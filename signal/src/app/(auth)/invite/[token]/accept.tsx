'use client';
import * as React from 'react';
import { acceptInvite } from '@/app/app/_actions/members';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

export function AcceptInviteButton({ token }: { token: string }) {
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  return (
    <div className="grid gap-3">
      {error && <Alert tone="danger">{error}</Alert>}
      <Button size="lg" loading={pending} onClick={() => startTransition(async () => { const r = await acceptInvite(token); if (r?.error) setError(r.error); })}>Accept invitation</Button>
    </div>
  );
}
