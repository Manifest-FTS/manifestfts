import 'server-only';
import type { AuditDetails, AuditSubscores, CheckResult, CrawlerAccess } from '@/lib/db/schema';
import { parseRobots } from './robots';
import { safeFetch, UnsafeUrlError } from './safe-fetch';
import { crawlerScore, evaluateCrawlers } from './crawlers';
import { analyzeCitability } from './citability';
import { htmlLang, jsonLd, linkHref, links, mainContent, meta, stripTags, tagTexts, withoutNonContent, wordCount } from './html';
import { composite, scoreBrand, scoreEeat, scorePlatform, scoreSchema, type PageSignals } from './scoring';

export { UnsafeUrlError };
export { CRAWLERS } from './crawlers';

async function tryFetch(url: string, accept: string, maxBytes = 500_000) {
  try {
    return await safeFetch(url, { accept, maxBytes });
  } catch (error) {
    if (error instanceof UnsafeUrlError) throw error;
    return null;
  }
}

const isText = (body: string) => !/<html|<!doctype/i.test(body.slice(0, 500));

export interface ReadinessReport {
  url: string;
  finalUrl: string;
  score: number;
  subscores: AuditSubscores;
  durationMs: number;
  results: CheckResult[];
  crawlers: CrawlerAccess[];
  details: AuditDetails;
}

export function normalizeInputUrl(input: string) {
  const trimmed = input.trim();
  return trimmed.includes('://') ? trimmed : `https://${trimmed}`;
}

/**
 * GEO audit: can generative engines discover, parse, trust, and cite this page?
 * Produces a composite score from six dimensions plus check results that drive tasks.
 */
