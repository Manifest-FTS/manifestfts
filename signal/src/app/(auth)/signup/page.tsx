import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthHeading } from '../auth-heading';
import { SignupForm } from './signup-form';
import { getCurrentUser } from '@/lib/auth/session';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Start your free trial', description: 'Create a Manifest Signal account and start a 14-day trial. No card required.', path: '/signup', noindex: true });

export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const params = await searchParams;
  const next = typeof params.next === 'string' ? params.next : undefined;
  if (await getCurrentUser()) redirect(next ?? '/app');
  return (
    <>
      <AuthHeading title="Start your free trial" subtitle="14 days with Growth limits. No card required." />
      <SignupForm next={next} email={typeof params.email === 'string' ? params.email : undefined} />
      <p className="mt-8 text-center text-[14px] text-fg-muted">
        Already have an account? <Link href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'} className="font-semibold text-accent hover:underline">Sign in</Link>
      </p>
    </>
  );
}
