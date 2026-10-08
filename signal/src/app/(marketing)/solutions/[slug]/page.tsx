import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MessageSquareQuote } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { CtaBand } from '@/components/marketing/cta-band';
import { JsonLd } from '@/components/json-ld';
import { buttonClass } from '@/components/ui/button';
import { SOLUTIONS, SOLUTION_BY_SLUG } from '@/content/solutions';
import { pageMetadata, breadcrumbLd, softwareLd } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<'/solutions/[slug]'>) {
  const s = SOLUTION_BY_SLUG[(await params).slug];
  return s ? pageMetadata({ title: s.title, description: s.description, path: `/solutions/${s.slug}` }) : {};
}

export default async function SolutionPage({ params }: PageProps<'/solutions/[slug]'>) {
  const s = SOLUTION_BY_SLUG[(await params).slug];
  if (!s) notFound();
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions/agencies' }, { name: s.name, path: `/solutions/${s.slug}` }]), { ...softwareLd, audience: { '@type': 'BusinessAudience', name: s.name } }]} />
      <PageHero eyebrow={`For ${s.name.toLowerCase()}`} title={s.title} lede={s.lede}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className={buttonClass({ size: 'lg' })}>Start free trial <ArrowRight aria-hidden /></Link>
          <Link href="/tools/ai-readiness-checker" className={buttonClass({ size: 'lg', variant: 'secondary' })}>Run a free GEO audit</Link>
        </div>
      </PageHero>
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <section aria-labelledby="challenge">
          <h2 id="challenge" className="text-[24px] font-semibold tracking-[-0.03em] text-fg">The challenge</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">{s.challenge}</p>
          <h3 className="mt-8 text-[15px] font-semibold text-fg">Questions worth tracking</h3>
          <ul className="mt-3 grid gap-2">
            {s.prompts.map((p) => <li key={p} className="flex items-start gap-2.5 rounded-xl border border-border bg-panel px-4 py-3 text-[14px] text-fg-soft"><MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{p}</li>)}
          </ul>
        </section>
        <section aria-labelledby="how">
          <h2 id="how" className="text-[24px] font-semibold tracking-[-0.03em] text-fg">How Signal helps</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {s.how.map((h) => <li key={h.title} className="rounded-2xl border border-border bg-panel p-5 shadow-card"><h3 className="text-[15.5px] font-semibold text-fg">{h.title}</h3><p className="mt-1.5 text-[14px] leading-relaxed text-fg-muted">{h.body}</p></li>)}
          </ul>
          <h3 className="mt-8 text-[15px] font-semibold text-fg">Metrics that matter</h3>
          <ul className="mt-3 grid gap-2">{s.metrics.map((m) => <li key={m} className="flex gap-2 text-[14.5px] text-fg-soft"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{m}</li>)}</ul>
        </section>
      </div>
      <section aria-labelledby="other" className="container-page pb-16">
        <h2 id="other" className="text-[15px] font-semibold text-fg">Other solutions</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SOLUTIONS.filter((x) => x.slug !== s.slug).map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`} className="inline-block rounded-full border border-border bg-panel px-3.5 py-1.5 text-[13px] font-medium text-fg-soft hover:text-fg">{x.name}</Link></li>)}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
