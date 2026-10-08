import { describe, expect, it } from 'vitest';
import { analyzeCitability } from './citability';
import { evaluateCrawlers, crawlerScore } from './crawlers';
import { parseRobots } from './robots';
import { jsonLd, links, meta } from './html';
import { composite, scoreSchema } from './scoring';

const para = (words: number, lead = 'Acme Health') => `${lead} ${Array.from({ length: words - 2 }, (_, i) => (i % 17 === 0 ? `${2010 + (i % 9)}` : 'word')).join(' ')}.`;

describe('citability', () => {
  it('rewards quotable, fact-rich passages and question headings', () => {
    const html = `<main><h2>What does Acme cost?</h2><p>${para(140)}</p><h2>How does Acme work?</h2><p>${para(130)}</p><p>${para(150)}</p><ul><li>One</li></ul></main>`;
    const r = analyzeCitability(html);
    expect(r.quotable).toBe(3);
    expect(r.questionHeadings).toBe(2);
    expect(r.score).toBeGreaterThan(70);
  });

  it('flags dangling and fact-free paragraphs', () => {
    const filler = 'helps teams do more with less every single day and keeps everyone aligned on the work that matters most to them';
    const html = `<main><p>This ${filler} and ${filler}.</p><p>We help people ${filler} and ${filler}.</p></main>`;
    const r = analyzeCitability(html);
    expect(r.weakBlocks).toHaveLength(2);
    expect(r.weakBlocks[0]!.reason).toMatch(/earlier text/);
    expect(r.weakBlocks[1]!.reason).toMatch(/No concrete facts/);
    expect(r.score).toBeLessThan(40);
  });
});

describe('crawler access', () => {
  it('reports partial access only when public (sitemap) pages are blocked', () => {
    const robots = parseRobots('User-agent: *\nDisallow: /admin\n\nUser-agent: PerplexityBot\nDisallow: /pricing\n\nUser-agent: GPTBot\nDisallow: /');
    const results = evaluateCrawlers(robots, '/', ['/', '/pricing', '/about']);
    expect(results.find((r) => r.agent === 'PerplexityBot')?.status).toBe('partial');
    expect(results.find((r) => r.agent === 'GPTBot')?.status).toBe('blocked');
    expect(results.find((r) => r.agent === 'OAI-SearchBot')?.status).toBe('allowed'); // /admin is private, not in the sitemap
    expect(crawlerScore(results, true)).toBeGreaterThan(90);
  });
});

describe('html and schema helpers', () => {
  it('reads metadata regardless of attribute order', () => {
    expect(meta('<meta content="Hello" name="description">', 'name', 'description')).toBe('Hello');
  });

  it('flattens JSON-LD graphs and counts invalid blocks', () => {
    const html = '<script type="application/ld+json">{"@graph":[{"@type":"Organization","name":"Acme","sameAs":["a","b"]},{"@type":"WebSite"}]}</script><script type="application/ld+json">{bad</script>';
    const { nodes, invalid } = jsonLd(html);
    expect(nodes.map((n) => n.type)).toEqual(['Organization', 'WebSite']);
    expect(invalid).toBe(1);
  });

  it('classifies internal and external links', () => {
    const l = links('<a href="/about">About</a><a href="https://other.org/x">Src</a>', 'https://www.acme.com/');
    expect(l.map((x) => x.internal)).toEqual([true, false]);
  });

  it('scores schema and combines subscores', () => {
    const { nodes } = jsonLd('<script type="application/ld+json">[{"@type":"Organization","sameAs":["a","b"]},{"@type":"WebSite"},{"@type":"FAQPage"}]</script>');
    expect(scoreSchema({ nodes, invalidJsonLd: 0 } as never)).toBe(80);
    expect(composite({ citability: 100, crawlers: 100, brand: 100, eeat: 100, schema: 100, platform: 100 })).toBe(100);
  });
});
