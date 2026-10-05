import type { Citation, CompetitorMention, Sentiment } from '@/lib/db/schema';

export interface Entity {
  id: string;
  names: string[];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function firstIndex(text: string, names: string[]) {
  let best = -1;
  for (const raw of names) {
    const name = raw.trim();
    if (name.length < 2) continue;
    // Word-boundary match that tolerates possessives ("Acme's") and punctuation.
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(name)}(?=$|[^\\p{L}\\p{N}])`, 'iu');
    const match = re.exec(text);
    if (match) {
      const index = match.index + match[1]!.length;
      if (best === -1 || index < best) best = index;
    }
  }
  return best;
}

/**
 * Finds which entities an answer mentions and ranks them by first appearance.
 * Position is 1-based among all mentioned entities (brand and competitors together).
 */
export function rankMentions(text: string, entities: Entity[]) {
  return entities
    .map((entity) => ({ id: entity.id, index: firstIndex(text, entity.names) }))
    .filter((m) => m.index >= 0)
    .sort((a, b) => a.index - b.index)
    .map((m, i) => ({ id: m.id, position: i + 1 }));
}

export function domainOf(url: string) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function domainMatches(domain: string, target: string) {
  const d = domain.toLowerCase().replace(/^www\./, '');
  const t = target.toLowerCase().replace(/^www\./, '');
  return !!t && (d === t || d.endsWith(`.${t}`));
}

const URL_RE = /https?:\/\/[^\s<>"'()\]]+[^\s<>"'()\].,;:!?]/g;

/** Merges structured citations from a provider with URLs found inline in the answer text. */
export function collectCitations(text: string, provided: Citation[] = []) {
  const seen = new Map<string, Citation>();
  for (const c of provided) {
    const domain = c.domain || domainOf(c.url);
    if (domain && !seen.has(c.url)) seen.set(c.url, { url: c.url, domain, title: c.title });
  }
  for (const url of text.match(URL_RE) ?? []) {
    const domain = domainOf(url);
    if (domain && !seen.has(url)) seen.set(url, { url, domain });
  }
  return [...seen.values()];
}

const POSITIVE = ['recommended', 'recommend', 'leading', 'trusted', 'excellent', 'strong', 'best', 'reliable', 'popular', 'well-regarded', 'well regarded', 'praised', 'standout', 'top choice', 'robust', 'easy to use', 'highly rated'];
const NEGATIVE = ['expensive', 'limited', 'complaints', 'outdated', 'lacks', 'poor', 'criticized', 'criticised', 'slow', 'difficult', 'concerns', 'drawback', 'downside', 'not recommended', 'issues', 'steep learning curve'];

/** Removes Markdown emphasis, list markers, and bracketed citation markers like [1]. */
export function cleanSentence(text: string) {
  return text
    .replace(/\*\*|__|`/g, '')
    .replace(/\s*\[\d+\](?=\s|$|[.,;:])/g, '')
    .replace(/^\s*(?:\d+[.)]|[-*•])\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentences(text: string) {
  // Split on sentence ends and line breaks, but not on list numbering such as "1. ".
  return text
    .split(/\n+/)
    .flatMap((line) => cleanSentence(line).split(/(?<=[a-z0-9%)"”][.!?])\s+(?=[A-Z"“(])/))
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Lexicon heuristic over sentences that mention the brand. Deliberately simple and disclosed
 * in the methodology; it flags tone for review, it does not certify sentiment.
 */
export function brandSentiment(text: string, brandNames: string[]): Sentiment | null {
  const relevant = sentences(text).filter((s) => firstIndex(s, brandNames) >= 0);
  if (!relevant.length) return null;
  let score = 0;
  for (const s of relevant) {
    const lower = s.toLowerCase();
    for (const w of POSITIVE) if (lower.includes(w)) score += 1;
    for (const w of NEGATIVE) if (lower.includes(w)) score -= 1;
  }
  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
}

// Concrete, checkable statements: dates, prices, quantities, places, ownership, and credentials.
// Generic descriptors ("offers", "pricing", "support") are deliberately excluded to keep review queues useful.
const FACT_SIGNALS = /\b(founded|established|headquartered|headquarters|based in|located in|offices? in|owned by|acquired|ceo|founder|co-founder|certified|accredited|compliant|launched in|plans? start|starts? at|per month|per year|employees|staff of|years? of experience|since (?:19|20)\d{2})\b|\$\s?\d|\b(?:19|20)\d{2}\b|\b\d[\d,.]*\s?(?:%|percent|customers|clients|locations|offices|employees|people|countries|states|integrations)\b/i;

/** Extracts brand-specific sentences that contain checkable statements. */
export function extractClaims(text: string, brandNames: string[], max = 4) {
  return sentences(text)
    .filter((s) => s.length >= 24 && s.length <= 400 && !s.includes('?') && firstIndex(s, brandNames) >= 0 && FACT_SIGNALS.test(s))
    .slice(0, max);
}

/** Picks the fact whose label words best overlap with the claim, if any. */
export function matchFact<T extends { id: string; label: string; value: string }>(claim: string, facts: T[]) {
  const lower = claim.toLowerCase();
  let best: { fact: T; score: number } | null = null;
  for (const fact of facts) {
    const words = `${fact.label}`.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    const stems = words.map((w) => w.slice(0, Math.max(4, w.length - 2)));
    const score = stems.filter((w) => lower.includes(w)).length;
    if (score > 0 && (!best || score > best.score)) best = { fact, score };
  }
  return best?.fact ?? null;
}

export interface AnalyzeInput {
  text: string;
  citations?: Citation[];
  brand: { names: string[]; domain: string };
  competitors: { id: string; names: string[] }[];
}

export function analyzeAnswer({ text, citations, brand, competitors }: AnalyzeInput) {
  const ranked = rankMentions(text, [{ id: '__brand', names: brand.names }, ...competitors]);
  const brandRank = ranked.find((m) => m.id === '__brand');
  const allCitations = collectCitations(text, citations);
  const competitorMentions: CompetitorMention[] = ranked
    .filter((m) => m.id !== '__brand')
    .map((m) => ({ competitorId: m.id, position: m.position }));
  return {
    brandMentioned: !!brandRank,
    brandPosition: brandRank?.position ?? null,
    brandCited: allCitations.some((c) => domainMatches(c.domain, brand.domain)),
    sentiment: brandSentiment(text, brand.names),
    competitorMentions,
    citations: allCitations,
    claims: extractClaims(text, brand.names),
  };
}
