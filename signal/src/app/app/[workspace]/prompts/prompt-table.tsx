'use client';
import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowDownUp, MessageSquareQuote, MoreHorizontal, Pause, Pencil, Play, Plus, Search, Trash2 } from 'lucide-react';
import { PromptDialog, type PromptValues } from './prompt-dialog';
import { deletePrompt, setPromptActive } from '@/app/app/_actions/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Confirm } from '@/components/ui/confirm';
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { IntervalBar } from '@/components/charts/bars';
import { Tooltip } from '@/components/ui/tooltip';
import { toastResult } from '@/components/app/use-action-toast';
import { ENGINE_BY_ID } from '@/lib/engines';
import { pct } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { EngineId } from '@/lib/db/schema';

export interface PromptRow {
  id: string; text: string; topic: string; intent: string; active: boolean;
  mention: { value: number | null; low: number | null; high: number | null; n: number };
  citation: number | null; avgPosition: number | null;
  engines: { engine: EngineId; mentioned: number; total: number }[];
}

type SortKey = 'mention' | 'citation' | 'text';

export function PromptTable({ rows, slug, workspaceId, topics, canEdit }: { rows: PromptRow[]; slug: string; workspaceId: string; topics: string[]; canEdit: boolean }) {
  const params = useSearchParams();
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'mention', dir: 1 });
  const [dialog, setDialog] = React.useState<{ open: boolean; initial?: PromptValues }>({ open: params.get('new') === '1' && canEdit });
  const [, startTransition] = React.useTransition();
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = rows
    .filter((r) => !q || r.text.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q))
    .sort((a, b) => {
      if (sort.key === 'text') return a.text.localeCompare(b.text) * sort.dir;
      const av = sort.key === 'mention' ? a.mention.value : a.citation;
      const bv = sort.key === 'mention' ? b.mention.value : b.citation;
      return ((av ?? -1) - (bv ?? -1)) * sort.dir;
    });

  const sortButton = (key: SortKey, label: string) => (
    <button type="button" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))} className="inline-flex items-center gap-1 hover:text-fg" aria-label={`Sort by ${label}`}>
      {label}<ArrowDownUp className={cn('size-3', sort.key === key ? 'text-accent' : 'text-fg-faint')} aria-hidden />
    </button>
  );
  const ariaSort = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined);

  return (
    <div className="rounded-panel border border-border bg-panel shadow-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden />
          <label htmlFor="prompt-search" className="sr-only">Search prompts</label>
          <input id="prompt-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prompts or topics" className="h-9 w-full rounded-lg border border-border bg-bg-subtle pl-9 pr-3 text-[13.5px] text-fg placeholder:text-fg-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-[var(--ring)]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] text-fg-muted">{rows.filter((r) => r.active).length} active · {rows.filter((r) => !r.active).length} paused</span>
          {canEdit && <Button size="sm" onClick={() => setDialog({ open: true })}><Plus aria-hidden />Add prompt</Button>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<MessageSquareQuote />} title={rows.length ? 'No prompts match your search' : 'No prompts yet'} description={rows.length ? 'Try a different term.' : 'Add the questions your customers ask answer engines.'} action={!rows.length && canEdit ? <Button onClick={() => setDialog({ open: true })}><Plus aria-hidden />Add prompt</Button> : undefined} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13.5px]">
            <caption className="sr-only">Tracked prompts with mention and citation rates</caption>
            <thead>
              <tr className="border-b border-border text-left text-[12px] font-medium text-fg-muted">
                <th scope="col" className="px-4 py-2.5 font-medium" aria-sort={ariaSort('text')}>{sortButton('text', 'Prompt')}</th>
                <th scope="col" className="w-48 px-4 py-2.5 font-medium" aria-sort={ariaSort('mention')}>{sortButton('mention', 'Mention rate')}</th>
                <th scope="col" className="w-24 px-4 py-2.5 font-medium" aria-sort={ariaSort('citation')}>{sortButton('citation', 'Cited')}</th>
                <th scope="col" className="w-24 px-4 py-2.5 font-medium">Avg. position</th>
                <th scope="col" className="w-40 px-4 py-2.5 font-medium">By engine</th>
                <th scope="col" className="w-12 px-4 py-2.5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className={cn('group border-b border-border last:border-0 hover:bg-bg-subtle/60', !r.active && 'opacity-60')}>
                  <td className="px-4 py-3">
                    <Link href={`/app/${slug}/prompts/${r.id}`} className="font-medium text-fg hover:text-accent">{r.text}</Link>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge tone="outline">{r.topic}</Badge>
                      <span className="text-[12px] capitalize text-fg-faint">{r.intent}</span>
                      {!r.active && <Badge tone="neutral">Paused</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {r.mention.value === null ? <span className="text-fg-faint">No data</span> : (
                      <div>
                        <div className="mb-1.5 flex items-baseline justify-between"><span className="font-semibold text-fg tabular">{pct(r.mention.value)}</span><span className="text-[11.5px] text-fg-faint tabular">n={r.mention.n}</span></div>
                        <IntervalBar value={r.mention.value} low={r.mention.low} high={r.mention.high} label="Mention rate" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-fg tabular">{pct(r.citation)}</td>
                  <td className="px-4 py-3 text-fg tabular">{r.avgPosition ? r.avgPosition.toFixed(1) : '—'}</td>
                  <td className="px-4 py-3">
                    <ul className="flex gap-1.5">
                      {r.engines.map((e) => {
                        const share = e.total ? e.mentioned / e.total : 0;
                        return (
                          <li key={e.engine}>
                            <Tooltip content={`${ENGINE_BY_ID[e.engine].name}: mentioned in ${e.mentioned} of ${e.total} answers`}>
                              <span tabIndex={0} className="grid size-6 place-items-center rounded-md border border-border text-[10px] font-semibold text-fg-soft" style={{ background: share >= 0.5 ? `color-mix(in srgb, var(--series-${ENGINE_BY_ID[e.engine].slot}) ${Math.round(18 + share * 50)}%, transparent)` : undefined }}>
                                {ENGINE_BY_ID[e.engine].name[0]}
                              </span>
                            </Tooltip>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td className="px-2 py-3 text-right">
                    {canEdit && (
                      <Dropdown>
                        <DropdownTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`Actions for ${r.text}`}><MoreHorizontal aria-hidden /></Button></DropdownTrigger>
                        <DropdownContent>
                          <DropdownItem onSelect={() => setDialog({ open: true, initial: { id: r.id, text: r.text, topic: r.topic, intent: r.intent } })}><Pencil aria-hidden />Edit</DropdownItem>
                          <DropdownItem onSelect={() => startTransition(async () => toastResult(await setPromptActive(workspaceId, r.id, !r.active)))}>{r.active ? <><Pause aria-hidden />Pause</> : <><Play aria-hidden />Resume</>}</DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem destructive onSelect={() => setConfirmId(r.id)}><Trash2 aria-hidden />Delete</DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Confirm
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Delete this prompt?"
        description="This permanently deletes the prompt and all of its observations. To keep history, pause it instead."
        onConfirm={async () => { if (confirmId) toastResult(await deletePrompt(workspaceId, confirmId)); }}
      />
      <PromptDialog workspaceId={workspaceId} topics={topics} open={dialog.open} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))} initial={dialog.initial} />
    </div>
  );
}
