import Link from 'next/link';
import { AuthHeading } from '../auth-heading';
import { ResetForm } from './reset-form';
import { Alert } from '@/components/ui/alert';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Choose a new password', description: 'Set a new password for Manifest Signal.', path: '/reset-password', noindex: true });

export default async function ResetPasswordPage({ searchParams }: PageProps<'/reset-password'>) {
  const { token } = await searchParams;
  return (
    <>
      <AuthHeading title="Choose a new password" />
      {typeof token === 'string' && token ? <ResetForm token={token} /> : (
        <Alert tone="warning" title="This link is incomplete">Open the link from your email again, or <Link href="/forgot-password" className="font-semibold underline">request a new one</Link>.</Alert>
      )}
    </>
  );
}
