import 'server-only';
import type { CheckResult } from '@/lib/db/schema';
import { evaluateRobots, parseRobots } from './robots';
import { safeFetch, UnsafeUrlError, type SafeResponse } from './safe-fetch';

export { UnsafeUrlError };

/** Crawlers that fetch pages to answer or cite in real time. Blocking these removes you from answers. */
export const RETRIEVAL_AGENTS = [
  { agent: 'OAI-SearchBot', owner: 'OpenAI', purpose: 'ChatGPT search results and citations' },
  { agent: 'ChatGPT-User', owner: 'OpenAI', purpose: 'Pages fetched when a ChatGPT user asks' },
  { agent: 'PerplexityBot', owner: 'Perplexity', purpose: 'Perplexity answer index' },
  { agent: 'Claude-SearchBot', owner: 'Anthropic', purpose: 'Claude search results' },
  { agent: 'Googlebot', owner: 'Google', purpose: 'Google Search, including AI Overviews' },
  { agent: 'Bingbot', owner: 'Microsoft', purpose: 'Bing index, which grounds Copilot' },
];

/** Crawlers that collect training data. Blocking these is a legitimate policy choice. */
export const TRAINING_AGENTS = [
  { agent: 'GPTBot', owner: 'OpenAI', purpose: 'Model training' },
  { agent: 'ClaudeBot', owner: 'Anthropic', purpose: 'Model training' },
  { agent: 'Google-Extended', owner: 'Google', purpose: 'Gemini training and grounding opt-out token' },
  { agent: 'Applebot-Extended', owner: 'Apple', purpose: 'Apple Intelligence training opt-out token' },
  { agent: 'CCBot', owner: 'Common Crawl', purpose: 'Open web corpus used by many models' },
];

function meta(html: string, attr: 'name' | 'property', key: string) {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() ?? null;
}

function tagText(html: string, tag: string) {
  return html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? null;
}

function jsonLdTypes(html: string) {
  const types = new Set<string>();
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (node: unknown) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (node && typeof node === 'object') {
          const t = (node as Record<string, unknown>)['@type'];
          if (typeof t === 'string') types.add(t);
          if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
          Object.values(node).forEach(walk);
        }
      };
      walk(JSON.parse(match[1]!));
    } catch {
      types.add('Invalid JSON-LD');
    }
  }
  return [...types];
}

function visibleTextLength(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
}

async function tryFetch(url: string, accept?: string) {
  try {
    return await safeFetch(url, accept ? { accept, maxBytes: 500_000 } : undefined);
  } catch (error) {
    if (error instanceof UnsafeUrlError) throw error;
    return null;
  }
}

export interface ReadinessReport {
  url: string;
  finalUrl: string;
  score: number;
  durationMs: number;
  results: CheckResult[];
  crawlers: { agent: string; owner: string; purpose: string; kind: 'retrieval' | 'training'; allowed: boolean; rule: string | null }[];
}

export function normalizeInputUrl(input: string) {
  const trimmed = input.trim();
  return trimmed.includes('://') ? trimmed : `https://${trimmed}`;
}

