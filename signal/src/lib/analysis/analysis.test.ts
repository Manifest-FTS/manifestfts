import { describe, expect, it } from 'vitest';
import { analyzeAnswer, brandDescriptors, brandSentiment, collectCitations, domainMatches, extractClaims, matchFact, rankMentions } from './index';
import { summarize, wilson, isMeaningfulChange } from '@/lib/metrics';
import { evaluateRobots, parseRobots } from '@/lib/readiness/robots';
import { sampleAnswer } from '@/lib/providers/sample';

describe('rankMentions', () => {
  it('orders entities by first appearance and respects word boundaries', () => {
    const text = 'Try Northwind first. Acme\'s plans are good; Acmeville is unrelated. Contoso also works.';
    const ranked = rankMentions(text, [
      { id: 'acme', names: ['Acme'] },
      { id: 'nw', names: ['Northwind'] },
      { id: 'contoso', names: ['Contoso'] },
      { id: 'fabrikam', names: ['Fabrikam'] },
    ]);
    expect(ranked).toEqual([{ id: 'nw', position: 1 }, { id: 'acme', position: 2 }, { id: 'contoso', position: 3 }]);
  });

  it('does not match a name inside a longer word', () => {
    expect(rankMentions('Acmeville is great', [{ id: 'a', names: ['Acme'] }])).toEqual([]);
  });
});

describe('citations', () => {
  it('merges provided citations with inline URLs and strips trailing punctuation', () => {
    const result = collectCitations('See https://www.example.com/a. Also (https://docs.acme.io/x).', [{ url: 'https://g2.com/p', domain: '' }]);
    expect(result.map((c) => c.domain)).toEqual(['g2.com', 'example.com', 'docs.acme.io']);
    expect(result[1]!.url).toBe('https://www.example.com/a');
  });

  it('matches subdomains of the brand domain only', () => {
    expect(domainMatches('docs.acme.io', 'acme.io')).toBe(true);
    expect(domainMatches('notacme.io', 'acme.io')).toBe(false);
  });
});

describe('sentiment and claims', () => {
  it('scores only sentences that mention the brand', () => {
    expect(brandSentiment('Acme is highly rated and reliable. Contoso is expensive.', ['Acme'])).toBe('positive');
    expect(brandSentiment('Acme is expensive and has a steep learning curve.', ['Acme'])).toBe('negative');
    expect(brandSentiment('Contoso is great.', ['Acme'])).toBeNull();
  });

  it('extracts checkable brand statements and matches them to facts', () => {
    const text = 'Acme was founded in 2014 in Austin. Acme is nice. Contoso was founded in 2001.';
    const claims = extractClaims(text, ['Acme']);
    expect(claims).toEqual(['Acme was founded in 2014 in Austin.']);
    const fact = matchFact(claims[0]!, [{ id: 'f1', label: 'Founded', value: '2012' }, { id: 'f2', label: 'Pricing', value: '$49' }]);
    expect(fact?.id).toBe('f1');
  });
});

describe('analyzeAnswer', () => {
  it('produces a full analysis', () => {
    const result = analyzeAnswer({
      text: '1. **Contoso** is popular.\n2. **Acme** is recommended. https://acme.io/pricing',
      brand: { names: ['Acme'], domain: 'acme.io' },
      competitors: [{ id: 'c1', names: ['Contoso'] }],
    });
    expect(result.brandMentioned).toBe(true);
    expect(result.brandPosition).toBe(2);
    expect(result.brandCited).toBe(true);
    expect(result.competitorMentions).toEqual([{ competitorId: 'c1', position: 1 }]);
    expect(result.sentiment).toBe('positive');
  });
});

describe('metrics', () => {
  it('computes Wilson intervals that contain the point estimate', () => {
    const r = wilson(30, 100);
    expect(r.value).toBe(0.3);
    expect(r.low!).toBeLessThan(0.3);
    expect(r.high!).toBeGreaterThan(0.3);
    expect(r.low!).toBeCloseTo(0.2189, 3);
    expect(wilson(0, 0).value).toBeNull();
  });

  it('summarizes answers with denominators', () => {
    const s = summarize([
      { brandMentioned: true, brandCited: true, brandPosition: 1, sentiment: 'positive', competitorMentions: [{ competitorId: 'x' }] },
      { brandMentioned: false, brandCited: false, brandPosition: null, sentiment: null, competitorMentions: [{ competitorId: 'x' }, { competitorId: 'y' }] },
    ]);
    expect(s.mention.value).toBe(0.5);
    expect(s.shareOfVoice.successes).toBe(1);
    expect(s.shareOfVoice.n).toBe(4);
    expect(s.avgPosition).toBe(1);
  });

  it('flags only non-overlapping intervals as meaningful', () => {
    expect(isMeaningfulChange(wilson(10, 100), wilson(60, 100))).toBe(true);
    expect(isMeaningfulChange(wilson(4, 10), wilson(5, 10))).toBe(false);
  });
});

