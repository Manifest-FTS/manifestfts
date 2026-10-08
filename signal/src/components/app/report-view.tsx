import type { ReportSnapshot } from '@/app/app/_actions/reports';
import { ENGINE_BY_ID } from '@/lib/engines';
import { formatDate, pct } from '@/lib/format';
import { LineChart } from '@/components/charts/line-chart';
import { IntervalBar } from '@/components/charts/bars';
import { Markdown } from '@/lib/markdown';
import type { EngineId } from '@/lib/db/schema';

function half(r: { low: number | null; high: number | null }) {
  return r.low === null || r.high === null ? null : Math.round(((r.high - r.low) / 2) * 1000) / 10;
}

export interface ReportBranding { name: string | null; color: string | null; logo: string | null; hideSignal: boolean }

export function ReportView({ title, snapshot: s, periodStart, periodEnd, summary, summarySlot, branding }: { title: string; snapshot: ReportSnapshot; periodStart: Date; periodEnd: Date; summary: string; summarySlot?: React.ReactNode; branding?: ReportBranding }) {
  const kpis = [
    { label: 'Mention rate', r: s.mention, delta: s.changes.mention, meaningful: s.changes.mentionMeaningful },
    { label: 'Citation rate', r: s.citation, delta: s.changes.citation, meaningful: s.changes.citationMeaningful },
    { label: 'Share of voice', r: s.shareOfVoice },
  ];
  return (
    <article className="mx-auto max-w-4xl rounded-2xl border border-border bg-panel shadow-card print:border-0 print:shadow-none" style={branding?.color ? ({ '--accent': branding.color, '--series-1': branding.color } as React.CSSProperties) : undefined}>
      <header className="border-b border-border px-6 py-8 sm:px-10">
        {(branding?.logo || branding?.name) && (
          <div className="mb-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- customer-supplied logo URL on any host; next/image would need a remote allowlist */}
            {branding.logo && <img src={branding.logo} alt={branding.name ?? 'Logo'} className="h-9 w-auto max-w-[180px] object-contain" />}
            {branding.name && !branding.logo && <span className="text-[16px] font-semibold text-fg">{branding.name}</span>}
          </div>
        )}
        <p className="eyebrow" style={branding?.color ? { color: branding.color } : undefined}>AI visibility report</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.035em] text-fg sm:text-[32px]">{title}</h1>
        <p className="mt-2 text-[14px] text-fg-muted">{s.brandName} · {s.domain} · {formatDate(periodStart)} – {formatDate(periodEnd)} · {s.n.toLocaleString()} answers</p>
        {s.dataMode === 'sample' && <p className="mt-3 inline-flex rounded-full bg-warning-subtle px-2.5 py-1 text-[12px] font-semibold text-warning-on-subtle">Contains sample data, not observations of real engines</p>}
      </header>

      <section className="border-b border-border px-6 py-7 sm:px-10" aria-labelledby="summary-h">
        <h2 id="summary-h" className="text-[16px] font-semibold text-fg">Summary</h2>
        {summarySlot ?? (summary ? <div className="prose-signal mt-3 text-[15px]"><Markdown source={summary} /></div> : <p className="mt-3 text-[14px] italic text-fg-faint">No summary was added.</p>)}
      </section>

      <section className="grid gap-4 border-b border-border px-6 py-7 sm:grid-cols-3 sm:px-10" aria-label="Key metrics">
        {kpis.map((k) => (
          <div key={k.label}>
            <p className="text-[13px] font-medium text-fg-muted">{k.label}</p>
            <p className="mt-1 text-[30px] font-semibold tracking-[-0.04em] text-fg">{pct(k.r.value)}</p>
            <p className="text-[12px] text-fg-faint">±{half(k.r) ?? '—'} pts · n={k.r.n}</p>
            {k.delta !== undefined && s.changes.hasPrev && (
              <p className="mt-1 text-[12px] text-fg-muted">{k.delta >= 0 ? '+' : ''}{Math.round(k.delta * 1000) / 10} pts vs prior period · {k.meaningful ? 'meaningful' : 'within normal variation'}</p>
            )}
          </div>
        ))}
      </section>

      {s.trend.labels.length > 1 && (
        <section className="border-b border-border px-6 py-7 sm:px-10" aria-labelledby="trend-h">
          <h2 id="trend-h" className="mb-4 text-[16px] font-semibold text-fg">Mention rate by engine</h2>
          <LineChart title="Mention rate by engine" labels={s.trend.labels} series={s.trend.series} max={1} />
        </section>
      )}

      <section className="grid gap-8 border-b border-border px-6 py-7 sm:px-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-[16px] font-semibold text-fg">By engine</h2>
          <ul className="grid gap-4">
            {s.byEngine.map((e) => {
              const meta = ENGINE_BY_ID[e.engine as EngineId];
              return (
                <li key={e.engine}>
                  <div className="mb-1.5 flex justify-between text-[13px]"><span className="font-medium text-fg">{meta?.name ?? e.engine}</span><span className="text-fg tabular">{pct(e.mention)} <span className="text-fg-faint">n={e.n}</span></span></div>
                  <IntervalBar value={e.mention} low={e.low} high={e.high} slot={meta?.slot ?? 1} label={`${meta?.name} mention rate`} />
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-[16px] font-semibold text-fg">Share of voice</h2>
          <ul className="grid gap-2 text-[13.5px]">
            {[...s.competitors].sort((a, b) => (b.share ?? 0) - (a.share ?? 0)).map((c) => (
              <li key={c.name} className="flex justify-between gap-3"><span className={c.isBrand ? 'font-semibold text-fg' : 'text-fg-soft'}>{c.name}</span><span className="text-fg tabular">{pct(c.share)}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-8 px-6 py-7 sm:px-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-[16px] font-semibold text-fg">Most cited sources</h2>
          <ul className="grid gap-2 text-[13.5px]">
            {s.sources.map((src) => <li key={src.domain} className="flex justify-between gap-3"><span className="truncate font-mono text-[12.5px] text-fg-soft">{src.domain}</span><span className="text-fg tabular">{pct(src.share)}</span></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-[16px] font-semibold text-fg">Accuracy and work completed</h2>
          <p className="text-[13.5px] text-fg-soft">{s.accuracy.accurate} accurate · {s.accuracy.inaccurate} inaccurate · {s.accuracy.needsReview} awaiting review</p>
          {s.completedTasks.length > 0 ? (
            <ul className="mt-3 grid gap-1.5 text-[13.5px] text-fg-soft">{s.completedTasks.map((t) => <li key={t.title} className="flex gap-2"><span className="text-success" aria-hidden>✓</span>{t.title}</li>)}</ul>
          ) : <p className="mt-3 text-[13px] text-fg-faint">No tasks completed in this period.</p>}
        </div>
      </section>
      <footer className="border-t border-border px-6 py-5 text-[12px] text-fg-faint sm:px-10">
        Rates show 95% Wilson intervals. Visibility in answers is not the same as traffic or revenue.{branding?.hideSignal ? '' : ' Generated by Manifest Signal.'}
      </footer>
    </article>
  );
}
