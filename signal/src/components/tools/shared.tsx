'use client';
import * as React from 'react';
import { Check, Copy, Download, Globe, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type RequestState<T> = { status: 'idle' } | { status: 'loading' } | { status: 'error'; message: string } | { status: 'done'; data: T };

/** POSTs to a tool endpoint with a timeout and turns every failure into a readable message. */
export function useToolRequest<T>(endpoint: string) {
  const [state, setState] = React.useState<RequestState<T>>({ status: 'idle' });
  const run = React.useCallback(async (body: unknown) => {
    setState({ status: 'loading' });
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(120_000) });
      const data = await res.json().catch(() => null);
      if (!data) setState({ status: 'error', message: `The server returned an unexpected response (HTTP ${res.status}). Please try again.` });
      else if (!res.ok) setState({ status: 'error', message: data.error ?? 'Something went wrong. Please try again.' });
      else setState({ status: 'done', data: data as T });
    } catch (error) {
      setState({ status: 'error', message: error instanceof DOMException && error.name === 'TimeoutError' ? 'This took too long. The site may be slow; please try again.' : 'We couldn’t reach the Signal server. Refresh the page and try again.' });
    }
  }, [endpoint]);
  return { state, run };
}

export function UrlForm({ id, placeholder, cta, loading, onSubmit, initial = '' }: { id: string; placeholder: string; cta: string; loading: boolean; onSubmit: (url: string) => void; initial?: string }) {
  const [value, setValue] = React.useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSubmit(value.trim()); }} className="flex flex-col gap-2.5 rounded-2xl border border-border bg-panel p-2.5 shadow-raised sm:flex-row">
      <label htmlFor={id} className="sr-only">Website address</label>
      <div className="relative flex-1">
        <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden />
        <input id={id} value={value} onChange={(e) => setValue(e.target.value)} required type="text" inputMode="url" autoComplete="url" spellCheck={false} placeholder={placeholder}
          className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-[15.5px] text-fg placeholder:text-fg-faint focus:outline-none" />
      </div>
      <Button type="submit" size="lg" loading={loading}>{cta}</Button>
    </form>
  );
}

export function ToolStatus({ state, retry, loadingLabel }: { state: { status: string; message?: string }; retry?: () => void; loadingLabel: string }) {
  if (state.status === 'loading') {
    return (
      <div className="mt-8 grid gap-3" role="status" aria-live="polite">
        <p className="text-[14px] text-fg-muted">{loadingLabel}</p>
        <Skeleton className="h-28" />
        <Skeleton className="h-48" />
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <Alert tone="danger" className="mt-8" title="We couldn’t complete that" action={retry && <Button size="sm" variant="secondary" onClick={retry}><RotateCcw aria-hidden />Retry</Button>}>
        {state.message}
      </Alert>
    );
  }
  return null;
}

export function CopyButton({ text, label = 'Copy', className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button type="button" size="sm" variant="secondary" className={className}
      onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard unavailable */ } }}>
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}{copied ? 'Copied' : label}
    </Button>
  );
}

/** Read-only code output with copy and download actions. */
export function CodeOutput({ code, filename, language, title, className }: { code: string; filename?: string; language: string; title: string; className?: string }) {
  const download = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename ?? 'output.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-panel shadow-card', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-bg-subtle px-4 py-2.5">
        <p className="text-[13px] font-semibold text-fg">{title}<span className="ml-2 font-mono text-[11.5px] font-normal text-fg-faint">{language}</span></p>
        <div className="flex gap-2">
          <CopyButton text={code} />
          {filename && <Button type="button" size="sm" variant="secondary" onClick={download}><Download aria-hidden />Download</Button>}
        </div>
      </div>
      <pre className="max-h-[520px] overflow-auto p-4 font-mono text-[12.5px] leading-relaxed text-fg-soft"><code>{code}</code></pre>
    </div>
  );
}
