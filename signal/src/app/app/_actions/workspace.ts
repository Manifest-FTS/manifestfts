'use server';
import { after } from 'next/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { and, eq, inArray, like, or } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { authorize, logActivity } from '@/lib/workspace';
import { newId, normalizeDomain, slugify } from '@/lib/utils';
import { limitsFor, TRIAL_DAYS } from '@/lib/plans';
import { saveAudit, seedSampleHistory } from '@/lib/pipeline';
import { runReadinessAudit } from '@/lib/readiness';
import { rateLimit } from '@/lib/rate-limit';
import { ENGINES } from '@/lib/engines';
import type { EngineId } from '@/lib/db/schema';

export type ActionState = { ok?: boolean; error?: string; message?: string; fieldErrors?: Record<string, string[] | undefined> };

const engineIds = ENGINES.map((e) => e.id) as [EngineId, ...EngineId[]];
const domainField = z.string().trim().transform(normalizeDomain).refine((d) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(d), 'Enter a valid domain, like example.com.');

const onboardingSchema = z.object({
  brandName: z.string().trim().min(2, 'Enter your brand name.').max(80),
  domain: domainField,
  category: z.string().trim().min(3, 'Describe what you offer in a few words.').max(80),
  audience: z.string().trim().max(80).optional().default(''),
  industry: z.string().trim().max(60).default(''),
  description: z.string().trim().max(400).default(''),
  aliases: z.array(z.string().trim().min(2).max(60)).max(5).default([]),
  competitors: z.array(z.object({ name: z.string().trim().min(2).max(80), domain: domainField })).max(10),
  prompts: z.array(z.object({ text: z.string().trim().min(8).max(300), topic: z.string().trim().min(1).max(40), intent: z.enum(['discovery', 'comparison', 'evaluation', 'brand']) })).min(3, 'Choose at least three prompts.').max(100),
  engines: z.array(z.enum(engineIds)).min(1, 'Choose at least one engine.'),
  runFrequency: z.enum(['daily', 'weekly', 'manual']),
});

async function uniqueSlug(base: string) {
  const db = await getDb();
  const root = slugify(base);
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const [hit] = await db.select({ id: schema.workspaces.id }).from(schema.workspaces).where(eq(schema.workspaces.slug, candidate)).limit(1);
    if (!hit && !['new', 'onboarding', 'account'].includes(candidate)) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}

export async function createWorkspace(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get('payload') ?? ''));
  } catch {
    return { error: 'Something went wrong reading the form. Refresh and try again.' };
  }
  const parsed = onboardingSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the highlighted fields.' };
  if (!(await rateLimit(`ws-create:${user.id}`, 10, 86400)).ok) return { error: 'You have created several workspaces today. Contact us if you need more.' };

  const data = parsed.data;
  const limits = limitsFor('trial');
  const db = await getDb();
  const workspaceId = newId('ws');
  const slug = await uniqueSlug(data.brandName);

  await db.insert(schema.workspaces).values({
    id: workspaceId, slug, name: data.brandName, brandName: data.brandName, brandAliases: data.aliases, domain: data.domain,
    description: data.description || `${data.brandName} offers ${data.category}${data.audience ? ` for ${data.audience}` : ''}.`,
    industry: data.industry, engines: data.engines, runFrequency: data.runFrequency, plan: 'trial',
    trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 86400_000), onboardedAt: new Date(),
  });
  await db.insert(schema.memberships).values({ workspaceId, userId: user.id, role: 'owner' });
  const competitors = data.competitors.slice(0, limits.competitors).filter((c) => c.domain !== data.domain);
  if (competitors.length) await db.insert(schema.competitors).values(competitors.map((c) => ({ id: newId('cmp'), workspaceId, name: c.name, domain: c.domain })));
  await db.insert(schema.prompts).values(data.prompts.slice(0, limits.prompts).map((p) => ({ id: newId('prm'), workspaceId, ...p })));
  await db.update(schema.users).set({ lastWorkspaceId: workspaceId }).where(eq(schema.users.id, user.id));
  await seedSampleHistory(workspaceId);
  await logActivity(workspaceId, user.id, 'workspace.created', `Created ${data.brandName}`);

  after(async () => {
    try {
      await saveAudit(workspaceId, await runReadinessAudit(`https://${data.domain}`));
    } catch (error) {
      console.warn('[onboarding] readiness audit skipped:', error instanceof Error ? error.message : error);
    }
  });

  redirect(`/app/${slug}/overview?welcome=1`);
}

