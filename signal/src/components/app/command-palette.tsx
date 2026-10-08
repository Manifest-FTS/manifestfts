'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { ArrowRight, CornerDownLeft, Search } from 'lucide-react';
import { NAV_GROUPS } from './nav';
import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/cn';

interface Command { id: string; label: string; group: string; href: string; keywords?: string }

export function CommandPalette({ slug, workspaces }: { slug: string; workspaces: { slug: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [index, setIndex] = React.useState(0);
  const listRef = React.useRef<HTMLUListElement>(null);

  const commands: Command[] = React.useMemo(() => [
    ...NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ id: `nav-${i.href}`, label: i.label, group: 'Go to', href: `/app/${slug}/${i.href}` }))),
    { id: 'add-prompt', label: 'Add a prompt', group: 'Actions', href: `/app/${slug}/prompts?new=1`, keywords: 'question track' },
    { id: 'run-audit', label: 'Run a readiness audit', group: 'Actions', href: `/app/${slug}/readiness`, keywords: 'robots crawler check' },
    { id: 'new-task', label: 'Create a task', group: 'Actions', href: `/app/${slug}/tasks?new=1`, keywords: 'todo' },
    { id: 'new-report', label: 'Create a report', group: 'Actions', href: `/app/${slug}/reports?new=1`, keywords: 'share pdf' },
    { id: 'invite', label: 'Invite a teammate', group: 'Actions', href: `/app/${slug}/settings/members`, keywords: 'member team user' },
    { id: 'settings', label: 'Workspace settings', group: 'Settings', href: `/app/${slug}/settings` },
    { id: 'billing', label: 'Billing and plan', group: 'Settings', href: `/app/${slug}/settings/billing`, keywords: 'upgrade subscription invoice' },
    { id: 'account', label: 'Account and security', group: 'Settings', href: '/app/account', keywords: 'password profile sessions' },
    { id: 'docs', label: 'Documentation', group: 'Help', href: '/docs' },
    { id: 'metrics', label: 'Metric definitions', group: 'Help', href: '/docs/metrics', keywords: 'confidence interval methodology' },
    ...workspaces.filter((w) => w.slug !== slug).map((w) => ({ id: `ws-${w.slug}`, label: `Switch to ${w.name}`, group: 'Workspaces', href: `/app/${w.slug}/overview` })),
  ], [slug, workspaces]);

  const q = query.trim().toLowerCase();
  const results = q ? commands.filter((c) => `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q)) : commands;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const go = (c: Command | undefined) => {
    if (!c) return;
    setOpen(false);
    setQuery('');
    if (c.href.startsWith('/docs')) window.open(c.href, '_blank', 'noopener');
    else router.push(c.href);
  };

  let lastGroup = '';
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(''); }}>
      <Dialog.Trigger className="hidden h-8 w-56 items-center gap-2 rounded-lg border border-border bg-bg-subtle px-2.5 text-[13px] text-fg-faint transition hover:border-border-strong/60 hover:text-fg-muted md:flex">
        <Search className="size-3.5" aria-hidden />
        <span className="flex-1 text-left">Search or jump to…</span>
        <Kbd>⌘K</Kbd>
      </Dialog.Trigger>
      <Dialog.Trigger className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-bg-muted md:hidden" aria-label="Search">
        <Search className="size-4" aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0a0d14]/40 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-panel-raised shadow-overlay outline-none data-[state=open]:animate-rise" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 text-fg-faint" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(results.length - 1, i + 1)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
                if (e.key === 'Enter') { e.preventDefault(); go(results[index]); }
              }}
              placeholder="Type a command or page…"
              className="h-13 flex-1 bg-transparent text-[15px] text-fg placeholder:text-fg-faint focus:outline-none"
              role="combobox"
              aria-expanded
              aria-controls="command-list"
              aria-activedescendant={results[index] ? `cmd-${results[index]!.id}` : undefined}
            />
          </div>
          <ul id="command-list" ref={listRef} role="listbox" className="max-h-[360px] overflow-y-auto p-2">
            {results.length === 0 && <li className="px-3 py-8 text-center text-[13.5px] text-fg-muted">No results for “{query}”</li>}
            {results.map((c, i) => {
              const header = c.group !== lastGroup ? c.group : null;
              lastGroup = c.group;
              return (
                <React.Fragment key={c.id}>
                  {header && <li role="presentation" className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-fg-faint first:pt-1">{header}</li>}
                  <li
                    id={`cmd-${c.id}`}
                    role="option"
                    aria-selected={i === index}
                    data-index={i}
                    onMouseMove={() => setIndex(i)}
                    onClick={() => go(c)}
                    className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-fg-soft', i === index && 'bg-bg-muted text-fg')}
                  >
                    <ArrowRight className={cn('size-3.5 text-fg-faint', i === index && 'text-accent')} aria-hidden />
                    <span className="flex-1">{c.label}</span>
                    {i === index && <CornerDownLeft className="size-3.5 text-fg-faint" aria-hidden />}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
