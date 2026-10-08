import { describe, expect, it } from 'vitest';
import { classifyLanding } from './traffic';

describe('classifyLanding', () => {
  it('detects AI assistants by referrer host', () => {
    expect(classifyLanding('https://chatgpt.com/', null)?.source).toBe('chatgpt');
    expect(classifyLanding('https://www.perplexity.ai/search?q=x', null)?.source).toBe('perplexity');
    expect(classifyLanding('https://gemini.google.com/app', null)?.source).toBe('gemini');
    expect(classifyLanding('https://claude.ai/chat/1', null)?.source).toBe('claude');
    expect(classifyLanding('https://copilot.microsoft.com/', null)?.source).toBe('copilot');
    expect(classifyLanding('https://www.bing.com/chat?q=x', null)?.source).toBe('copilot');
  });

  it('falls back to utm_source when the referrer is stripped', () => {
    expect(classifyLanding('', 'chatgpt.com')?.source).toBe('chatgpt');
    expect(classifyLanding(null, 'perplexity')?.source).toBe('perplexity');
  });

  it('classifies search, social, referral, direct, and ignores internal navigation', () => {
    expect(classifyLanding('https://www.google.com/', null)?.source).toBe('search');
    expect(classifyLanding('https://www.bing.com/search?q=x', null)?.source).toBe('search');
    expect(classifyLanding('https://t.co/abc', null)?.source).toBe('social');
    expect(classifyLanding('https://news.example.org/a', null)?.source).toBe('referral');
    expect(classifyLanding('', null)?.source).toBe('direct');
    expect(classifyLanding('https://www.acme.com/pricing', null, 'acme.com')).toBeNull();
  });
});
