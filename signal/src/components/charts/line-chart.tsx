'use client';
import * as React from 'react';
import { Table2 } from 'lucide-react';
import { niceStep } from '@/lib/chart-scale';

export interface Series {
  id: string;
  label: string;
  /** Categorical slot (1-based) so color follows the entity. */
  slot: number;
  values: (number | null)[];
}

interface Props {
  title: string;
  labels: string[];
  series: Series[];
  format?: (v: number) => string;
  /** Serializable alternative to `format` for use from server components. */
  valueFormat?: 'percent' | 'count';
  max?: number;
  height?: number;
  description?: string;
}

const PAD = { top: 12, right: 12, bottom: 26, left: 40 };

/**
 * Multi-series line chart: 2px lines, hairline grid, crosshair + one tooltip listing every
 * series, keyboard-navigable points, a legend for 2+ series, and a table view.
 */
const FORMATS = { percent: (v: number) => `${Math.round(v * 100)}%`, count: (v: number) => Math.round(v).toLocaleString() };

export function LineChart({ title, labels, series, format: formatProp, valueFormat = 'percent', max, height = 240, description }: Props) {
  const format = formatProp ?? FORMATS[valueFormat];
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(640);
  const [active, setActive] = React.useState<number | null>(null);
  const [showTable, setShowTable] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry!.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const all = series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const step = max !== undefined ? max / 4 : niceStep(Math.max(...all, 0.0001) / 4, valueFormat === 'count');
  const top = max ?? step * 4;
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (labels.length <= 1 ? innerW / 2 : (i / (labels.length - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / top) * innerH;
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);
  const labelEvery = Math.ceil(labels.length / Math.max(2, Math.floor(innerW / 70)));

  const pathFor = (values: (number | null)[]) => {
    let d = '';
    let pen = false;
    values.forEach((v, i) => {
      if (v === null) { pen = false; return; }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const i = Math.round(((px - PAD.left) / innerW) * (labels.length - 1));
    setActive(Math.max(0, Math.min(labels.length - 1, i)));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setActive((a) => Math.min(labels.length - 1, (a ?? -1) + 1));
    else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? labels.length) - 1));
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const tooltipLeft = active !== null ? Math.min(Math.max(x(active) / width, 0.12), 0.88) * 100 : 0;

  return (
    <figure className="m-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {series.length > 1 ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5" aria-label="Legend">
            {series.map((s) => (
              <li key={s.id} className="flex items-center gap-1.5 text-[12.5px] text-fg-muted">
                <span className="h-0.5 w-3.5 rounded-full" style={{ background: `var(--series-${s.slot})` }} aria-hidden />
                {s.label}
              </li>
            ))}
          </ul>
        ) : <span />}
        <button type="button" onClick={() => setShowTable((v) => !v)} aria-pressed={showTable} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-fg-muted hover:bg-bg-muted hover:text-fg">
          <Table2 className="size-3.5" aria-hidden />{showTable ? 'Show chart' : 'Show table'}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-[320px] overflow-auto rounded-lg border border-border">
          <table className="w-full text-[13px] tabular">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-bg-subtle">
              <tr><th scope="col" className="px-3 py-2 text-left font-medium text-fg-muted">Period</th>{series.map((s) => <th key={s.id} scope="col" className="px-3 py-2 text-right font-medium text-fg-muted">{s.label}</th>)}</tr>
            </thead>
            <tbody>
              {labels.map((l, i) => (
                <tr key={l} className="border-t border-border">
                  <th scope="row" className="px-3 py-1.5 text-left font-normal text-fg-soft">{l}</th>
                  {series.map((s) => <td key={s.id} className="px-3 py-1.5 text-right text-fg">{s.values[i] === null ? '—' : format(s.values[i]!)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={ref} className="relative">
          <svg
            width="100%"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${title}. ${description ?? ''} Use left and right arrow keys to read values.`}
            tabIndex={0}
            onKeyDown={onKey}
            onPointerMove={onMove}
            onPointerLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            className="block touch-pan-y overflow-visible rounded-md focus-visible:outline-2 focus-visible:outline-accent"
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? 'var(--chart-axis)' : 'var(--chart-grid)'} strokeWidth="1" />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-fg-faint text-[11px] tabular">{format(t)}</text>
              </g>
            ))}
            {labels.map((l, i) => (labels.length - 1 - i) % labelEvery === 0 && (
              <text key={l} x={x(i)} y={height - 6} textAnchor="middle" className="fill-fg-faint text-[11px]">{l}</text>
            ))}
            {series.length === 1 && (
              <path d={`${pathFor(series[0]!.values)}L${x(labels.length - 1)},${y(0)}L${x(series[0]!.values.findIndex((v) => v !== null))},${y(0)}Z`} fill={`var(--series-${series[0]!.slot})`} opacity="0.1" />
            )}
            {series.map((s) => (
              <path key={s.id} d={pathFor(s.values)} fill="none" stroke={`var(--series-${s.slot})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chart-mark" />
            ))}
            {series.map((s) => {
              const last = s.values.length - 1 - [...s.values].reverse().findIndex((v) => v !== null);
              const v = s.values[last];
              return v === null || v === undefined ? null : <circle key={s.id} cx={x(last)} cy={y(v)} r="4" fill={`var(--series-${s.slot})`} stroke="var(--chart-surface)" strokeWidth="2" />;
            })}
            {active !== null && (
              <g pointerEvents="none">
                <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--fg-faint)" strokeWidth="1" />
                {series.map((s) => s.values[active] !== null && (
                  <circle key={s.id} cx={x(active)} cy={y(s.values[active]!)} r="4.5" fill={`var(--series-${s.slot})`} stroke="var(--chart-surface)" strokeWidth="2" />
                ))}
              </g>
            )}
          </svg>
          {active !== null && (
            <div className="pointer-events-none absolute top-0 z-10 min-w-40 -translate-x-1/2 rounded-lg border border-border bg-panel-raised px-3 py-2 shadow-raised" style={{ left: `${tooltipLeft}%` }} role="status">
              <p className="text-[11.5px] font-medium text-fg-muted">{labels[active]}</p>
              <ul className="mt-1 grid gap-0.5">
                {series.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-4 text-[12.5px]">
                    <span className="flex items-center gap-1.5 text-fg-muted"><span className="h-0.5 w-3 rounded-full" style={{ background: `var(--series-${s.slot})` }} aria-hidden />{s.label}</span>
                    <span className="font-semibold text-fg tabular">{s.values[active] === null ? '—' : format(s.values[active]!)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {description && <figcaption className="mt-2 text-[12px] text-fg-faint">{description}</figcaption>}
    </figure>
  );
}
