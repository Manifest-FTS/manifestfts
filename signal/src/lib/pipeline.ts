import 'server-only';
import { and, desc, eq, gte, inArray, isNotNull, ne, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { CheckResult, Citation, DataMode, EngineId, TaskCategory, TaskEvidence, Workspace } from '@/lib/db/schema';
import { analyzeAnswer, matchFact } from '@/lib/analysis';
import { liveProvider } from '@/lib/providers/live';
import { sampleAnswer } from '@/lib/providers/sample';
import type { AskContext } from '@/lib/providers/types';
import { ENGINE_BY_ID } from '@/lib/engines';
import { newId } from '@/lib/utils';
import { notifyMembers } from '@/lib/workspace';
import { limitsFor } from '@/lib/plans';

/** Engines that will actually run for this workspace in its current data mode. */
export function runnableEngines(workspace: Workspace): EngineId[] {
  const limits = limitsFor(workspace.plan);
  const allowed = workspace.engines.filter((e) => limits.engines === 'all' || limits.engines.includes(e));
  return workspace.dataMode === 'live' ? allowed.filter((e) => liveProvider(e)) : allowed;
}

async function loadContext(workspaceId: string) {
  const db = await getDb();
  const [workspace] = await db.select().from(schema.workspaces).where(eq(schema.workspaces.id, workspaceId));
  if (!workspace) throw new Error('Workspace not found');
  const [prompts, competitors, facts] = await Promise.all([
    db.select().from(schema.prompts).where(and(eq(schema.prompts.workspaceId, workspaceId), eq(schema.prompts.active, true))),
    db.select().from(schema.competitors).where(eq(schema.competitors.workspaceId, workspaceId)),
    db.select().from(schema.facts).where(eq(schema.facts.workspaceId, workspaceId)),
  ]);
  return { db, workspace, prompts, competitors, facts };
}

type Ctx = Awaited<ReturnType<typeof loadContext>>;

function askContext(ctx: Ctx, promptText: string, seed: string, progress: number): AskContext {
  return {
    prompt: promptText,
    brand: { name: ctx.workspace.brandName, aliases: ctx.workspace.brandAliases, domain: ctx.workspace.domain, description: ctx.workspace.description, industry: ctx.workspace.industry },
    competitors: ctx.competitors.map((c) => ({ id: c.id, name: c.name, domain: c.domain })),
    facts: ctx.facts.map((f) => ({ label: f.label, value: f.value })),
    seed,
    progress,
  };
}

/** Analyzes an answer and builds the rows to persist (answer plus any extracted claims). */
function buildRows(ctx: Ctx, runId: string, promptId: string, engine: EngineId, source: DataMode, result: { text: string; citations: Citation[]; model: string; latencyMs: number }, observedAt: Date) {
  const analysis = analyzeAnswer({
    text: result.text,
    citations: result.citations,
    brand: { names: [ctx.workspace.brandName, ...ctx.workspace.brandAliases], domain: ctx.workspace.domain },
    competitors: ctx.competitors.map((c) => ({ id: c.id, names: [c.name, ...c.aliases] })),
  });
  const answerId = newId('ans');
  const answer: typeof schema.answers.$inferInsert = {
    id: answerId, workspaceId: ctx.workspace.id, runId, promptId, engine, source, model: result.model, text: result.text,
    brandMentioned: analysis.brandMentioned, brandPosition: analysis.brandPosition, brandCited: analysis.brandCited,
    sentiment: analysis.sentiment, competitorMentions: analysis.competitorMentions, citations: analysis.citations,
    latencyMs: result.latencyMs, observedAt,
  };
  const claims = analysis.claims.map((text): typeof schema.claims.$inferInsert => {
    const fact = matchFact(text, ctx.facts);
    // A claim that restates the recorded fact verbatim is auto-confirmed; anything else waits for a person.
    const confirmed = !!fact && text.toLowerCase().includes(fact.value.toLowerCase());
    return { id: newId('clm'), workspaceId: ctx.workspace.id, answerId, factId: fact?.id ?? null, text, status: confirmed ? 'accurate' : 'needs_review', createdAt: observedAt };
  });
  return { answer, claims };
}

export async function activeRun(workspaceId: string) {
  const db = await getDb();
  const [run] = await db.select().from(schema.runs)
    .where(and(eq(schema.runs.workspaceId, workspaceId), inArray(schema.runs.status, ['queued', 'running']), gte(schema.runs.startedAt, new Date(Date.now() - 60 * 60_000))))
    .orderBy(desc(schema.runs.startedAt)).limit(1);
  return run ?? null;
}

/** Creates a run record. The caller schedules `executeRun` (for example with `after()`). */
export async function createRun(workspace: Workspace, trigger: 'manual' | 'scheduled' | 'onboarding') {
  const db = await getDb();
  const engines = runnableEngines(workspace);
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.prompts)
    .where(and(eq(schema.prompts.workspaceId, workspace.id), eq(schema.prompts.active, true)));
  const id = newId('run');
  await db.insert(schema.runs).values({ id, workspaceId: workspace.id, trigger, source: workspace.dataMode, totalJobs: count * engines.length, status: 'queued' });
  return id;
}

