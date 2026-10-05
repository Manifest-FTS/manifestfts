'use client';
import * as React from 'react';
import { Check } from 'lucide-react';
import { openBillingPortal, startCheckout } from '@/app/app/_actions/billing';
import { Button } from '@/components/ui/button';
import { toastResult } from '@/components/app/use-action-toast';
import { track } from '@/lib/analytics';
import type { PlanDef } from '@/lib/plans';
import { cn } from '@/lib/cn';

export function PlanPicker({ workspaceId, plans, current, canManage }: { workspaceId: string; plans: PlanDef[]; current: string; canManage: boolean }) {
  const [pending, setPending] = React.useState<string | null>(null);
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((p) => {
        const isCurrent = current === p.id;
        return (
          <div key={p.id} className={cn('flex flex-col rounded-xl border p-5', isCurrent ? 'border-accent ring-1 ring-accent' : 'border-border', p.highlight && !isCurrent && 'border-accent/40')}>
            <div className="flex items-center justify-between">
              <h3 className="text-[15.5px] font-semibold text-fg">{p.name}</h3>
              {isCurrent && <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-[11.5px] font-semibold text-accent-on-subtle">Current plan</span>}
            </div>
            <p className="mt-2"><span className="text-[28px] font-semibold tracking-[-0.04em] text-fg">${p.price}</span><span className="text-[13px] text-fg-muted"> /month</span></p>
            <ul className="mt-4 grid flex-1 gap-1.5">
              {p.features.slice(0, 5).map((f) => <li key={f} className="flex gap-2 text-[13px] text-fg-soft"><Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />{f}</li>)}
            </ul>
            <Button className="mt-5 w-full" variant={isCurrent ? 'secondary' : p.highlight ? 'primary' : 'secondary'} disabled={!canManage || isCurrent} loading={pending === p.id}
              onClick={async () => { setPending(p.id); track('checkout_started', { plan: p.id }); const r = await startCheckout(workspaceId, p.id); setPending(null); toastResult(r); }}>
              {isCurrent ? 'Current plan' : `Choose ${p.name}`}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function PortalButton({ workspaceId }: { workspaceId: string }) {
  const [pending, startTransition] = React.useTransition();
  return <Button variant="secondary" loading={pending} onClick={() => startTransition(async () => toastResult(await openBillingPortal(workspaceId)))}>Manage billing</Button>;
}
