import Link from 'next/link';
import { CircleCheck, CircleX, FileCode2, Info, ListTree, Map, TriangleAlert } from 'lucide-react';
import type { AuditDetails, AuditSubscores, CheckResult, CrawlerAccess } from '@/lib/db/schema';
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
  content: 'Content and citability',
  schema: 'Structured data',
  security: 'Delivery',
};

export const SUBSCORES: { key: keyof AuditSubscores; label: string; help: string }[] = [
  { key: 'citability', label: 'Citability', help: 'Self-contained, fact-rich passages an engine can quote.' },
  { key: 'crawlers', label: 'Crawlers', help: 'Retrieval crawlers can reach the page.' },
  { key: 'brand', label: 'Brand', help: 'Entity clarity: organization data, logo, profiles.' },
  { key: 'eeat', label: 'E-E-A-T', help: 'Authorship, dates, sources, and trust pages.' },
  { key: 'schema', label: 'Schema', help: 'Valid, relevant JSON-LD structured data.' },
  { key: 'platform', label: 'Platform', help: 'Indexability, speed, metadata, server rendering.' },
];

export const tone = (score: number) => (score >= 80 ? 'success' : score >= 55 ? 'warning' : 'danger');
const label = (score: number) => (score >= 80 ? 'Strong' : score >= 55 ? 'Needs work' : 'At risk');

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`Score ${score} out of 100, ${label(score).toLowerCase()}`}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-muted)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={`var(--${tone(score)})`} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <div className="text-center">
        <p className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-fg tabular">{score}</p>
        <p className="mt-1 text-[11px] font-medium text-fg-muted">{label(score)}</p>
      </div>
    </div>
  );
}

