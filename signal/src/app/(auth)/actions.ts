'use server';
import { redirect } from 'next/navigation';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { hashPassword, verifyPassword, dummyHash } from '@/lib/auth/password';
import { clientInfo, createSession, destroyOtherSessions, destroySession, requireUser } from '@/lib/auth/session';
import { randomToken, sha256 } from '@/lib/auth/tokens';
import { rateLimit } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';
import { newId } from '@/lib/utils';
import { absoluteUrl } from '@/lib/site';

export type AuthState = { error?: string; fieldErrors?: Record<string, string[] | undefined>; values?: Record<string, string>; ok?: boolean; message?: string };

const password = z.string().min(10, 'Use at least 10 characters.').max(200, 'Use at most 200 characters.')
  .refine((p) => !/^(.)\1+$/.test(p) && !['password123', '1234567890', 'qwertyuiop'].includes(p.toLowerCase()), 'Choose a less common password.');
const email = z.email('Enter a valid email address.').max(200).transform((e) => e.trim().toLowerCase());

/** Only allow same-site relative paths as post-auth destinations. */
function safeNext(next: unknown) {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : null;
}

async function issueToken(userId: string, kind: 'verify_email' | 'reset_password', ttlMinutes: number) {
  const db = await getDb();
  const token = randomToken();
  await db.insert(schema.tokens).values({ id: sha256(token), userId, kind, expiresAt: new Date(Date.now() + ttlMinutes * 60_000) });
  return token;
}

async function sendVerification(user: { id: string; email: string; name: string }) {
  const token = await issueToken(user.id, 'verify_email', 60 * 48);
  await sendEmail({
    to: user.email,
    subject: 'Confirm your email address',
    paragraphs: [`Hi ${user.name.split(' ')[0]},`, 'Confirm your email to secure your Manifest Signal account and receive run alerts and reports.'],
    action: { label: 'Confirm email', url: absoluteUrl(`/verify-email?token=${token}`) },
    footnote: 'This link expires in 48 hours. If you did not create an account, you can ignore this email.',
  });
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const values = { name: String(formData.get('name') ?? ''), email: String(formData.get('email') ?? ''), next: String(formData.get('next') ?? '') };
  const parsed = z.object({ name: z.string().trim().min(2, 'Enter your name.').max(120), email, password }).safeParse({ ...values, password: formData.get('password') });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };

  const { ip } = await clientInfo();
  if (!(await rateLimit(`signup:${ip}`, 8, 3600)).ok) return { error: 'Too many sign-up attempts from this network. Try again in an hour.', values };

  const db = await getDb();
  const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, parsed.data.email)).limit(1);
  if (existing) return { fieldErrors: { email: ['An account with this email already exists. Sign in instead.'] }, values };

  const user = { id: newId('usr'), name: parsed.data.name, email: parsed.data.email };
  await db.insert(schema.users).values({ ...user, passwordHash: await hashPassword(parsed.data.password) });
  await createSession(user.id);
  await sendVerification(user);
  redirect(safeNext(values.next) ?? '/app/onboarding?welcome=1');
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const values = { email: String(formData.get('email') ?? ''), next: String(formData.get('next') ?? '') };
  const parsed = z.object({ email, password: z.string().min(1, 'Enter your password.').max(200) }).safeParse({ email: values.email, password: formData.get('password') });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };

  const { ip } = await clientInfo();
  const [byIp, byAccount] = await Promise.all([rateLimit(`signin:ip:${ip}`, 30, 900), rateLimit(`signin:acct:${parsed.data.email}`, 8, 900)]);
  if (!byIp.ok || !byAccount.ok) return { error: 'Too many sign-in attempts. Wait 15 minutes or reset your password.', values };

  const db = await getDb();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, parsed.data.email)).limit(1);
  const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : (await verifyPassword(parsed.data.password, await dummyHash()), false);
  if (!user || !valid) return { error: 'That email and password combination is not correct.', values };

  await createSession(user.id);
  redirect(safeNext(values.next) ?? '/app');
}

export async function signOut() {
  await destroySession();
  redirect('/login?signed_out=1');
}

export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = z.object({ email }).safeParse({ email: formData.get('email') });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values: { email: String(formData.get('email') ?? '') } };
  const { ip } = await clientInfo();
  if (!(await rateLimit(`reset:${ip}`, 6, 3600)).ok) return { error: 'Too many requests. Try again later.' };

  const db = await getDb();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, parsed.data.email)).limit(1);
  if (user) {
    const token = await issueToken(user.id, 'reset_password', 60);
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      paragraphs: [`Hi ${user.name.split(' ')[0]},`, 'We received a request to reset the password for your Manifest Signal account.'],
      action: { label: 'Choose a new password', url: absoluteUrl(`/reset-password?token=${token}`) },
      footnote: 'This link expires in one hour and can be used once. If you did not request a reset, no action is needed; your password is unchanged.',
    });
  }
  // Same response either way so the form cannot be used to discover accounts.
  return { ok: true, message: `If an account exists for ${parsed.data.email}, a reset link is on its way. Check your inbox and spam folder.` };
}

export async function resetPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const token = String(formData.get('token') ?? '');
  const parsed = z.object({ password, confirm: z.string() }).refine((v) => v.password === v.confirm, { message: 'Passwords do not match.', path: ['confirm'] })
    .safeParse({ password: formData.get('password'), confirm: formData.get('confirm') });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const db = await getDb();
  const [row] = await db.select().from(schema.tokens)
    .where(and(eq(schema.tokens.id, sha256(token)), eq(schema.tokens.kind, 'reset_password'), isNull(schema.tokens.usedAt), gt(schema.tokens.expiresAt, new Date()))).limit(1);
  if (!row) return { error: 'This reset link is invalid or has expired. Request a new one.' };

  await db.update(schema.users).set({ passwordHash: await hashPassword(parsed.data.password) }).where(eq(schema.users.id, row.userId));
  await db.update(schema.tokens).set({ usedAt: new Date() }).where(eq(schema.tokens.id, row.id));
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, row.userId));
  await createSession(row.userId);
  redirect('/app?password_reset=1');
}

export async function resendVerification(): Promise<AuthState> {
  const user = await requireUser();
  if (user.emailVerifiedAt) return { ok: true, message: 'Your email is already confirmed.' };
  if (!(await rateLimit(`verify:${user.id}`, 3, 3600)).ok) return { error: 'We already sent a few links. Check your inbox or try again later.' };
  await sendVerification(user);
  return { ok: true, message: `We sent a new confirmation link to ${user.email}.` };
}

export async function changePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const user = await requireUser();
  const parsed = z.object({ current: z.string().min(1, 'Enter your current password.'), password, confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: 'Passwords do not match.', path: ['confirm'] })
    .safeParse({ current: formData.get('current'), password: formData.get('password'), confirm: formData.get('confirm') });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  if (!(await rateLimit(`pwchange:${user.id}`, 5, 900)).ok) return { error: 'Too many attempts. Try again in 15 minutes.' };
  if (!(await verifyPassword(parsed.data.current, user.passwordHash))) return { fieldErrors: { current: ['Your current password is not correct.'] } };
  const db = await getDb();
  await db.update(schema.users).set({ passwordHash: await hashPassword(parsed.data.password) }).where(eq(schema.users.id, user.id));
  await destroyOtherSessions(user.id);
  return { ok: true, message: 'Password updated. Other sessions were signed out.' };
}
