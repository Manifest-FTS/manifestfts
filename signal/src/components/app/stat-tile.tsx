import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { Rate } from '@/lib/metrics';
import { marginPts } from '@/lib/metrics';
import { Tooltip } from '@/components/ui/tooltip';
import { Sparkline } from '@/components/charts/bars';
import { pct } from '@/lib/format';
import { cn } from '@/lib/cn';

interface Props {
  label: string;
  rate: Rate;
  help: string;
  change?: { delta: number; meaningful: boolean; hasPrev: boolean };
  trend?: (number | null)[];
  emptyLabel?: string;
}

export function StatTile({ label, rate, help, change, trend, emptyLabel = 'No data in period' }: Props) {
  const margin = marginPts(rate);
  const delta = change ? Math.round(change.delta * 1000) / 10 : 0;
  return (
    <div className="flex flex-col rounded-panel border border-border bg-panel p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <Tooltip content={help}>
          <p tabIndex={0} className="cursor-help text-[13px] font-medium text-fg-muted decoration-dotted underline-offset-4 hover:underline">{label}</p>
        </Tooltip>
        {trend && <Sparkline values={trend} />}
      </div>
      {rate.value === null ? (
        <p className="mt-3 text-[14px] text-fg-faint">{emptyLabel}</p>
      ) : (
        <>
          <p className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.04em] text-fg">{pct(rate.value)}</p>
          <p className="mt-2 text-[12px] text-fg-faint tabular">±{margin} pts · n={rate.n.toLocaleString()}</p>
        </>
      )}
      {change && change.hasPrev && rate.value !== null && (
        <div className="mt-auto pt-4">
          <p className={cn('inline-flex items-center gap-1 text-[12.5px] font-medium', !change.meaningful ? 'text-fg-muted' : delta > 0 ? 'text-success' : 'text-danger')}>
            {delta > 0 ? <ArrowUpRight className="size-3.5" aria-hidden /> : delta < 0 ? <ArrowDownRight className="size-3.5" aria-hidden /> : <Minus className="size-3.5" aria-hidden />}
            {delta > 0 ? '+' : ''}{delta} pts vs previous period
          </p>
          <p className="text-[11.5px] text-fg-faint">{change.meaningful ? 'Intervals separate: meaningful change' : 'Within normal variation'}</p>
        </div>
      )}
    </div>
  );
}
