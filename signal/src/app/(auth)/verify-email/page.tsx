import Link from 'next/link';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { CircleCheck, CircleX } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { sha256 } from '@/lib/auth/tokens';
import { buttonClass } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Confirm your email', description: 'Confirm your Manifest Signal email address.', path: '/verify-email', noindex: true });

export default async function VerifyEmailPage({ searchParams }: PageProps<'/verify-email'>) {
  const { token } = await searchParams;
  let ok = false;
  if (typeof token === 'string' && token) {
    const db = await getDb();
    const [row] = await db.select().from(schema.tokens)
      .where(and(eq(schema.tokens.id, sha256(token)), eq(schema.tokens.kind, 'verify_email'), isNull(schema.tokens.usedAt), gt(schema.tokens.expiresAt, new Date()))).limit(1);
    if (row) {
      await db.update(schema.users).set({ emailVerifiedAt: new Date() }).where(eq(schema.users.id, row.userId));
      await db.update(schema.tokens).set({ usedAt: new Date() }).where(eq(schema.tokens.id, row.id));
      ok = true;
    }
  }
  return (
    <div className="text-center">
      {ok ? <CircleCheck className="mx-auto size-12 text-success" aria-hidden /> : <CircleX className="mx-auto size-12 text-danger" aria-hidden />}
      <h1 className="mt-5 text-[26px] font-semibold tracking-[-0.03em] text-fg">{ok ? 'Email confirmed' : 'This link has expired'}</h1>
      <p className="mt-2 text-[15px] text-fg-muted">{ok ? 'Thanks. Your account is fully set up.' : 'Confirmation links work once and expire after 48 hours. Sign in to send a new one.'}</p>
      <Link href="/app" className={buttonClass({ size: 'lg', className: 'mt-8' })}>Continue to Signal</Link>
    </div>
  );
}
