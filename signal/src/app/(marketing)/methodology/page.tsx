import Link from 'next/link';
import { ProsePage } from '@/components/marketing/prose-page';
import { CtaBand } from '@/components/marketing/cta-band';
import { JsonLd } from '@/components/json-ld';
import { buttonClass } from '@/components/ui/button';
import { pageMetadata, breadcrumbLd, organizationLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Methodology',
  description: 'How Manifest Signal collects AI answers, detects mentions and citations, and reports every rate with its sample size and a 95% Wilson confidence interval.',
  path: '/methodology',
});

const BODY = `
Answer engines are probabilistic. Ask the same question twice and you may get two different answers. Any measurement of AI visibility is therefore a measurement of a sample, and it should be reported like one. These are the principles Signal follows.

## 1. Observe, then calculate

Signal stores every answer it collects: the full text, the sources the engine cited, the model identifier, and the time. Metrics are computed from those stored observations, so every number in the product can be traced back to the answers behind it. Open any prompt to read them.

## 2. Every rate has a denominator

Mention rate, citation rate, share of voice, first-position rate, and accuracy are all proportions. Signal shows the sample size (n) beside each one, in the product, in exports, and in shared reports. A 50% mention rate from 4 answers and from 400 answers are very different findings.

## 3. Intervals, not point estimates

Signal reports 95% Wilson score intervals, which behave well for small samples and for rates near 0% or 100%. A change between periods is labeled meaningful only when the two intervals do not overlap. When they overlap, Signal says so, even if the headline number went up.

## 4. Live and sample data never mix

New workspaces start with sample data so teams can learn the product before connecting live engines. Sample observations are labeled wherever they appear and are excluded from live metrics, trends, and reports.

## 5. Heuristics are disclosed as heuristics

Mention detection uses whole-word matching on the names you provide. Sentiment uses a disclosed lexicon applied only to sentences that mention you, and is intended to surface answers worth reading. Claim extraction looks for sentences that mention you and contain checkable statements. None of these replace reading the answer.

## 6. Visibility is not outcome

Being named or cited in an answer is not the same as a visit, a lead, or revenue. Signal measures what engines say. Connect outcomes in your own analytics and compare timing rather than assuming causation.

## How collection works

For live engines, Signal calls each vendor's official API with web search enabled and a neutral instruction to answer as it would for a member of the public. This approximates, but is not identical to, the consumer app experience, which can vary by account, location, and experiments. Engines without an official API are offered as labeled sample data. See [Answer engines and data sources](/docs/answer-engines) for the current list.

## Definitions

Full definitions and formulas for every metric are in [Metrics, denominators, and confidence intervals](/docs/metrics).
`;

export default function MethodologyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Methodology', path: '/methodology' }]),
          { '@type': 'Article', headline: 'Manifest Signal methodology', url: absoluteUrl('/methodology'), author: organizationLd, publisher: organizationLd, dateModified: '2026-10-05' },
        ]}
      />
      <ProsePage eyebrow="Methodology" title="How Signal measures AI visibility" lede="Six principles that keep the numbers honest, and what each metric can and cannot tell you." body={BODY} updated="2026-10-05">
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/docs/metrics" className={buttonClass()}>Metric definitions</Link>
          <Link href="/docs/readiness-checks" className={buttonClass({ variant: 'secondary' })}>Readiness check reference</Link>
        </div>
      </ProsePage>
      <CtaBand />
    </>
  );
}
