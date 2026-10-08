'use client';
import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Field, Input } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { buttonClass } from '@/components/ui/button';
import { generateQueries } from '@/lib/suggestions';
import { CopyButton } from './shared';
import type { Intent } from '@/lib/db/schema';

const INTENTS: { id: Intent; label: string; hint: string }[] = [
  { id: 'discovery', label: 'Discovery', hint: 'Are you on the shortlist?' },
  { id: 'comparison', label: 'Comparison', hint: 'How do you compare with rivals?' },
  { id: 'evaluation', label: 'Evaluation', hint: 'Pricing, pros and cons, reviews' },
  { id: 'brand', label: 'Brand', hint: 'Do engines describe you correctly?' },
];

export function PromptGenerator({ embed = false }: { embed?: boolean }) {
  const [v, setV] = React.useState({ category: '', audience: '', brand: '', competitors: '', location: '' });
  const queries = generateQueries({ ...v, competitors: v.competitors.split(',') });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-2xl border border-border bg-panel p-5 shadow-raised sm:grid-cols-2">
        <Field label="What do you offer?" htmlFor="pg-category" hint="A few words a customer would use."><Input id="pg-category" value={v.category} onChange={set('category')} placeholder="managed WordPress hosting" /></Field>
        <Field label="Who is it for?" htmlFor="pg-audience" optional><Input id="pg-audience" value={v.audience} onChange={set('audience')} placeholder="small agencies" /></Field>
        <Field label="Your brand" htmlFor="pg-brand" optional><Input id="pg-brand" value={v.brand} onChange={set('brand')} placeholder="Acme" /></Field>
        <Field label="Location" htmlFor="pg-location" optional><Input id="pg-location" value={v.location} onChange={set('location')} placeholder="Austin, TX" /></Field>
        <Field label="Competitors" htmlFor="pg-competitors" optional hint="Comma-separated." className="sm:col-span-2"><Input id="pg-competitors" value={v.competitors} onChange={set('competitors')} placeholder="Contoso, Fabrikam" /></Field>
      </div>
      {queries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-5 py-8 text-center text-[14px] text-fg-muted">Describe what you offer to generate questions.</p>
      ) : (
        <div className="grid gap-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-fg-muted"><strong className="font-semibold text-fg">{queries.length}</strong> questions across {new Set(queries.map((q) => q.intent)).size} intents</p>
            <CopyButton text={queries.map((q) => q.text).join('\n')} label="Copy all" />
          </div>
          {INTENTS.map((intent) => {
            const items = queries.filter((q) => q.intent === intent.id);
            if (!items.length) return null;
            return (
              <section key={intent.id} className="rounded-2xl border border-border bg-panel p-5" aria-labelledby={`int-${intent.id}`}>
                <h3 id={`int-${intent.id}`} className="flex flex-wrap items-baseline gap-2 text-[15px] font-semibold text-fg">{intent.label}<span className="text-[12.5px] font-normal text-fg-muted">{intent.hint}</span></h3>
                <ul className="mt-3 divide-y divide-border">
                  {items.map((q) => (
                    <li key={q.text} className="flex items-center gap-3 py-2">
                      <span className="flex-1 text-[14px] text-fg-soft">{q.text}</span>
                      <Badge tone="outline">{q.topic}</Badge>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-accent/25 bg-accent-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] text-fg-soft"><strong className="font-semibold text-fg">Track these questions</strong> across ChatGPT, Perplexity, Gemini, and Claude with confidence intervals.</p>
            <Link href="/signup" target={embed ? '_blank' : undefined} className={buttonClass({ size: 'sm' })}>Start free trial <ArrowRight aria-hidden /></Link>
          </div>
        </div>
      )}
    </div>
  );
}