export function SubscoreGrid({ subscores }: { subscores: AuditSubscores }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {SUBSCORES.map(({ key, label: l, help }) => {
        const v = subscores[key];
        return (
          <li key={key} className="rounded-xl border border-border bg-panel p-4">
            <p className="text-[12.5px] font-medium text-fg-muted">{l}</p>
            <p className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.03em] text-fg tabular">{v}</p>
            <div className="mt-3 h-1.5 rounded-full bg-bg-muted" aria-hidden>
              <div className="h-full rounded-full" style={{ width: `${Math.max(3, v)}%`, background: `var(--${tone(v)})` }} />
            </div>
            <p className="mt-2 text-[11.5px] leading-snug text-fg-faint">{help}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function StatusIcon({ status, className }: { status: CheckResult['status']; className?: string }) {
  const { Icon, label: l, cls } = STATUS[status];
  return <Icon className={cn('size-4 shrink-0', cls, className)} aria-label={l} role="img" />;
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

const statusOf = (c: CrawlerAccess) => c.status ?? (c.allowed ? 'allowed' : 'blocked');
const CHIP = {
  allowed: 'border-success/30 bg-success-subtle text-success-on-subtle',
  partial: 'border-warning/35 bg-warning-subtle text-warning-on-subtle',
  blocked: 'border-danger/30 bg-danger-subtle text-danger-on-subtle',
} as const;
const KIND_LABEL = { retrieval: 'Live answers and citations', training: 'Model training', other: 'Other AI and search crawlers' } as const;

/** Crawler access as status chips grouped by purpose, with a detailed table on demand. */
export function CrawlerAccessView({ crawlers }: { crawlers: CrawlerAccess[] }) {
  const counts = { allowed: 0, partial: 0, blocked: 0 };
  for (const c of crawlers) counts[statusOf(c)]++;
  return (
    <div className="grid gap-5">
      <p className="text-[13px] text-fg-muted">{counts.allowed} allowed · {counts.partial} partial · {counts.blocked} blocked. “Partial” means this page is allowed but the crawler is blocked from some pages your sitemap lists.</p>
      {(['retrieval', 'training', 'other'] as const).map((kind) => {
        const items = crawlers.filter((c) => (c.kind ?? 'other') === kind);
        if (!items.length) return null;
        return (
          <div key={kind}>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-fg-faint">{KIND_LABEL[kind]}</p>
            <ul className="flex flex-wrap gap-1.5">
              {items.map((c) => {
                const s = statusOf(c);
                return (
                  <li key={c.agent} title={`${c.owner}: ${c.purpose}${c.rule ? ` · ${c.rule}` : ''}`} className={cn('rounded-full border px-2.5 py-1 font-mono text-[12px] font-medium', CHIP[s])}>
                    {c.agent.toLowerCase()}: {s}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <details className="group rounded-xl border border-border">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-[13px] font-medium text-fg-soft hover:text-fg [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Show crawler details</span><span className="hidden group-open:inline">Hide crawler details</span>
        </summary>
        <div className="overflow-x-auto border-t border-border">
          <table className="w-full min-w-[560px] text-[13px]">
            <caption className="sr-only">AI crawler access according to robots.txt</caption>
            <thead><tr className="bg-bg-subtle text-left text-[12px] text-fg-muted">
              <th scope="col" className="px-4 py-2 font-medium">Crawler</th><th scope="col" className="px-4 py-2 font-medium">Purpose</th><th scope="col" className="px-4 py-2 font-medium">Access</th><th scope="col" className="px-4 py-2 font-medium">Matching rule</th>
            </tr></thead>
            <tbody>
              {crawlers.map((c) => (
                <tr key={c.agent} className="border-t border-border">
                  <th scope="row" className="px-4 py-2 text-left font-normal"><span className="font-mono text-[12.5px] text-fg">{c.agent}</span><span className="block text-[11.5px] text-fg-faint">{c.owner}</span></th>
                  <td className="px-4 py-2 text-fg-muted">{c.purpose}</td>
                  <td className="px-4 py-2 font-medium capitalize text-fg">{statusOf(c)}</td>
                  <td className="px-4 py-2 font-mono text-[11.5px] text-fg-faint">{c.rule ?? 'No rule (default allow)'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

/** @deprecated kept for older call sites; prefer CrawlerAccessView. */
export const CrawlerTable = CrawlerAccessView;
export type CrawlerRow = CrawlerAccess;

const SEVERITY = { high: 'text-danger', medium: 'text-warning', low: 'text-fg-muted' } as const;

export function IssueList({ issues }: { issues: AuditDetails['issues'] }) {
  if (!issues.length) return <p className="text-[14px] text-fg-muted">No priority issues. Recheck after major content or template changes.</p>;
  return (
    <ul className="grid gap-2.5">
      {issues.slice(0, 8).map((issue, i) => (
        <li key={i} className="rounded-xl border border-border bg-panel p-4">
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className={cn('text-[12px] font-bold uppercase tracking-wider', SEVERITY[issue.severity])}>{issue.severity}</span>
            <span className="text-[14.5px] font-medium text-fg">{issue.title}</span>
          </p>
          <p className="mt-1 break-words text-[13px] leading-relaxed text-fg-muted">{issue.detail}</p>
          {issue.fix && <p className="mt-2 text-[13px] leading-relaxed text-fg-soft">{issue.fix}</p>}
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border border-border bg-panel p-5 shadow-card', className)}>
      <h3 className="flex items-center gap-2 text-[15px] font-semibold text-fg [&_svg]:size-4 [&_svg]:text-accent">{icon}{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Full GEO report used by the public checker and the in-app readiness page. */
export function GeoReport({ score, subscores, crawlers, details, results, header }: { score: number; subscores: AuditSubscores; crawlers: CrawlerAccess[]; details: AuditDetails; results: CheckResult[]; header?: React.ReactNode }) {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-border bg-panel p-6 shadow-card" aria-labelledby="geo-score">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={score} />
          <div className="min-w-0 flex-1">
            <h2 id="geo-score" className="text-[20px] font-semibold tracking-[-0.02em] text-fg">Composite GEO score</h2>
            <p className="mt-1 text-[13.5px] text-fg-muted">Out of 100, weighted across six dimensions. Higher is better for AI visibility.</p>
            {header}
          </div>
        </div>
        <div className="mt-6"><SubscoreGrid subscores={subscores} /></div>
      </section>

      <Panel title="AI crawler access" icon={<ListTree />}><CrawlerAccessView crawlers={crawlers} /></Panel>
      <Panel title="Priority issues" icon={<TriangleAlert />}><IssueList issues={details.issues} /></Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="llms.txt" icon={<FileCode2 />}>
          <p className="text-[14px] text-fg-soft">Present: <strong className="font-semibold text-fg">{details.llms.present ? 'Yes' : 'No'}</strong>{details.llms.present && ` · ${details.llms.bytes.toLocaleString()} characters`}</p>
          {!details.llms.present && <Link href="/tools/llms-txt-generator" className="mt-2 inline-block text-[13px] font-medium text-accent hover:underline">Generate an llms.txt</Link>}
        </Panel>
        <Panel title="XML sitemap" icon={<Map />}>
          <p className="text-[14px] text-fg-soft">{details.sitemap.present ? <>Found <strong className="font-semibold text-fg">{details.sitemap.urls.toLocaleString()}</strong> entries{details.sitemap.declared ? ', declared in robots.txt' : ', not declared in robots.txt'}.</> : 'No valid sitemap found.'}</p>
          <p className="mt-1 break-all font-mono text-[11.5px] text-fg-faint">{details.sitemap.url}</p>
        </Panel>
        <Panel title="Schemas detected" icon={<FileCode2 />}>
          {details.schemas.length ? (
            <ul className="flex flex-wrap gap-1.5">{details.schemas.map((s) => <li key={s} className="rounded-md border border-border bg-bg-subtle px-2 py-0.5 font-mono text-[12px] text-fg-soft">{s}</li>)}</ul>
          ) : <p className="text-[14px] text-fg-muted">None detected. <Link href="/tools/schema-generator" className="font-medium text-accent hover:underline">Generate schema</Link></p>}
        </Panel>
        <Panel title="Citability recommendations" icon={<Info />}>
          <ul className="grid list-disc gap-1.5 pl-4 text-[13.5px] leading-relaxed text-fg-soft marker:text-fg-faint">
            {details.citability.recommendations.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </Panel>
      </div>

      <section aria-labelledby="all-checks">
        <h2 id="all-checks" className="mb-4 text-[18px] font-semibold text-fg">All checks</h2>
        <ChecksList results={results} />
      </section>
    </div>
  );
}
