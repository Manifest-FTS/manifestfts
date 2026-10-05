import type { Citation, EngineId } from '@/lib/db/schema';

export interface AskContext {
  prompt: string;
  brand: { name: string; aliases: string[]; domain: string; description: string; industry: string };
  competitors: { id: string; name: string; domain: string }[];
  facts: { label: string; value: string }[];
  /** Deterministic seed input for sample data; ignored by live providers. */
  seed: string;
  /** 0..1 position of this run within the sample history window (for sample trends). */
  progress: number;
}

export interface ProviderAnswer {
  text: string;
  citations: Citation[];
  model: string;
  latencyMs: number;
}

export interface Provider {
  engine: EngineId;
  ask(ctx: AskContext): Promise<ProviderAnswer>;
}

/** The instruction sent to live engines: answer as you would for an end user, with sources. */
export const LIVE_SYSTEM_PROMPT =
  'Answer the user\'s question as you normally would for a member of the public researching a purchase or decision. Name specific organizations or products where relevant and cite the sources you rely on.';
