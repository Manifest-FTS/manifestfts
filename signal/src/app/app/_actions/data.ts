'use server';
import { revalidatePath } from 'next/cache';
import { and, count, eq } from 'drizzle-orm';
import { z } from 'zod';
import { schema } from '@/lib/db';
import { authorize, isReadOnly, logActivity } from '@/lib/workspace';
import { limitsFor } from '@/lib/plans';
import { newId, normalizeDomain } from '@/lib/utils';
import { generateInsightTasks, syncAuditTasks } from '@/lib/pipeline';
import { runReadinessAudit, UnsafeUrlError } from '@/lib/readiness';
import { rateLimit } from '@/lib/rate-limit';
import type { ActionState } from './workspace';

const refresh = (slug: string) => revalidatePath(`/app/${slug}`, 'layout');
const flat = (e: z.ZodError) => z.flattenError(e).fieldErrors as Record<string, string[] | undefined>;

async function writable(workspaceId: string, min: 'editor' | 'admin' = 'editor') {
  const auth = await authorize(workspaceId, min);
  if (!auth.ok) return auth;
  if (isReadOnly(auth.workspace)) return { ok: false as const, error: 'This workspace is read-only. Choose a plan to make changes.' };
  return auth;
}

/* Prompts */

const promptSchema = z.object({
  workspaceId: z.string(),
  promptId: z.string().optional(),
  text: z.string().trim().min(8, 'Write the full question (8+ characters).').max(300),
  topic: z.string().trim().min(1, 'Add a topic.').max(40),
  intent: z.enum(['discovery', 'comparison', 'evaluation', 'brand']),
});

export async function savePrompt(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = promptSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flat(parsed.error) };
  const auth = await writable(parsed.data.workspaceId);
  if (!auth.ok) return { error: auth.error };
  const { workspaceId, promptId, ...values } = parsed.data;
  if (promptId) {
    await auth.db.update(schema.prompts).set(values).where(and(eq(schema.prompts.id, promptId), eq(schema.prompts.workspaceId, workspaceId)));
  } else {
    const [{ value }] = await auth.db.select({ value: count() }).from(schema.prompts).where(and(eq(schema.prompts.workspaceId, workspaceId), eq(schema.prompts.active, true)));
    const limit = limitsFor(auth.workspace.plan).prompts;
    if (value >= limit) return { error: `Your plan includes ${limit} active prompts. Pause a prompt or upgrade to add more.` };
    await auth.db.insert(schema.prompts).values({ id: newId('prm'), workspaceId, ...values });
  }
  await logActivity(workspaceId, auth.user.id, promptId ? 'prompt.updated' : 'prompt.created', values.text);
  refresh(auth.workspace.slug);
  return { ok: true, message: promptId ? 'Prompt updated.' : 'Prompt added. It will be included in the next run.' };
}

export async function setPromptActive(workspaceId: string, promptId: string, active: boolean): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  if (active) {
    const [{ value }] = await auth.db.select({ value: count() }).from(schema.prompts).where(and(eq(schema.prompts.workspaceId, workspaceId), eq(schema.prompts.active, true)));
    if (value >= limitsFor(auth.workspace.plan).prompts) return { error: 'You have reached your plan’s active prompt limit.' };
  }
  await auth.db.update(schema.prompts).set({ active }).where(and(eq(schema.prompts.id, promptId), eq(schema.prompts.workspaceId, workspaceId)));
  refresh(auth.workspace.slug);
  return { ok: true, message: active ? 'Prompt resumed.' : 'Prompt paused. Its history is kept.' };
}

export async function deletePrompt(workspaceId: string, promptId: string): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  await auth.db.delete(schema.prompts).where(and(eq(schema.prompts.id, promptId), eq(schema.prompts.workspaceId, workspaceId)));
  await logActivity(workspaceId, auth.user.id, 'prompt.deleted', promptId);
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Prompt and its observations deleted.' };
}

/* Competitors */

const competitorSchema = z.object({
  workspaceId: z.string(),
  name: z.string().trim().min(2, 'Enter a name.').max(80),
  domain: z.string().trim().transform(normalizeDomain).refine((d) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(d), 'Enter a valid domain.'),
  aliases: z.string().max(300).optional().default('').transform((s) => s.split(',').map((a) => a.trim()).filter((a) => a.length >= 2).slice(0, 5)),
});

