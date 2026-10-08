'use client';
import * as React from 'react';
import Link from 'next/link';
import { Check, CircleHelp, Clock, X } from 'lucide-react';
import { reviewClaim } from '@/app/app/_actions/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toastResult } from '@/components/app/use-action-toast';
import { formatShortDate } from '@/lib/format';

export interface ClaimItem {
  id: string; text: string; status: string; note: string | null; engine: string; engineSlot: number; promptId: string; promptText: string; observedAt: string;
  fact: { label: string; value: string } | null; sample: boolean;
}

const STATUS_BADGE: Record<string, { tone: 'success' | 'danger' | 'warning' | 'neutral' | 'accent'; label: string }> = {
  needs_review: { tone: 'warning', label: 'Needs review' },
  accurate: { tone: 'success', label: 'Accurate' },
  inaccurate: { tone: 'danger', label: 'Inaccurate' },
  outdated: { tone: 'accent', label: 'Outdated' },
  unverifiable: { tone: 'neutral', label: 'Unverifiable' },
};

export function ClaimList({ claims, workspaceId, slug, canEdit }: { claims: ClaimItem[]; workspaceId: string; slug: string; canEdit: boolean }) {
  const [optimistic, setOptimistic] = React.useOptimistic(claims, (state, update: { id: string; status: string }) => state.map((c) => (c.id === update.id ? { ...c, status: update.status } : c)));
  const [, startTransition] = React.useTransition();

  const review = (id: string, status: 'accurate' | 'inaccurate' | 'outdated' | 'unverifiable' | 'needs_review') =>
    startTransition(async () => {
      setOptimistic({ id, status });
      const result = await reviewClaim({ workspaceId, claimId: id, status });
      if (result.error) toastResult(result);
    });

  return (
    <ul className="grid gap-3">
      {optimistic.map((c) => {
        const badge = STATUS_BADGE[c.status] ?? STATUS_BADGE.needs_review!;
        return (
          <li key={c.id} className="rounded-xl border border-border bg-panel p-4 shadow-card">
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-fg-muted">
              <span className="size-2 rounded-full" style={{ background: `var(--series-${c.engineSlot})` }} aria-hidden />
              <span className="font-medium text-fg-soft">{c.engine}</span>
              <span aria-hidden>·</span>
              <time dateTime={c.observedAt}>{formatShortDate(c.observedAt)}</time>
              {c.sample && <Badge tone="warning">Sample</Badge>}
              <Badge tone={badge.tone} className="ml-auto">{badge.label}</Badge>
            </div>
            <blockquote className="mt-2.5 border-l-2 border-border-strong/50 pl-3 text-[14.5px] leading-relaxed text-fg">{c.text}</blockquote>
            <div className="mt-3 grid gap-1 text-[12.5px] text-fg-muted">
              {c.fact ? (
                <p>Fact sheet · <strong className="font-medium text-fg-soft">{c.fact.label}:</strong> {c.fact.value}</p>
              ) : <p>No matching fact. <Link href="#fact-sheet" className="font-medium text-accent hover:underline">Add one</Link> to check claims like this automatically.</p>}
              <p className="truncate">From <Link href={`/app/${slug}/prompts/${c.promptId}`} className="text-accent hover:underline">“{c.promptText}”</Link></p>
            </div>
            {canEdit && (
              <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-border pt-3" role="group" aria-label="Review this claim">
                <Button size="sm" variant={c.status === 'accurate' ? 'primary' : 'secondary'} aria-pressed={c.status === 'accurate'} onClick={() => review(c.id, 'accurate')}><Check aria-hidden />Accurate</Button>
                <Button size="sm" variant={c.status === 'inaccurate' ? 'danger' : 'secondary'} aria-pressed={c.status === 'inaccurate'} onClick={() => review(c.id, 'inaccurate')}><X aria-hidden />Inaccurate</Button>
                <Button size="sm" variant="secondary" aria-pressed={c.status === 'outdated'} className={c.status === 'outdated' ? 'ring-2 ring-accent' : ''} onClick={() => review(c.id, 'outdated')}><Clock aria-hidden />Outdated</Button>
                <Button size="sm" variant="ghost" aria-pressed={c.status === 'unverifiable'} onClick={() => review(c.id, 'unverifiable')}><CircleHelp aria-hidden />Can’t verify</Button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
