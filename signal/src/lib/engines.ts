import type { EngineId } from '@/lib/db/schema';

export interface EngineMeta {
  id: EngineId;
  name: string;
  vendor: string;
  /** Categorical chart slot (1-based); fixed per engine so color follows the entity. */
  slot: number;
  /** Whether Signal ships a live adapter for this engine. */
  liveAdapter: boolean;
  envKey?: string;
}

export const ENGINES: EngineMeta[] = [
  { id: 'chatgpt', name: 'ChatGPT', vendor: 'OpenAI', slot: 1, liveAdapter: true, envKey: 'OPENAI_API_KEY' },
  { id: 'perplexity', name: 'Perplexity', vendor: 'Perplexity AI', slot: 2, liveAdapter: true, envKey: 'PERPLEXITY_API_KEY' },
  { id: 'gemini', name: 'Gemini', vendor: 'Google', slot: 3, liveAdapter: true, envKey: 'GEMINI_API_KEY' },
  { id: 'claude', name: 'Claude', vendor: 'Anthropic', slot: 4, liveAdapter: true, envKey: 'ANTHROPIC_API_KEY' },
  { id: 'ai_overviews', name: 'AI Overviews', vendor: 'Google Search', slot: 5, liveAdapter: false },
  { id: 'copilot', name: 'Copilot', vendor: 'Microsoft', slot: 6, liveAdapter: false },
];

export const ENGINE_BY_ID = Object.fromEntries(ENGINES.map((e) => [e.id, e])) as Record<EngineId, EngineMeta>;

export function engineName(id: string) {
  return ENGINE_BY_ID[id as EngineId]?.name ?? id;
}

export const seriesVar = (slot: number) => `var(--series-${slot})`;
