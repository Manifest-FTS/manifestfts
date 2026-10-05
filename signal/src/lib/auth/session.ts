import 'server-only';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq, gt, ne } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { randomToken, sha256 } from './tokens';

const SESSION_DAYS = 30;
const RENEW_AFTER_MS = 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-signal_session' : 'signal_session';

export async function clientInfo() {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  return { ip: forwarded || h.get('x-real-ip') || 'unknown', userAgent: h.get('user-agent')?.slice(0, 300) ?? null };
}

export async function createSession(userId: string) {
  const db = await getDb();
  const token = randomToken();
  const { ip, userAgent } = await clientInfo();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db.insert(schema.sessions).values({ id: sha256(token), userId, expiresAt, ipAddress: ip, userAgent });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/** Returns the signed-in user and session, or null. Memoized per request. */
export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const id = sha256(token);
  const [row] = await db
    .select({ session: schema.sessions, user: schema.users })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.id, id), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  if (!row) return null;
  if (Date.now() - row.session.lastSeenAt.getTime() > RENEW_AFTER_MS) {
    await db.update(schema.sessions)
      .set({ lastSeenAt: new Date(), expiresAt: new Date(Date.now() + SESSION_DAYS * 86400_000) })
      .where(eq(schema.sessions.id, id));
  }
  return row;
});

export async function getCurrentUser() {
  return (await getSession())?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(schema.sessions).where(eq(schema.sessions.id, sha256(token)));
  }
  jar.delete(SESSION_COOKIE);
}

export async function destroyOtherSessions(userId: string) {
  const current = await getSession();
  const db = await getDb();
  await db.delete(schema.sessions).where(current
    ? and(eq(schema.sessions.userId, userId), ne(schema.sessions.id, current.session.id))
    : eq(schema.sessions.userId, userId));
}
