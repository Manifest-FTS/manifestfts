import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import type { CheckResult } from '@/lib/db/schema';
import { cn } from '@/lib/cn';

const STATUS = {
  pass: { Icon: CircleCheck, label: 'Pass', cls: 'text-success' },
  warn: { Icon: TriangleAlert, label: 'Warning', cls: 'text-warning' },
  fail: { Icon: CircleX, label: 'Fail', cls: 'text-danger' },
  info: { Icon: Info, label: 'Info', cls: 'text-fg-faint' },
} as const;

const CATEGORY_LABEL: Record<CheckResult['category'], string> = {
  crawler: 'Crawler access',
  discovery: 'Discovery and indexing',
  content: 'Content and metadata',
  schema: 'Structured data',
  security: 'Delivery',
};

export interface CrawlerRow {
  agent: string;
  owner: string;
  purpose: string;
  kind: 'retrieval' | 'training';
  allowed: boolean;
  rule: string | null;
}

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone = score >= 80 ? 'var(--success)' : score >= 55 ? 'var(--warning)' : 'var(--danger)';
  const label = score >= 80 ? 'Strong' : score >= 55 ? 'Needs work' : 'At risk';
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`Readiness score ${score} out of 100, ${label.toLowerCase()}`}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-muted)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={tone} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <div className="text-center">
        <p className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-fg tabular">{score}</p>
        <p className="mt-1 text-[11px] font-medium text-fg-muted">{label}</p>
      </div>
    </div>
  );
}

export function StatusIcon({ status, className }: { status: CheckResult['status']; className?: string }) {
  const { Icon, label, cls } = STATUS[status];
  return <Icon className={cn('size-4 shrink-0', cls, className)} aria-label={label} role="img" />;
}

export function ChecksList({ results }: { results: CheckResult[] }) {
  const categories = (Object.keys(CATEGORY_LABEL) as CheckResult['category'][]).filter((c) => results.some((r) => r.category === c));
  return (
    <div className="grid gap-8">
      {categories.map((category) => (
        <section key={category} aria-labelledby={`cat-${category}`}>
          <h3 id={`cat-${category}`} className="text-[12.5px] font-semibold uppercase tracking-wider text-fg-faint">{CATEGORY_LABEL[category]}</h3>
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-panel">
            {results.filter((r) => r.category === category).map((r) => (
              <li key={r.id} className="flex gap-3 px-4 py-3.5">
                <StatusIcon status={r.status} className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-fg">{r.label}</p>
                  <p className="mt-0.5 break-words text-[13.5px] leading-relaxed text-fg-muted">{r.detail}</p>
                  {r.recommendation && <p className="mt-2 rounded-lg bg-bg-subtle px-3 py-2 text-[13px] leading-relaxed text-fg-soft">{r.recommendation}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function CrawlerTable({ crawlers }: { crawlers: CrawlerRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-panel">
      <table className="w-full min-w-[560px] text-[13.5px]">
        <caption className="sr-only">AI crawler access according to robots.txt</caption>
        <thead>
          <tr className="border-b border-border bg-bg-subtle text-left text-[12px] text-fg-muted">
            <th scope="col" className="px-4 py-2.5 font-medium">Crawler</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Purpose</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Access</th>
          </tr>
        </thead>
        <tbody>
          {crawlers.map((c) => (
            <tr key={c.agent} className="border-b border-border last:border-0">
              <th scope="row" className="px-4 py-2.5 text-left font-medium text-fg"><span className="font-mono text-[12.5px]">{c.agent}</span><span className="block text-[11.5px] font-normal text-fg-faint">{c.owner}</span></th>
              <td className="px-4 py-2.5 text-fg-muted">{c.purpose}</td>
              <td className="px-4 py-2.5 text-fg-muted">{c.kind === 'retrieval' ? 'Retrieval' : 'Training'}</td>
              <td className="px-4 py-2.5">
                <span className={cn('inline-flex items-center gap-1.5 font-medium', c.allowed ? 'text-success' : c.kind === 'retrieval' ? 'text-danger' : 'text-fg-muted')}>
                  {c.allowed ? <CircleCheck className="size-3.5" aria-hidden /> : c.kind === 'retrieval' ? <CircleX className="size-3.5" aria-hidden /> : <Info className="size-3.5" aria-hidden />}
                  {c.allowed ? 'Allowed' : 'Blocked'}
                </span>
                {c.rule && <span className="block font-mono text-[11px] text-fg-faint">{c.rule}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
