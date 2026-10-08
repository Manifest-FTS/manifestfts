import 'server-only';
import { cache } from 'react';
import { forbidden, notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { Role, Workspace } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/session';
import { newId } from '@/lib/utils';

const RANK: Record<Role, number> = { viewer: 0, editor: 1, admin: 2, owner: 3 };

export function hasRole(role: Role, min: Role) {
  return RANK[role] >= RANK[min];
}

export const listWorkspaces = cache(async (userId: string) => {
  const db = await getDb();
  return db
    .select({ workspace: schema.workspaces, role: schema.memberships.role })
    .from(schema.memberships)
    .innerJoin(schema.workspaces, eq(schema.workspaces.id, schema.memberships.workspaceId))
    .where(eq(schema.memberships.userId, userId))
    .orderBy(asc(schema.workspaces.name));
});

/**
 * Resolves a workspace by slug and confirms the signed-in user's membership. Every workspace
 * read and write goes through this check; non-members get a 404 so slugs are not enumerable.
 */
export const requireWorkspace = cache(async (slug: string, min: Role = 'viewer') => {
  const user = await requireUser();
  const db = await getDb();
  const [row] = await db
    .select({ workspace: schema.workspaces, role: schema.memberships.role })
    .from(schema.workspaces)
    .innerJoin(schema.memberships, and(eq(schema.memberships.workspaceId, schema.workspaces.id), eq(schema.memberships.userId, user.id)))
    .where(eq(schema.workspaces.slug, slug))
    .limit(1);
  if (!row) notFound();
  if (!hasRole(row.role, min)) forbidden();
  return { user, workspace: row.workspace, role: row.role };
});

/** For server actions: same check, but returns an error object instead of rendering a boundary. */
export async function authorize(workspaceId: string, min: Role = 'editor') {
  const user = await requireUser();
  const db = await getDb();
  const [row] = await db
    .select({ workspace: schema.workspaces, role: schema.memberships.role })
    .from(schema.workspaces)
    .innerJoin(schema.memberships, and(eq(schema.memberships.workspaceId, schema.workspaces.id), eq(schema.memberships.userId, user.id)))
    .where(eq(schema.workspaces.id, workspaceId))
    .limit(1);
  if (!row || !hasRole(row.role, min)) return { ok: false as const, error: 'You do not have permission to do that in this workspace.' };
  return { ok: true as const, user, workspace: row.workspace, role: row.role, db };
}

export function isReadOnly(workspace: Workspace) {
  if (workspace.plan !== 'trial') return !['active', 'trialing', 'past_due'].includes(workspace.subscriptionStatus ?? 'active');
  return !!workspace.trialEndsAt && workspace.trialEndsAt.getTime() < Date.now();
}

export function trialDaysLeft(workspace: Workspace) {
  if (workspace.plan !== 'trial' || !workspace.trialEndsAt) return null;
  return Math.max(0, Math.ceil((workspace.trialEndsAt.getTime() - Date.now()) / 86400_000));
}

export async function logActivity(workspaceId: string, actorId: string | null, action: string, detail = '') {
  const db = await getDb();
  await db.insert(schema.activity).values({ id: newId('act'), workspaceId, actorId, action, detail });
}

export async function notifyMembers(workspaceId: string, notification: Omit<typeof schema.notifications.$inferInsert, 'id' | 'userId' | 'workspaceId'>) {
  const db = await getDb();
  const members = await db.select({ userId: schema.memberships.userId }).from(schema.memberships).where(eq(schema.memberships.workspaceId, workspaceId));
  if (!members.length) return;
  await db.insert(schema.notifications).values(members.map((m) => ({ ...notification, id: newId('ntf'), userId: m.userId, workspaceId })));
}