describe('robots.txt', () => {
  const robots = parseRobots(`
User-agent: GPTBot
Disallow: /

User-agent: *
Disallow: /admin
Allow: /admin/public$
Disallow: /*.pdf$

Sitemap: https://example.com/sitemap.xml
`);

  it('applies agent-specific groups before the wildcard group', () => {
    expect(evaluateRobots(robots, 'GPTBot', '/').allowed).toBe(false);
    expect(evaluateRobots(robots, 'PerplexityBot', '/').allowed).toBe(true);
  });

  it('uses longest match, Allow on ties, and wildcards', () => {
    expect(evaluateRobots(robots, 'Bingbot', '/admin/x').allowed).toBe(false);
    expect(evaluateRobots(robots, 'Bingbot', '/admin/public').allowed).toBe(true);
    expect(evaluateRobots(robots, 'Bingbot', '/files/report.pdf').allowed).toBe(false);
    expect(robots.sitemaps).toEqual(['https://example.com/sitemap.xml']);
  });

  it('treats an empty Disallow as allow-all and merges stacked user-agents', () => {
    const r = parseRobots('User-agent: ClaudeBot\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: *\nDisallow:');
    expect(evaluateRobots(r, 'CCBot', '/').allowed).toBe(false);
    expect(evaluateRobots(r, 'Googlebot', '/').allowed).toBe(true);
  });
});

describe('sample provider', () => {
  const ctx = {
    prompt: 'best project tracking software for agencies',
    brand: { name: 'Acme', aliases: [], domain: 'acme.io', description: '', industry: 'software' },
    competitors: [{ id: 'c1', name: 'Contoso', domain: 'contoso.com' }, { id: 'c2', name: 'Northwind', domain: 'northwind.com' }],
    facts: [{ label: 'Founded', value: '2014' }],
    seed: 'p1|w3',
    progress: 0.5,
  };

  it('is deterministic for the same seed', () => {
    expect(sampleAnswer('chatgpt', ctx)).toEqual(sampleAnswer('chatgpt', ctx));
    expect(sampleAnswer('chatgpt', ctx).text).not.toEqual(sampleAnswer('chatgpt', { ...ctx, seed: 'other' }).text);
  });

  it('produces answers the analyzer can read', () => {
    let mentioned = 0;
    for (let i = 0; i < 40; i++) {
      const a = sampleAnswer('perplexity', { ...ctx, seed: `s${i}` });
      expect(a.citations.length).toBeGreaterThan(0);
      const r = analyzeAnswer({ text: a.text, citations: a.citations, brand: { names: ['Acme'], domain: 'acme.io' }, competitors: [{ id: 'c1', names: ['Contoso'] }, { id: 'c2', names: ['Northwind'] }] });
      if (r.brandMentioned) mentioned++;
    }
    expect(mentioned).toBeGreaterThan(5);
    expect(mentioned).toBeLessThan(40);
  });
});

describe('claim extraction hygiene', () => {
  it('ignores list numbering and citation markers as factual signals', () => {
    const text = '1. **Acme** is frequently recommended for its onboarding. [1]\n2. **Contoso** is popular. [2]';
    expect(extractClaims(text, ['Acme'])).toEqual([]);
  });

  it('returns clean claim text without markdown', () => {
    const text = 'Overview.\n\n1. **Acme** was founded in 2014 and is based in Austin. [3]';
    expect(extractClaims(text, ['Acme'])).toEqual(['Acme was founded in 2014 and is based in Austin.']);
  });
});

describe('claim specificity', () => {
  it('skips generic descriptors and question echoes', () => {
    const text = 'Acme is recommended for responsive support. Acme offers transparent pricing. Here is an overview of "How much does Acme cost?".';
    expect(extractClaims(text, ['Acme'])).toEqual([]);
  });

  it('keeps prices, years, places, and counts', () => {
    const text = 'Acme plans start at $49 per month. Acme is headquartered in Denver. Acme serves 1,200 customers.';
    expect(extractClaims(text, ['Acme'])).toHaveLength(3);
  });
});

describe('brandDescriptors', () => {
  it('counts descriptors only in sentences about the brand', () => {
    const r = brandDescriptors(['Acme is reliable and popular. Contoso is expensive.', 'Acme can be expensive for small teams.'], ['Acme']);
    expect(r.strengths.map((x) => x.term)).toEqual(expect.arrayContaining(['reliable', 'popular']));
    expect(r.concerns).toEqual([{ term: 'expensive', count: 1 }]);
  });
});
