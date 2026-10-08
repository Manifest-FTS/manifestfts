import 'server-only';
import { safeFetch } from '@/lib/readiness/safe-fetch';
import { jsonLd, meta, tagTexts } from '@/lib/readiness/html';
import { normalizeInputUrl } from '@/lib/readiness';
import { RULES, validateNode } from './schema-rules';
import { ToolError } from './route';

/* Structured data validator */

export async function validateStructuredData(url: string) {
  const page = await safeFetch(normalizeInputUrl(url));
  if (page.status >= 400) throw new ToolError(`The page returned HTTP ${page.status}.`, 422);
  const blocks = [...page.body.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const parseErrors: string[] = [];
  blocks.forEach((b, i) => {
    try {
      JSON.parse(b[1]!.trim());
    } catch (error) {
      parseErrors.push(`Block ${i + 1}: ${error instanceof Error ? error.message : 'invalid JSON'}`);
    }
  });
  const { nodes } = jsonLd(page.body);
  const reports = nodes.filter((n) => RULES[n.type] || nodes.length < 25).map((n) => validateNode(n.type, n.props));
  const microdata = (page.body.match(/itemscope/gi) ?? []).length;
  const rdfa = (page.body.match(/\btypeof=/gi) ?? []).length;
  return {
    url: page.url,
    blocks: blocks.length,
    parseErrors,
    nodes: reports,
    totals: { errors: parseErrors.length + reports.reduce((s, r) => s + r.errors.length, 0), warnings: reports.reduce((s, r) => s + r.warnings.length, 0) },
    otherFormats: { microdata, rdfa },
  };
}

/* Sitemap validator */

export async function validateSitemap(input: string) {
  const raw = normalizeInputUrl(input);
  let url = new URL(raw);
  if (url.pathname === '/' || url.pathname === '') {
    // Prefer the sitemap declared in robots.txt.
    const robots = await safeFetch(`${url.origin}/robots.txt`, { accept: 'text/plain', maxBytes: 200_000 }).catch(() => null);
    const declared = robots?.status === 200 ? robots.body.match(/^\s*sitemap:\s*(\S+)/im)?.[1] : undefined;
    url = new URL(declared ?? `${url.origin}/sitemap.xml`);
  }
  const res = await safeFetch(url.toString(), { accept: 'application/xml,text/xml,*/*;q=0.5', maxBytes: 5_000_000 });
  const issues: { severity: 'error' | 'warning'; message: string }[] = [];
  if (res.status >= 400) throw new ToolError(`No sitemap found at ${url} (HTTP ${res.status}).`, 422);
  const body = res.body;
  const isIndex = /<sitemapindex\b/i.test(body);
  const isUrlset = /<urlset\b/i.test(body);
  if (!isIndex && !isUrlset) throw new ToolError('That address did not return an XML sitemap (no <urlset> or <sitemapindex> element).', 422);
  if (!/xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(body)) issues.push({ severity: 'warning', message: 'Missing the standard sitemaps.org namespace declaration.' });

  const entries = [...body.matchAll(/<(url|sitemap)>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    loc: m[2]!.match(/<loc>\s*([^<]+?)\s*<\/loc>/i)?.[1] ?? '',
    lastmod: m[2]!.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/i)?.[1] ?? null,
  }));
  const host = new URL(res.url).hostname.replace(/^www\./, '');
  const seen = new Set<string>();
  let duplicates = 0, offHost = 0, insecure = 0, missingLastmod = 0, badLastmod = 0;
  for (const e of entries) {
    if (seen.has(e.loc)) duplicates++;
    seen.add(e.loc);
    try {
      const u = new URL(e.loc);
      if (u.hostname.replace(/^www\./, '') !== host) offHost++;
      if (u.protocol !== 'https:') insecure++;
    } catch {
      issues.push({ severity: 'error', message: `Invalid URL: ${e.loc.slice(0, 120)}` });
    }
    if (!e.lastmod) missingLastmod++;
    else if (Number.isNaN(Date.parse(e.lastmod))) badLastmod++;
  }
  if (entries.length > 50_000) issues.push({ severity: 'error', message: `${entries.length.toLocaleString()} entries exceeds the 50,000 per-file limit.` });
  if (body.length > 50 * 1024 * 1024) issues.push({ severity: 'error', message: 'File exceeds the 50 MB uncompressed limit.' });
  if (duplicates) issues.push({ severity: 'warning', message: `${duplicates} duplicate URL(s).` });
  if (offHost) issues.push({ severity: 'error', message: `${offHost} URL(s) point to a different host than the sitemap.` });
  if (insecure) issues.push({ severity: 'warning', message: `${insecure} URL(s) use http instead of https.` });
  if (badLastmod) issues.push({ severity: 'error', message: `${badLastmod} lastmod value(s) are not valid W3C dates.` });
  if (missingLastmod && !isIndex) issues.push({ severity: 'warning', message: `${missingLastmod} of ${entries.length} URLs have no lastmod; engines use it to prioritize recrawls.` });
  if (!entries.length) issues.push({ severity: 'error', message: 'The sitemap contains no entries.' });

  // Spot-check that listed pages actually resolve.
  const sample = isUrlset ? entries.slice(0, 8) : [];
  const spot = await Promise.all(sample.map(async (e) => {
    try {
      const r = await safeFetch(e.loc, { maxBytes: 20_000, timeoutMs: 15_000 });
      return { url: e.loc, status: r.status, redirected: r.redirects > 0 };
    } catch {
      // 0 = no response in time (slow server or network), not proof the page is broken.
      return { url: e.loc, status: 0, redirected: false };
    }
  }));
  const broken = spot.filter((s) => s.status >= 400).length;
  const slow = spot.filter((s) => s.status === 0).length;
  const redirected = spot.filter((s) => s.redirected).length;
  if (broken) issues.push({ severity: 'error', message: `${broken} of ${spot.length} sampled URLs return an HTTP error.` });
  if (slow) issues.push({ severity: 'warning', message: `${slow} of ${spot.length} sampled URLs did not respond within 15 seconds. Slow pages risk crawler timeouts.` });
  if (redirected) issues.push({ severity: 'warning', message: `${redirected} of ${spot.length} sampled URLs redirect; list final URLs instead.` });

  return { url: res.url, kind: isIndex ? 'index' : 'urlset', entries: entries.length, withLastmod: entries.length - missingLastmod, issues, sample: spot, children: isIndex ? entries.slice(0, 50).map((e) => e.loc) : [] };
}

