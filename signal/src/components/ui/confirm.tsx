'use client';
import * as React from 'react';
import { AlertDialog } from 'radix-ui';
import { Button } from './button';

/** Accessible confirmation for destructive actions. */
export function Confirm({ trigger, title, description, confirmLabel = 'Delete', onConfirm, destructive = true, open: controlled, onOpenChange }: { trigger?: React.ReactNode; title: string; description: React.ReactNode; confirmLabel?: string; onConfirm: () => Promise<unknown> | void; destructive?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const open = controlled ?? uncontrolled;
  const setOpen = (o: boolean) => (onOpenChange ? onOpenChange(o) : setUncontrolled(o));
  const [pending, startTransition] = React.useTransition();
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>}
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[#0a0d14]/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <AlertDialog.Content className="fixed left-1/2 top-[20vh] z-50 w-[calc(100vw-32px)] max-w-md -translate-x-1/2 rounded-2xl border border-border bg-panel-raised p-6 shadow-overlay data-[state=open]:animate-rise">
          <AlertDialog.Title className="text-[17px] font-semibold text-fg">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-[14px] leading-relaxed text-fg-muted">{description}</AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild><Button variant="secondary">Cancel</Button></AlertDialog.Cancel>
            <Button variant={destructive ? 'danger' : 'primary'} loading={pending} onClick={() => startTransition(async () => { await onConfirm(); setOpen(false); })}>{confirmLabel}</Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