export async function runReadinessAudit(input: string): Promise<ReadinessReport> {
  const started = Date.now();
  const page = await safeFetch(normalizeInputUrl(input));
  const finalUrl = new URL(page.url);
  const origin = finalUrl.origin;
  const [robotsRes, llmsRes] = await Promise.all([
    tryFetch(`${origin}/robots.txt`, 'text/plain,*/*;q=0.5'),
    tryFetch(`${origin}/llms.txt`, 'text/plain,text/markdown,*/*;q=0.5'),
  ]);

  const html = page.body;
  const robotsOk = !!robotsRes && robotsRes.status === 200 && isText(robotsRes.body);
  const robots = parseRobots(robotsOk ? robotsRes!.body : '');
  const path = finalUrl.pathname || '/';
  const sitemapUrl = robots.sitemaps[0] ?? `${origin}/sitemap.xml`;
  const sitemapRes = await tryFetch(sitemapUrl, 'application/xml,text/xml,*/*;q=0.5', 3_000_000);
  const sitemapOk = !!sitemapRes && sitemapRes.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemapRes.body);
  const locs = sitemapOk ? [...sitemapRes!.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]!) : [];
  const sitemapUrls = locs.length;
  // Public paths from the sitemap (same host) let us tell deliberate private blocks from lost public pages.
  const publicPaths = /<urlset\b/i.test(sitemapRes?.body ?? '')
    ? locs.slice(0, 300).flatMap((l) => { try { const u = new URL(l); return u.hostname.replace(/^www\./, '') === finalUrl.hostname.replace(/^www\./, '') ? [u.pathname + u.search] : []; } catch { return []; } })
    : [];
  const crawlers = evaluateCrawlers(robots, path, publicPaths);

  const llmsOk = !!llmsRes && llmsRes.status === 200 && isText(llmsRes.body) && llmsRes.body.trim().length > 0;

  // Page signals
  const title = tagTexts(html, 'title')[0] ?? null;
  const description = meta(html, 'name', 'description');
  const h1s = tagTexts(withoutNonContent(html), 'h1');
  const canonical = linkHref(html, 'canonical');
  const robotsMeta = meta(html, 'name', 'robots') ?? '';
  const xRobots = page.headers.get('x-robots-tag') ?? '';
  const noindex = /noindex/i.test(robotsMeta) || /noindex/i.test(xRobots);
  const textLength = stripTags(withoutNonContent(html).match(/<body[\s\S]*<\/body>/i)?.[0] ?? withoutNonContent(html)).length;
  const { nodes, invalid } = jsonLd(html);
  const types = [...new Set(nodes.map((n) => n.type))];
  const pageLinks = links(html, page.url);
  const mainLinks = links(mainContent(html), page.url);
  const citability = analyzeCitability(html);

  const signals: PageSignals = {
    https: finalUrl.protocol === 'https:',
    status: page.status,
    ms: page.ms,
    noindex,
    textLength,
    title,
    description,
    h1Count: h1s.length,
    canonical,
    ogTitle: meta(html, 'property', 'og:title'),
    ogImage: meta(html, 'property', 'og:image'),
    siteName: meta(html, 'property', 'og:site_name'),
    lang: htmlLang(html),
    viewport: !!meta(html, 'name', 'viewport'),
    sitemap: sitemapOk,
    llms: llmsOk,
    nodes,
    invalidJsonLd: invalid,
    links: pageLinks,
    externalCitations: mainLinks.filter((l) => !l.internal).length,
    authorMeta: !!meta(html, 'name', 'author') || !!linkHref(html, 'author'),
    timeTag: /<time\b[^>]*datetime=/i.test(html) || !!meta(html, 'property', 'article:modified_time') || !!meta(html, 'property', 'article:published_time'),
  };

  const subscores: AuditSubscores = {
    citability: citability.score,
    crawlers: crawlerScore(crawlers, robotsOk),
    brand: scoreBrand(signals),
    eeat: scoreEeat(signals),
    schema: scoreSchema(signals),
    platform: scorePlatform(signals),
  };

  // Checks (these drive tasks; status "info" is not scored)
  const results: CheckResult[] = [];
  const add = (r: CheckResult) => results.push(r);
  const blockedRetrieval = crawlers.filter((c) => c.kind === 'retrieval' && c.status === 'blocked');
  const partialRetrieval = crawlers.filter((c) => c.kind === 'retrieval' && c.status === 'partial');
  const blockedTraining = crawlers.filter((c) => c.kind === 'training' && c.status === 'blocked');

  add({ id: 'robots-present', category: 'crawler', label: 'robots.txt is published', status: robotsOk ? 'pass' : robotsRes?.status === 404 ? 'info' : 'warn',
    detail: robotsOk ? `Found ${origin}/robots.txt with ${robots.groups.length} user-agent group(s).` : robotsRes?.status === 404 ? 'No robots.txt was found, so all crawlers are allowed by default.' : 'robots.txt could not be read reliably.',
    recommendation: robotsOk ? undefined : 'Publish a robots.txt that states your crawler policy explicitly and lists your sitemap.' });
  add({ id: 'retrieval-crawlers', category: 'crawler', label: 'Answer-engine retrieval crawlers can reach this page', status: blockedRetrieval.length ? 'fail' : partialRetrieval.length ? 'warn' : 'pass',
    detail: blockedRetrieval.length ? `Blocked: ${blockedRetrieval.map((c) => `${c.agent} (${c.rule})`).join(', ')}.`
      : partialRetrieval.length ? `Allowed here, but some sitemap pages are blocked for ${partialRetrieval.map((c) => `${c.agent} (${c.rule})`).join(', ')}.`
        : `All ${crawlers.filter((c) => c.kind === 'retrieval').length} retrieval crawlers checked can reach ${path}.`,
    recommendation: blockedRetrieval.length ? "Allow retrieval crawlers on public pages you want cited. Blocking them removes the page from that engine's live answers." : partialRetrieval.length ? 'Remove pages you want cited from these Disallow rules, or drop them from the sitemap if they are meant to be private.' : undefined,
    evidence: blockedRetrieval.map((c) => c.rule).filter(Boolean).join('\n') || undefined });
  add({ id: 'training-crawlers', category: 'crawler', label: 'Training crawler policy', status: 'info',
    detail: blockedTraining.length ? `Training access is blocked for ${blockedTraining.map((c) => c.agent).join(', ')}. This is a policy choice and does not block live citations.` : 'Training crawlers are allowed. That is a policy choice; it neither guarantees nor prevents citation.' });
  add({ id: 'sitemap', category: 'discovery', label: 'XML sitemap is available', status: sitemapOk ? (robots.sitemaps.length ? 'pass' : 'warn') : 'warn',
    detail: sitemapOk ? `${sitemapUrl} lists ${sitemapUrls.toLocaleString()} entr${sitemapUrls === 1 ? 'y' : 'ies'}${robots.sitemaps.length ? '' : ', but robots.txt does not declare it'}.` : `No valid sitemap was found at ${sitemapUrl}.`,
    recommendation: sitemapOk && robots.sitemaps.length ? undefined : 'Publish an XML sitemap and add a "Sitemap:" line to robots.txt.' });
  add({ id: 'llms-txt', category: 'discovery', label: 'llms.txt summary is available', status: llmsOk ? 'pass' : 'info',
    detail: llmsOk ? `Found ${origin}/llms.txt (${llmsRes!.body.length.toLocaleString()} characters).` : 'No llms.txt was found. It is an emerging convention; no major engine has committed to using it.',
    recommendation: llmsOk ? undefined : 'Optional: publish a concise llms.txt that links to your most authoritative pages. Signal’s free generator can draft one.' });
  add({ id: 'indexable', category: 'discovery', label: 'Page is indexable', status: page.status >= 400 || noindex ? 'fail' : 'pass',
    detail: page.status >= 400 ? `The page returned HTTP ${page.status}.` : noindex ? `A noindex directive was found (${robotsMeta || xRobots}).` : `HTTP ${page.status} with no noindex directive.`,
    recommendation: noindex || page.status >= 400 ? 'Return HTTP 200 and remove noindex from pages you want answer engines to use.' : undefined });
  add({ id: 'canonical', category: 'discovery', label: 'Canonical URL is declared', status: canonical ? 'pass' : 'warn', detail: canonical ?? 'No rel="canonical" link was found.',
    recommendation: canonical ? undefined : 'Declare a canonical URL so engines consolidate signals on one address.' });
  add({ id: 'internal-links', category: 'discovery', label: 'Internal links support discovery', status: pageLinks.filter((l) => l.internal).length >= 5 ? 'pass' : 'warn',
    detail: `${pageLinks.filter((l) => l.internal).length} internal and ${pageLinks.filter((l) => !l.internal).length} external links in the HTML.`,
    recommendation: pageLinks.filter((l) => l.internal).length >= 5 ? undefined : 'Link to related, authoritative pages on your site with descriptive anchor text.' });

  add({ id: 'title', category: 'content', label: 'Descriptive title tag', status: title && title.length >= 15 && title.length <= 70 ? 'pass' : title ? 'warn' : 'fail',
    detail: title ? `"${title}" (${title.length} characters)` : 'No <title> element was found.',
    recommendation: title && title.length >= 15 && title.length <= 70 ? undefined : 'Write a specific 15–70 character title that names what the page offers and who it is for.' });
  add({ id: 'description', category: 'content', label: 'Meta description summarizes the page', status: description && description.length >= 50 && description.length <= 170 ? 'pass' : description ? 'warn' : 'fail',
    detail: description ? `${description.length} characters: "${description.slice(0, 160)}${description.length > 160 ? '…' : ''}"` : 'No meta description was found.',
    recommendation: description && description.length >= 50 && description.length <= 170 ? undefined : 'Add a factual 50–170 character summary. Answer engines often reuse it as a source snippet.' });
  add({ id: 'h1', category: 'content', label: 'Single clear H1 heading', status: h1s.length === 1 ? 'pass' : 'warn',
    detail: h1s.length ? `${h1s.length} H1 heading(s): "${h1s[0]!.slice(0, 100)}"` : 'No <h1> was found in the server-rendered HTML.',
    recommendation: h1s.length === 1 ? undefined : 'Render exactly one descriptive H1 in the initial HTML.' });
  add({ id: 'server-rendered', category: 'content', label: 'Content is present without JavaScript', status: textLength > 1200 ? 'pass' : textLength > 300 ? 'warn' : 'fail',
    detail: `${textLength.toLocaleString()} characters of readable text in the initial HTML response.`,
    recommendation: textLength > 1200 ? undefined : 'Many AI crawlers do not execute JavaScript. Server-render the primary content of the page.' });
  add({ id: 'citability', category: 'content', label: 'Passages are quotable and fact-rich', status: citability.score >= 70 ? 'pass' : citability.score >= 45 ? 'warn' : 'fail',
    detail: `Citability ${citability.score}/100: ${citability.quotable} quotable passage(s), ${citability.factRich} of ${citability.paragraphs} paragraphs with concrete facts, ${citability.questionHeadings} question-style heading(s), ${citability.words.toLocaleString()} words.`,
    recommendation: citability.score >= 70 ? undefined : citability.recommendations.slice(0, 2).join(' ') });
  add({ id: 'open-graph', category: 'content', label: 'Open Graph metadata', status: signals.ogTitle && signals.ogImage ? 'pass' : 'warn',
    detail: [signals.ogTitle ? 'og:title present' : 'og:title missing', signals.ogImage ? 'og:image present' : 'og:image missing'].join(' · '),
    recommendation: signals.ogTitle && signals.ogImage ? undefined : 'Add og:title, og:description, and og:image so shared links and some engines render a clear preview.' });
  add({ id: 'trust-signals', category: 'content', label: 'Authorship and freshness signals', status: subscores.eeat >= 60 ? 'pass' : 'warn',
    detail: [signals.authorMeta || nodes.some((n) => n.type === 'Person' || 'author' in n.props) ? 'author identified' : 'no author', signals.timeTag || nodes.some((n) => 'dateModified' in n.props || 'datePublished' in n.props) ? 'dates present' : 'no dates', `${signals.externalCitations} outbound source link(s) in content`].join(' · '),
    recommendation: subscores.eeat >= 60 ? undefined : 'Show who wrote or reviewed the page, when it was updated, and link to the sources behind your claims.' });

  add({ id: 'schema-present', category: 'schema', label: 'Structured data (JSON-LD) is present', status: invalid ? 'fail' : types.length ? 'pass' : 'warn',
    detail: types.length ? `Types found: ${types.join(', ')}${invalid ? ` · ${invalid} block(s) failed to parse` : ''}` : invalid ? `${invalid} JSON-LD block(s) failed to parse.` : 'No JSON-LD blocks were found.',
    recommendation: invalid ? 'Fix the JSON syntax error in your JSON-LD block.' : types.length ? undefined : 'Add JSON-LD that matches visible content, starting with Organization and WebSite.' });
  const entity = nodes.find((n) => ENTITY_TYPES.has(n.type));
  add({ id: 'schema-entity', category: 'schema', label: 'Organization or product entity is described', status: entity ? (Array.isArray(entity.props.sameAs) && (entity.props.sameAs as unknown[]).length >= 2 ? 'pass' : 'warn') : 'warn',
    detail: entity ? `${entity.type} declared${Array.isArray(entity.props.sameAs) ? ` with ${(entity.props.sameAs as unknown[]).length} sameAs profile(s)` : ' without sameAs profiles'}.` : 'No Organization, Product, or SoftwareApplication entity was found.',
    recommendation: entity && Array.isArray(entity.props.sameAs) && (entity.props.sameAs as unknown[]).length >= 2 ? undefined : 'Describe your organization (name, url, logo, and sameAs links to official profiles) so engines can resolve your entity.' });

  add({ id: 'https', category: 'security', label: 'Served over HTTPS', status: signals.https ? 'pass' : 'fail', detail: signals.https ? 'The final URL uses HTTPS.' : 'The page is served over plain HTTP.',
    recommendation: signals.https ? undefined : 'Serve every page over HTTPS and redirect HTTP requests.' });
  add({ id: 'response-time', category: 'security', label: 'Responds quickly to crawlers', status: page.ms < 1500 ? 'pass' : page.ms < 4000 ? 'warn' : 'fail',
    detail: `Full HTML response in ${page.ms.toLocaleString()} ms${page.redirects ? ` after ${page.redirects} redirect(s)` : ''}, measured from our server.`,
    recommendation: page.ms < 1500 ? undefined : 'Slow responses risk crawler timeouts. Cache HTML at the edge and reduce server work.' });

  const issues = results
    .filter((r) => r.status === 'fail' || r.status === 'warn')
    .map((r) => ({ severity: r.status === 'fail' ? ('high' as const) : ('medium' as const), title: r.label, detail: r.detail, fix: r.recommendation ?? '' }))
    .concat(citability.weakBlocks.slice(0, 3).map((b, i) => ({ severity: 'medium' as const, title: `Weak citation block ${i + 1}`, detail: `“${b.excerpt}”`, fix: b.reason })))
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'high' ? -1 : 1));

  const details: AuditDetails = {
    issues,
    schemas: types,
    citability,
    llms: { present: llmsOk, url: `${origin}/llms.txt`, bytes: llmsOk ? llmsRes!.body.length : 0 },
    sitemap: { present: sitemapOk, url: sitemapUrl, urls: sitemapUrls, declared: robots.sitemaps.length > 0 },
    page: { title, description, h1: h1s[0] ?? null, lang: signals.lang, canonical, words: wordCount(stripTags(mainContent(html))), internalLinks: pageLinks.filter((l) => l.internal).length, externalLinks: pageLinks.filter((l) => !l.internal).length },
  };

  return {
    url: input,
    finalUrl: page.url,
    score: composite(subscores),
    subscores,
    durationMs: Date.now() - started,
    results,
    crawlers: crawlers.map(({ agent, owner, purpose, kind, allowed, status, rule }) => ({ agent, owner, purpose, kind, allowed, status, rule })),
    details,
  };
}

const ENTITY_TYPES = new Set(['Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService', 'LegalService', 'MedicalBusiness', 'SoftwareApplication', 'Product', 'Brand', 'NGO', 'EducationalOrganization', 'Store', 'Restaurant']);
