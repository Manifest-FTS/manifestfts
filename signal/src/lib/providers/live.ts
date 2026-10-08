import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import type { Citation, EngineId } from '@/lib/db/schema';
import { domainOf } from '@/lib/analysis';
import { LIVE_SYSTEM_PROMPT, type AskContext, type Provider, type ProviderAnswer } from './types';

const TIMEOUT = 90_000;

function cite(url: string, title?: string | null): Citation {
  return { url, domain: domainOf(url), title: title ?? undefined };
}

async function postJson(url: string, body: unknown, headers: Record<string, string>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!response.ok) throw new Error(`${new URL(url).hostname} responded ${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}

// OpenAI Responses API with the hosted web search tool.
const openai: Provider = {
  engine: 'chatgpt',
  async ask({ prompt }) {
    const model = process.env.OPENAI_MODEL || 'gpt-5-mini';
    const started = Date.now();
    const data = await postJson('https://api.openai.com/v1/responses', {
      model,
      instructions: LIVE_SYSTEM_PROMPT,
      input: prompt,
      tools: [{ type: 'web_search' }],
    }, { authorization: `Bearer ${process.env.OPENAI_API_KEY}` });
    let text = '';
    const citations: Citation[] = [];
    for (const item of (data.output as { type: string; content?: { type: string; text?: string; annotations?: { type: string; url?: string; title?: string }[] }[] }[]) ?? []) {
      if (item.type !== 'message') continue;
      for (const part of item.content ?? []) {
        if (part.type !== 'output_text') continue;
        text += part.text ?? '';
        for (const a of part.annotations ?? []) if (a.type === 'url_citation' && a.url) citations.push(cite(a.url, a.title));
      }
    }
    return { text, citations, model, latencyMs: Date.now() - started };
  },
};

// Perplexity Sonar chat completions; citations arrive as search_results / citations.
const perplexity: Provider = {
  engine: 'perplexity',
  async ask({ prompt }) {
    const model = process.env.PERPLEXITY_MODEL || 'sonar';
    const started = Date.now();
    const data = await postJson('https://api.perplexity.ai/chat/completions', {
      model,
      messages: [{ role: 'system', content: LIVE_SYSTEM_PROMPT }, { role: 'user', content: prompt }],
    }, { authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` });
    const choices = data.choices as { message: { content: string } }[] | undefined;
    const results = (data.search_results as { url: string; title?: string }[] | undefined) ?? [];
    const urls = (data.citations as string[] | undefined) ?? [];
    const citations = results.length ? results.map((r) => cite(r.url, r.title)) : urls.map((u) => cite(u));
    return { text: choices?.[0]?.message.content ?? '', citations, model, latencyMs: Date.now() - started };
  },
};

// Gemini generateContent with Google Search grounding.
const gemini: Provider = {
  engine: 'gemini',
  async ask({ prompt }) {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const started = Date.now();
    const data = await postJson(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      systemInstruction: { parts: [{ text: LIVE_SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
    }, { 'x-goog-api-key': process.env.GEMINI_API_KEY! });
    const candidate = (data.candidates as { content?: { parts?: { text?: string }[] }; groundingMetadata?: { groundingChunks?: { web?: { uri: string; title?: string } }[] } }[] | undefined)?.[0];
    const text = candidate?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    // Grounding URIs are redirect links; the title carries the source domain.
    const citations = (candidate?.groundingMetadata?.groundingChunks ?? [])
      .filter((c) => c.web?.uri)
      .map((c) => ({ url: c.web!.uri, domain: (c.web!.title ?? domainOf(c.web!.uri)).toLowerCase().replace(/^www\./, ''), title: c.web!.title }));
    return { text, citations, model, latencyMs: Date.now() - started };
  },
};

// Claude via the official SDK with the server-side web search tool.
const claude: Provider = {
  engine: 'claude',
  async ask({ prompt }) {
    const model = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';
    const client = new Anthropic({ timeout: TIMEOUT, maxRetries: 2 });
    const started = Date.now();
    const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: prompt }];
    let text = '';
    const citations: Citation[] = [];
    // Server tools can pause a long turn; resume it a bounded number of times.
    for (let turn = 0; turn < 3; turn++) {
      const response = await client.beta.messages.create({
        model,
        max_tokens: 16000,
        system: LIVE_SYSTEM_PROMPT,
        output_config: { effort: 'medium' },
        tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 5 }],
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        messages,
      });
      if (response.stop_reason === 'refusal') throw new Error('Claude declined to answer this prompt.');
      for (const block of response.content) {
        if (block.type === 'text') {
          text += block.text;
          for (const c of block.citations ?? []) if (c.type === 'web_search_result_location') citations.push(cite(c.url, c.title));
        } else if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
          for (const r of block.content) if (r.type === 'web_search_result') citations.push(cite(r.url, r.title));
        }
      }
      if (response.stop_reason !== 'pause_turn') break;
      messages.push({ role: 'assistant', content: response.content });
    }
    return { text, citations, model, latencyMs: Date.now() - started };
  },
};

const LIVE: Partial<Record<EngineId, { provider: Provider; env: string }>> = {
  chatgpt: { provider: openai, env: 'OPENAI_API_KEY' },
  perplexity: { provider: perplexity, env: 'PERPLEXITY_API_KEY' },
  gemini: { provider: gemini, env: 'GEMINI_API_KEY' },
  claude: { provider: claude, env: 'ANTHROPIC_API_KEY' },
};

export function liveProvider(engine: EngineId): Provider | null {
  const entry = LIVE[engine];
  return entry && process.env[entry.env] ? entry.provider : null;
}

export function liveEngines(): EngineId[] {
  return (Object.keys(LIVE) as EngineId[]).filter((e) => !!process.env[LIVE[e]!.env]);
}

export type { AskContext, ProviderAnswer };
