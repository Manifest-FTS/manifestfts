import Link from 'next/link';
import { AuthHeading } from '../auth-heading';
import { ForgotForm } from './forgot-form';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Reset your password', description: 'Request a password reset link for Manifest Signal.', path: '/forgot-password', noindex: true });

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading title="Reset your password" subtitle="Enter the email you use for Signal and we’ll send a reset link." />
      <ForgotForm />
      <p className="mt-8 text-center text-[14px] text-fg-muted"><Link href="/login" className="font-semibold text-accent hover:underline">Back to sign in</Link></p>
    </>
  );
}
