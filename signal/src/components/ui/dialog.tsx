'use client';
import * as React from 'react';
import { Dialog as D } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({ title, description, children, className, wide }: { title: string; description?: React.ReactNode; children: React.ReactNode; className?: string; wide?: boolean }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-[#0a0d14]/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
      <D.Content
        className={cn(
          'fixed left-1/2 top-[max(5vh,24px)] z-50 max-h-[90vh] w-[calc(100vw-32px)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-border bg-panel-raised shadow-overlay outline-none data-[state=open]:animate-rise',
          wide ? 'max-w-2xl' : 'max-w-lg',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <D.Title className="text-[17px] font-semibold tracking-[-0.015em] text-fg">{title}</D.Title>
            {description ? <D.Description className="mt-1 text-[13.5px] leading-relaxed text-fg-muted">{description}</D.Description> : <D.Description className="sr-only">{title}</D.Description>}
          </div>
          <D.Close className="-mr-2 -mt-1 grid size-8 place-items-center rounded-lg text-fg-muted transition hover:bg-bg-muted hover:text-fg" aria-label="Close">
            <X className="size-4" />
          </D.Close>
        </div>
        <div className="px-6 py-5">{children}</div>
      </D.Content>
    </D.Portal>
  );
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('-mx-6 -mb-5 mt-6 flex flex-col-reverse gap-2 border-t border-border bg-bg-subtle px-6 py-4 sm:flex-row sm:justify-end', className)}>{children}</div>;
}
