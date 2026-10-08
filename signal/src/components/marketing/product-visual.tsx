import { BarChart3, CheckCircle2, FileSearch, Gauge, Layers, ListChecks, MessageSquareQuote, Quote, Search, ShieldCheck } from 'lucide-react';
import { SignalMark } from '@/components/brand/logo';

// Static, server-rendered product preview for the home page. Values are illustrative and the
// visual is labeled as sample data, per the Manifest style guide.

const TREND = [22, 24, 23, 27, 29, 28, 33, 35, 34, 38, 41, 42];
const TREND_B = [31, 30, 32, 31, 33, 34, 33, 35, 34, 36, 35, 36];

function path(values: number[], w: number, h: number, max = 50) {
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / (values.length - 1)) * w).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`).join(' ');
}

export function ProductVisual() {
  const w = 520;
  const h = 150;
  return (
    <div className="relative" aria-label="Illustrative Manifest Signal dashboard with sample data" role="img">
      <div className="overflow-hidden rounded-2xl border border-border bg-panel shadow-overlay">
        {/* Window chrome */}
        <div className="flex h-10 items-center gap-2 border-b border-border bg-bg-subtle px-4">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 hidden rounded-md border border-border bg-panel px-3 py-0.5 font-mono text-[11px] text-fg-faint sm:block">signal.manifestfts.com/app/northwind/overview</span>
          <span className="ml-auto rounded-full bg-warning-subtle px-2 py-0.5 text-[10.5px] font-semibold text-warning-on-subtle">Sample data</span>
        </div>
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-48 shrink-0 border-r border-border bg-bg-subtle p-3 md:block">
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
              <SignalMark className="size-6" />
              <span className="text-[12.5px] font-semibold text-fg">Northwind Health</span>
            </div>
            <div className="mt-4 grid gap-0.5 text-[12px] text-fg-muted">
              {[
                [Gauge, 'Overview', true],
                [MessageSquareQuote, 'Prompts', false],
                [Layers, 'Sources', false],
                [BarChart3, 'Competitors', false],
                [ShieldCheck, 'Accuracy', false],
                [FileSearch, 'Readiness', false],
                [ListChecks, 'Tasks', false],
              ].map(([Icon, label, active]) => {
                const I = Icon as typeof Gauge;
                return (
                  <div key={label as string} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${active ? 'bg-panel font-medium text-fg shadow-card' : ''}`}>
                    <I className="size-3.5" aria-hidden />
                    {label as string}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Main */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-fg">Overview</p>
                <p className="text-[11px] text-fg-faint">Last 30 days · 4 engines · 240 answers</p>
              </div>
              <div className="hidden items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-[11px] text-fg-muted sm:flex">
                <Search className="size-3" aria-hidden /> Search prompts
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {[
                ['Mention rate', '42%', '±6.2 pts', '+9 pts'],
                ['Citation rate', '18%', '±4.8 pts', '+5 pts'],
                ['Share of voice', '31%', '±4.2 pts', '+4 pts'],
                ['Accuracy', '88%', '22 reviewed', '—'],
              ].map(([label, value, ci, delta]) => (
                <div key={label} className="rounded-xl border border-border p-3">
                  <p className="text-[10.5px] font-medium text-fg-muted">{label}</p>
                  <p className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-fg">{value}</p>
                  <p className="mt-0.5 flex items-center justify-between text-[10px] text-fg-faint">
                    <span>{ci}</span>
                    {delta !== '—' && <span className="font-medium text-success">{delta}</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11.5px] font-semibold text-fg">Mention rate by week</p>
                <div className="flex items-center gap-3 text-[10.5px] text-fg-muted">
                  <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-[var(--series-1)]" />Northwind</span>
                  <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-[var(--series-2)]" />Contoso Care</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${w} ${h + 8}`} className="mt-2 h-auto w-full" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <line key={i} x1="0" x2={w} y1={4 + (i * h) / 3} y2={4 + (i * h) / 3} stroke="var(--chart-grid)" strokeWidth="1" />
                ))}
                <g transform="translate(0,4)">
                  <path d={`${path(TREND, w, h)} L${w},${h} L0,${h} Z`} fill="var(--series-1)" opacity="0.09" />
                  <path d={path(TREND_B, w, h)} fill="none" stroke="var(--series-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={path(TREND, w, h)} fill="none" stroke="var(--series-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={w} cy={h - (42 / 50) * h} r="4" fill="var(--series-1)" stroke="var(--panel)" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating answer inspector */}
      <div className="absolute -bottom-10 -left-3 hidden w-[330px] rounded-2xl border border-border bg-panel-raised p-4 shadow-overlay sm:block lg:-left-10">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-fg"><Quote className="size-3.5 text-accent" aria-hidden />Perplexity answer</p>
          <span className="text-[10.5px] text-fg-faint">Position 1 of 4</span>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-fg-soft">
          For telehealth scheduling,{' '}
          <mark className="rounded bg-accent-subtle px-1 font-semibold text-accent-on-subtle">Northwind Health</mark>{' '}
          is frequently recommended for its onboarding support, while{' '}
          <mark className="rounded bg-bg-muted px-1 text-fg">Contoso Care</mark> suits larger systems…
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['northwind.health', 'g2.com', 'reddit.com'].map((d, i) => (
            <span key={d} className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] ${i === 0 ? 'border-success/30 bg-success-subtle text-success-on-subtle' : 'border-border text-fg-muted'}`}>{d}</span>
          ))}
        </div>
      </div>

      {/* Floating task */}
      <div className="absolute -right-3 -top-6 hidden w-[260px] rounded-2xl border border-border bg-panel-raised p-3.5 shadow-overlay lg:-right-8 lg:block">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-success"><CheckCircle2 className="size-3.5" aria-hidden />Task closed by audit</p>
        <p className="mt-1.5 text-[12px] font-medium leading-snug text-fg">Allow OAI-SearchBot on /services</p>
        <p className="mt-1 text-[10.5px] text-fg-faint">Evidence · Readiness check, Oct 3</p>
      </div>
    </div>
  );
}
