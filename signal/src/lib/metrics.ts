// Pure metric helpers. Every rate carries its denominator and a 95% Wilson interval so
// small samples are never presented with more confidence than they deserve.

export interface Rate {
  value: number | null;
  successes: number;
  n: number;
  low: number | null;
  high: number | null;
}

export function wilson(successes: number, n: number, z = 1.96): Rate {
  if (n <= 0) return { value: null, successes: 0, n: 0, low: null, high: null };
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const center = (p + (z * z) / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { value: p, successes, n, low: Math.max(0, center - margin), high: Math.min(1, center + margin) };
}

/** Half-width of the interval in percentage points, for "±x pts" labels. */
export function marginPts(rate: Rate) {
  if (rate.low === null || rate.high === null) return null;
  return Math.round(((rate.high - rate.low) / 2) * 1000) / 10;
}

export interface AnswerLike {
  brandMentioned: boolean;
  brandCited: boolean;
  brandPosition: number | null;
  sentiment: string | null;
  competitorMentions: { competitorId: string }[];
}

export function summarize(answers: AnswerLike[]) {
  const n = answers.length;
  const mentioned = answers.filter((a) => a.brandMentioned);
  const cited = answers.filter((a) => a.brandCited).length;
  const competitorMentionTotal = answers.reduce((sum, a) => sum + a.competitorMentions.length, 0);
  const positions = mentioned.map((a) => a.brandPosition).filter((p): p is number => p !== null);
  const positive = mentioned.filter((a) => a.sentiment === 'positive').length;
  const negative = mentioned.filter((a) => a.sentiment === 'negative').length;
  return {
    n,
    mention: wilson(mentioned.length, n),
    citation: wilson(cited, n),
    shareOfVoice: wilson(mentioned.length, mentioned.length + competitorMentionTotal),
    firstPosition: wilson(positions.filter((p) => p === 1).length, mentioned.length),
    avgPosition: positions.length ? positions.reduce((a, b) => a + b, 0) / positions.length : null,
    positive: wilson(positive, mentioned.length),
    negative: wilson(negative, mentioned.length),
  };
}

/** Two rates differ meaningfully only when their intervals do not overlap. */
export function isMeaningfulChange(a: Rate, b: Rate) {
  if (a.low === null || b.low === null || a.high === null || b.high === null) return false;
  return a.high < b.low || b.high < a.low;
}
