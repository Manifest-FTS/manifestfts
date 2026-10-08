'use client';
import * as React from 'react';
import { DropdownMenu as M } from 'radix-ui';
import { cn } from '@/lib/cn';

export const Dropdown = M.Root;
export const DropdownTrigger = M.Trigger;
export const DropdownGroup = M.Group;

export function DropdownContent({ className, align = 'end', sideOffset = 6, ...props }: React.ComponentProps<typeof M.Content>) {
  return (
    <M.Portal>
      <M.Content
        align={align}
        sideOffset={sideOffset}
        className={cn('z-50 min-w-52 overflow-hidden rounded-xl border border-border bg-panel-raised p-1 shadow-raised data-[state=open]:animate-fade-in', className)}
        {...props}
      />
    </M.Portal>
  );
}

export function DropdownItem({ className, destructive, ...props }: React.ComponentProps<typeof M.Item> & { destructive?: boolean }) {
  return (
    <M.Item
      className={cn(
        'flex h-9 cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] text-fg-soft outline-none transition-colors data-[highlighted]:bg-bg-muted data-[highlighted]:text-fg data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:text-fg-faint',
        destructive && 'text-danger data-[highlighted]:bg-danger-subtle data-[highlighted]:text-danger [&_svg]:text-danger',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownLabel({ className, ...props }: React.ComponentProps<typeof M.Label>) {
  return <M.Label className={cn('px-2.5 pb-1 pt-2 text-[11.5px] font-medium uppercase tracking-wider text-fg-faint', className)} {...props} />;
}

export function DropdownSeparator() {
  return <M.Separator className="-mx-1 my-1 h-px bg-border" />;
}
