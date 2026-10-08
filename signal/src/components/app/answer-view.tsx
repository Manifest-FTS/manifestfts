'use client';
import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Citation } from '@/lib/db/schema';
import { domainMatches } from '@/lib/analysis';
import { formatDateTime } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

interface Entity { names: string[]; kind: 'brand' | 'competitor' }

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Renders answer text with brand and competitor names highlighted in place. */
export function HighlightedAnswer({ text, entities }: { text: string; entities: Entity[] }) {
  const clean = text.replace(/\*\*/g, '');
  const names = entities.flatMap((e) => e.names.filter((n) => n.trim().length >= 2).map((n) => ({ n, kind: e.kind }))).sort((a, b) => b.n.length - a.n.length);
  if (!names.length) return <p className="whitespace-pre-line">{clean}</p>;
  const re = new RegExp(`(${names.map((x) => escape(x.n)).join('|')})`, 'gi');
  const parts = clean.split(re);
  return (
    <p className="whitespace-pre-line">
      {parts.map((part, i) => {
        const hit = names.find((x) => x.n.toLowerCase() === part.toLowerCase());
        if (!hit) return <React.Fragment key={i}>{part}</React.Fragment>;
        return (
          <mark key={i} className={cn('rounded px-0.5', hit.kind === 'brand' ? 'bg-accent-subtle font-semibold text-accent-on-subtle' : 'bg-bg-muted text-fg')}>
            {part}
            <span className="sr-only">{hit.kind === 'brand' ? ' (your brand)' : ' (competitor)'}</span>
          </mark>
        );
      })}
    </p>
  );
}

export interface AnswerCardProps {
  engineName: string;
  slot: number;
  model: string | null;
  observedAt: string;
  text: string;
  citations: Citation[];
  brandMentioned: boolean;
  brandPosition: number | null;
  brandCited: boolean;
  sentiment: string | null;
  brand: { names: string[]; domain: string };
  competitors: { names: string[]; domain: string }[];
  sample: boolean;
}

export function AnswerCard(p: AnswerCardProps) {
  return (
    <article className="rounded-xl border border-border bg-panel">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2 rounded-full" style={{ background: `var(--series-${p.slot})` }} aria-hidden />
        <h3 className="text-[14px] font-semibold text-fg">{p.engineName}</h3>
        <span className="text-[12px] text-fg-faint">{formatDateTime(p.observedAt)}{p.model ? ` · ${p.model}` : ''}</span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {p.sample && <Badge tone="warning">Sample</Badge>}
          {p.brandMentioned ? <Badge tone="accent">Mentioned · #{p.brandPosition}</Badge> : <Badge tone="neutral">Not mentioned</Badge>}
          {p.brandCited && <Badge tone="success">Cited</Badge>}
          {p.sentiment && p.brandMentioned && <Badge tone={p.sentiment === 'positive' ? 'success' : p.sentiment === 'negative' ? 'danger' : 'outline'} className="capitalize">{p.sentiment}</Badge>}
        </div>
      </header>
      <div className="px-4 py-4 text-[14px] leading-relaxed text-fg-soft">
        <HighlightedAnswer text={p.text} entities={[{ names: p.brand.names, kind: 'brand' }, ...p.competitors.map((c) => ({ names: c.names, kind: 'competitor' as const }))]} />
      </div>
      {p.citations.length > 0 && (
        <footer className="border-t border-border px-4 py-3">
          <p className="mb-2 text-[12px] font-medium text-fg-muted">{p.citations.length} cited source{p.citations.length === 1 ? '' : 's'}</p>
          <ul className="flex flex-wrap gap-1.5">
            {p.citations.map((c) => {
              const own = domainMatches(c.domain, p.brand.domain);
              const comp = p.competitors.some((x) => domainMatches(c.domain, x.domain));
              return (
                <li key={c.url}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer nofollow" title={c.title ?? c.url}
                    className={cn('inline-flex max-w-[260px] items-center gap-1 rounded-md border px-2 py-1 font-mono text-[11.5px] transition hover:border-border-strong', own ? 'border-success/30 bg-success-subtle text-success-on-subtle' : comp ? 'border-warning/30 bg-warning-subtle text-warning-on-subtle' : 'border-border text-fg-muted')}>
                    <span className="truncate">{c.domain}</span><ExternalLink className="size-3 shrink-0" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </footer>
      )}
    </article>
  );
}

export function EngineTabs({ tabs }: { tabs: { id: string; label: string; slot: number; content: React.ReactNode }[] }) {
  const [active, setActive] = React.useState(tabs[0]?.id);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : null;
    if (next === null) return;
    e.preventDefault();
    setActive(tabs[next]!.id);
    refs.current[next]?.focus();
  };
  return (
    <div>
      <div role="tablist" aria-label="Engines" className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`tab-${t.id}`} aria-controls={`panel-${t.id}`} aria-selected={active === t.id} tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)} onKeyDown={(e) => onKey(e, i)}
            className={cn('-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[13.5px] font-medium transition-colors', active === t.id ? 'border-accent text-fg' : 'border-transparent text-fg-muted hover:text-fg')}>
            <span className="size-2 rounded-full" style={{ background: `var(--series-${t.slot})` }} aria-hidden />{t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={active !== t.id}>{t.content}</div>
      ))}
    </div>
  );
}
