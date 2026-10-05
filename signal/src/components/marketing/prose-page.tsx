import { PageHero } from './page-hero';
import { Markdown } from '@/lib/markdown';
import { formatDate } from '@/lib/format';

export function ProsePage({ eyebrow, title, lede, body, updated, children }: { eyebrow?: string; title: string; lede?: string; body: string; updated?: string; children?: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={lede}>
        {updated && <p className="mt-5 text-[13px] text-fg-faint">Last updated <time dateTime={updated}>{formatDate(updated)}</time></p>}
      </PageHero>
      <div className="container-page py-14 sm:py-16">
        <div className="prose-signal max-w-[72ch]">
          <Markdown source={body} />
        </div>
        {children}
      </div>
    </>
  );
}
