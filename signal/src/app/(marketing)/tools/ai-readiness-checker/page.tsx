import { Suspense } from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/marketing/page-hero';
import { Faq } from '@/components/marketing/faq';
import { JsonLd } from '@/components/json-ld';
import { ReadinessChecker } from '@/components/readiness/checker';
import { pageMetadata, breadcrumbLd, organizationLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Free AI readiness checker: can ChatGPT, Perplexity, and Claude read your site?',
  description: 'Check robots.txt rules for GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended and more, plus indexability, structured data, and server-rendered content. Free, no signup.',
  path: '/tools/ai-readiness-checker',
});

const FAQ = [
  { q: 'Should I block GPTBot or other AI crawlers?', a: 'It depends on your policy. Blocking training crawlers such as GPTBot, ClaudeBot, or Google-Extended limits use of your content for model training and does not remove you from live answers. Blocking retrieval crawlers such as OAI-SearchBot, ChatGPT-User, or PerplexityBot does remove your pages from those engines’ live answers and citations.' },
  { q: 'Does a high score mean AI engines will cite me?', a: 'No. The checker confirms that engines can access and understand the page. Whether they cite it depends on whether it answers questions better than other sources. Manifest Signal measures that directly.' },
  { q: 'Do I need an llms.txt file?', a: 'It is optional. llms.txt is an emerging convention for summarizing a site for language models; no major engine has committed to using it, so the checker reports it for information only.' },
  { q: 'Why does server-rendered content matter?', a: 'Many AI crawlers fetch HTML without running JavaScript. If your main content only appears after scripts run, those crawlers may see an almost empty page.' },
];

export default function CheckerPage() {
  return (
    <>
      <JsonLd
        data={[
          { '@type': 'WebApplication', name: 'AI readiness checker', url: absoluteUrl('/tools/ai-readiness-checker'), applicationCategory: 'DeveloperApplication', operatingSystem: 'Web', isAccessibleForFree: true, offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: organizationLd },
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'AI readiness checker', path: '/tools/ai-readiness-checker' }]),
          { '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ]}
      />
      <PageHero eyebrow="Free tool" title="Can AI answer engines read your site?" lede="Check crawler access for eleven AI and search crawlers, plus indexability, metadata, structured data, and server-rendered content. Free, no account needed.">
        <div className="mt-10 max-w-3xl">
          <Suspense fallback={<div className="skeleton h-[68px] rounded-2xl" />}>
            <ReadinessChecker />
          </Suspense>
        </div>
      </PageHero>
      <section aria-labelledby="checker-faq" className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 id="checker-faq" className="text-[28px] font-semibold tracking-[-0.03em] text-fg">About this checker</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">The full list of crawlers and checks is in the <Link href="/docs/readiness-checks" className="font-medium text-accent hover:underline">readiness check reference</Link>.</p>
        </div>
        <Faq items={FAQ} />
      </section>
    </>
  );
}
