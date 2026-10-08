import Link from 'next/link';
import { requireUser } from '@/lib/auth/session';
import { listWorkspaces } from '@/lib/workspace';
import { Wordmark } from '@/components/brand/logo';
import { OnboardingWizard } from './wizard';

export const metadata = { title: 'Set up your workspace' };

export default async function OnboardingPage() {
  const user = await requireUser();
  const workspaces = await listWorkspaces(user.id);
  return (
    <div className="min-h-dvh bg-bg-subtle">
      <header className="flex h-16 items-center justify-between border-b border-border bg-bg px-4 sm:px-8">
        <Link href="/app" aria-label="Manifest Signal"><Wordmark /></Link>
        {workspaces.length > 0 && <Link href="/app" className="text-[13.5px] font-medium text-fg-muted hover:text-fg">Cancel</Link>}
      </header>
      <main id="main" className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-border bg-panel p-6 shadow-card sm:p-10">
          <OnboardingWizard firstName={user.name.split(' ')[0] ?? user.name} />
        </div>
      </main>
    </div>
  );
}
