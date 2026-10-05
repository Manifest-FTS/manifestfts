'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { and, count, eq, ne } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { destroyOtherSessions, getSession, requireUser, destroySession } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';
import type { EmailPrefs } from '@/lib/db/schema';
import type { ActionState } from './workspace';

export async function updateProfile(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = z.object({ name: z.string().trim().min(2, 'Enter your name.').max(120) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  const db = await getDb();
  await db.update(schema.users).set({ name: parsed.data.name }).where(eq(schema.users.id, user.id));
  revalidatePath('/app', 'layout');
  return { ok: true, message: 'Profile updated.' };
}

export async function updateEmailPrefs(prefs: EmailPrefs): Promise<ActionState> {
  const user = await requireUser();
  const parsed = z.object({ weeklyDigest: z.boolean(), runAlerts: z.boolean(), accuracyAlerts: z.boolean(), productUpdates: z.boolean() }).safeParse(prefs);
  if (!parsed.success) return { error: 'Invalid preferences.' };
  const db = await getDb();
  await db.update(schema.users).set({ emailPrefs: parsed.data }).where(eq(schema.users.id, user.id));
  return { ok: true, message: 'Email preferences saved.' };
}

export async function revokeSession(sessionId: string): Promise<ActionState> {
  const user = await requireUser();
  const current = await getSession();
  if (current?.session.id === sessionId) return { error: 'Use Sign out to end your current session.' };
  const db = await getDb();
  await db.delete(schema.sessions).where(and(eq(schema.sessions.id, sessionId), eq(schema.sessions.userId, user.id)));
  revalidatePath('/app/account');
  return { ok: true, message: 'Session signed out.' };
}

export async function signOutOtherSessions(): Promise<ActionState> {
  const user = await requireUser();
  await destroyOtherSessions(user.id);
  revalidatePath('/app/account');
  return { ok: true, message: 'All other sessions were signed out.' };
}

export async function deleteAccount(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!(await verifyPassword(String(formData.get('password') ?? ''), user.passwordHash))) return { fieldErrors: { password: ['Password is not correct.'] } };
  const db = await getDb();
  // Block deletion while the user is the sole owner of any workspace, so no workspace is orphaned.
  const owned = await db.select({ workspaceId: schema.memberships.workspaceId, name: schema.workspaces.name }).from(schema.memberships)
    .innerJoin(schema.workspaces, eq(schema.workspaces.id, schema.memberships.workspaceId))
    .where(and(eq(schema.memberships.userId, user.id), eq(schema.memberships.role, 'owner')));
  for (const w of owned) {
    const [{ value }] = await db.select({ value: count() }).from(schema.memberships).where(and(eq(schema.memberships.workspaceId, w.workspaceId), eq(schema.memberships.role, 'owner'), ne(schema.memberships.userId, user.id)));
    if (value === 0) return { error: `You are the only owner of “${w.name}”. Transfer ownership or delete that workspace first.` };
  }
  await destroySession();
  await db.delete(schema.users).where(eq(schema.users.id, user.id));
  redirect('/?account_deleted=1');
}
