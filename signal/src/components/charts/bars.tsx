import { cn } from '@/lib/cn';
import { Tooltip } from '@/components/ui/tooltip';

/** Horizontal bar list. Labels and values wear text tokens; bars carry the color. */
export function BarList({ items, format = (v) => `${Math.round(v * 100)}%`, max, className }: { items: { id: string; label: React.ReactNode; value: number; slot?: number; detail?: string; href?: string }[]; format?: (v: number) => string; max?: number; className?: string }) {
  const top = max ?? Math.max(...items.map((i) => i.value), 0.0001);
  return (
    <ul className={cn('grid gap-3', className)}>
      {items.map((item) => (
        <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5">
          <span className="truncate text-[13.5px] text-fg-soft">{item.label}</span>
          <span className="text-right text-[13px] font-semibold text-fg tabular">{format(item.value)}{item.detail && <span className="ml-1.5 font-normal text-fg-faint">{item.detail}</span>}</span>
          <div className="col-span-2 h-2 rounded-full bg-bg-muted" aria-hidden>
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(1.5, (item.value / top) * 100)}%`, background: item.slot ? `var(--series-${item.slot})` : 'var(--series-1)' }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Proportion with its interval: dot = point estimate, band = 95% interval. */
export function IntervalBar({ value, low, high, slot = 1, label }: { value: number | null; low: number | null; high: number | null; slot?: number; label: string }) {
  if (value === null || low === null || high === null) return <div className="h-2 rounded-full bg-bg-muted" aria-label={`${label}: no data`} />;
  return (
    <Tooltip content={`${Math.round(value * 100)}% (95% interval ${Math.round(low * 100)}–${Math.round(high * 100)}%)`}>
      <div className="relative h-2 rounded-full bg-bg-muted" role="img" aria-label={`${label}: ${Math.round(value * 100)}%, 95% interval ${Math.round(low * 100)} to ${Math.round(high * 100)} percent`} tabIndex={0}>
        <div className="absolute inset-y-0 rounded-full opacity-35" style={{ left: `${low * 100}%`, width: `${Math.max(1, (high - low) * 100)}%`, background: `var(--series-${slot})` }} />
        <div className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--chart-surface)]" style={{ left: `${value * 100}%`, background: `var(--series-${slot})` }} />
      </div>
    </Tooltip>
  );
}

export function Sparkline({ values, slot = 1, className }: { values: (number | null)[]; slot?: number; className?: string }) {
  const nums = values.filter((v): v is number => v !== null);
  if (nums.length < 2) return null;
  const max = Math.max(...nums, 0.0001);
  const min = Math.min(...nums);
  const w = 96;
  const h = 28;
  const pts = values.map((v, i) => (v === null ? null : [(i / (values.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)] as const)).filter(Boolean) as (readonly [number, number])[];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn('h-7 w-24', className)} aria-hidden>
      <path d={pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')} fill="none" stroke="var(--series-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.at(-1)![0]} cy={pts.at(-1)![1]} r="2.5" fill={`var(--series-${slot})`} />
    </svg>
  );
}
