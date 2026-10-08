'use client';
import * as React from 'react';
import Link from 'next/link';
import { CircleCheck, CircleX, ExternalLink, Info, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Button, buttonClass } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/field';
import { ENGINES, ENGINE_BY_ID } from '@/lib/engines';
import type { EngineId } from '@/lib/db/schema';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { CodeOutput, ToolStatus, UrlForm, useToolRequest } from './shared';

/* llms.txt generator */

export function LlmsTxtGenerator() {
  const { state, run } = useToolRequest<{ origin: string; name: string; pages: number; sitemap: string | null; llmsTxt: string }>('/api/tools/llms-txt');
  const [last, setLast] = React.useState('');
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => {
    if (state.status === 'done') setDraft(state.data.llmsTxt); // eslint-disable-line react-hooks/set-state-in-effect -- seed the editor from a new result
  }, [state]);
  return (
    <div>
      <UrlForm id="llms-url" placeholder="yourdomain.com" cta="Draft llms.txt" loading={state.status === 'loading'} onSubmit={(u) => { setLast(u); void run({ url: u }); }} />
      <p className="mt-3 text-[13px] text-fg-faint">We read your sitemap and up to 24 pages’ titles and descriptions. Nothing is stored.</p>
      <ToolStatus state={state} retry={() => run({ url: last })} loadingLabel="Reading your sitemap and pages…" />
      {state.status === 'done' && (
        <div className="mt-8 grid animate-rise gap-4">
          <p className="text-[14px] text-fg-muted">Drafted from <strong className="font-semibold text-fg">{state.data.pages}</strong> pages{state.data.sitemap ? <> in <span className="font-mono text-[12.5px]">{state.data.sitemap}</span></> : ' linked from the home page (no sitemap found)'}. Edit before publishing.</p>
          <label htmlFor="llms-edit" className="sr-only">Edit llms.txt</label>
          <Textarea id="llms-edit" rows={16} value={draft} onChange={(e) => setDraft(e.target.value)} className="font-mono text-[12.5px] leading-relaxed" />
          <CodeOutput code={draft} filename="llms.txt" language="Markdown" title="Publish at /llms.txt" />
        </div>
      )}
    </div>
  );
}

/* Structured data validator */

interface SdResult { url: string; blocks: number; parseErrors: string[]; nodes: { type: string; name: string | null; errors: string[]; warnings: string[] }[]; totals: { errors: number; warnings: number }; otherFormats: { microdata: number; rdfa: number } }