async function pool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) await worker(items[index++]!);
  }));
}

export async function executeRun(runId: string) {
  const db = await getDb();
  const [run] = await db.select().from(schema.runs).where(eq(schema.runs.id, runId));
  if (!run || run.status !== 'queued') return;
  await db.update(schema.runs).set({ status: 'running' }).where(eq(schema.runs.id, runId));
  const ctx = await loadContext(run.workspaceId);
  const engines = runnableEngines(ctx.workspace);
  const jobs = ctx.prompts.flatMap((p) => engines.map((engine) => ({ prompt: p, engine })));
  let failed = 0;
  let lastError: string | null = null;

  await pool(jobs, run.source === 'live' ? 4 : 16, async ({ prompt, engine }) => {
    try {
      const observedAt = new Date();
      const ask = askContext(ctx, prompt.text, `${prompt.id}|${observedAt.toISOString().slice(0, 10)}`, 1);
      const provider = run.source === 'live' ? liveProvider(engine) : null;
      if (run.source === 'live' && !provider) throw new Error(`${ENGINE_BY_ID[engine].name} is not configured`);
      const result = provider ? await provider.ask(ask) : sampleAnswer(engine, ask);
      const rows = buildRows(ctx, runId, prompt.id, engine, run.source, result, observedAt);
      await db.insert(schema.answers).values(rows.answer);
      if (rows.claims.length) await db.insert(schema.claims).values(rows.claims);
      await db.update(schema.runs).set({ completedJobs: sql`${schema.runs.completedJobs} + 1` }).where(eq(schema.runs.id, runId));
    } catch (error) {
      failed++;
      lastError = error instanceof Error ? error.message : 'Unknown error';
      await db.update(schema.runs).set({ failedJobs: sql`${schema.runs.failedJobs} + 1` }).where(eq(schema.runs.id, runId));
    }
  });

  const allFailed = jobs.length > 0 && failed === jobs.length;
  await db.update(schema.runs)
    .set({ status: allFailed ? 'failed' : 'completed', completedAt: new Date(), error: lastError })
    .where(eq(schema.runs.id, runId));
  await generateInsightTasks(ctx.workspace.id);
  if (run.trigger === 'scheduled') await emailRunAlert(ctx.workspace, runId, jobs.length - failed, failed, allFailed);
  await notifyMembers(ctx.workspace.id, allFailed
    ? { kind: 'run_failed', title: 'Observation run failed', body: lastError ?? 'No answers were collected.', href: `/app/${ctx.workspace.slug}/overview` }
    : { kind: 'run_completed', title: 'Observation run completed', body: `${jobs.length - failed} of ${jobs.length} answers collected${failed ? `; ${failed} failed` : ''}.`, href: `/app/${ctx.workspace.slug}/overview` });
}