export async function runReadinessAudit(input: string): Promise<ReadinessReport> {
  const started = Date.now();
  const page = await safeFetch(normalizeInputUrl(input));
  const origin = new URL(page.url).origin;
  const [robotsRes, llmsRes] = await Promise.all([
    tryFetch(`${origin}/robots.txt`, 'text/plain,*/*;q=0.5'),
    tryFetch(`${origin}/llms.txt`, 'text/plain,text/markdown,*/*;q=0.5'),
  ]);

  const results: CheckResult[] = [];
  const add = (r: CheckResult) => results.push(r);
  const html = page.body;

  // Crawler access
  const robotsOk = robotsRes && robotsRes.status === 200 && !/<html/i.test(robotsRes.body.slice(0, 500));
  const robots = parseRobots(robotsOk ? robotsRes!.body : '');
  const path = new URL(page.url).pathname || '/';
  const crawlers = [
    ...RETRIEVAL_AGENTS.map((a) => ({ ...a, kind: 'retrieval' as const })),
    ...TRAINING_AGENTS.map((a) => ({ ...a, kind: 'training' as const })),
  ].map((a) => ({ ...a, ...evaluateRobots(robots, a.agent, path) }));

  add({
    id: 'robots-present', category: 'crawler', label: 'robots.txt is published',
    status: robotsOk ? 'pass' : robotsRes?.status === 404 ? 'info' : 'warn',
    detail: robotsOk ? `Found ${origin}/robots.txt with ${robots.groups.length} user-agent group(s).` : robotsRes?.status === 404 ? 'No robots.txt was found, so all crawlers are allowed by default.' : 'robots.txt could not be read reliably.',
    recommendation: robotsOk ? undefined : 'Publish a robots.txt that states your crawler policy explicitly and lists your sitemap.',
  });

  const blockedRetrieval = crawlers.filter((c) => c.kind === 'retrieval' && !c.allowed);
  add({
    id: 'retrieval-crawlers', category: 'crawler', label: 'Answer-engine retrieval crawlers can reach this page',
    status: blockedRetrieval.length ? 'fail' : 'pass',
    detail: blockedRetrieval.length
      ? `Blocked: ${blockedRetrieval.map((c) => `${c.agent} (${c.rule})`).join(', ')}.`
      : `All ${RETRIEVAL_AGENTS.length} retrieval crawlers checked are allowed for ${path}.`,
    recommendation: blockedRetrieval.length ? 'Allow retrieval crawlers on public pages you want cited. Blocking them removes the page from that engine\'s live answers.' : undefined,
    evidence: blockedRetrieval.map((c) => c.rule).filter(Boolean).join('\n') || undefined,
  });

  const blockedTraining = crawlers.filter((c) => c.kind === 'training' && !c.allowed);
  add({
    id: 'training-crawlers', category: 'crawler', label: 'Training crawler policy',
    status: 'info',
    detail: blockedTraining.length
      ? `Training access is blocked for ${blockedTraining.map((c) => c.agent).join(', ')}. This is a policy choice and does not block live citations.`
      : 'Training crawlers are allowed. That is a policy choice; it neither guarantees nor prevents citation.',
  });

  // Discovery
  add({
    id: 'sitemap', category: 'discovery', label: 'Sitemap is declared in robots.txt',
    status: robots.sitemaps.length ? 'pass' : 'warn',
    detail: robots.sitemaps.length ? robots.sitemaps.slice(0, 3).join(', ') : 'No Sitemap directive was found.',
    recommendation: robots.sitemaps.length ? undefined : 'Add a "Sitemap:" line to robots.txt pointing to your XML sitemap.',
  });

  const llmsOk = llmsRes && llmsRes.status === 200 && !/<html/i.test(llmsRes.body.slice(0, 500)) && llmsRes.body.trim().length > 0;
  add({
    id: 'llms-txt', category: 'discovery', label: 'llms.txt summary is available',
    status: llmsOk ? 'pass' : 'info',
    detail: llmsOk ? `Found ${origin}/llms.txt (${llmsRes!.body.length.toLocaleString()} characters).` : 'No llms.txt was found. It is an emerging convention; no major engine has committed to using it.',
    recommendation: llmsOk ? undefined : 'Optional: publish a concise llms.txt that links to your most authoritative pages.',
  });

  const robotsMeta = meta(html, 'name', 'robots') ?? '';
  const xRobots = page.headers.get('x-robots-tag') ?? '';
  const noindex = /noindex/i.test(robotsMeta) || /noindex/i.test(xRobots);
  add({
    id: 'indexable', category: 'discovery', label: 'Page is indexable',
    status: page.status >= 400 ? 'fail' : noindex ? 'fail' : 'pass',
    detail: page.status >= 400 ? `The page returned HTTP ${page.status}.` : noindex ? `A noindex directive was found (${robotsMeta || xRobots}).` : `HTTP ${page.status} with no noindex directive.`,
    recommendation: noindex || page.status >= 400 ? 'Return HTTP 200 and remove noindex from pages you want answer engines to use.' : undefined,
  });

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]?.match(/href=["']([^"']+)["']/i)?.[1] ?? null;
  add({
    id: 'canonical', category: 'discovery', label: 'Canonical URL is declared',
    status: canonical ? 'pass' : 'warn',
    detail: canonical ? canonical : 'No rel="canonical" link was found.',
    recommendation: canonical ? undefined : 'Declare a canonical URL so engines consolidate signals on one address.',
  });

  // Content
  const title = tagText(html, 'title');
  add({
    id: 'title', category: 'content', label: 'Descriptive title tag',
    status: title && title.length >= 15 && title.length <= 70 ? 'pass' : title ? 'warn' : 'fail',
    detail: title ? `"${title}" (${title.length} characters)` : 'No <title> element was found.',
    recommendation: title && title.length >= 15 && title.length <= 70 ? undefined : 'Write a specific 15–70 character title that names what the page offers and who it is for.',
  });

  const description = meta(html, 'name', 'description');
  add({
    id: 'description', category: 'content', label: 'Meta description summarizes the page',
    status: description && description.length >= 50 && description.length <= 170 ? 'pass' : description ? 'warn' : 'fail',
    detail: description ? `${description.length} characters: "${description.slice(0, 160)}${description.length > 160 ? '…' : ''}"` : 'No meta description was found.',
    recommendation: description && description.length >= 50 && description.length <= 170 ? undefined : 'Add a factual 50–170 character summary. Answer engines often reuse it as a source snippet.',
  });

  const h1 = tagText(html, 'h1');
  add({
    id: 'h1', category: 'content', label: 'Single clear H1 heading',
    status: h1 ? 'pass' : 'warn',
    detail: h1 ? `"${h1.slice(0, 120)}"` : 'No <h1> was found in the server-rendered HTML.',
    recommendation: h1 ? undefined : 'Render one descriptive H1 in the initial HTML.',
  });

  const textLength = visibleTextLength(html);
  add({
    id: 'server-rendered', category: 'content', label: 'Content is present without JavaScript',
    status: textLength > 1200 ? 'pass' : textLength > 300 ? 'warn' : 'fail',
    detail: `${textLength.toLocaleString()} characters of readable text in the initial HTML response.`,
    recommendation: textLength > 1200 ? undefined : 'Many AI crawlers do not execute JavaScript. Server-render the primary content of the page.',
  });

  const ogTitle = meta(html, 'property', 'og:title');
  const ogImage = meta(html, 'property', 'og:image');
  add({
    id: 'open-graph', category: 'content', label: 'Open Graph metadata',
    status: ogTitle && ogImage ? 'pass' : ogTitle || ogImage ? 'warn' : 'warn',
    detail: [ogTitle ? 'og:title present' : 'og:title missing', ogImage ? 'og:image present' : 'og:image missing'].join(' · '),
    recommendation: ogTitle && ogImage ? undefined : 'Add og:title, og:description, and og:image so shared links and some engines render a clear preview.',
  });

  // Structured data
  const types = jsonLdTypes(html);
  const entityTypes = ['Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService', 'SoftwareApplication', 'Product', 'Brand', 'NGO', 'EducationalOrganization'];
  const hasEntity = types.some((t) => entityTypes.includes(t));
  add({
    id: 'schema-present', category: 'schema', label: 'Structured data (JSON-LD) is present',
    status: types.includes('Invalid JSON-LD') ? 'fail' : types.length ? 'pass' : 'warn',
    detail: types.length ? `Types found: ${types.join(', ')}` : 'No JSON-LD blocks were found.',
    recommendation: types.includes('Invalid JSON-LD') ? 'Fix the JSON syntax error in your JSON-LD block.' : types.length ? undefined : 'Add JSON-LD that matches visible content, starting with Organization and WebSite.',
  });
  add({
    id: 'schema-entity', category: 'schema', label: 'Organization or product entity is described',
    status: hasEntity ? 'pass' : 'warn',
    detail: hasEntity ? 'An organization, product, or software entity is declared.' : 'No Organization, Product, or SoftwareApplication entity was found.',
    recommendation: hasEntity ? undefined : 'Describe your organization (name, url, logo, sameAs profiles) so engines can resolve your entity.',
  });

  // Security & performance
  const https = new URL(page.url).protocol === 'https:';
  add({
    id: 'https', category: 'security', label: 'Served over HTTPS',
    status: https ? 'pass' : 'fail',
    detail: https ? 'The final URL uses HTTPS.' : 'The page is served over plain HTTP.',
    recommendation: https ? undefined : 'Serve every page over HTTPS and redirect HTTP requests.',
  });
  add({
    id: 'response-time', category: 'security', label: 'Responds quickly to crawlers',
    status: page.ms < 1500 ? 'pass' : page.ms < 4000 ? 'warn' : 'fail',
    detail: `Full HTML response in ${page.ms.toLocaleString()} ms${page.redirects ? ` after ${page.redirects} redirect(s)` : ''}, measured from our server.`,
    recommendation: page.ms < 1500 ? undefined : 'Slow responses risk crawler timeouts. Cache HTML at the edge and reduce server work.',
  });

  const weights = { pass: 1, warn: 0.5, fail: 0, info: null } as const;
  const scored = results.map((r) => weights[r.status]).filter((w): w is 0 | 0.5 | 1 => w !== null);
  const score = Math.round((scored.reduce<number>((a, b) => a + b, 0) / scored.length) * 100);

  return { url: input, finalUrl: page.url, score, durationMs: Date.now() - started, results, crawlers };
}

export type { SafeResponse };
