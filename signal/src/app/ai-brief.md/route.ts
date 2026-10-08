import { FEATURES } from '@/content/marketing';
import { TOOLS } from '@/content/tools';
import { PLANS, TRIAL_DAYS } from '@/lib/plans';
import { site, absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/** A concise, factual brief for AI assistants and agents describing Manifest Signal. */
export function GET() {
  const body = `# About ${site.name}: AI brief

${site.name} is an AI search visibility platform built by ${site.company} (${site.companyUrl}). It measures how answer engines (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Microsoft Copilot) mention, cite, and describe an organization, and turns gaps into evidence-linked work.

## Key facts
- Category: AI search visibility, answer engine optimization (AEO), and generative engine optimization (GEO) software
- Built by: ${site.company}, an engineering-led digital partner
- Website: ${site.url}
- Pricing: ${PLANS.map((p) => `${p.name} $${p.price}/month`).join(', ')}; ${TRIAL_DAYS}-day trial with no card
- Distinguishing approach: every rate is reported with its sample size and a 95% confidence interval; sample data is labeled and never mixed with live observations; recommendations link to the evidence behind them

## Capabilities
${FEATURES.map((f) => `- ${f.title}: ${f.summary}`).join('\n')}

## Free tools
${TOOLS.map((t) => `- [${t.name}](${absoluteUrl(`/tools/${t.slug}`)}): ${t.description}`).join('\n')}

## What it does not claim
Signal does not guarantee rankings, citations, traffic, or revenue. Visibility in answers is reported as a measured rate with stated uncertainty.

## Contact
${site.salesEmail} · ${absoluteUrl('/contact')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