/* llms.txt generator */

export async function draftLlmsTxt(input: string) {
  const home = await safeFetch(normalizeInputUrl(input));
  const origin = new URL(home.url).origin;
  const name = meta(home.body, 'property', 'og:site_name') ?? tagTexts(home.body, 'title')[0]?.split(/[|–—:-]/)[0]?.trim() ?? new URL(origin).hostname;
  const summary = meta(home.body, 'name', 'description') ?? meta(home.body, 'property', 'og:description') ?? '';

  const robots = await safeFetch(`${origin}/robots.txt`, { accept: 'text/plain', maxBytes: 200_000 }).catch(() => null);
  const sitemapUrl = (robots?.status === 200 ? robots.body.match(/^\s*sitemap:\s*(\S+)/im)?.[1] : undefined) ?? `${origin}/sitemap.xml`;
  const sitemap = await safeFetch(sitemapUrl, { accept: 'application/xml,text/xml', maxBytes: 3_000_000 }).catch(() => null);
  let locs = sitemap?.status === 200 ? [...sitemap.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]!) : [];
  if (/<sitemapindex\b/i.test(sitemap?.body ?? '') && locs[0]) {
    const child = await safeFetch(locs[0], { accept: 'application/xml,text/xml', maxBytes: 3_000_000 }).catch(() => null);
    locs = child?.status === 200 ? [...child.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]!) : [];
  }
  if (!locs.length) {
    // Fall back to internal links on the home page.
    locs = [...home.body.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)].map((m) => { try { return new URL(m[1]!, origin).toString(); } catch { return ''; } }).filter((u) => u.startsWith(origin));
  }
  const unique = [...new Set(locs.map((u) => u.replace(/#.*$/, '')))].filter((u) => u !== `${origin}/` && u !== origin).slice(0, 24);

  const pages = (await Promise.all(unique.map(async (u) => {
    try {
      const r = await safeFetch(u, { maxBytes: 400_000, timeoutMs: 15_000 });
      if (r.status >= 400) return null;
      const title = tagTexts(r.body, 'title')[0]?.replace(new RegExp(`\\s*[|–—-]\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i'), '') ?? new URL(u).pathname;
      return { url: r.url, title, description: meta(r.body, 'name', 'description') ?? '' };
    } catch {
      return null;
    }
  }))).filter((p): p is { url: string; title: string; description: string } => !!p);

  const groups = new Map<string, typeof pages>();
  for (const p of pages) {
    const seg = new URL(p.url).pathname.split('/').filter(Boolean)[0] ?? '';
    const section = /blog|insight|article|news|post|guide|resource|learn/i.test(seg) ? 'Articles and guides'
      : /doc|help|support|faq|kb/i.test(seg) ? 'Documentation'
        : /pric|plan/i.test(seg) ? 'Pricing'
          : /about|team|contact|career|press|company/i.test(seg) ? 'Company'
            : /legal|privacy|terms|cookie/i.test(seg) ? 'Optional'
              : 'Key pages';
    groups.set(section, [...(groups.get(section) ?? []), p]);
  }
  const order = ['Key pages', 'Pricing', 'Documentation', 'Articles and guides', 'Company', 'Optional'];
  const body = [
    `# ${name}`,
    '',
    summary ? `> ${summary}` : `> One-sentence summary of what ${name} offers and who it is for.`,
    '',
    `${name}'s website is ${origin}. Edit this paragraph to add the facts you most want AI systems to get right: what you offer, who you serve, where, and since when.`,
    ...order.filter((g) => groups.get(g)?.length).flatMap((g) => ['', `## ${g}`, ...groups.get(g)!.map((p) => `- [${p.title}](${p.url})${p.description ? `: ${p.description}` : ''}`)]),
    '',
  ].join('\n');
  return { origin, name, pages: pages.length, sitemap: locs.length ? sitemapUrl : null, llmsTxt: body };
}
