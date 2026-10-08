import 'server-only';
import { analyzeAnswer } from '@/lib/analysis';
import { liveEngines, liveProvider } from '@/lib/providers/live';
import { ENGINE_BY_ID } from '@/lib/engines';
import type { EngineId } from '@/lib/db/schema';
import { normalizeDomain } from '@/lib/utils';
import { ToolError } from './route';

export function visibilityAvailability() {
  return liveEngines();
}

/**
 * Asks each configured engine one buyer question and reports whether the brand is named or
 * cited. One sample per engine is a snapshot, not a rate; the UI says so.
 */
export async function checkVisibility(input: { brand: string; domain: string; question: string; engines: EngineId[] }) {
  const domain = normalizeDomain(input.domain);
  if (!domain) throw new ToolError('Enter a valid domain, like example.com.');
  const available = liveEngines().filter((e) => input.engines.includes(e));
  if (!available.length) return { configured: liveEngines(), results: [] };
  const results = await Promise.all(available.map(async (engine) => {
    const provider = liveProvider(engine)!;
    try {
      const answer = await provider.ask({
        prompt: input.question,
        brand: { name: input.brand, aliases: [], domain, description: '', industry: '' },
        competitors: [], facts: [], seed: '', progress: 1,
      });
      const a = analyzeAnswer({ text: answer.text, citations: answer.citations, brand: { names: [input.brand], domain }, competitors: [] });
      return {
        engine, name: ENGINE_BY_ID[engine].name, ok: true as const, model: answer.model,
        mentioned: a.brandMentioned, cited: a.brandCited, sentiment: a.sentiment,
        excerpt: answer.text.replace(/\*\*/g, '').slice(0, 900),
        citations: a.citations.slice(0, 8),
      };
    } catch (error) {
      return { engine, name: ENGINE_BY_ID[engine].name, ok: false as const, error: error instanceof Error ? error.message : 'Engine request failed' };
    }
  }));
  return { configured: liveEngines(), results };
}
