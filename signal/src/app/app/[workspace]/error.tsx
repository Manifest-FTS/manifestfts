'use client';
import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function WorkspaceError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <Card className="mx-auto mt-10 max-w-lg p-8 text-center">
      <h1 className="text-[20px] font-semibold text-fg">This view couldn’t load</h1>
      <p className="mt-2 text-[14px] text-fg-muted">Your data is safe. Try again, and contact signal@manifestfts.com if it keeps happening{error.digest ? ` (reference ${error.digest})` : ''}.</p>
      <Button className="mt-6" onClick={reset}><RotateCcw aria-hidden />Try again</Button>
    </Card>
  );
}
