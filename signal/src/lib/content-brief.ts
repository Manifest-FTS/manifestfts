import 'server-only';
import { and, desc, eq, gte, ne } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { Workspace } from '@/lib/db/schema';
import { domainMatches } from '@/lib/analysis';
import { ENGINE_BY_ID } from '@/lib/engines';

const INTENT_SECTIONS: Record<string, string[]> = {
  discovery: ['What should you look for in {c}?', 'How do the main options compare?', 'Who is {b} best suited for?', 'How much does it cost?'],
  comparison: ['How do the options differ on features, price, and support?', 'Which is better for which kind of buyer?', 'What do customers say?', 'How do you switch?'],
  evaluation: ['What are the strengths and limitations?', 'What does it cost, and what is included?', 'Who is it not a good fit for?', 'What do customers say?'],
  brand: ['What does {b} do?', 'Who is {b} for?', 'How does {b} work?', 'How much does {b} cost?'],
};

/**
 * Builds an evidence-based content brief for one question: what engines say now, who they
 * name, which sources they cite, the facts to state, and the structure that tends to be quoted.
 */
export async function buildBrief(workspace: Workspace, input: { promptId?: string | null; question: string }) {
  const db = await getDb();
  const since = new Date(Date.now() - 30 * 86400_000);
  const [prompt] = input.promptId ? await db.select().from(schema.prompts).where(and(eq(schema.prompts.id, input.promptId), eq(schema.prompts.workspaceId, workspace.id))) : [];
  const [answers, competitors, facts, related] = await Promise.all([
    prompt ? db.select({ engine: schema.answers.engine, brandMentioned: schema.answers.brandMentioned, competitorMentions: schema.answers.competitorMentions, citations: schema.answers.citations })
      .from(schema.answers).where(and(eq(schema.answers.promptId, prompt.id), eq(schema.answers.source, workspace.dataMode), gte(schema.answers.observedAt, since))).orderBy(desc(schema.answers.observedAt)).limit(200) : Promise.resolve([]),
    db.select().from(schema.competitors).where(eq(schema.competitors.workspaceId, workspace.id)),
    db.select().from(schema.facts).where(eq(schema.facts.workspaceId, workspace.id)),
    prompt ? db.select({ text: schema.prompts.text }).from(schema.prompts).where(and(eq(schema.prompts.workspaceId, workspace.id), eq(schema.prompts.topic, prompt.topic), ne(schema.prompts.id, prompt.id))).limit(6) : Promise.resolve([]),
  ]);

  const b = workspace.brandName;
  const c = workspace.description.replace(/^.*? offers /, '').replace(/\.$/, '') || 'this category';
  const intent = prompt?.intent ?? 'discovery';
  const lines: string[] = [];
  lines.push(`**Target question:** ${input.question}`);
  if (prompt) lines.push('', `**Topic:** ${prompt.topic} · **Intent:** ${intent}`);

  lines.push('', '## What answer engines say today');
  if (answers.length) {
    const mentioned = answers.filter((a) => a.brandMentioned).length;
    const compCounts = new Map<string, number>();
    for (const a of answers) for (const m of a.competitorMentions) compCounts.set(m.competitorId, (compCounts.get(m.competitorId) ?? 0) + 1);
    const engines = [...new Set(answers.map((a) => ENGINE_BY_ID[a.engine]?.name ?? a.engine))];
    lines.push(`In the last 30 days ${b} was named in **${mentioned} of ${answers.length}** answers to this question across ${engines.join(', ')}${workspace.dataMode === 'sample' ? ' (sample data)' : ''}.`);
    const named = [...compCounts.entries()].sort((x, y) => y[1] - x[1]).map(([id, n]) => `${competitors.find((x) => x.id === id)?.name ?? 'A competitor'} (${n})`);
    if (named.length) lines.push('', `Competitors named instead: ${named.join(', ')}. Address them fairly and specifically; vague comparisons are rarely quoted.`);

    const domains = new Map<string, number>();
    for (const a of answers) for (const d of new Set(a.citations.map((x) => x.domain))) domains.set(d, (domains.get(d) ?? 0) + 1);
    const top = [...domains.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8);
    if (top.length) {
      lines.push('', '## Sources engines cite for this question', '');
      lines.push(...top.map(([d, n]) => `- ${d}: ${n} answer${n === 1 ? '' : 's'}${domainMatches(d, workspace.domain) ? ' (your site)' : competitors.some((x) => domainMatches(d, x.domain)) ? ' (competitor)' : ''}`));
      lines.push('', 'Read the most-cited pages: match their coverage, then go further with specifics, current figures, and first-hand detail. Make sure your listings on cited third-party sites are accurate.');
    }
  } else {
    lines.push('No observations yet for this question. Track it as a prompt to measure the effect of the new page.');
  }

  lines.push('', '## Open with a direct answer', '', `Start with a 40–60 word answer to “${input.question}” that names ${b}, says who it is for, and includes one concrete fact (a price, a number, a date, or a location). Engines often quote the first self-contained passage.`);

  const sections = [...new Set([...(INTENT_SECTIONS[intent] ?? INTENT_SECTIONS.discovery!).map((s) => s.replace(/\{b\}/g, b).replace(/\{c\}/g, c)), ...related.map((r) => r.text)])].slice(0, 7);
  lines.push('', '## Sections to include', '', 'Use each as an H2 phrased as a question, and answer it in the first sentence underneath. Aim for 100–170 words per section so each can be quoted on its own.', '');
  lines.push(...sections.map((s) => `- ${s}`));

  lines.push('', '## Facts to state explicitly');
  if (facts.length) lines.push('', ...facts.map((f) => `- **${f.label}:** ${f.value}`), '', 'Use these exact values. Inconsistent figures across your site and profiles are a common cause of inaccurate answers.');
  else lines.push('', 'Your fact sheet is empty. Add founding year, location, pricing, and key capabilities under Accuracy so briefs and drafts can state them precisely.');

  lines.push('', '## Proof and trust', '', '- Name the author or reviewer and their relevant experience.', '- Show a published date and a last-updated date.', '- Link to primary sources for any statistic, standard, or regulation you cite.', '- Include at least one first-hand example, customer outcome, or worked case, labeled with its date and context.');
  lines.push('', '## Structure and markup', '', '- A comparison table if more than two options are discussed.', '- A short FAQ section using questions from this brief, marked up as FAQPage.', `- Article markup with author, datePublished, and dateModified, and Organization markup for ${b} with sameAs profiles.`, '- Internal links to your pricing, product, and contact pages with descriptive anchor text.');
  lines.push('', '## Length and next steps', '', '- Target 900–1,400 words. Cover the question completely before adding anything else.', '- After publishing, run a readiness audit on the URL and track this question to measure change.');

  return { title: input.question.length > 90 ? `${input.question.slice(0, 87)}…` : input.question, brief: lines.join('\n') };
}
