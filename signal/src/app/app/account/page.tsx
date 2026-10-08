import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { getSession, requireUser } from '@/lib/auth/session';
import { Wordmark } from '@/components/brand/logo';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DeleteAccountForm, EmailPrefsForm, PasswordForm, ProfileForm, SessionList } from './account-ui';

export const metadata = { title: 'Account' };

function describeAgent(ua: string | null) {
  if (!ua) return { device: 'Unknown device', mobile: false };
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Unknown OS';
  return { device: `${browser} on ${os}`, mobile: /Mobile|iPhone|Android/.test(ua) };
}

export default async function AccountPage() {
  const user = await requireUser();
  const current = await getSession();
  const db = await getDb();
  const sessions = await db.select().from(schema.sessions).where(eq(schema.sessions.userId, user.id)).orderBy(desc(schema.sessions.lastSeenAt));
  return (
    <div className="min-h-dvh bg-bg-subtle">
      <header className="sticky top-0 z-20 border-b border-border bg-bg-subtle/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/app" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-fg-muted hover:text-fg"><ArrowLeft className="size-4" aria-hidden />Back to dashboard</Link>
          <Wordmark compact />
        </div>
      </header>
      <main id="main" className="mx-auto grid max-w-3xl gap-5 px-4 py-8">
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-fg">Account</h1>
        <Card><CardHeader title="Profile" /><CardBody><ProfileForm name={user.name} email={user.email} verified={!!user.emailVerifiedAt} /></CardBody></Card>
        <Card><CardHeader title="Appearance" description="Applies on this device." action={<ThemeToggle />} /><div className="pb-5" /></Card>
        <Card><CardHeader title="Email notifications" /><CardBody><EmailPrefsForm initial={user.emailPrefs} /></CardBody></Card>
        <Card><CardHeader title="Password" /><CardBody><PasswordForm /></CardBody></Card>
        <Card>
          <CardHeader title="Sessions" description="Devices currently signed in to your account." />
          <CardBody>
            <SessionList sessions={sessions.map((s) => ({ id: s.id, ...describeAgent(s.userAgent), ip: s.ipAddress, lastSeen: s.lastSeenAt.toISOString(), current: s.id === current?.session.id }))} />
          </CardBody>
        </Card>
        <Card><CardHeader title="Delete account" /><CardBody><DeleteAccountForm /></CardBody></Card>
      </main>
    </div>
  );
}
