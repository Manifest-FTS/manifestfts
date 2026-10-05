import Link from 'next/link';
import { ProsePage } from '@/components/marketing/prose-page';
import { JsonLd } from '@/components/json-ld';
import { buttonClass } from '@/components/ui/button';
import { pageMetadata, breadcrumbLd, organizationLd, softwareLd } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'About',
  description: 'Manifest Signal is built by Manifest FTS, an engineering-led digital partner that designs, builds, and supports durable web platforms.',
  path: '/about',
});

const BODY = `
Manifest Signal is a product by [Manifest FTS](${site.companyUrl}), an engineering-led digital partner that plans, builds, and supports websites and web platforms for organizations that need them to work for years, not months.

## Why we built Signal

Clients started asking us a new question: "What does ChatGPT say about us?" Answering it well turned out to require the same disciplines we apply to any platform decision: careful measurement, clear ownership of data, and honest reporting of uncertainty. Existing tools tended to present a single answer as a ranking, or a score without a denominator. We wanted something we could put in front of a client's leadership team and defend line by line.

## What we believe

- **Trusted partnership.** Tools should make decisions clearer, not create urgency. Signal reports what it observed and how confident it is.
- **Data trust and security.** Collect what the product needs, document where it goes, and make it easy to export or delete.
- **Appropriate technology.** Most improvements in AI visibility come from fundamentals: accessible pages, accurate facts, clear structure, and presence on the sources engines rely on.

## Working with Manifest FTS

Signal is self-serve. Teams that want hands-on help can engage Manifest FTS for content strategy, technical SEO, structured data, and platform work, using Signal as the shared source of evidence.
`;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[{ '@type': 'AboutPage', name: 'About Manifest Signal', about: softwareLd, publisher: organizationLd }, breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]} />
      <ProsePage eyebrow="About" title="Built by people who maintain the platforms they measure" body={BODY}>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact" className={buttonClass()}>Contact us</Link>
          <a href={site.companyUrl} className={buttonClass({ variant: 'secondary' })}>Visit Manifest FTS</a>
        </div>
      </ProsePage>
    </>
  );
}
