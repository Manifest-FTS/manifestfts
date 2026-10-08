'use client';
import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalSegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="grid min-h-[70dvh] place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-[13px] font-semibold text-danger">Error</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-fg">Something went wrong</h1>
        <p className="mt-2 text-[15px] text-fg-muted">The problem has been logged. Try again, and if it keeps happening contact signal@manifestfts.com{error.digest ? ` with reference ${error.digest}` : ''}.</p>
        <Button className="mt-6" onClick={reset}><RotateCcw aria-hidden />Try again</Button>
      </div>
    </main>
  );
}
