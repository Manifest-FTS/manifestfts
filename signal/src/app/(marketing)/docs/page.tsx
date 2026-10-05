import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { JsonLd } from '@/components/json-ld';
import { DOC_CATEGORIES, docs } from '@/content/docs';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Documentation',
  description: 'Guides and reference for Manifest Signal: setup, prompts, answer engines, metric definitions, readiness checks, accuracy monitoring, billing, and security.',
  path: '/docs',
});

export default function DocsIndex() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Docs', path: '/docs' }]),
          { '@type': 'CollectionPage', name: 'Manifest Signal documentation', url: absoluteUrl('/docs'), hasPart: docs.map((d) => ({ '@type': 'TechArticle', headline: d.title, url: absoluteUrl(`/docs/${d.slug}`) })) },
        ]}
      />
      <PageHero eyebrow="Documentation" title="Learn how Signal measures and improves AI visibility" lede="Practical guides for setting up a workspace, reading the numbers correctly, and turning observations into improvements." />
      <div className="container-page py-16">
        <Link href="/docs/getting-started" className="group flex flex-col gap-4 rounded-2xl border border-border bg-panel p-6 shadow-card transition hover:shadow-raised sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-subtle text-accent"><BookOpen className="size-5" aria-hidden /></span>
            <div>
              <h2 className="text-[18px] font-semibold text-fg">New to Signal? Start here</h2>
              <p className="mt-1 text-[15px] text-fg-muted">Set up a workspace and read your first baseline in about ten minutes.</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[14px] font-semibold text-accent">Getting started <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
        </Link>
        <div className="mt-14 grid gap-12">
          {DOC_CATEGORIES.map((category) => {
            const items = docs.filter((d) => d.category === category);
            if (!items.length) return null;
            return (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <h2 id={`cat-${category}`} className="text-[13px] font-semibold uppercase tracking-wider text-fg-faint">{category}</h2>
                <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((doc) => (
                    <li key={doc.slug}>
                      <Link href={`/docs/${doc.slug}`} className="flex h-full flex-col rounded-xl border border-border bg-panel p-5 transition hover:border-border-strong/60 hover:shadow-card">
                        <h3 className="text-[15.5px] font-semibold text-fg">{doc.title}</h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-fg-muted">{doc.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
