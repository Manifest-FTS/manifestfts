'use client';
import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Globe, RotateCcw } from 'lucide-react';
import { Button, buttonClass } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ChecksList, CrawlerTable, ScoreRing, type CrawlerRow } from './report-view';
import type { CheckResult } from '@/lib/db/schema';
import { track } from '@/lib/analytics';

interface Report {
  url: string;
  finalUrl: string;
  score: number;
  durationMs: number;
  results: CheckResult[];
  crawlers: CrawlerRow[];
}

type State = { status: 'idle' } | { status: 'loading'; url: string } | { status: 'error'; message: string } | { status: 'done'; report: Report };

export function ReadinessChecker() {
  const params = useSearchParams();
  const [url, setUrl] = React.useState(params.get('url') ?? '');
  const [state, setState] = React.useState<State>({ status: 'idle' });
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const started = React.useRef(false);

  const run = React.useCallback(async (target: string) => {
    if (!target.trim()) return;
    setState({ status: 'loading', url: target });
    track('readiness_check_run', { surface: 'public' });
    try {
      const res = await fetch('/api/tools/readiness', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: target }) });
      const data = await res.json();
      if (!res.ok) setState({ status: 'error', message: data.error ?? 'Something went wrong. Please try again.' });
      else setState({ status: 'done', report: data });
    } catch {
      setState({ status: 'error', message: 'Network error. Check your connection and try again.' });
    }
    requestAnimationFrame(() => resultsRef.current?.focus());
  }, []);

  React.useEffect(() => {
    const initial = params.get('url');
    if (initial && !started.current) {
      started.current = true;
      void run(initial);
    }
  }, [params, run]);

  const counts = state.status === 'done' ? {
    fail: state.report.results.filter((r) => r.status === 'fail').length,
    warn: state.report.results.filter((r) => r.status === 'warn').length,
    pass: state.report.results.filter((r) => r.status === 'pass').length,
  } : null;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const next = new URL(window.location.href);
          next.searchParams.set('url', url.trim());
          window.history.replaceState(null, '', next);
          void run(url);
        }}
        className="flex flex-col gap-2.5 rounded-2xl border border-border bg-panel p-2.5 shadow-raised sm:flex-row"
      >
        <label htmlFor="checker-url" className="sr-only">Website URL</label>
        <div className="relative flex-1">
          <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden />
          <input
            id="checker-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="https://yourdomain.com/page"
            className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-[15.5px] text-fg placeholder:text-fg-faint focus:outline-none"
          />
        </div>
        <Button type="submit" size="lg" loading={state.status === 'loading'}>{state.status === 'loading' ? 'Checking…' : 'Check readiness'}</Button>
      </form>
      <p className="mt-3 text-[13px] text-fg-faint">We fetch one public page plus robots.txt and llms.txt from our servers. Nothing is stored.</p>

      <div ref={resultsRef} tabIndex={-1} aria-live="polite" className="mt-10 outline-none">
        {state.status === 'loading' && (
          <div className="grid gap-4" aria-label="Running checks">
            <p className="text-[14px] text-fg-muted">Fetching {state.url} and evaluating 16 checks…</p>
            <Skeleton className="h-36" />
            <Skeleton className="h-64" />
          </div>
        )}
        {state.status === 'error' && (
          <Alert tone="danger" title="We couldn’t complete the check" action={<Button size="sm" variant="secondary" onClick={() => run(url)}><RotateCcw aria-hidden />Retry</Button>}>
            {state.message}
          </Alert>
        )}
        {state.status === 'done' && counts && (
          <div className="grid animate-rise gap-10">
            <div className="flex flex-col gap-6 rounded-2xl border border-border bg-panel p-6 shadow-card sm:flex-row sm:items-center">
              <ScoreRing score={state.report.score} />
              <div className="min-w-0 flex-1">
                <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-fg">AI readiness for <span className="break-all font-mono text-[17px]">{new URL(state.report.finalUrl).host}</span></h2>
                <p className="mt-1.5 text-[14px] text-fg-muted">{counts.fail} failing · {counts.warn} warnings · {counts.pass} passing · checked in {(state.report.durationMs / 1000).toFixed(1)}s</p>
                <p className="mt-3 text-[13px] text-fg-faint">A strong score means the page is technically accessible and well described. It does not guarantee that any engine will cite it.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-accent/25 bg-accent-subtle p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-[15.5px] font-semibold text-fg">See what engines actually say about this site</p>
                <p className="mt-1 text-[14px] text-fg-soft">Track answers, citations, and accuracy across ChatGPT, Perplexity, Gemini, and Claude. Failing checks become tasks automatically.</p>
              </div>
              <Link href="/signup" onClick={() => track('signup_started', { label: 'checker_result' })} className={buttonClass({ className: 'mt-4 sm:mt-0' })}>Start free trial <ArrowRight aria-hidden /></Link>
            </div>
            <section aria-labelledby="crawlers-title">
              <h2 id="crawlers-title" className="text-[18px] font-semibold text-fg">AI crawler access</h2>
              <p className="mt-1 mb-4 text-[14px] text-fg-muted">Evaluated against robots.txt for <span className="font-mono">{new URL(state.report.finalUrl).pathname}</span>. Retrieval crawlers power live answers; training crawlers are a policy choice.</p>
              <CrawlerTable crawlers={state.report.crawlers} />
            </section>
            <section aria-labelledby="checks-title">
              <h2 id="checks-title" className="mb-4 text-[18px] font-semibold text-fg">All checks</h2>
              <ChecksList results={state.report.results} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
