import Link from 'next/link';
import { Check, Eye, FileSearch, Layers, ListChecks, MessageSquareQuote, MousePointerClick, PenLine, PieChart, Plug, ShieldCheck, Users } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { CtaBand } from '@/components/marketing/cta-band';
import { JsonLd } from '@/components/json-ld';
import { buttonClass } from '@/components/ui/button';
import { FEATURES } from '@/content/marketing';
import { pageMetadata, breadcrumbLd, softwareLd } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Features',
  description: 'Visibility tracking, answer inspection, source intelligence, accuracy monitoring, readiness audits, evidence-linked tasks, and stakeholder reports for AI search.',
  path: '/features',
});

const ICONS: Record<string, typeof Eye> = { visibility: Eye, answers: MessageSquareQuote, sources: Layers, accuracy: ShieldCheck, readiness: FileSearch, tasks: ListChecks, traffic: MousePointerClick, content: PenLine, integrations: Plug, reports: PieChart, team: Users };

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={[{ ...softwareLd, featureList: FEATURES.map((f) => f.title) }, breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Features', path: '/features' }])]} />
      <PageHero
        eyebrow="Product"
        title="One loop: observe, diagnose, act, measure."
        lede="Signal brings together the measurements, evidence, and workflow a team needs to improve how answer engines represent its organization, without overstating what the data shows."
      >
        <nav aria-label="Features on this page" className="mt-10 flex flex-wrap gap-2">
          {FEATURES.map((f) => (
            <a key={f.id} href={`#${f.id}`} className="rounded-full border border-border bg-panel px-3.5 py-1.5 text-[13px] font-medium text-fg-soft transition hover:border-border-strong/60 hover:text-fg">{f.title}</a>
          ))}
        </nav>
      </PageHero>
      <div className="container-page divide-y divide-border">
        {FEATURES.map((f, i) => {
          const Icon = ICONS[f.id] ?? Eye;
          return (
            <section key={f.id} id={f.id} aria-labelledby={`${f.id}-title`} className="grid scroll-mt-20 gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <div>
                <span className="grid size-11 place-items-center rounded-xl bg-accent-subtle text-accent"><Icon className="size-5" aria-hidden /></span>
                <p className="mt-6 font-mono text-[12px] font-semibold text-fg-faint">{String(i + 1).padStart(2, '0')}</p>
                <h2 id={`${f.id}-title`} className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-fg sm:text-[32px]">{f.title}</h2>
                <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-fg-muted">{f.summary}</p>
              </div>
              <ul className="grid content-start gap-3">
                {f.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-panel px-5 py-4 text-[15px] text-fg-soft shadow-card">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <div className="container-page pb-20 text-center">
        <p className="text-[15px] text-fg-muted">Want the definitions behind every number?</p>
        <Link href="/docs/metrics" className={buttonClass({ variant: 'secondary', className: 'mt-4' })}>Read the metric definitions</Link>
      </div>
      <CtaBand />
    </>
  );
}
