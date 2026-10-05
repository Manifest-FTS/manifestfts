import type { Citation, EngineId } from '@/lib/db/schema';
import type { AskContext, Provider, ProviderAnswer } from './types';

// Deterministic sample answers so teams can explore Signal before connecting live engines.
// Every answer produced here is stored with source = "sample" and labeled in the interface.

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, list: T[]) => list[Math.floor(r() * list.length)]!;

function shuffle<T>(r: () => number, list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

const ENGINE_STYLE: Record<EngineId, { bias: number; citeBias: number; citations: [number, number]; markers: boolean }> = {
  chatgpt: { bias: 0, citeBias: 0, citations: [2, 5], markers: false },
  perplexity: { bias: 0.06, citeBias: 0.12, citations: [4, 7], markers: true },
  gemini: { bias: -0.05, citeBias: -0.02, citations: [3, 5], markers: false },
  claude: { bias: -0.02, citeBias: -0.04, citations: [2, 4], markers: false },
  ai_overviews: { bias: 0.03, citeBias: 0.05, citations: [3, 6], markers: false },
  copilot: { bias: -0.08, citeBias: 0, citations: [2, 4], markers: true },
};

const INTROS = [
  (q: string) => `Here is a practical overview for "${q}".`,
  () => 'Several options stand out, depending on your priorities, budget, and how much support you need.',
  () => 'There is no single right answer, but these are the names that come up most consistently in reviews and expert roundups.',
  () => 'Based on current reviews, documentation, and comparison articles, these are worth shortlisting.',
];

const POSITIVE = [
  'is frequently recommended for its clear onboarding and responsive support',
  'is well-regarded for reliability and a strong track record with mid-sized teams',
  'stands out for transparent pricing and an easy to use interface',
  'is a popular choice when integrations and documentation matter',
];
const NEUTRAL = [
  'covers the core requirements and is a reasonable fit for many teams',
  'offers a broad feature set; fit depends on your existing tools',
  'is often mentioned alongside larger vendors in comparison articles',
];
const NEGATIVE = [
  'is capable, though some reviewers say it is expensive for smaller teams',
  'has a solid reputation, but users mention a steep learning curve',
];
const COMPETITOR = [
  'is a well-known option with a large customer base',
  'is often chosen by enterprise teams that need extensive customization',
  'is a strong choice for teams that prioritize price',
  'has a robust ecosystem of partners and templates',
  'is frequently listed in "best of" roundups for this category',
];
const OUTROS = [
  'Shortlist two or three, request demos, and compare total cost over a full year.',
  'The best fit depends on team size, integration needs, and the level of hands-on support you expect.',
  'Check recent reviews and confirm current pricing directly with each provider before deciding.',
];

const GENERIC_SOURCES = [
  { domain: 'g2.com', path: (s: string) => `/categories/${s}`, title: 'Best software in this category — G2' },
  { domain: 'capterra.com', path: (s: string) => `/${s}-software`, title: 'Top rated tools — Capterra' },
  { domain: 'reddit.com', path: (s: string) => `/r/smallbusiness/comments/${s}`, title: 'Recommendations thread — Reddit' },
  { domain: 'forbes.com', path: (s: string) => `/advisor/business/${s}`, title: 'Forbes Advisor review' },
  { domain: 'en.wikipedia.org', path: (s: string) => `/wiki/${s}`, title: 'Wikipedia' },
  { domain: 'techradar.com', path: (s: string) => `/best/${s}`, title: 'The best options tested — TechRadar' },
  { domain: 'youtube.com', path: (s: string) => `/watch?v=${s.slice(0, 11)}`, title: 'Video comparison — YouTube' },
  { domain: 'linkedin.com', path: (s: string) => `/pulse/${s}`, title: 'Industry perspective — LinkedIn' },
  { domain: 'gartner.com', path: (s: string) => `/reviews/market/${s}`, title: 'Peer Insights — Gartner' },
  { domain: 'medium.com', path: (s: string) => `/@analyst/${s}`, title: 'Practitioner write-up — Medium' },
];

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

function mutate(value: string, r: () => number) {
  const digits = value.match(/\d+/);
  if (digits) return value.replace(digits[0], String(Number(digits[0]) + 1 + Math.floor(r() * 3)));
  return pick(r, ['not publicly listed', 'unclear from public sources', 'different by region']);
}

export function sampleAnswer(engine: EngineId, ctx: AskContext): ProviderAnswer {
  const r = rng(`${ctx.seed}|${engine}`);
  const style = ENGINE_STYLE[engine];
  const brandIntent = new RegExp(ctx.brand.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(ctx.prompt);
  const mentionP = brandIntent ? 0.96 : Math.min(0.92, 0.3 + 0.3 * ctx.progress + style.bias);
  const mentioned = r() < mentionP;
  const competitors = shuffle(r, ctx.competitors).slice(0, Math.min(ctx.competitors.length, 2 + Math.floor(r() * 3)));
  const entries: { name: string; isBrand: boolean; domain: string }[] = competitors.map((c) => ({ name: c.name, isBrand: false, domain: c.domain }));
  if (mentioned) {
    const firstP = brandIntent ? 0.9 : 0.2 + 0.25 * ctx.progress;
    const index = r() < firstP ? 0 : 1 + Math.floor(r() * entries.length);
    entries.splice(Math.min(index, entries.length), 0, { name: ctx.brand.name, isBrand: true, domain: ctx.brand.domain });
  }

  const lines: string[] = [pick(r, INTROS)(ctx.prompt), ''];
  entries.forEach((entry, i) => {
    let descriptor: string;
    if (entry.isBrand) {
      const roll = r();
      descriptor = roll < 0.62 + 0.15 * ctx.progress ? pick(r, POSITIVE) : roll < 0.88 ? pick(r, NEUTRAL) : pick(r, NEGATIVE);
    } else {
      descriptor = pick(r, COMPETITOR);
    }
    lines.push(`${i + 1}. **${entry.name}** ${descriptor}.${style.markers ? ` [${i + 1}]` : ''}`);
  });

  if (mentioned && ctx.facts.length && r() < 0.7) {
    const fact = pick(r, ctx.facts);
    const accurate = r() < 0.72 + 0.15 * ctx.progress;
    const value = accurate ? fact.value : mutate(fact.value, r);
    lines.push('', `According to published information, ${ctx.brand.name}'s ${fact.label.toLowerCase()} is ${value}.`);
  }
  else if (mentioned && !ctx.facts.length && r() < 0.3) {
    // Without a fact sheet, occasionally include a checkable statement so the review flow has examples.
    lines.push('', `${ctx.brand.name} was founded in ${2004 + Math.floor(r() * 16)} and is based in ${pick(r, ['the United States', 'New York', 'North Carolina', 'Chicago'])}.`);
  }
  lines.push('', pick(r, OUTROS));

  const topic = slug(ctx.prompt);
  const citations: Citation[] = [];
  const [min, max] = style.citations;
  const count = min + Math.floor(r() * (max - min + 1));
  const citeBrand = mentioned && r() < (brandIntent ? 0.75 : 0.22 + 0.3 * ctx.progress + style.citeBias);
  if (citeBrand) citations.push({ url: `https://${ctx.brand.domain}/${pick(r, ['', 'pricing', 'about', 'resources/guide', 'customers'])}`.replace(/\/$/, ''), domain: ctx.brand.domain, title: `${ctx.brand.name} — official site` });
  for (const c of competitors) {
    if (citations.length < count && r() < 0.45) citations.push({ url: `https://${c.domain}/${pick(r, ['pricing', 'features', 'compare'])}`, domain: c.domain, title: `${c.name} — official site` });
  }
  for (const source of shuffle(r, GENERIC_SOURCES)) {
    if (citations.length >= count) break;
    citations.push({ url: `https://${source.domain}${source.path(topic)}`, domain: source.domain, title: source.title });
  }

  return { text: lines.join('\n'), citations, model: `sample-${engine}`, latencyMs: 1800 + Math.floor(r() * 7000) };
}

export function sampleProvider(engine: EngineId): Provider {
  return { engine, ask: async (ctx) => sampleAnswer(engine, ctx) };
}
