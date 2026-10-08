import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { DOC_BY_SLUG, DOC_CATEGORIES, docs } from '@/content/docs';
import { Markdown, outline, plainText } from '@/lib/markdown';
import { pageMetadata, breadcrumbLd, organizationLd } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';
import { formatDate } from '@/lib/format';

export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<'/docs/[slug]'>) {
  const doc = DOC_BY_SLUG[(await params).slug];
  if (!doc) return {};
  return pageMetadata({ title: doc.title, description: doc.description, path: `/docs/${doc.slug}`, type: 'article', modifiedTime: doc.updated });
}

export default async function DocPage({ params }: PageProps<'/docs/[slug]'>) {
  const { slug } = await params;
  const doc = DOC_BY_SLUG[slug];
  if (!doc) notFound();
  const toc = outline(doc.body);
  const index = docs.indexOf(doc);
  const prev = docs[index - 1];
  const next = docs[index + 1];
  const isGlossary = slug === 'glossary';

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Docs', path: '/docs' }, { name: doc.title, path: `/docs/${doc.slug}` }]),
          {
            '@type': 'TechArticle',
            headline: doc.title,
            description: doc.description,
            url: absoluteUrl(`/docs/${doc.slug}`),
            dateModified: doc.updated,
            author: organizationLd,
            publisher: organizationLd,
            about: { '@type': 'SoftwareApplication', name: site.name },
          },
          ...(isGlossary
            ? [{
                '@type': 'DefinedTermSet',
                name: 'AI search glossary',
                url: absoluteUrl('/docs/glossary'),
                hasDefinedTerm: [...doc.body.matchAll(/^## (.+)\n\n([^\n]+)/gm)].map((m) => ({ '@type': 'DefinedTerm', name: m[1], description: plainText(m[2]!) })),
              }]
            : []),
        ]}
      />
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[220px_minmax(0,1fr)_200px] lg:gap-12 lg:py-14">
        <aside className="hidden lg:block" aria-label="Documentation">
          <nav className="sticky top-24 grid gap-6 text-[13.5px]">
            {DOC_CATEGORIES.map((c) => (
              <div key={c}>
                <p className="font-semibold text-fg">{c}</p>
                <ul className="mt-2 grid gap-0.5 border-l border-border">
                  {docs.filter((d) => d.category === c).map((d) => (
                    <li key={d.slug}>
                      <Link href={`/docs/${d.slug}`} aria-current={d.slug === slug ? 'page' : undefined}
                        className={`-ml-px block border-l py-1.5 pl-3 leading-snug transition-colors ${d.slug === slug ? 'border-accent font-medium text-accent' : 'border-transparent text-fg-muted hover:border-border-strong hover:text-fg'}`}>
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-[13px] text-fg-muted">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/docs" className="hover:text-fg">Docs</Link></li>
              <li aria-hidden>/</li>
              <li className="text-fg-faint">{doc.category}</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-0.035em] text-fg sm:text-[40px]">{doc.title}</h1>
          <p className="mt-4 text-[18px] leading-relaxed text-fg-muted">{doc.description}</p>
          <p className="mt-4 text-[13px] text-fg-faint">Updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time></p>
          <div className="prose-signal mt-10 max-w-[72ch]">
            <Markdown source={doc.body} />
          </div>
          <nav aria-label="Previous and next" className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/docs/${prev.slug}`} className="group rounded-xl border border-border p-4 transition hover:border-border-strong/60">
                <span className="flex items-center gap-1 text-[12.5px] text-fg-muted"><ArrowLeft className="size-3.5" aria-hidden />Previous</span>
                <span className="mt-1 block text-[14.5px] font-medium text-fg">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/docs/${next.slug}`} className="group rounded-xl border border-border p-4 text-right transition hover:border-border-strong/60">
                <span className="flex items-center justify-end gap-1 text-[12.5px] text-fg-muted">Next<ArrowRight className="size-3.5" aria-hidden /></span>
                <span className="mt-1 block text-[14.5px] font-medium text-fg">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>

        {toc.length > 1 && (
          <aside className="hidden lg:block" aria-label="On this page">
            <div className="sticky top-24">
              <p className="text-[12.5px] font-semibold text-fg">On this page</p>
              <ul className="mt-3 grid gap-2 text-[13px]">
                {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-fg-muted hover:text-fg">{h.text}</a></li>)}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
