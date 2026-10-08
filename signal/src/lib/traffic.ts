import type { TrafficSource } from '@/lib/db/schema';

// Classifies a landing by referrer and utm_source. AI assistants often strip or vary the
// referrer, so utm_source (ChatGPT appends utm_source=chatgpt.com to links) is checked too.

const AI_HOSTS: [RegExp, TrafficSource][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$|(^|\.)openai\.com$/, 'chatgpt'],
  [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/^gemini\.google\.com$|^bard\.google\.com$|^aistudio\.google\.com$/, 'gemini'],
  [/(^|\.)claude\.ai$/, 'claude'],
  [/^copilot\.microsoft\.com$|^copilot\.cloud\.microsoft$|^edgeservices\.bing\.com$/, 'copilot'],
  [/(^|\.)deepseek\.com$/, 'deepseek'],
  [/(^|\.)meta\.ai$/, 'meta_ai'],
  [/(^|\.)you\.com$|(^|\.)phind\.com$|(^|\.)poe\.com$|^chat\.mistral\.ai$|(^|\.)grok\.com$|^x\.ai$|(^|\.)duck\.ai$|^kagi\.com$/, 'other_ai'],
];
const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|baidu|yandex|naver|qwant|startpage)\.[a-z.]+$|^search\.brave\.com$/;
const SOCIAL = /(^|\.)(facebook|fb|instagram|linkedin|lnkd|reddit|pinterest|tiktok|threads|youtube|youtu|quora|mastodon)\.[a-z.]+$|^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$|(^|\.)bsky\.app$/;

const UTM: [RegExp, TrafficSource][] = [
  [/chatgpt|openai/i, 'chatgpt'],
  [/perplexity/i, 'perplexity'],
  [/gemini|bard/i, 'gemini'],
  [/claude|anthropic/i, 'claude'],
  [/copilot/i, 'copilot'],
  [/deepseek/i, 'deepseek'],
  [/meta\.?ai/i, 'meta_ai'],
];

export const AI_SOURCES: TrafficSource[] = ['chatgpt', 'perplexity', 'gemini', 'claude', 'copilot', 'deepseek', 'meta_ai', 'other_ai'];

export const SOURCE_LABEL: Record<TrafficSource, string> = {
  chatgpt: 'ChatGPT', perplexity: 'Perplexity', gemini: 'Gemini', claude: 'Claude', copilot: 'Copilot', deepseek: 'DeepSeek', meta_ai: 'Meta AI', other_ai: 'Other AI assistants',
  search: 'Search engines', social: 'Social', referral: 'Other websites', direct: 'Direct or unknown',
};

/** Categorical chart slot per AI source so colors follow the entity across charts. */
export const SOURCE_SLOT: Partial<Record<TrafficSource, number>> = { chatgpt: 1, perplexity: 2, gemini: 3, claude: 4, copilot: 6, deepseek: 5, meta_ai: 5, other_ai: 5 };

export function classifyLanding(referrer: string | null | undefined, utmSource: string | null | undefined, siteHost?: string): { source: TrafficSource; host: string | null } | null {
  let host: string | null = null;
  if (referrer) {
    try {
      host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      host = null;
    }
  }
  const site = siteHost?.toLowerCase().replace(/^www\./, '');
  // Internal navigation is not a landing.
  if (host && site && (host === site || host.endsWith(`.${site}`))) return null;
  if (host) {
    for (const [re, source] of AI_HOSTS) if (re.test(host)) return { source, host };
    if (/^bing\.com$/.test(host) && /\/chat|copilot/i.test(referrer ?? '')) return { source: 'copilot', host };
  }
  if (utmSource) for (const [re, source] of UTM) if (re.test(utmSource)) return { source, host };
  if (host) {
    if (SEARCH.test(host)) return { source: 'search', host };
    if (SOCIAL.test(host)) return { source: 'social', host };
    return { source: 'referral', host };
  }
  return { source: 'direct', host: null };
}
