// Pure HTML extraction helpers for audits. Regex-based and tolerant; they read server-rendered
// HTML the way most AI crawlers do (no JavaScript execution).

export function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

export function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function withoutNonContent(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

/** Main content region when marked up, otherwise the body without header, nav, aside, and footer. */
export function mainContent(html: string) {
  const clean = withoutNonContent(html);
  const main = clean.match(/<main[\s\S]*?<\/main>/i)?.[0];
  if (main) return main;
  // A single <article> is the page's content; several are usually cards within it.
  const articles = clean.match(/<article[\s\S]*?<\/article>/gi) ?? [];
  if (articles.length === 1) return articles[0]!;
  const body = clean.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? clean;
  return body.replace(/<(header|nav|aside|footer)[\s\S]*?<\/\1>/gi, ' ');
}

export function meta(html: string, attr: 'name' | 'property', key: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const k = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1];
    if (k?.toLowerCase() === key.toLowerCase()) return decodeEntities(tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? '') || null;
  }
  return null;
}

export function linkHref(html: string, rel: string) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const r = tag.match(/rel\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase().split(/\s+/) ?? [];
    if (r.includes(rel)) return tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
  }
  return null;
}

export function tagTexts(html: string, tag: string) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi'))].map((m) => stripTags(m[1]!)).filter(Boolean);
}

export function htmlLang(html: string) {
  return html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
}

export interface JsonLdNode {
  type: string;
  props: Record<string, unknown>;
}

/** All JSON-LD nodes with an @type, flattened (including @graph and nested entities). */
export function jsonLd(html: string) {
  const nodes: JsonLdNode[] = [];
  let invalid = 0;
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (node: unknown) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (!node || typeof node !== 'object') return;
        const obj = node as Record<string, unknown>;
        const t = obj['@type'];
        for (const type of Array.isArray(t) ? t : [t]) if (typeof type === 'string') nodes.push({ type, props: obj });
        Object.values(obj).forEach(walk);
      };
      walk(JSON.parse(m[1]!.trim()));
    } catch {
      invalid++;
    }
  }
  return { nodes, invalid };
}

export interface PageLink { href: string; text: string; internal: boolean }

export function links(html: string, base: string): PageLink[] {
  const origin = new URL(base);
  const out: PageLink[] = [];
  for (const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    try {
      const url = new URL(decodeEntities(m[1]!), base);
      if (!/^https?:$/.test(url.protocol)) continue;
      const host = url.hostname.replace(/^www\./, '');
      out.push({ href: url.toString(), text: stripTags(m[2]!), internal: host === origin.hostname.replace(/^www\./, '') });
    } catch {
      // ignore malformed hrefs
    }
  }
  return out;
}

export function wordCount(text: string) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}
