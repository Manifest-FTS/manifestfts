import Link from 'next/link';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { MailOpen } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { sha256 } from '@/lib/auth/tokens';
import { getCurrentUser } from '@/lib/auth/session';
import { buttonClass } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AcceptInviteButton } from './accept';

export const metadata = { title: 'Join a workspace', robots: { index: false, follow: false } };

export default async function InvitePage({ params }: PageProps<'/invite/[token]'>) {
  const { token } = await params;
  const db = await getDb();
  const [row] = await db.select({ email: schema.invitations.email, role: schema.invitations.role, workspace: schema.workspaces.name, inviter: schema.users.name })
    .from(schema.invitations)
    .innerJoin(schema.workspaces, eq(schema.workspaces.id, schema.invitations.workspaceId))
    .leftJoin(schema.users, eq(schema.users.id, schema.invitations.invitedById))
    .where(and(eq(schema.invitations.tokenHash, sha256(token)), isNull(schema.invitations.acceptedAt), gt(schema.invitations.expiresAt, new Date()))).limit(1);
  const user = await getCurrentUser();
  const next = `/invite/${token}`;

  if (!row) {
    return (
      <div className="text-center">
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-fg">This invitation has expired</h1>
        <p className="mt-2 text-[15px] text-fg-muted">Invitations last seven days and can be used once. Ask a workspace admin to send a new one.</p>
        <Link href="/app" className={buttonClass({ className: 'mt-8' })}>Go to Signal</Link>
      </div>
    );
  }
  return (
    <div>
      <MailOpen className="size-10 text-accent" aria-hidden />
      <h1 className="mt-5 text-[26px] font-semibold tracking-[-0.03em] text-fg">Join {row.workspace}</h1>
      <p className="mt-2 text-[15px] text-fg-muted">{row.inviter ?? 'A teammate'} invited <strong className="font-medium text-fg">{row.email}</strong> to join as {row.role === 'admin' ? 'an admin' : `an ${row.role}`}.</p>
      <div className="mt-8">
        {user ? (
          user.email === row.email ? <AcceptInviteButton token={token} /> : (
            <Alert tone="warning" title={`You’re signed in as ${user.email}`}>Sign out and sign in as {row.email} to accept this invitation.</Alert>
          )
        ) : (
          <div className="grid gap-3">
            <Link href={`/signup?next=${encodeURIComponent(next)}&email=${encodeURIComponent(row.email)}`} className={buttonClass({ size: 'lg' })}>Create an account</Link>
            <Link href={`/login?next=${encodeURIComponent(next)}`} className={buttonClass({ size: 'lg', variant: 'secondary' })}>I already have an account</Link>
          </div>
        )}
      </div>
    </div>
  );
}