const settingsSchema = z.object({
  workspaceId: z.string(),
  name: z.string().trim().min(2).max(80),
  brandName: z.string().trim().min(2).max(80),
  domain: domainField,
  description: z.string().trim().max(400),
  aliases: z.string().max(400).transform((s) => s.split(',').map((a) => a.trim()).filter((a) => a.length >= 2).slice(0, 5)),
  runFrequency: z.enum(['daily', 'weekly', 'manual']),
  engines: z.array(z.enum(engineIds)).min(1, 'Choose at least one engine.'),
});

export async function updateWorkspace(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = settingsSchema.safeParse({ ...Object.fromEntries(formData), engines: formData.getAll('engines') });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, error: 'Check the highlighted fields.' };
  const auth = await authorize(parsed.data.workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  const limits = limitsFor(auth.workspace.plan);
  if (parsed.data.runFrequency === 'daily' && limits.cadence !== 'daily') return { error: `Daily runs are available on Growth and Agency plans.` };
  const { workspaceId, aliases, ...rest } = parsed.data;
  await auth.db.update(schema.workspaces).set({ ...rest, brandAliases: aliases }).where(eq(schema.workspaces.id, workspaceId));
  await logActivity(workspaceId, auth.user.id, 'workspace.updated', 'Updated workspace settings');
  revalidatePath(`/app/${auth.workspace.slug}`, 'layout');
  return { ok: true, message: 'Settings saved.' };
}

export async function setDataMode(workspaceId: string, mode: 'sample' | 'live'): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  if (mode === 'live') {
    const { liveEngines } = await import('@/lib/providers/live');
    if (!liveEngines().some((e) => auth.workspace.engines.includes(e))) {
      return { error: 'Live collection is not enabled for the engines this workspace tracks yet. Contact support to enable it.' };
    }
  }
  await auth.db.update(schema.workspaces).set({ dataMode: mode }).where(eq(schema.workspaces.id, workspaceId));
  await logActivity(workspaceId, auth.user.id, 'workspace.data_mode', `Switched data source to ${mode}`);
  revalidatePath(`/app/${auth.workspace.slug}`, 'layout');
  return { ok: true, message: mode === 'live' ? 'Live collection enabled. Start a run to collect observations.' : 'Showing sample data.' };
}

export async function clearSampleData(workspaceId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  await auth.db.delete(schema.runs).where(and(eq(schema.runs.workspaceId, workspaceId), eq(schema.runs.source, 'sample')));
  await auth.db.delete(schema.trafficEvents).where(and(eq(schema.trafficEvents.workspaceId, workspaceId), eq(schema.trafficEvents.dataSource, 'sample')));
  // Remove only tasks generated from sample observations; audit tasks and manual tasks stay.
  await auth.db.delete(schema.tasks).where(and(eq(schema.tasks.workspaceId, workspaceId), inArray(schema.tasks.status, ['todo', 'in_progress']), or(like(schema.tasks.dedupeKey, 'gap:%'), like(schema.tasks.dedupeKey, 'source:%'), like(schema.tasks.dedupeKey, 'claim:%'))));
  await logActivity(workspaceId, auth.user.id, 'workspace.sample_cleared', 'Cleared sample observations');
  revalidatePath(`/app/${auth.workspace.slug}`, 'layout');
  return { ok: true, message: 'Sample data cleared.' };
}

export async function deleteWorkspace(_: ActionState, formData: FormData): Promise<ActionState> {
  const workspaceId = String(formData.get('workspaceId'));
  const auth = await authorize(workspaceId, 'owner');
  if (!auth.ok) return { error: auth.error };
  if (String(formData.get('confirm') ?? '').trim() !== auth.workspace.slug) return { fieldErrors: { confirm: [`Type ${auth.workspace.slug} to confirm.`] } };
  await auth.db.delete(schema.workspaces).where(eq(schema.workspaces.id, workspaceId));
  await auth.db.update(schema.users).set({ lastWorkspaceId: null }).where(eq(schema.users.lastWorkspaceId, workspaceId));
  redirect('/app?deleted=1');
}
