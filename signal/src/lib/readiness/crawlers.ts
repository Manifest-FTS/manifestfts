import { evaluateRobots, type RobotsFile } from './robots';

export type CrawlerKind = 'retrieval' | 'training' | 'other';

export interface CrawlerDef {
  agent: string;
  owner: string;
  purpose: string;
  kind: CrawlerKind;
}

/**
 * AI and search crawlers evaluated against robots.txt.
 * Retrieval crawlers fetch pages to answer or cite in real time; blocking them removes you from
 * those answers. Training crawlers and opt-out tokens govern model training, a policy choice.
 */
export const CRAWLERS: CrawlerDef[] = [
  { agent: 'OAI-SearchBot', owner: 'OpenAI', purpose: 'ChatGPT search results and citations', kind: 'retrieval' },
  { agent: 'ChatGPT-User', owner: 'OpenAI', purpose: 'Pages fetched when a ChatGPT user asks', kind: 'retrieval' },
  { agent: 'GPTBot', owner: 'OpenAI', purpose: 'Model training', kind: 'training' },
  { agent: 'Claude-SearchBot', owner: 'Anthropic', purpose: 'Claude search results', kind: 'retrieval' },
  { agent: 'Claude-User', owner: 'Anthropic', purpose: 'Pages fetched when a Claude user asks', kind: 'retrieval' },
  { agent: 'ClaudeBot', owner: 'Anthropic', purpose: 'Model training', kind: 'training' },
  { agent: 'anthropic-ai', owner: 'Anthropic', purpose: 'Legacy training token', kind: 'training' },
  { agent: 'claude-web', owner: 'Anthropic', purpose: 'Legacy web token', kind: 'other' },
  { agent: 'PerplexityBot', owner: 'Perplexity', purpose: 'Perplexity answer index', kind: 'retrieval' },
  { agent: 'Perplexity-User', owner: 'Perplexity', purpose: 'Pages fetched when a Perplexity user asks', kind: 'retrieval' },
  { agent: 'Googlebot', owner: 'Google', purpose: 'Google Search, including AI Overviews and AI Mode', kind: 'retrieval' },
  { agent: 'Google-Extended', owner: 'Google', purpose: 'Gemini training and grounding opt-out token', kind: 'training' },
  { agent: 'GoogleOther', owner: 'Google', purpose: 'Google research and product crawls', kind: 'other' },
  { agent: 'Bingbot', owner: 'Microsoft', purpose: 'Bing index, which grounds Copilot and ChatGPT search', kind: 'retrieval' },
  { agent: 'Applebot', owner: 'Apple', purpose: 'Siri and Spotlight suggestions', kind: 'retrieval' },
  { agent: 'Applebot-Extended', owner: 'Apple', purpose: 'Apple Intelligence training opt-out token', kind: 'training' },
  { agent: 'DuckAssistBot', owner: 'DuckDuckGo', purpose: 'DuckDuckGo AI-assisted answers', kind: 'retrieval' },
  { agent: 'MistralAI-User', owner: 'Mistral', purpose: 'Pages fetched for Le Chat users', kind: 'retrieval' },
  { agent: 'Amazonbot', owner: 'Amazon', purpose: 'Alexa and Amazon answers', kind: 'retrieval' },
  { agent: 'meta-externalagent', owner: 'Meta', purpose: 'Meta AI training and features', kind: 'training' },
  { agent: 'CCBot', owner: 'Common Crawl', purpose: 'Open web corpus used by many models', kind: 'training' },
  { agent: 'Bytespider', owner: 'ByteDance', purpose: 'Model training', kind: 'training' },
  { agent: 'cohere-ai', owner: 'Cohere', purpose: 'Model training', kind: 'training' },
  { agent: 'YouBot', owner: 'You.com', purpose: 'You.com answer index', kind: 'retrieval' },
  { agent: 'Diffbot', owner: 'Diffbot', purpose: 'Knowledge graph extraction', kind: 'other' },
  { agent: 'PetalBot', owner: 'Huawei', purpose: 'Petal Search index', kind: 'other' },
];

export type AccessStatus = 'allowed' | 'partial' | 'blocked';

export interface CrawlerResult extends CrawlerDef {
  allowed: boolean;
  status: AccessStatus;
  rule: string | null;
}

/**
 * Evaluates each crawler for the audited path. "Partial" means the path is allowed but the
 * crawler is blocked from some public pages, judged by URLs your own sitemap lists. Blocking
 * private areas (an admin or API path not in the sitemap) is good hygiene and stays "allowed".
 */
export function evaluateCrawlers(robots: RobotsFile, path: string, publicPaths: string[] = []): CrawlerResult[] {
  return CRAWLERS.map((c) => {
    const r = evaluateRobots(robots, c.agent, path);
    const blockedPublic = r.allowed ? publicPaths.find((p) => !evaluateRobots(robots, c.agent, p).allowed) : undefined;
    const status: AccessStatus = !r.allowed ? 'blocked' : blockedPublic ? 'partial' : 'allowed';
    return { ...c, allowed: r.allowed, status, rule: blockedPublic ? `${evaluateRobots(robots, c.agent, blockedPublic).rule} (blocks ${blockedPublic})` : r.rule };
  });
}

/** 0–100. Retrieval access dominates; training access is policy and not scored. */
export function crawlerScore(results: CrawlerResult[], robotsPublished: boolean) {
  const retrieval = results.filter((r) => r.kind === 'retrieval');
  const value = retrieval.reduce((s, r) => s + (r.status === 'allowed' ? 1 : r.status === 'partial' ? 0.75 : 0), 0) / retrieval.length;
  return Math.round(value * 90 + (robotsPublished ? 10 : 0));
}
