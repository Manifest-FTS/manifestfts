'use client';
import * as React from 'react';
import Link from 'next/link';
import { Popover } from 'radix-ui';
import { Bell, CheckCheck } from 'lucide-react';
import { markNotificationsRead } from '@/app/app/_actions/runs';
import { relativeTime } from '@/lib/format';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/cn';

export interface NotificationItem { id: string; title: string; body: string; href: string | null; read: boolean; createdAt: string }

export function Notifications({ items, slug }: { items: NotificationItem[]; slug: string }) {
  const unread = items.filter((i) => !i.read).length;
  const [pending, startTransition] = React.useTransition();
  return (
    <Popover.Root>
      <Popover.Trigger className="relative grid size-8 place-items-center rounded-lg text-fg-muted transition hover:bg-bg-muted hover:text-fg data-[state=open]:bg-bg-muted" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}>
        <Bell className="size-4" aria-hidden />
        {unread > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent ring-2 ring-bg" aria-hidden />}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={8} className="z-50 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-xl border border-border bg-panel-raised shadow-overlay data-[state=open]:animate-fade-in">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-[13.5px] font-semibold text-fg">Notifications</p>
            {unread > 0 && (
              <button type="button" disabled={pending} onClick={() => startTransition(() => markNotificationsRead(slug))} className="flex items-center gap-1 text-[12.5px] font-medium text-accent hover:underline disabled:opacity-50">
                <CheckCheck className="size-3.5" aria-hidden />Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <EmptyState icon={<Bell />} title="You’re all caught up" description="Run results, accuracy alerts, and team updates will appear here." className="py-10" />
          ) : (
            <ul className="max-h-[380px] divide-y divide-border overflow-y-auto">
              {items.map((n) => {
                const content = (
                  <div className="flex gap-3 px-4 py-3">
                    <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-accent')} aria-hidden />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium text-fg">{n.title}{!n.read && <span className="sr-only"> (unread)</span>}</p>
                      {n.body && <p className="mt-0.5 text-[12.5px] leading-relaxed text-fg-muted">{n.body}</p>}
                      <p className="mt-1 text-[11.5px] text-fg-faint">{relativeTime(n.createdAt)}</p>
                    </div>
                  </div>
                );
                return <li key={n.id}>{n.href ? <Popover.Close asChild><Link href={n.href} className="block transition hover:bg-bg-muted">{content}</Link></Popover.Close> : content}</li>;
              })}
            </ul>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