export async function addCompetitor(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = competitorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flat(parsed.error) };
  const auth = await writable(parsed.data.workspaceId);
  if (!auth.ok) return { error: auth.error };
  const [{ value }] = await auth.db.select({ value: count() }).from(schema.competitors).where(eq(schema.competitors.workspaceId, auth.workspace.id));
  const limit = limitsFor(auth.workspace.plan).competitors;
  if (value >= limit) return { error: `Your plan includes ${limit} competitors.` };
  if (parsed.data.domain === auth.workspace.domain) return { fieldErrors: { domain: ['That is your own domain.'] } };
  await auth.db.insert(schema.competitors).values({ id: newId('cmp'), workspaceId: auth.workspace.id, name: parsed.data.name, domain: parsed.data.domain, aliases: parsed.data.aliases });
  await logActivity(auth.workspace.id, auth.user.id, 'competitor.added', parsed.data.name);
  refresh(auth.workspace.slug);
  return { ok: true, message: `${parsed.data.name} added. Share of voice updates on the next run.` };
}

export async function removeCompetitor(workspaceId: string, competitorId: string): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  await auth.db.delete(schema.competitors).where(and(eq(schema.competitors.id, competitorId), eq(schema.competitors.workspaceId, workspaceId)));
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Competitor removed.' };
}

/* Facts and claims */

const factSchema = z.object({ workspaceId: z.string(), label: z.string().trim().min(2, 'Add a label.').max(60), value: z.string().trim().min(1, 'Add a value.').max(200) });

export async function addFact(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = factSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flat(parsed.error) };
  const auth = await writable(parsed.data.workspaceId);
  if (!auth.ok) return { error: auth.error };
  await auth.db.insert(schema.facts).values({ id: newId('fct'), workspaceId: auth.workspace.id, label: parsed.data.label, value: parsed.data.value });
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Fact added. New claims will be checked against it.' };
}

export async function deleteFact(workspaceId: string, factId: string): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  await auth.db.delete(schema.facts).where(and(eq(schema.facts.id, factId), eq(schema.facts.workspaceId, workspaceId)));
  refresh(auth.workspace.slug);
  return { ok: true };
}

const reviewSchema = z.object({ workspaceId: z.string(), claimId: z.string(), status: z.enum(['accurate', 'inaccurate', 'outdated', 'unverifiable', 'needs_review']), note: z.string().trim().max(500).optional() });

export async function reviewClaim(input: z.input<typeof reviewSchema>): Promise<ActionState> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { error: 'Invalid review.' };
  const auth = await writable(parsed.data.workspaceId);
  if (!auth.ok) return { error: auth.error };
  const reviewed = parsed.data.status !== 'needs_review';
  await auth.db.update(schema.claims)
    .set({ status: parsed.data.status, note: parsed.data.note ?? null, reviewedById: reviewed ? auth.user.id : null, reviewedAt: reviewed ? new Date() : null })
    .where(and(eq(schema.claims.id, parsed.data.claimId), eq(schema.claims.workspaceId, parsed.data.workspaceId)));
  if (parsed.data.status === 'inaccurate') await generateInsightTasks(parsed.data.workspaceId);
  refresh(auth.workspace.slug);
  return { ok: true };
}

/* Tasks */

const taskSchema = z.object({
  workspaceId: z.string(),
  taskId: z.string().optional(),
  title: z.string().trim().min(3, 'Add a short title.').max(200),
  description: z.string().trim().max(4000).optional().default(''),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.enum(['content', 'technical', 'schema', 'authority', 'accuracy']),
  assigneeId: z.string().optional().transform((v) => v || null),
  dueDate: z.string().optional().transform((v) => (v ? new Date(`${v}T12:00:00Z`) : null)),
});

export async function saveTask(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flat(parsed.error) };
  const auth = await writable(parsed.data.workspaceId);
  if (!auth.ok) return { error: auth.error };
  const { workspaceId, taskId, ...values } = parsed.data;
  if (values.assigneeId) {
    const [member] = await auth.db.select().from(schema.memberships).where(and(eq(schema.memberships.workspaceId, workspaceId), eq(schema.memberships.userId, values.assigneeId)));
    if (!member) return { fieldErrors: { assigneeId: ['Choose a workspace member.'] } };
  }
  if (taskId) await auth.db.update(schema.tasks).set(values).where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.workspaceId, workspaceId)));
  else await auth.db.insert(schema.tasks).values({ id: newId('tsk'), workspaceId, ...values });
  refresh(auth.workspace.slug);
  return { ok: true, message: taskId ? 'Task updated.' : 'Task created.' };
}

