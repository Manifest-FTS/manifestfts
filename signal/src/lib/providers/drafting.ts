import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

export function draftingAvailable() {
  return !!process.env.ANTHROPIC_API_KEY;
}

const SYSTEM = `You write clear, factual web pages that answer one buyer question well enough to be quoted by AI answer engines.
Follow the brief exactly. Write in Markdown with one H1 and question-style H2s.
Never invent statistics, prices, dates, customer names, or quotes. Use only facts given in the brief; where a fact is needed but not provided, write a clearly marked placeholder such as [VERIFY: starting price].
Keep a neutral, specific tone. Make each section self-contained so it can be quoted on its own.`;

/** Produces a first draft from a content brief with Claude. Returns Markdown and the model used. */
export async function draftFromBrief(input: { brandName: string; domain: string; question: string; brief: string }) {
  const client = new Anthropic({ timeout: 180_000, maxRetries: 2 });
  const model = process.env.ANTHROPIC_DRAFT_MODEL || 'claude-opus-5-5';
  const response = await client.beta.messages.create({
    model,
    max_tokens: 12000,
    system: SYSTEM,
    output_config: { effort: 'medium' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    messages: [{
      role: 'user',
      content: `Write the page for ${input.brandName} (${input.domain}) that answers: "${input.question}".\n\nBrief:\n\n${input.brief}`,
    }],
  });
  if (response.stop_reason === 'refusal') throw new Error('The model declined to draft this page. Edit the question or brief and try again.');
  const text = response.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim();
  if (!text) throw new Error('The model returned an empty draft.');
  return { text, model: response.model };
}
