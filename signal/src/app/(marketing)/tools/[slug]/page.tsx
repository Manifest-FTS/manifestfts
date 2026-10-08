import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { Faq } from '@/components/marketing/faq';
import { JsonLd } from '@/components/json-ld';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import { EmbedCode } from '@/components/tools/embed-code';
import { buttonClass } from '@/components/ui/button';
import { TOOLS, TOOL_BY_SLUG } from '@/content/tools';
import { pageMetadata, breadcrumbLd, organizationLd } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<'/tools/[slug]'>) {
  const tool = TOOL_BY_SLUG[(await params).slug];
  return tool ? pageMetadata({ title: tool.title, description: tool.description, path: `/tools/${tool.slug}` }) : {};
}

export default async function ToolPage({ params }: PageProps<'/tools/[slug]'>) {
  const tool = TOOL_BY_SLUG[(await params).slug];
  if (!tool) notFound();
  const related = TOOLS.filter((t) => t.slug !== tool.slug && (t.category === tool.category || t.component === 'geo-audit')).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          { '@type': 'WebApplication', name: tool.name, description: tool.description, url: absoluteUrl(`/tools/${tool.slug}`), applicationCategory: 'BusinessApplication', operatingSystem: 'Web', isAccessibleForFree: true, offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: organizationLd },
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Free tools', path: '/tools' }, { name: tool.name, path: `/tools/${tool.slug}` }]),
          { '@type': 'FAQPage', mainEntity: tool.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
          { '@type': 'HowTo', name: `How to use the ${tool.name}`, step: tool.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s, text: s })) },
        ]}
      />
      <PageHero eyebrow="Free tool" title={tool.title.split(':')[0]!} lede={tool.lede}>
        <nav aria-label="Breadcrumb" className="mt-5 text-[13px] text-fg-muted">
          <Link href="/tools" className="hover:text-fg">All free tools</Link> <span aria-hidden>/</span> <span className="text-fg-faint">{tool.category}</span>
        </nav>
        <div className="mt-10 max-w-5xl"><ToolRenderer component={tool.component} engine={tool.engine} /></div>
      </PageHero>

      <div className="container-page grid gap-6 py-16 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-panel p-7" aria-labelledby="measures">
          <h2 id="measures" className="text-[22px] font-semibold tracking-[-0.02em] text-fg">What this tool {tool.category === 'Generators' ? 'creates' : 'measures'}</h2>
          <ul className="mt-4 grid list-disc gap-2 pl-5 text-[15px] text-fg-soft marker:text-fg-faint">{tool.measures.map((m) => <li key={m}>{m}</li>)}</ul>
        </section>
        <section className="rounded-2xl border border-border bg-panel p-7" aria-labelledby="how">
          <h2 id="how" className="text-[22px] font-semibold tracking-[-0.02em] text-fg">How it works</h2>
          <ol className="mt-4 grid list-decimal gap-2 pl-5 text-[15px] text-fg-soft marker:text-fg-faint">{tool.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        </section>
        <section className="rounded-2xl border border-border bg-panel p-7" aria-labelledby="why">
          <h2 id="why" className="text-[22px] font-semibold tracking-[-0.02em] text-fg">Why it matters for AI search</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-soft">{tool.why}</p>
        </section>
        <section className="rounded-2xl border border-border bg-panel p-7" aria-labelledby="beyond">
          <h2 id="beyond" className="text-[22px] font-semibold tracking-[-0.02em] text-fg">Beyond the free tool</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-soft">Signal turns these findings into ongoing measurement: scheduled answer tracking across engines, evidence-linked tasks, and re-audits that close tasks automatically. Manifest FTS can also ship the fixes for you.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/signup" className={buttonClass({ size: 'sm' })}>Start free trial <ArrowRight aria-hidden /></Link>
            <Link href="/contact?topic=services" className={buttonClass({ size: 'sm', variant: 'secondary' })}><CalendarCheck aria-hidden />Book a strategy call</Link>
          </div>
        </section>
      </div>

      {tool.embeddable && <div className="container-page pb-16"><EmbedCode slug={tool.slug} name={tool.name} siteUrl={site.url} /></div>}

      <section aria-labelledby="tool-faq" className="border-t border-border bg-bg-subtle py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <h2 id="tool-faq" className="text-[28px] font-semibold tracking-[-0.03em] text-fg">Frequently asked questions</h2>
          <Faq items={tool.faq} />
        </div>
      </section>

      <section aria-labelledby="related" className="container-page py-16">
        <h2 id="related" className="text-[22px] font-semibold tracking-[-0.02em] text-fg">Related free tools</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((t) => (
            <li key={t.slug}>
              <Link href={`/tools/${t.slug}`} className="group flex h-full flex-col rounded-xl border border-border bg-panel p-4 transition hover:border-border-strong/60 hover:shadow-card">
                <span className="text-[14.5px] font-semibold text-fg group-hover:text-accent">{t.name}</span>
                <span className="mt-1 text-[13px] leading-relaxed text-fg-muted">{t.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/tools" className="mt-6 inline-flex items-center gap-1 text-[14px] font-semibold text-accent hover:underline">All free tools <ArrowRight className="size-4" aria-hidden /></Link>
      </section>
    </>
  );
}