export function StructuredDataValidator() {
  const { state, run } = useToolRequest<SdResult>('/api/tools/structured-data');
  const [last, setLast] = React.useState('');
  return (
    <div>
      <UrlForm id="sd-url" placeholder="https://yourdomain.com/page" cta="Validate" loading={state.status === 'loading'} onSubmit={(u) => { setLast(u); void run({ url: u }); }} />
      <ToolStatus state={state} retry={() => run({ url: last })} loadingLabel="Fetching the page and validating JSON-LD…" />
      {state.status === 'done' && (
        <div className="mt-8 grid animate-rise gap-4">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-panel p-5 shadow-card">
            <p className="mr-auto break-all font-mono text-[13px] text-fg-soft">{state.data.url}</p>
            <Badge tone="neutral">{state.data.blocks} JSON-LD block{state.data.blocks === 1 ? '' : 's'}</Badge>
            <Badge tone={state.data.totals.errors ? 'danger' : 'success'}>{state.data.totals.errors} errors</Badge>
            <Badge tone={state.data.totals.warnings ? 'warning' : 'success'}>{state.data.totals.warnings} suggestions</Badge>
          </div>
          {state.data.parseErrors.map((e) => <Alert key={e} tone="danger" title="JSON syntax error">{e}</Alert>)}
          {state.data.nodes.length === 0 && !state.data.parseErrors.length && (
            <Alert tone="warning" title="No JSON-LD found">{state.data.otherFormats.microdata || state.data.otherFormats.rdfa ? `Found ${state.data.otherFormats.microdata} microdata and ${state.data.otherFormats.rdfa} RDFa annotations. JSON-LD is the recommended format.` : 'Add JSON-LD describing your organization and page content.'} <Link href="/tools/schema-generator" className="font-semibold underline">Generate schema</Link></Alert>
          )}
          <ul className="grid gap-3">
            {state.data.nodes.map((n, i) => (
              <li key={i} className="rounded-2xl border border-border bg-panel p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {n.errors.length ? <CircleX className="size-4 text-danger" aria-label="Has errors" /> : <CircleCheck className="size-4 text-success" aria-label="Valid" />}
                  <span className="font-mono text-[13.5px] font-semibold text-fg">{n.type}</span>
                  {n.name && <span className="truncate text-[13px] text-fg-muted">“{n.name}”</span>}
                </div>
                {(n.errors.length > 0 || n.warnings.length > 0) && (
                  <ul className="mt-2 grid gap-1 pl-6 text-[13px]">
                    {n.errors.map((e) => <li key={e} className="text-danger">{e}</li>)}
                    {n.warnings.map((w) => <li key={w} className="text-fg-muted">{w}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* Sitemap validator */

interface SitemapResult { url: string; kind: 'index' | 'urlset'; entries: number; withLastmod: number; issues: { severity: 'error' | 'warning'; message: string }[]; sample: { url: string; status: number; redirected: boolean }[]; children: string[] }

export function SitemapValidator() {
  const { state, run } = useToolRequest<SitemapResult>('/api/tools/sitemap');
  const [last, setLast] = React.useState('');
  return (
    <div>
      <UrlForm id="sm-url" placeholder="yourdomain.com or https://yourdomain.com/sitemap.xml" cta="Validate sitemap" loading={state.status === 'loading'} onSubmit={(u) => { setLast(u); void run({ url: u }); }} />
      <ToolStatus state={state} retry={() => run({ url: last })} loadingLabel="Fetching the sitemap and spot-checking URLs…" />
      {state.status === 'done' && (
        <div className="mt-8 grid animate-rise gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[[state.data.kind === 'index' ? 'Child sitemaps' : 'URLs', state.data.entries.toLocaleString()], ['With lastmod', `${state.data.withLastmod.toLocaleString()}`], ['Issues', String(state.data.issues.length)]].map(([l, v]) => (
              <div key={l} className="rounded-2xl border border-border bg-panel p-4 shadow-card"><p className="text-[12.5px] text-fg-muted">{l}</p><p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-fg">{v}</p></div>
            ))}
          </div>
          <p className="break-all font-mono text-[12.5px] text-fg-muted">{state.data.url}</p>
          {state.data.issues.length === 0 ? <Alert tone="success" title="No issues found">The sitemap is valid and the sampled URLs resolve.</Alert> : (
            <ul className="grid gap-2">
              {state.data.issues.map((i) => (
                <li key={i.message} className="flex items-start gap-2.5 rounded-xl border border-border bg-panel px-4 py-3 text-[13.5px]">
                  {i.severity === 'error' ? <CircleX className="mt-0.5 size-4 shrink-0 text-danger" aria-label="Error" /> : <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-label="Warning" />}
                  <span className="text-fg-soft">{i.message}</span>
                </li>
              ))}
            </ul>
          )}
          {state.data.sample.length > 0 && (
            <details className="rounded-xl border border-border bg-panel">
              <summary className="cursor-pointer px-4 py-2.5 text-[13px] font-medium text-fg-soft">Spot-checked URLs</summary>
              <ul className="divide-y divide-border border-t border-border">
                {state.data.sample.map((s) => <li key={s.url} className="flex items-center gap-3 px-4 py-2 text-[12.5px]"><span className="min-w-0 flex-1 truncate font-mono text-fg-soft">{s.url}</span><span className={cn('font-semibold tabular', s.status >= 400 ? 'text-danger' : s.status === 0 ? 'text-warning' : 'text-success')}>{s.status || 'timeout'}</span></li>)}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

/* AI visibility checker */

interface VisResult { configured: EngineId[]; results: ({ engine: EngineId; name: string; ok: true; model: string; mentioned: boolean; cited: boolean; sentiment: string | null; excerpt: string; citations: { url: string; domain: string }[] } | { engine: EngineId; name: string; ok: false; error: string })[] }

export function VisibilityChecker({ engine }: { engine?: EngineId }) {
  const { state, run } = useToolRequest<VisResult>('/api/tools/visibility');
  const [configured, setConfigured] = React.useState<EngineId[] | null>(null);
  const [v, setV] = React.useState({ brand: '', domain: '', question: '' });
  const [engines, setEngines] = React.useState<EngineId[]>(engine ? [engine] : ['chatgpt', 'perplexity', 'gemini', 'claude']);

  React.useEffect(() => {
    fetch('/api/tools/visibility').then((r) => r.json()).then((d) => setConfigured(d.configured ?? [])).catch(() => setConfigured([]));
  }, []);

  const liveEngines = ENGINES.filter((e) => e.liveAdapter);
  const unavailable = configured !== null && (engine ? !configured.includes(engine) : configured.length === 0);

  return (
    <div className="grid gap-6">
      {unavailable && (
        <Alert tone="info" title={`Live ${engine ? ENGINE_BY_ID[engine].name : 'engine'} checks aren’t enabled on this site yet`}>
          Live checks call each vendor’s API and are switched on per deployment. You can still track questions with labeled sample data in a free trial, or <Link href="/tools/ai-readiness-checker" className="font-semibold underline">run a GEO audit</Link> now.
        </Alert>
      )}
      <form
        className="grid gap-4 rounded-2xl border border-border bg-panel p-5 shadow-raised"
        onSubmit={(e) => { e.preventDefault(); track('readiness_check_run', { surface: 'visibility' }); void run({ ...v, engines }); }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand name" htmlFor="vc-brand"><Input id="vc-brand" required value={v.brand} onChange={(e) => setV({ ...v, brand: e.target.value })} placeholder="Acme" /></Field>
          <Field label="Domain" htmlFor="vc-domain"><Input id="vc-domain" required value={v.domain} onChange={(e) => setV({ ...v, domain: e.target.value })} placeholder="acme.com" spellCheck={false} /></Field>
        </div>
        <Field label="Buyer question" htmlFor="vc-question" hint={<>Phrase it the way a customer would. Need ideas? Try the <Link href="/tools/ai-prompt-generator" className="underline">prompt generator</Link>.</>}>
          <Textarea id="vc-question" required rows={2} value={v.question} onChange={(e) => setV({ ...v, question: e.target.value })} placeholder="What is the best project management software for small agencies?" />
        </Field>
        {!engine && (
          <fieldset>
            <legend className="text-[13.5px] font-medium text-fg">Engines</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {liveEngines.map((e) => {
                const on = engines.includes(e.id);
                const ready = configured?.includes(e.id);
                return (
                  <label key={e.id} className={cn('flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px]', on ? 'border-accent bg-accent-subtle/50' : 'border-border', !ready && 'opacity-60')}>
                    <input type="checkbox" checked={on} onChange={() => setEngines(on ? engines.filter((x) => x !== e.id) : [...engines, e.id])} className="accent-[var(--accent)]" />
                    {e.name}{configured && !ready && <span className="text-[11px] text-fg-faint">(not enabled)</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        <div><Button type="submit" size="lg" loading={state.status === 'loading'} disabled={unavailable}>Check visibility</Button></div>
      </form>
      <ToolStatus state={state} retry={() => run({ ...v, engines })} loadingLabel="Asking each engine with web search enabled. This can take up to a minute…" />
      {state.status === 'done' && (
        <div className="grid animate-rise gap-4">
          {state.data.results.length === 0 && <Alert tone="info">None of the selected engines are enabled for live checks on this site.</Alert>}
          {state.data.results.map((r) => (
            <article key={r.engine} className="rounded-2xl border border-border bg-panel p-5 shadow-card">
              <header className="flex flex-wrap items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: `var(--series-${ENGINE_BY_ID[r.engine].slot})` }} aria-hidden />
                <h3 className="text-[15px] font-semibold text-fg">{r.name}</h3>
                {r.ok ? (
                  <span className="ml-auto flex flex-wrap gap-1.5">
                    <Badge tone={r.mentioned ? 'success' : 'danger'}>{r.mentioned ? 'Mentions you' : 'Does not mention you'}</Badge>
                    <Badge tone={r.cited ? 'success' : 'neutral'}>{r.cited ? 'Cites your site' : 'No citation of your site'}</Badge>
                  </span>
                ) : <Badge tone="warning" className="ml-auto">Unavailable</Badge>}
              </header>
              {r.ok ? (
                <>
                  <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-fg-soft">{r.excerpt}{r.excerpt.length >= 900 ? '…' : ''}</p>
                  {r.citations.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {r.citations.map((c) => <li key={c.url}><a href={c.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 font-mono text-[11.5px] text-fg-muted hover:text-fg">{c.domain}<ExternalLink className="size-3" aria-hidden /></a></li>)}
                    </ul>
                  )}
                  <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-fg-faint"><Info className="size-3.5" aria-hidden />One answer from {r.model}. Answers vary; track this question over time for a reliable rate.</p>
                </>
              ) : <p className="mt-2 text-[13px] text-fg-muted">{r.error}</p>}
            </article>
          ))}
          {state.data.results.length > 0 && (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-accent/25 bg-accent-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14px] text-fg-soft"><strong className="font-semibold text-fg">One answer is a snapshot.</strong> Track this question daily with confidence intervals, competitors, and sources.</p>
              <Link href="/signup" className={buttonClass({ size: 'sm' })}>Start free trial</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
