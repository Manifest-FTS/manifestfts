import { mainContent, tagTexts, wordCount } from './html';

// How easily an answer engine can lift a self-contained, fact-rich passage from the page.
// Heuristics are disclosed in the readiness docs; they guide editing, they do not predict citation.

const DANGLING = /^(this|that|these|those|it|they|he|she|its|their|such|here|there|also|however|but|and|so)\b/i;
const QUESTION = /\?$|^(what|how|why|when|who|which|where|can|does|do|is|are|should|will)\b/i;
const NUMBER = /\d/;

export const QUOTABLE_MIN = 100;
export const QUOTABLE_MAX = 170;

export interface WeakBlock { excerpt: string; reason: string; words: number }

export interface CitabilityReport {
  score: number;
  words: number;
  paragraphs: number;
  quotable: number;
  factRich: number;
  questionHeadings: number;
  structured: boolean;
  weakBlocks: WeakBlock[];
  recommendations: string[];
}

export function analyzeCitability(html: string): CitabilityReport {
  const main = mainContent(html);
  const paragraphs = tagTexts(main, 'p').filter((p) => wordCount(p) >= 8);
  const headings = [...tagTexts(main, 'h2'), ...tagTexts(main, 'h3')];
  const words = wordCount(paragraphs.join(' ') + ' ' + tagTexts(main, 'li').join(' '));
  const structured = /<(ul|ol|table|dl)\b/i.test(main);

  let quotable = 0;
  let factRich = 0;
  let selfContained = 0;
  const weakBlocks: WeakBlock[] = [];
  for (const p of paragraphs) {
    const n = wordCount(p);
    const hasFacts = NUMBER.test(p) || /\b[A-Z][a-z]+ [A-Z][a-z]+/.test(p);
    const dangling = DANGLING.test(p);
    if (n >= QUOTABLE_MIN && n <= QUOTABLE_MAX && !dangling) quotable++;
    if (hasFacts) factRich++;
    if (!dangling) selfContained++;
    if (weakBlocks.length < 5 && n >= 25) {
      const reason = dangling
        ? 'Starts by referring to earlier text, so it cannot be quoted on its own.'
        : n > 220
          ? 'Very long; engines tend to quote tighter, single-topic passages.'
          : !hasFacts
            ? 'No concrete facts, numbers, or named entities to cite.'
            : null;
      if (reason) weakBlocks.push({ excerpt: p.length > 180 ? `${p.slice(0, 177)}…` : p, reason, words: n });
    }
  }
  const questionHeadings = headings.filter((h) => QUESTION.test(h.trim())).length;
  const ratio = (x: number) => (paragraphs.length ? x / paragraphs.length : 0);

  const score = Math.min(100, Math.round(
    (words >= 600 ? 20 : words >= 300 ? 12 : words >= 120 ? 6 : 0) +
    Math.min(quotable, 4) * 8 +
    ratio(factRich) * 15 +
    Math.min(questionHeadings, 3) * 5 +
    (structured ? 8 : 0) +
    ratio(selfContained) * 10,
  ));

  const recommendations: string[] = [];
  if (quotable < 3) recommendations.push(`Add standalone sections of ${QUOTABLE_MIN}–${QUOTABLE_MAX} words that each answer one question completely, so they can be quoted without surrounding context.`);
  if (ratio(factRich) < 0.5) recommendations.push('Add concrete proof points: metrics, dates, prices, locations, examples, and named entities.');
  if (questionHeadings < 2) recommendations.push('Phrase key subheadings as the questions buyers ask, and answer each in the first sentence below it.');
  if (!structured) recommendations.push('Use lists or tables for steps, comparisons, and specifications; engines extract structured content reliably.');
  if (weakBlocks.some((w) => w.reason.startsWith('Starts'))) recommendations.push('Rewrite paragraphs that begin with "This", "It", or "They" so each one names its subject.');
  if (words < 300) recommendations.push('Expand the page: thin pages rarely contain enough substance to be cited.');
  if (!recommendations.length) recommendations.push('Content is well structured for citation. Keep facts current and add dated updates when details change.');

  return { score, words, paragraphs: paragraphs.length, quotable, factRich, questionHeadings, structured, weakBlocks, recommendations };
}
