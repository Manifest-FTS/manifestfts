'use server';
import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';
import { schema } from '@/lib/db';
import { authorize, isReadOnly, logActivity } from '@/lib/workspace';
import { activeRun, createRun, executeRun, runnableEngines } from '@/lib/pipeline';
import { rateLimit } from '@/lib/rate-limit';

export async function startRun(workspaceId: string): Promise<{ runId?: string; error?: string }> {
  const auth = await authorize(workspaceId, 'editor');
  if (!auth.ok) return { error: auth.error };
  if (isReadOnly(auth.workspace)) return { error: 'This workspace is read-only. Choose a plan to resume runs.' };
  const existing = await activeRun(workspaceId);
  if (existing) return { runId: existing.id };
  if (!runnableEngines(auth.workspace).length) return { error: 'No engines are available for this workspace’s data source. Check Settings → General.' };
  if (!(await rateLimit(`run:${workspaceId}`, auth.workspace.dataMode === 'live' ? 6 : 30, 86400)).ok) return { error: 'Daily run limit reached for this workspace. Scheduled runs will continue.' };
  const runId = await createRun(auth.workspace, 'manual');
  after(() => executeRun(runId));
  await logActivity(workspaceId, auth.user.id, 'run.started', `Started a ${auth.workspace.dataMode} run`);
  return { runId };
}

export async function markNotificationsRead(workspaceSlug: string) {
  const { requireUser } = await import('@/lib/auth/session');
  const { getDb } = await import('@/lib/db');
  const user = await requireUser();
  const db = await getDb();
  await db.update(schema.notifications).set({ readAt: new Date() }).where(and(eq(schema.notifications.userId, user.id), isNull(schema.notifications.readAt)));
  revalidatePath(`/app/${workspaceSlug}`, 'layout');
}
