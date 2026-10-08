import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { Faq } from '@/components/marketing/faq';
import { CtaBand } from '@/components/marketing/cta-band';
import { JsonLd } from '@/components/json-ld';
import { TrackLink } from '@/components/track-link';
import { buttonClass } from '@/components/ui/button';
import { PLANS, TRIAL_DAYS } from '@/lib/plans';
import { ENGINES } from '@/lib/engines';
import { pageMetadata, breadcrumbLd, softwareLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Pricing',
  description: 'Manifest Signal plans start at $49 per month per workspace. Every plan includes readiness audits and evidence-linked tasks. Start with a 14-day Growth trial, no card required.',
  path: '/pricing',
});

const PRICING_FAQ = [
  { q: 'What counts as a prompt?', a: 'A prompt is one tracked question. Each run asks every active prompt once per enabled engine, so 25 prompts on 3 engines produce 75 answers per run.' },
  { q: 'What is a workspace?', a: 'A workspace tracks one brand: its domain, competitors, prompts, and facts. Agencies typically create one workspace per client. Each workspace has its own plan.' },
  { q: 'What happens when my trial ends?', a: 'Your workspace becomes read-only until you choose a plan. You can still view and export everything; nothing is deleted.' },
  { q: 'Can I change plans later?', a: 'Yes. Upgrades apply immediately with prorated billing, and downgrades take effect at the next billing date. Manage everything from Settings → Billing.' },
  { q: 'Do you offer annual billing or nonprofit pricing?', a: 'Yes, through Manifest FTS. Contact us for annual invoicing, nonprofit pricing, or more than 300 prompts.' },
];

