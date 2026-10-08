import Link from 'next/link';
import { Wordmark } from '@/components/brand/logo';
import { buttonClass } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,#000,transparent)]" />
      <div className="relative max-w-md text-center">
        <Link href="/" className="inline-block"><Wordmark /></Link>
        <p className="mt-10 font-mono text-[13px] font-semibold text-accent">404</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-fg">We couldn’t find that page</h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-fg-muted">The link may be outdated, or you may not have access to this workspace.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonClass()}>Go to homepage</Link>
          <Link href="/docs" className={buttonClass({ variant: 'secondary' })}>Browse docs</Link>
        </div>
      </div>
    </main>
  );
}
