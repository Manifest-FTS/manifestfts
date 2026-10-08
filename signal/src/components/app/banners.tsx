'use client';
import * as React from 'react';
import Link from 'next/link';
import { FlaskConical, MailWarning, Sparkles, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { resendVerification } from '@/app/(auth)/actions';

function Bar({ tone, icon, children }: { tone: 'warning' | 'accent' | 'danger'; icon: React.ReactNode; children: React.ReactNode }) {
  const cls = tone === 'warning' ? 'border-warning/20 bg-warning-subtle text-warning-on-subtle' : tone === 'danger' ? 'border-danger/20 bg-danger-subtle text-danger-on-subtle' : 'border-accent/15 bg-accent-subtle text-accent-on-subtle';
  return (
    <div className={`border-b ${cls}`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-[13px] sm:px-6 lg:px-8 [&_svg]:size-4 [&_svg]:shrink-0">
        {icon}
        {children}
      </div>
    </div>
  );
}

export function SampleBanner({ slug, canManage }: { slug: string; canManage: boolean }) {
  return (
    <Bar tone="warning" icon={<FlaskConical aria-hidden />}>
      <span><strong className="font-semibold">Sample data.</strong> Answers in this workspace are generated for exploration and are not observations of real engines.</span>
      <span className="ml-auto flex gap-3">
        <Link href="/docs/answer-engines" target="_blank" className="font-semibold underline-offset-2 hover:underline">How it works</Link>
        {canManage && <Link href={`/app/${slug}/settings#data-source`} className="font-semibold underline-offset-2 hover:underline">Data source settings</Link>}
      </span>
    </Bar>
  );
}

export function TrialBanner({ slug, days }: { slug: string; days: number }) {
  return (
    <Bar tone="accent" icon={<Sparkles aria-hidden />}>
      <span>{days === 0 ? 'Your trial ends today.' : `${days} day${days === 1 ? '' : 's'} left in your Growth trial.`}</span>
      <Link href={`/app/${slug}/settings/billing`} className="ml-auto font-semibold underline-offset-2 hover:underline">Choose a plan</Link>
    </Bar>
  );
}

export function ReadOnlyBanner({ slug }: { slug: string }) {
  return (
    <Bar tone="danger" icon={<Lock aria-hidden />}>
      <span><strong className="font-semibold">This workspace is read-only.</strong> Your trial or subscription has ended. Data is safe; runs and audits are paused.</span>
      <Link href={`/app/${slug}/settings/billing`} className="ml-auto font-semibold underline-offset-2 hover:underline">Reactivate</Link>
    </Bar>
  );
}

export function VerifyBanner({ email }: { email: string }) {
  const [pending, startTransition] = React.useTransition();
  return (
    <Bar tone="accent" icon={<MailWarning aria-hidden />}>
      <span>Confirm <strong className="font-semibold">{email}</strong> to receive run alerts and reports.</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => {
          const r = await resendVerification();
          if (r.error) toast.error(r.error);
          else toast.success(r.message ?? 'Sent.');
        })}
        className="ml-auto font-semibold underline-offset-2 hover:underline disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Resend link'}
      </button>
    </Bar>
  );
}