type Row = [string, (string | boolean)[]];
const ROWS: Row[] = [
  ['Tracked prompts', PLANS.map((p) => String(p.prompts))],
  ['Answer engines', PLANS.map((p) => (p.engines === 'all' ? `All ${ENGINES.length}` : String(p.engines.length)))],
  ['Run frequency', PLANS.map((p) => (p.cadence === 'daily' ? 'Daily' : 'Weekly'))],
  ['Competitors', PLANS.map((p) => String(p.competitors))],
  ['Seats', PLANS.map((p) => (p.seats ? String(p.seats) : 'Unlimited'))],
  ['Confidence intervals on every metric', [true, true, true]],
  ['GEO audits with composite score', [true, true, true]],
  ['Evidence-linked tasks', [true, true, true]],
  ['AI traffic analytics', [true, true, true]],
  ['Content briefs', [true, true, true]],
  ['AI-drafted pages', [false, true, true]],
  ['Accuracy monitoring', [false, true, true]],
  ['Shareable reports', [false, true, true]],
  ['White-label reports', [false, false, true]],
  ['Slack, webhooks, and IndexNow', [true, true, true]],
  ['JSON export', [true, true, true]],
  ['Priority support from Manifest FTS', [false, false, true]],
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          { ...softwareLd, offers: PLANS.map((p) => ({ '@type': 'Offer', name: `${p.name} plan`, price: p.price, priceCurrency: 'USD', description: p.blurb, url: absoluteUrl('/pricing') })) },
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]),
          { '@type': 'FAQPage', mainEntity: PRICING_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ]}
      />
      <PageHero eyebrow="Pricing" title="Plans for every stage of your AI visibility program" lede={`Billed monthly per workspace. Every workspace starts with a ${TRIAL_DAYS}-day Growth trial, with no card required.`} />

      <section aria-label="Plans" className="container-page py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative flex flex-col rounded-2xl border bg-panel p-7 shadow-card ${plan.highlight ? 'border-accent shadow-raised ring-1 ring-accent' : 'border-border'}`}>
              {plan.highlight && <span className="absolute -top-3 left-7 rounded-full bg-accent px-2.5 py-1 text-[11.5px] font-semibold text-white dark:text-[#0a0d14]">Most popular</span>}
              <h2 className="text-[18px] font-semibold text-fg">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-[14.5px] leading-relaxed text-fg-muted">{plan.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1.5"><span className="text-[44px] font-semibold tracking-[-0.045em] text-fg">${plan.price}</span><span className="text-[14.5px] text-fg-muted">per month</span></p>
              <TrackLink href={`/signup?plan=${plan.id}`} label={`pricing_${plan.id}`} event="signup_started" className={buttonClass({ variant: plan.highlight ? 'primary' : 'secondary', size: 'lg', className: 'mt-6 w-full' })}>
                Start free trial
              </TrackLink>
              <ul className="mt-8 grid gap-3 border-t border-border pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-fg-soft"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[14px] text-fg-muted">
          Need more than 300 prompts, annual invoicing, or nonprofit pricing? <Link href="/contact" className="font-medium text-accent hover:underline">Talk to Manifest FTS</Link>.
        </p>
      </section>

      <section aria-labelledby="compare-title" className="container-page pb-20">
        <h2 id="compare-title" className="text-[26px] font-semibold tracking-[-0.03em] text-fg">Compare plans</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-panel shadow-card">
          <table className="w-full min-w-[640px] text-[14.5px]">
            <caption className="sr-only">Plan comparison</caption>
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th scope="col" className="px-5 py-4 text-left font-medium text-fg-muted">Feature</th>
                {PLANS.map((p) => <th key={p.id} scope="col" className="px-5 py-4 text-left font-semibold text-fg">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, values]) => (
                <tr key={label} className="border-b border-border last:border-0">
                  <th scope="row" className="px-5 py-3.5 text-left font-normal text-fg-soft">{label}</th>
                  {values.map((v, i) => (
                    <td key={i} className="px-5 py-3.5 text-fg">
                      {v === true ? <Check className="size-4 text-success" aria-label="Included" /> : v === false ? <Minus className="size-4 text-fg-faint" aria-label="Not included" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="managed-title" className="container-page pb-20">
        <div className="overflow-hidden rounded-3xl border border-border bg-panel shadow-card lg:grid lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-10">
            <p className="eyebrow">Managed AEO by Manifest FTS</p>
            <h2 id="managed-title" className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-fg sm:text-[32px]">Prefer done-for-you? We ship the fixes.</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-fg-muted">Add a managed program to any plan. Manifest FTS’s engineers and editors execute the work Signal recommends, and Signal measures the result with the same confidence intervals you see in the app.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/contact?topic=services" className={buttonClass()}>Book a strategy call</Link>
              <Link href="/tools/ai-readiness-checker" className={buttonClass({ variant: 'secondary' })}>Start with a free GEO audit</Link>
            </div>
            <p className="mt-4 text-[13px] text-fg-faint">Scoped and quoted per engagement. No guarantees of rankings, citations, or traffic; we report what changes and how confident we are.</p>
          </div>
          <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              ['Answer-ready content', 'Pages and comparisons written to the briefs Signal generates, reviewed for accuracy.'],
              ['Technical AEO', 'Crawler access, schema and entity markup, internal linking, sitemaps, IndexNow.'],
              ['Source and authority building', 'Accurate listings and coverage on the third-party sites engines cite; digital PR.'],
              ['Community presence', 'Guidance and participation plans for Reddit, Quora, and forums engines rely on, done transparently.'],
              ['Strategy and reporting', 'A named strategist, written monthly reports, and a shared Slack channel.'],
              ['Platform engineering', 'Site migrations, server rendering, and performance work by the Manifest FTS engineering team.'],
            ].map(([t, d]) => (
              <li key={t} className="bg-panel p-6">
                <h3 className="text-[15px] font-semibold text-fg">{t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="pricing-faq" className="border-t border-border bg-bg-subtle py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <h2 id="pricing-faq" className="text-[30px] font-semibold tracking-[-0.03em] text-fg">Billing questions</h2>
          <Faq items={PRICING_FAQ} />
        </div>
      </section>
      <div className="pt-20"><CtaBand /></div>
    </>
  );
}
