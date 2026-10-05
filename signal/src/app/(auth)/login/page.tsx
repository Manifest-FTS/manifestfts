import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthHeading } from '../auth-heading';
import { LoginForm } from './login-form';
import { Alert } from '@/components/ui/alert';
import { getCurrentUser } from '@/lib/auth/session';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Sign in', description: 'Sign in to Manifest Signal.', path: '/login', noindex: true });

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const params = await searchParams;
  const next = typeof params.next === 'string' ? params.next : undefined;
  if (await getCurrentUser()) redirect(next?.startsWith('/') && !next.startsWith('//') ? next : '/app');
  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Sign in to your Manifest Signal workspace." />
      {params.signed_out && <Alert tone="success" className="mb-6">You have been signed out.</Alert>}
      <LoginForm next={next} />
      <p className="mt-8 text-center text-[14px] text-fg-muted">
        New to Signal? <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'} className="font-semibold text-accent hover:underline">Start a free trial</Link>
      </p>
    </>
  );
}
