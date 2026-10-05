'use client';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ENGINES } from '@/lib/engines';
import { cn } from '@/lib/cn';

const PendingContext = React.createContext(false);

/** Filter row that scopes everything beneath it. While new data loads the previous render stays visible, dimmed. */
export function FilterScope({ topics, showEngine = true, showTopic = true, showRange = true, children, extra }: { topics?: string[]; showEngine?: boolean; showTopic?: boolean; showRange?: boolean; children: React.ReactNode; extra?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = React.useTransition();

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key);
    else next.set(key, value);
    next.delete('welcome');
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }));
  };

  const range = params.get('range') ?? '30';
  return (
    <PendingContext.Provider value={pending}>
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
        {showRange && (
          <div className="inline-flex rounded-lg border border-border bg-panel p-0.5 shadow-card" role="radiogroup" aria-label="Date range">
            {[['7', '7 days'], ['30', '30 days'], ['90', '90 days']].map(([value, label]) => (
              <button key={value} type="button" role="radio" aria-checked={range === value} onClick={() => set('range', value === '30' ? null : value)}
                className={cn('h-7 rounded-md px-3 text-[12.5px] font-medium transition-colors', range === value ? 'bg-bg-muted text-fg' : 'text-fg-muted hover:text-fg')}>
                {label}
              </button>
            ))}
          </div>
        )}
        {showEngine && (
          <select aria-label="Engine" value={params.get('engine') ?? 'all'} onChange={(e) => set('engine', e.target.value === 'all' ? null : e.target.value)}
            className="h-8 rounded-lg border border-border bg-panel px-2.5 pr-8 text-[12.5px] font-medium text-fg-soft shadow-card focus:outline-none focus:ring-4 focus:ring-[var(--ring)]">
            <option value="all">All engines</option>
            {ENGINES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        )}
        {showTopic && topics && topics.length > 1 && (
          <select aria-label="Topic" value={params.get('topic') ?? 'all'} onChange={(e) => set('topic', e.target.value === 'all' ? null : e.target.value)}
            className="h-8 rounded-lg border border-border bg-panel px-2.5 pr-8 text-[12.5px] font-medium text-fg-soft shadow-card focus:outline-none focus:ring-4 focus:ring-[var(--ring)]">
            <option value="all">All topics</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
        {pending && <span className="text-[12px] text-fg-faint" role="status">Updating…</span>}
        {extra && <div className="ml-auto flex items-center gap-2">{extra}</div>}
      </div>
      <div className={cn('transition-opacity duration-200', pending && 'pointer-events-none opacity-55')} aria-busy={pending}>{children}</div>
    </PendingContext.Provider>
  );
}

export function useFilterPending() {
  return React.useContext(PendingContext);
}
