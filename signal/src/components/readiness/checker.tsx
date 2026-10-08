'use client';
import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Globe, RotateCcw } from 'lucide-react';
import { Button, buttonClass } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CrawlerAccessView, GeoReport } from './report-view';
import type { AuditDetails, AuditSubscores, CheckResult, CrawlerAccess } from '@/lib/db/schema';
import { track } from '@/lib/analytics';

interface Report {
  url: string;
  finalUrl: string;
  score: number;
  durationMs: number;
  results: CheckResult[];
  crawlers: CrawlerAccess[];
  subscores: AuditSubscores;
  details: AuditDetails;
}

type State = { status: 'idle' } | { status: 'loading'; url: string } | { status: 'error'; message: string } | { status: 'done'; report: Report };

/** Public GEO audit. In `embed` mode it renders compactly and links out to the full tool. */
export function ReadinessChecker({ embed = false, focus = 'full' }: { embed?: boolean; focus?: 'full' | 'crawlers' }) {
  const params = useSearchParams();
  const [url, setUrl] = React.useState(params.get('url') ?? '');
  const [state, setState] = React.useState<State>({ status: 'idle' });
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const started = React.useRef(false);

  const run = React.useCallback(async (target: string) => {
    if (!target.trim()) return;
    setState({ status: 'loading', url: target });
    track('readiness_check_run', { surface: embed ? 'embed' : 'public' });
    try {
      const res = await fetch('/api/tools/readiness', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: target }),
        signal: AbortSignal.timeout(45_000),
      });
      const data = await res.json().catch(() => null);
      if (!data) setState({ status: 'error', message: `The server returned an unexpected response (HTTP ${res.status}). Please try again in a moment.` });
      else if (!res.ok) setState({ status: 'error', message: data.error ?? 'Something went wrong. Please try again.' });
      else setState({ status: 'done', report: data });
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
      setState({
        status: 'error',
        message: timedOut
          ? 'The check took too long. The site may be slow to respond; try again or check a specific page.'
          : navigator.onLine === false
            ? 'You appear to be offline. Check your connection and try again.'
            : 'We couldn’t reach the Signal server. Refresh the page and try again.',
      });
    }
    requestAnimationFrame(() => resultsRef.current?.focus());
  }, [embed]);

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
          if (!embed) window.history.replaceState(null, '', next);
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
        <Button type="submit" size="lg" loading={state.status === 'loading'}>{state.status === 'loading' ? 'Auditing…' : 'Run GEO audit'}</Button>
      </form>
      <p className="mt-3 text-[13px] text-fg-faint">We fetch one public page plus robots.txt, llms.txt, and your sitemap from our servers. Results can take up to 30 seconds. Nothing is stored.</p>

      <div ref={resultsRef} tabIndex={-1} aria-live="polite" className="mt-10 outline-none">
        {state.status === 'loading' && (
          <div className="grid gap-4" aria-label="Running checks">
            <p className="text-[14px] text-fg-muted">Fetching {state.url}, robots.txt, llms.txt, and the sitemap, then scoring six dimensions…</p>
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
          <div className="grid animate-rise gap-8">
            {focus === 'crawlers' ? (
              <section className="rounded-2xl border border-border bg-panel p-6 shadow-card" aria-labelledby="robots-title">
                <h2 id="robots-title" className="text-[18px] font-semibold text-fg">AI crawler access for <span className="break-all font-mono text-[16px]">{new URL(state.report.finalUrl).host}</span></h2>
                <p className="mb-5 mt-1 text-[13.5px] text-fg-muted">Evaluated against robots.txt for <span className="font-mono">{new URL(state.report.finalUrl).pathname}</span> and the pages in your sitemap.</p>
                <CrawlerAccessView crawlers={state.report.crawlers} />
                {!embed && <p className="mt-5 text-[13px] text-fg-muted">Want the full picture? <a href={`/tools/ai-readiness-checker?url=${encodeURIComponent(state.report.finalUrl)}`} className="font-medium text-accent hover:underline">Run the complete GEO audit</a> or <Link href="/tools/robots-txt-generator" className="font-medium text-accent hover:underline">generate a robots.txt</Link>.</p>}
              </section>
            ) : (
            <GeoReport
              score={state.report.score}
              subscores={state.report.subscores}
              crawlers={state.report.crawlers}
              details={state.report.details}
              results={embed ? [] : state.report.results}
              header={
                <>
                  <p className="mt-3 break-all font-mono text-[13px] text-fg-soft">{state.report.finalUrl}</p>
                  <p className="mt-1 text-[12.5px] text-fg-faint">{counts.fail} failing · {counts.warn} warnings · {counts.pass} passing · {(state.report.durationMs / 1000).toFixed(1)}s. A strong score means the page is accessible and well described; it does not guarantee citation.</p>
                </>
              }
            />
            )}
            <div className="rounded-2xl border border-accent/25 bg-accent-subtle p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-[15.5px] font-semibold text-fg">{embed ? 'Get the full report and track progress' : 'See what engines actually say about this site'}</p>
                <p className="mt-1 text-[14px] text-fg-soft">Track answers, citations, and accuracy across ChatGPT, Perplexity, Gemini, and Claude. Failing checks become tasks automatically.</p>
              </div>
              {embed ? (
                <a href={`/tools/ai-readiness-checker?url=${encodeURIComponent(state.report.finalUrl)}&utm_source=embed`} target="_blank" rel="noopener" className={buttonClass({ className: 'mt-4 sm:mt-0' })}>Open full report <ArrowRight aria-hidden /></a>
              ) : (
                <Link href="/signup" onClick={() => track('signup_started', { label: 'checker_result' })} className={buttonClass({ className: 'mt-4 sm:mt-0' })}>Start free trial <ArrowRight aria-hidden /></Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
