import { PageHero } from '@/components/marketing/page-hero';
import { JsonLd } from '@/components/json-ld';
import { CHANGELOG } from '@/content/marketing';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';
import { formatDate } from '@/lib/format';

export const metadata = pageMetadata({ title: 'Changelog', description: 'New features, improvements, and fixes in Manifest Signal.', path: '/changelog' });

export default function ChangelogPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Changelog', path: '/changelog' }])} />
      <PageHero eyebrow="Changelog" title="What’s new in Signal" lede="Product updates from the Manifest FTS team." />
      <div className="container-page py-16">
        <ol className="grid gap-12">
          {CHANGELOG.map((entry) => (
            <li key={entry.version} className="grid gap-4 md:grid-cols-[200px_1fr]">
              <div>
                <time dateTime={entry.date} className="text-[14px] font-medium text-fg">{formatDate(entry.date)}</time>
                <p className="mt-1 font-mono text-[12.5px] text-fg-faint">v{entry.version}</p>
              </div>
              <article className="rounded-2xl border border-border bg-panel p-6 shadow-card">
                <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-fg">{entry.title}</h2>
                <ul className="prose-signal mt-4 text-[15px]">
                  {entry.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
