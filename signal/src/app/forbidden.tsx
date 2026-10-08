import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { buttonClass } from '@/components/ui/button';

export default function Forbidden() {
  return (
    <main id="main" className="grid min-h-[70dvh] place-items-center px-4">
      <div className="max-w-md text-center">
        <ShieldAlert className="mx-auto size-10 text-warning" aria-hidden />
        <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] text-fg">You don’t have access to this</h1>
        <p className="mt-2 text-[15px] text-fg-muted">Your role in this workspace doesn’t include this page. Ask a workspace owner or admin to change your role.</p>
        <Link href="/app" className={buttonClass({ className: 'mt-6' })}>Back to dashboard</Link>
      </div>
    </main>
  );
}