export async function setTaskStatus(workspaceId: string, taskId: string, status: 'todo' | 'in_progress' | 'done'): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  await auth.db.update(schema.tasks).set({ status, completedAt: status === 'done' ? new Date() : null })
    .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.workspaceId, workspaceId)));
  if (status === 'done') await logActivity(workspaceId, auth.user.id, 'task.completed', taskId);
  refresh(auth.workspace.slug);
  return { ok: true };
}

export async function deleteTask(workspaceId: string, taskId: string): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  // Automatic tasks are dismissed (kept as done) so they are not recreated by the next run.
  const [task] = await auth.db.select().from(schema.tasks).where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.workspaceId, workspaceId)));
  if (task?.dedupeKey) await auth.db.update(schema.tasks).set({ status: 'done', completedAt: new Date() }).where(eq(schema.tasks.id, taskId));
  else await auth.db.delete(schema.tasks).where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.workspaceId, workspaceId)));
  refresh(auth.workspace.slug);
  return { ok: true, message: task?.dedupeKey ? 'Recommendation dismissed.' : 'Task deleted.' };
}

/* Readiness audits */

export async function runAudit(_: ActionState, formData: FormData): Promise<ActionState> {
  const workspaceId = String(formData.get('workspaceId'));
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  const raw = String(formData.get('url') ?? '').trim() || `https://${auth.workspace.domain}`;
  const url = raw.includes('://') ? raw : `https://${raw}`;
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return { fieldErrors: { url: ['Enter a valid URL.'] } };
  }
  if (host !== auth.workspace.domain && !host.endsWith(`.${auth.workspace.domain}`)) return { fieldErrors: { url: [`Audit pages on ${auth.workspace.domain}. Use the public checker for other sites.`] } };
  if (!(await rateLimit(`audit:${workspaceId}`, 30, 3600)).ok) return { error: 'Audit limit reached for this hour. Try again shortly.' };
  try {
    const report = await runReadinessAudit(url);
    const auditId = newId('aud');
    await auth.db.insert(schema.audits).values({ id: auditId, workspaceId, url: report.finalUrl, score: report.score, results: report.results, crawlers: report.crawlers, durationMs: report.durationMs });
    await syncAuditTasks(workspaceId, auditId, report.results);
    await logActivity(workspaceId, auth.user.id, 'audit.run', report.finalUrl);
    refresh(auth.workspace.slug);
    return { ok: true, message: `Audit complete: score ${report.score}.` };
  } catch (error) {
    return { error: error instanceof UnsafeUrlError ? error.message : 'We could not reach that page. Check that it is publicly accessible.' };
  }
}

/* Reports */

export async function deleteReport(workspaceId: string, reportId: string): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  await auth.db.delete(schema.reports).where(and(eq(schema.reports.id, reportId), eq(schema.reports.workspaceId, workspaceId)));
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Report deleted.' };
}

export async function updateReportSummary(workspaceId: string, reportId: string, summary: string): Promise<ActionState> {
  const auth = await writable(workspaceId);
  if (!auth.ok) return { error: auth.error };
  await auth.db.update(schema.reports).set({ summary: summary.slice(0, 4000) }).where(and(eq(schema.reports.id, reportId), eq(schema.reports.workspaceId, workspaceId)));
  refresh(auth.workspace.slug);
  return { ok: true, message: 'Summary saved.' };
}

export async function setReportSharing(workspaceId: string, reportId: string, enabled: boolean): Promise<ActionState & { token?: string | null }> {
  const auth = await writable(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  if (enabled && limitsFor(auth.workspace.plan).id === 'starter') return { error: 'Shareable reports are available on Growth and Agency plans.' };
  const { randomToken } = await import('@/lib/auth/tokens');
  const token = enabled ? randomToken(24) : null;
  await auth.db.update(schema.reports).set({ shareToken: token }).where(and(eq(schema.reports.id, reportId), eq(schema.reports.workspaceId, workspaceId)));
  await logActivity(workspaceId, auth.user.id, enabled ? 'report.shared' : 'report.unshared', reportId);
  refresh(auth.workspace.slug);
  return { ok: true, token };
}
