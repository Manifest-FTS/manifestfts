'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, ChevronsUpDown, LogOut, Plus, UserRound } from 'lucide-react';
import { SignalMark } from '@/components/brand/logo';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator, DropdownTrigger } from '@/components/ui/dropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NAV_GROUPS, SECONDARY_NAV } from './nav';
import { signOut } from '@/app/(auth)/actions';
import { cn } from '@/lib/cn';

export interface ShellProps {
  user: { name: string; email: string };
  workspace: { slug: string; name: string; domain: string; planLabel: string };
  workspaces: { slug: string; name: string }[];
  counts: { openTasks: number; needsReview: number };
}

export function Sidebar({ user, workspace, workspaces, counts, onNavigate }: ShellProps & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const base = `/app/${workspace.slug}`;
  const badge = (href: string) => (href === 'tasks' && counts.openTasks ? counts.openTasks : href === 'accuracy' && counts.needsReview ? counts.needsReview : null);

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Dropdown>
          <DropdownTrigger className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-bg-muted data-[state=open]:bg-bg-muted">
            <SignalMark className="size-8" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-fg">{workspace.name}</span>
              <span className="block truncate text-[11.5px] text-fg-muted">{workspace.planLabel}</span>
            </span>
            <ChevronsUpDown className="size-4 text-fg-faint" aria-hidden />
          </DropdownTrigger>
          <DropdownContent align="start" className="w-64">
            <DropdownLabel>Workspaces</DropdownLabel>
            {workspaces.map((w) => (
              <DropdownItem key={w.slug} asChild>
                <Link href={`/app/${w.slug}/overview`} onClick={onNavigate}>
                  <span className="grid size-5 place-items-center rounded bg-accent-subtle text-[10px] font-bold text-accent-on-subtle">{w.name[0]}</span>
                  <span className="flex-1 truncate">{w.name}</span>
                  {w.slug === workspace.slug && <Check className="text-accent!" aria-label="Current" />}
                </Link>
              </DropdownItem>
            ))}
            <DropdownSeparator />
            <DropdownItem asChild>
              <Link href="/app/onboarding" onClick={onNavigate}><Plus aria-hidden />New workspace</Link>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>

      <nav aria-label="Workspace" className="flex-1 overflow-y-auto px-3 pb-3">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && 'mt-5')}>
            {group.label && <p className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-fg-faint">{group.label}</p>}
            <ul className="grid gap-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const full = `${base}/${href}`;
                const active = pathname === full || pathname.startsWith(`${full}/`);
                const count = badge(href);
                return (
                  <li key={href}>
                    <Link href={full} onClick={onNavigate} aria-current={active ? 'page' : undefined}
                      className={cn('group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors', active ? 'bg-panel text-fg shadow-card ring-1 ring-border' : 'text-fg-muted hover:bg-bg-muted hover:text-fg')}>
                      <Icon className={cn('size-4', active ? 'text-accent' : 'text-fg-faint group-hover:text-fg-muted')} aria-hidden />
                      <span className="flex-1">{label}</span>
                      {count !== null && <Badge tone={href === 'accuracy' ? 'warning' : 'neutral'} className="h-5 px-1.5 text-[11px]" aria-label={`${count} open`}>{count}</Badge>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <ul className="grid gap-0.5">
          {SECONDARY_NAV.map(({ href, label, icon: Icon, ...rest }) => {
            const external = 'external' in rest;
            const full = external ? href : `${base}/${href}`;
            const active = !external && pathname.startsWith(full);
            return (
              <li key={href}>
                <Link href={full} onClick={onNavigate} target={external ? '_blank' : undefined} aria-current={active ? 'page' : undefined}
                  className={cn('flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors', active ? 'bg-panel text-fg shadow-card ring-1 ring-border' : 'text-fg-muted hover:bg-bg-muted hover:text-fg')}>
                  <Icon className={cn('size-4', active ? 'text-accent' : 'text-fg-faint')} aria-hidden />{label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Dropdown>
          <DropdownTrigger className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-bg-muted data-[state=open]:bg-bg-muted">
            <Avatar name={user.name} size={28} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-fg">{user.name}</span>
              <span className="block truncate text-[11.5px] text-fg-muted">{user.email}</span>
            </span>
          </DropdownTrigger>
          <DropdownContent align="start" side="top" className="w-60">
            <div className="flex items-center justify-between px-2.5 py-2">
              <span className="text-[12.5px] text-fg-muted">Theme</span>
              <ThemeToggle />
            </div>
            <DropdownSeparator />
            <DropdownItem asChild><Link href="/app/account" onClick={onNavigate}><UserRound aria-hidden />Account settings</Link></DropdownItem>
            <DropdownSeparator />
            <DropdownItem onSelect={() => React.startTransition(() => signOut())}><LogOut aria-hidden />Sign out</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
}