/** Emails members who opted in to run alerts (and accuracy alerts when new claims need review). */
async function emailRunAlert(workspace: Workspace, runId: string, collected: number, failed: number, allFailed: boolean) {
  const db = await getDb();
  const members = await db.select({ email: schema.users.email, prefs: schema.users.emailPrefs }).from(schema.memberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
    .where(and(eq(schema.memberships.workspaceId, workspace.id), isNotNull(schema.users.emailVerifiedAt)));
  const [{ pending }] = await db.select({ pending: sql<number>`count(*)::int` }).from(schema.claims)
    .innerJoin(schema.answers, eq(schema.answers.id, schema.claims.answerId))
    .where(and(eq(schema.answers.runId, runId), eq(schema.claims.status, 'needs_review')));
  const { sendEmail } = await import('@/lib/email');
  const { absoluteUrl } = await import('@/lib/site');
  for (const m of members) {
    const wantsRun = m.prefs.runAlerts;
    const wantsAccuracy = m.prefs.accuracyAlerts && pending > 0;
    if (!wantsRun && !wantsAccuracy) continue;
    await sendEmail({
      to: m.email,
      subject: allFailed ? `${workspace.name}: scheduled run failed` : `${workspace.name}: scheduled run complete`,
      paragraphs: [
        ...(wantsRun ? [allFailed ? 'No answers were collected in the latest scheduled run. Check the engine configuration in Settings.' : `${collected} answers collected${failed ? `, ${failed} failed` : ''}.`] : []),
        ...(wantsAccuracy ? [`${pending} new statements about ${workspace.brandName} need review.`] : []),
      ],
      action: { label: wantsAccuracy && !wantsRun ? 'Review claims' : 'Open dashboard', url: absoluteUrl(`/app/${workspace.slug}/${wantsAccuracy && !wantsRun ? 'accuracy' : 'overview'}`) },
    });
  }
}

/** Seeds eight weekly sample runs so a new workspace has trends to explore immediately. */
export async function seedSampleHistory(workspaceId: string, weeks = 8) {
  const ctx = await loadContext(workspaceId);
  const engines = runnableEngines({ ...ctx.workspace, dataMode: 'sample' });
  const db = ctx.db;
  for (let w = 0; w < weeks; w++) {
    const observedAt = new Date(Date.now() - (weeks - 1 - w) * 7 * 86400_000 - 3600_000);
    const runId = newId('run');
    const total = ctx.prompts.length * engines.length;
    await db.insert(schema.runs).values({ id: runId, workspaceId, trigger: w === weeks - 1 ? 'onboarding' : 'scheduled', source: 'sample', status: 'completed', totalJobs: total, completedJobs: total, startedAt: observedAt, completedAt: new Date(observedAt.getTime() + 4 * 60_000) });
    const answers: (typeof schema.answers.$inferInsert)[] = [];
    const claims: (typeof schema.claims.$inferInsert)[] = [];
    for (const prompt of ctx.prompts) {
      for (const engine of engines) {
        const ask = askContext(ctx, prompt.text, `${prompt.id}|w${w}`, w / Math.max(1, weeks - 1));
        const rows = buildRows(ctx, runId, prompt.id, engine, 'sample', sampleAnswer(engine, ask), observedAt);
        answers.push(rows.answer);
        claims.push(...rows.claims);
      }
    }
    if (answers.length) await db.insert(schema.answers).values(answers);
    if (claims.length) await db.insert(schema.claims).values(claims);
  }
  await generateInsightTasks(workspaceId);
}

async function upsertTask(workspaceId: string, task: { dedupeKey: string; title: string; description: string; priority: 'high' | 'medium' | 'low'; category: TaskCategory; evidence: TaskEvidence }) {
  const db = await getDb();
  const [existing] = await db.select({ id: schema.tasks.id }).from(schema.tasks)
    .where(and(eq(schema.tasks.workspaceId, workspaceId), eq(schema.tasks.dedupeKey, task.dedupeKey))).limit(1);
  if (existing) return false;
  await db.insert(schema.tasks).values({ id: newId('tsk'), workspaceId, ...task });
  return true;
}

const AUDIT_CATEGORY: Record<CheckResult['category'], TaskCategory> = { crawler: 'technical', discovery: 'technical', security: 'technical', content: 'content', schema: 'schema' };

/** Opens tasks for failing or warning checks and closes open audit tasks whose check now passes. */
export async function syncAuditTasks(workspaceId: string, auditId: string, results: CheckResult[]) {
  const db = await getDb();
  for (const r of results) {
    const key = `audit:${r.id}`;
    if ((r.status === 'fail' || r.status === 'warn') && r.recommendation) {
      await upsertTask(workspaceId, {
        dedupeKey: key,
        title: r.label.startsWith('Page') || r.label.startsWith('Served') ? `Fix: ${r.label.toLowerCase()}` : `Improve: ${r.label.charAt(0).toLowerCase()}${r.label.slice(1)}`,
        description: `${r.detail}\n\n${r.recommendation}`,
        priority: r.status === 'fail' ? 'high' : 'medium',
        category: AUDIT_CATEGORY[r.category],
        evidence: { kind: 'audit', refId: auditId, label: `Readiness check · ${r.label}` },
      });
    } else if (r.status === 'pass') {
      await db.update(schema.tasks).set({ status: 'done', completedAt: new Date() })
        .where(and(eq(schema.tasks.workspaceId, workspaceId), eq(schema.tasks.dedupeKey, key), ne(schema.tasks.status, 'done')));
    }
  }
}

/** Turns patterns in recent answers into evidence-linked recommendations. */
export async function generateInsightTasks(workspaceId: string) {
  const db = await getDb();
  const [workspace] = await db.select().from(schema.workspaces).where(eq(schema.workspaces.id, workspaceId));
  if (!workspace) return;
  const since = new Date(Date.now() - 14 * 86400_000);
  const recent = await db.select({
    promptId: schema.answers.promptId, engine: schema.answers.engine, brandMentioned: schema.answers.brandMentioned,
    competitorMentions: schema.answers.competitorMentions, citations: schema.answers.citations, promptText: schema.prompts.text,
  }).from(schema.answers)
    .innerJoin(schema.prompts, eq(schema.prompts.id, schema.answers.promptId))
    .where(and(eq(schema.answers.workspaceId, workspaceId), eq(schema.answers.source, workspace.dataMode), gte(schema.answers.observedAt, since)));

  // 1. Prompts where competitors appear but the brand is absent across most engines.
  const byPrompt = new Map<string, { text: string; total: number; absentWithCompetitors: number }>();
  for (const a of recent) {
    const entry = byPrompt.get(a.promptId) ?? { text: a.promptText, total: 0, absentWithCompetitors: 0 };
    entry.total++;
    if (!a.brandMentioned && a.competitorMentions.length) entry.absentWithCompetitors++;
    byPrompt.set(a.promptId, entry);
  }
  const gaps = [...byPrompt.entries()].filter(([, v]) => v.total >= 4 && v.absentWithCompetitors / v.total >= 0.6)
    .sort((a, b) => b[1].absentWithCompetitors / b[1].total - a[1].absentWithCompetitors / a[1].total).slice(0, 5);
  for (const [promptId, v] of gaps) {
    await upsertTask(workspaceId, {
      dedupeKey: `gap:${promptId}`,
      title: `Publish a source page that answers "${v.text.length > 70 ? `${v.text.slice(0, 67)}…` : v.text}"`,
      description: `In the last 14 days, competitors were named but ${workspace.brandName} was absent in ${v.absentWithCompetitors} of ${v.total} answers to this prompt. Create or strengthen a page that answers the question directly, with specific facts, comparisons, and a clear summary near the top.`,
      priority: v.absentWithCompetitors / v.total >= 0.8 ? 'high' : 'medium',
      category: 'content',
      evidence: { kind: 'prompt', refId: promptId, label: `${v.absentWithCompetitors}/${v.total} answers omit ${workspace.brandName}` },
    });
  }

  // 2. Third-party domains engines rely on that never cite the brand.
  const domainCounts = new Map<string, number>();
  for (const a of recent) for (const d of new Set(a.citations.map((c) => c.domain))) domainCounts.set(d, (domainCounts.get(d) ?? 0) + 1);
  const ownDomains = new Set([workspace.domain]);
  const competitorDomains = new Set((await db.select({ d: schema.competitors.domain }).from(schema.competitors).where(eq(schema.competitors.workspaceId, workspaceId))).map((c) => c.d));
  const topSources = [...domainCounts.entries()]
    .filter(([d]) => !ownDomains.has(d) && !competitorDomains.has(d) && !d.endsWith(`.${workspace.domain}`))
    .sort((a, b) => b[1] - a[1]).slice(0, 3);
  for (const [domain, count] of topSources) {
    if (count < Math.max(4, recent.length * 0.12)) continue;
    await upsertTask(workspaceId, {
      dedupeKey: `source:${domain}`,
      title: `Strengthen ${workspace.brandName}'s presence on ${domain}`,
      description: `${domain} was cited in ${count} of ${recent.length} recent answers. Make sure your profile, listing, or coverage there is accurate and current; engines reuse these third-party sources when describing your category.`,
      priority: 'medium',
      category: 'authority',
      evidence: { kind: 'source', refId: domain, label: `Cited in ${count} answers` },
    });
  }

  // 3. Claims that contradict the fact sheet.
  const flagged = await db.select({ id: schema.claims.id, text: schema.claims.text }).from(schema.claims)
    .where(and(eq(schema.claims.workspaceId, workspaceId), eq(schema.claims.status, 'inaccurate'), isNotNull(schema.claims.reviewedAt))).limit(5);
  for (const claim of flagged) {
    await upsertTask(workspaceId, {
      dedupeKey: `claim:${claim.id}`,
      title: 'Correct an inaccurate statement engines repeat',
      description: `Reviewed as inaccurate: "${claim.text}"\n\nPublish the correct information on an authoritative page (About, pricing, or FAQ), mark it up with structured data, and update third-party profiles that may be the source of the error.`,
      priority: 'high',
      category: 'accuracy',
      evidence: { kind: 'claim', refId: claim.id, label: 'Claim reviewed as inaccurate' },
    });
  }
}
