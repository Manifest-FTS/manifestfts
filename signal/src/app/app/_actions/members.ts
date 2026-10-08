'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { and, count, eq, gt, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { randomToken, sha256 } from '@/lib/auth/tokens';
import { authorize, logActivity } from '@/lib/workspace';
import { limitsFor } from '@/lib/plans';
import { rateLimit } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';
import { newId } from '@/lib/utils';
import { absoluteUrl } from '@/lib/site';
import type { Role } from '@/lib/db/schema';
import type { ActionState } from './workspace';

const roles = ['viewer', 'editor', 'admin', 'owner'] as const;

export async function inviteMember(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object({ workspaceId: z.string(), email: z.email('Enter a valid email.').transform((e) => e.toLowerCase().trim()), role: z.enum(['viewer', 'editor', 'admin']) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  const auth = await authorize(parsed.data.workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  if (!auth.user.emailVerifiedAt) return { error: 'Confirm your own email address before inviting teammates.' };
  if (!(await rateLimit(`invite:${auth.workspace.id}`, 30, 86400)).ok) return { error: 'Invitation limit reached for today.' };

  const seats = limitsFor(auth.workspace.plan).seats;
  if (seats) {
    const [{ value: members }] = await auth.db.select({ value: count() }).from(schema.memberships).where(eq(schema.memberships.workspaceId, auth.workspace.id));
    const [{ value: pending }] = await auth.db.select({ value: count() }).from(schema.invitations).where(and(eq(schema.invitations.workspaceId, auth.workspace.id), isNull(schema.invitations.acceptedAt), gt(schema.invitations.expiresAt, new Date())));
    if (members + pending >= seats) return { error: `Your plan includes ${seats} seats. Upgrade or remove a member to invite more.` };
  }
  const [existing] = await auth.db.select({ id: schema.users.id }).from(schema.users)
    .innerJoin(schema.memberships, and(eq(schema.memberships.userId, schema.users.id), eq(schema.memberships.workspaceId, auth.workspace.id)))
    .where(eq(schema.users.email, parsed.data.email));
  if (existing) return { fieldErrors: { email: ['That person is already a member.'] } };

  const token = randomToken();
  await auth.db.delete(schema.invitations).where(and(eq(schema.invitations.workspaceId, auth.workspace.id), eq(schema.invitations.email, parsed.data.email), isNull(schema.invitations.acceptedAt)));
  await auth.db.insert(schema.invitations).values({ id: newId('inv'), workspaceId: auth.workspace.id, email: parsed.data.email, role: parsed.data.role, tokenHash: sha256(token), invitedById: auth.user.id, expiresAt: new Date(Date.now() + 7 * 86400_000) });
  await sendEmail({
    to: parsed.data.email,
    subject: `${auth.user.name} invited you to ${auth.workspace.name} on Manifest Signal`,
    paragraphs: [`${auth.user.name} invited you to join the ${auth.workspace.name} workspace as ${parsed.data.role === 'admin' ? 'an admin' : `an ${parsed.data.role}`}.`, 'Manifest Signal shows how AI answer engines describe and cite your organization.'],
    action: { label: 'Accept invitation', url: absoluteUrl(`/invite/${token}`) },
    footnote: 'This invitation expires in 7 days.',
  });
  await logActivity(auth.workspace.id, auth.user.id, 'member.invited', `${parsed.data.email} as ${parsed.data.role}`);
  revalidatePath(`/app/${auth.workspace.slug}/settings/members`);
  return { ok: true, message: `Invitation sent to ${parsed.data.email}.` };
}

export async function revokeInvite(workspaceId: string, inviteId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  await auth.db.delete(schema.invitations).where(and(eq(schema.invitations.id, inviteId), eq(schema.invitations.workspaceId, workspaceId)));
  revalidatePath(`/app/${auth.workspace.slug}/settings/members`);
  return { ok: true, message: 'Invitation revoked.' };
}

async function ownerCount(workspaceId: string) {
  const db = await getDb();
  const [{ value }] = await db.select({ value: count() }).from(schema.memberships).where(and(eq(schema.memberships.workspaceId, workspaceId), eq(schema.memberships.role, 'owner')));
  return value;
}

export async function changeRole(workspaceId: string, userId: string, role: Role): Promise<ActionState> {
  if (!roles.includes(role)) return { error: 'Invalid role.' };
  const auth = await authorize(workspaceId, 'admin');
  if (!auth.ok) return { error: auth.error };
  const [target] = await auth.db.select().from(schema.memberships).where(and(eq(schema.memberships.workspaceId, workspaceId), eq(schema.memberships.userId, userId)));
  if (!target) return { error: 'Member not found.' };
  // Only owners can grant or remove ownership.
  if ((role === 'owner' || target.role === 'owner') && auth.role !== 'owner') return { error: 'Only owners can change ownership.' };
  if (target.role === 'owner' && role !== 'owner' && (await ownerCount(workspaceId)) <= 1) return { error: 'A workspace needs at least one owner. Promote someone else first.' };
  await auth.db.update(schema.memberships).set({ role }).where(and(eq(schema.memberships.workspaceId, workspaceId), eq(schema.memberships.userId, userId)));
  await logActivity(workspaceId, auth.user.id, 'member.role_changed', `${userId} → ${role}`);
  revalidatePath(`/app/${auth.workspace.slug}`, 'layout');
  return { ok: true, message: 'Role updated.' };
}

export async function removeMember(workspaceId: string, userId: string): Promise<ActionState> {
  const user = await requireUser();
  const self = user.id === userId;
  const auth = await authorize(workspaceId, self ? 'viewer' : 'admin');
  if (!auth.ok) return { error: auth.error };
  const [target] = await auth.db.select().from(schema.memberships).where(and(eq(schema.memberships.workspaceId, workspaceId), eq(schema.memberships.userId, userId)));
  if (!target) return { error: 'Member not found.' };
  if (target.role === 'owner' && auth.role !== 'owner') return { error: 'Only owners can remove an owner.' };
  if (target.role === 'owner' && (await ownerCount(workspaceId)) <= 1) return { error: 'Transfer ownership before leaving, or delete the workspace.' };
  await auth.db.delete(schema.memberships).where(and(eq(schema.memberships.workspaceId, workspaceId), eq(schema.memberships.userId, userId)));
  await logActivity(workspaceId, auth.user.id, self ? 'member.left' : 'member.removed', userId);
  if (self) redirect('/app');
  revalidatePath(`/app/${auth.workspace.slug}/settings/members`);
  return { ok: true, message: 'Member removed.' };
}

export async function acceptInvite(token: string): Promise<ActionState> {
  const user = await requireUser();
  const db = await getDb();
  const [invite] = await db.select({ invite: schema.invitations, slug: schema.workspaces.slug }).from(schema.invitations)
    .innerJoin(schema.workspaces, eq(schema.workspaces.id, schema.invitations.workspaceId))
    .where(and(eq(schema.invitations.tokenHash, sha256(token)), isNull(schema.invitations.acceptedAt), gt(schema.invitations.expiresAt, new Date()))).limit(1);
  if (!invite) return { error: 'This invitation is invalid or has expired. Ask for a new one.' };
  if (invite.invite.email !== user.email) return { error: `This invitation was sent to ${invite.invite.email}. Sign in with that email to accept it.` };
  await db.insert(schema.memberships).values({ workspaceId: invite.invite.workspaceId, userId: user.id, role: invite.invite.role }).onConflictDoNothing();
  await db.update(schema.invitations).set({ acceptedAt: new Date() }).where(eq(schema.invitations.id, invite.invite.id));
  // Accepting an emailed invitation proves control of the address.
  if (!user.emailVerifiedAt) await db.update(schema.users).set({ emailVerifiedAt: new Date() }).where(eq(schema.users.id, user.id));
  await logActivity(invite.invite.workspaceId, user.id, 'member.joined', user.email);
  redirect(`/app/${invite.slug}/overview`);
}
