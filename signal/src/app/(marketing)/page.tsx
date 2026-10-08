import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Binary, CircleDashed, Eye, FileSearch, Layers, ListChecks, MessageSquareQuote, Microscope, Scale, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { ProductVisual } from '@/components/marketing/product-visual';
import { Section, SectionHeading } from '@/components/marketing/section';
import { Faq } from '@/components/marketing/faq';
import { CtaBand } from '@/components/marketing/cta-band';
import { JsonLd } from '@/components/json-ld';
import { TrackLink } from '@/components/track-link';
import { buttonClass } from '@/components/ui/button';
import { FAQS, FEATURES } from '@/content/marketing';
import { PLANS } from '@/lib/plans';
import { ENGINES } from '@/lib/engines';
import { site, absoluteUrl } from '@/lib/site';
import { organizationLd, softwareLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Manifest Signal — AI search visibility and citation monitoring' },
  description: site.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: { title: 'Manifest Signal — Know what AI says about you', description: site.description, url: absoluteUrl('/') },
};

const STEPS = [
  { icon: Target, title: 'Define the questions', body: 'Track the prompts your buyers actually ask, grouped by topic and intent, alongside the competitors they compare you with.' },
  { icon: Eye, title: 'Observe every engine', body: 'Signal asks ChatGPT, Perplexity, Gemini, and Claude on a schedule and stores each full answer, its sources, and the model that produced it.' },
  { icon: Microscope, title: 'Diagnose with evidence', body: 'See where you are missing, which sources shape answers, what engines get wrong, and whether crawlers can reach your pages.' },
  { icon: ListChecks, title: 'Act and measure', body: 'Work a prioritized task list where every item links to its evidence, then watch the metrics that matter over the next runs.' },
];

const FEATURE_ICONS: Record<string, typeof Eye> = { visibility: Eye, answers: MessageSquareQuote, sources: Layers, accuracy: ShieldCheck, readiness: FileSearch, tasks: ListChecks };

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationLd,
          { '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: site.url, publisher: { '@id': `${site.companyUrl}/#organization` } },
          { ...softwareLd, offers: PLANS.map((p) => ({ '@type': 'Offer', name: p.name, price: p.price, priceCurrency: 'USD', url: absoluteUrl('/pricing') })) },
          { '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pb-28 pt-14 sm:pt-20 lg:pb-36">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_55%_at_50%_0%,#000_30%,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-280px] h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_16%,transparent),transparent)]" />
        <div className="container-page relative">
          <div className="mx-auto max-w-3xl text-center">
            <Link href="/tools" className="inline-flex animate-rise items-center gap-2 rounded-full border border-border bg-panel/80 py-1 pl-1 pr-3 text-[13px] text-fg-soft shadow-card backdrop-blur transition hover:border-border-strong/60">
              <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-[12px] font-semibold text-accent-on-subtle">New</span>
              Free GEO audit and AI search tools
              <ArrowRight className="size-3.5 text-fg-faint" aria-hidden />
            </Link>
            <h1 className="mt-6 animate-rise text-[40px] font-semibold leading-[1.04] tracking-[-0.045em] text-fg [animation-delay:60ms] sm:text-[56px] lg:text-[68px]">
              Know what AI says about you. <span className="text-fg-muted">Then change it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-rise text-[17.5px] leading-relaxed text-fg-muted [animation-delay:120ms] sm:text-[19px]">
              Manifest Signal asks ChatGPT, Perplexity, Gemini, and Claude the questions your customers ask, records every answer and source, and turns what it finds into prioritized, evidence-linked work.
            </p>
            <div className="mt-9 flex animate-rise flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row">
              <TrackLink href="/signup" label="hero_trial" event="signup_started" className={buttonClass({ size: 'lg', className: 'w-full sm:w-auto' })}>
                Start free trial <ArrowRight aria-hidden />
              </TrackLink>
              <TrackLink href="/tools/ai-readiness-checker" label="hero_checker" className={buttonClass({ size: 'lg', variant: 'secondary', className: 'w-full sm:w-auto' })}>
                Check your site’s AI readiness
              </TrackLink>
            </div>
            <p className="mt-5 animate-rise text-[13px] text-fg-faint [animation-delay:240ms]">14-day trial · No card required · Built by Manifest FTS</p>
          </div>
          <div className="relative mx-auto mt-16 max-w-5xl animate-rise [animation-delay:300ms] sm:mt-20">
            <ProductVisual />
          </div>
        </div>
      </section>

      {/* Engines */}
      <section aria-labelledby="engines-title" className="border-y border-border bg-bg-subtle py-10">
        <div className="container-page flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <h2 id="engines-title" className="text-[13.5px] font-medium text-fg-muted">Observes the answer engines your buyers already use</h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {ENGINES.map((e) => (
              <li key={e.id} className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-fg-soft">
                <span className="size-2 rounded-full" style={{ background: `var(--series-${e.slot})` }} aria-hidden />
                {e.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem */}
      <Section labelledBy="shift-title">
        <SectionHeading id="shift-title" eyebrow="The shift" title="Buyers ask for answers now. Most teams can’t see them." lede="When someone asks an AI assistant which provider to choose, there is no results page to check and no rank to track. There is a paragraph that names a few organizations and cites a few sources, and it changes from one request to the next." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {[
            { icon: MessageSquareQuote, title: 'Answers, not rankings', body: 'Visibility is whether you are named, where, and how you are described, measured across many samples rather than a single position.' },
            { icon: Layers, title: 'Sources decide', body: 'Engines lean on a small set of pages and third-party sites. Knowing which ones tells you where effort will count.' },
            { icon: ShieldCheck, title: 'Errors repeat', body: 'An outdated price or wrong location can be repeated to every buyer who asks. You need to see it before they do.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-panel p-7 sm:p-8">
              <Icon className="size-5 text-accent" aria-hidden />
              <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.015em] text-fg">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section tone="subtle" labelledBy="how-title">
        <SectionHeading id="how-title" eyebrow="How it works" title="From question to measurable change" lede="Signal connects observation, diagnosis, and action in one loop, so every recommendation can be traced back to what engines actually said." />
        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="group relative rounded-2xl border border-border bg-panel p-6 shadow-card transition-shadow hover:shadow-raised">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-accent-subtle text-accent"><Icon className="size-5" aria-hidden /></span>
                <span className="font-mono text-[12px] font-semibold text-fg-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-[16.5px] font-semibold tracking-[-0.015em] text-fg">{title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-fg-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Features bento */}
      <Section labelledBy="features-title">
        <SectionHeading
          id="features-title"
          eyebrow="Product"
          title="Everything you need to run AI visibility as a program"
          action={<Link href="/features" className={buttonClass({ variant: 'secondary' })}>Explore all features</Link>}
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          {FEATURES.slice(0, 6).map((f, i) => {
            const Icon = FEATURE_ICONS[f.id] ?? Sparkles;
            const wide = i === 0 || i === 3;
            return (
              <Link key={f.id} href={`/features#${f.id}`} className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-panel p-7 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised ${wide ? 'lg:col-span-4' : 'lg:col-span-2'}`}>
                <Icon className="size-5 text-accent" aria-hidden />
                <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-fg">{f.title}</h3>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-fg-muted">{f.summary}</p>
                {wide && i === 0 && (
                  <div className="mt-7 grid grid-cols-3 gap-3" aria-hidden>
                    {[['Mention', '42%', '±6.2'], ['Citation', '18%', '±4.8'], ['First position', '27%', '±7.9']].map(([l, v, c]) => (
                      <div key={l} className="rounded-xl border border-border bg-bg-subtle p-3">
                        <p className="text-[11px] text-fg-muted">{l}</p>
                        <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-fg">{v}</p>
                        <p className="text-[10.5px] text-fg-faint">{c} pts · n=240</p>
                      </div>
                    ))}
                  </div>
                )}
                {wide && i === 3 && (
                  <div className="mt-7 grid gap-2" aria-hidden>
                    {[['“Northwind was founded in 2015.”', 'Inaccurate', 'danger'], ['“Northwind is based in Denver.”', 'Accurate', 'success'], ['“Plans start at $39 per month.”', 'Needs review', 'warning']].map(([t, s, tone]) => (
                      <div key={t} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-subtle px-3.5 py-2.5 text-[13px]">
                        <span className="truncate text-fg-soft">{t}</span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone === 'danger' ? 'bg-danger-subtle text-danger-on-subtle' : tone === 'success' ? 'bg-success-subtle text-success-on-subtle' : 'bg-warning-subtle text-warning-on-subtle'}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="mt-auto flex items-center gap-1 pt-6 text-[13.5px] font-medium text-accent">
                  Learn more <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Methodology */}
      <Section tone="ink" labelledBy="method-title">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="eyebrow">Methodology</p>
            <h2 id="method-title" className="mt-3 text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] sm:text-[40px]">Numbers you can defend in front of leadership</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-fg-muted">AI answers vary. A dashboard that hides that variation invites bad decisions. Signal shows its work.</p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                { icon: Binary, title: 'Every rate has a denominator', body: 'Sample size sits next to every percentage, in the product and in reports.' },
                { icon: Scale, title: 'Intervals, not guesses', body: '95% Wilson intervals; a change is flagged only when intervals separate.' },
                { icon: BadgeCheck, title: 'Raw answers on record', body: 'Open any number to read the exact answers and sources behind it.' },
                { icon: CircleDashed, title: 'Sample data is labeled', body: 'Illustrative data never mixes with live observations.' },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title}>
                  <Icon className="size-5 text-accent" aria-hidden />
                  <h3 className="mt-3 text-[15.5px] font-semibold">{title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-fg-muted">{body}</p>
                </li>
              ))}
            </ul>
            <Link href="/methodology" className="mt-10 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-accent hover:underline">
              Read the methodology <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-panel p-6 shadow-overlay sm:p-8" role="img" aria-label="Example metric: mention rate 42 percent, plus or minus 6.2 points, from 240 answers">
            <div className="flex items-center justify-between text-[12.5px] text-fg-muted">
              <span>Mention rate · ChatGPT · last 30 days</span>
              <span className="rounded-full bg-warning-subtle px-2 py-0.5 text-[11px] font-semibold text-[#f7cc7a]">Example</span>
            </div>
            <p className="mt-4 text-[56px] font-semibold leading-none tracking-[-0.045em]">42%</p>
            <p className="mt-2 text-[14px] text-fg-muted">101 of 240 answers · 95% interval 36.0%–48.4%</p>
            <div className="mt-8 space-y-4">
              {[['This period', 36.0, 48.4, 42.1], ['Previous period', 27.7, 39.5, 33.3]].map(([label, lo, hi, v]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-[12.5px] text-fg-muted"><span>{label}</span><span className="tabular">{(v as number).toFixed(1)}%</span></div>
                  <div className="relative mt-2 h-2 rounded-full bg-bg-muted">
                    <div className="absolute inset-y-0 rounded-full bg-accent/35" style={{ left: `${lo}%`, width: `${(hi as number) - (lo as number)}%` }} />
                    <div className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-panel bg-accent" style={{ left: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-xl border border-border bg-bg-subtle px-4 py-3 text-[13px] leading-relaxed text-fg-soft">
              Intervals overlap, so Signal reports this as <strong className="text-fg">“up 8.8 pts, not yet significant”</strong> rather than a win.
            </p>
          </div>
        </div>
      </Section>

      {/* Free tool */}
      <Section labelledBy="tool-title">
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-bg-subtle p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Free tool</p>
            <h2 id="tool-title" className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-fg sm:text-[34px]">Can AI crawlers actually read your site?</h2>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-fg-muted">Run a free GEO audit: crawler access for 26 AI bots, citability, schema, entity and E-E-A-T signals, with a composite score and a prioritized fix list. No account needed.</p>
          </div>
          <form action="/tools/ai-readiness-checker" method="get" className="flex flex-col gap-2.5 sm:flex-row">
            <label htmlFor="home-url" className="sr-only">Website URL</label>
            <input id="home-url" name="url" type="text" inputMode="url" autoComplete="url" required placeholder="yourdomain.com" className="h-12 w-full rounded-control border border-border bg-panel px-4 text-[15px] text-fg shadow-card placeholder:text-fg-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-[var(--ring)]" />
            <button type="submit" className={buttonClass({ size: 'lg' })}>Run check</button>
          </form>
        </div>
      </Section>

      {/* Pricing teaser */}
      <Section tone="subtle" labelledBy="pricing-title">
        <SectionHeading id="pricing-title" align="center" eyebrow="Pricing" title="Simple plans that scale with your program" lede="Every plan includes readiness audits, evidence-linked tasks, and the full methodology. Start with a 14-day Growth trial." />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`rounded-2xl border bg-panel p-6 shadow-card ${plan.highlight ? 'border-accent ring-1 ring-accent' : 'border-border'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-fg">{plan.name}</h3>
                {plan.highlight && <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-[11.5px] font-semibold text-accent-on-subtle">Most popular</span>}
              </div>
              <p className="mt-4 flex items-baseline gap-1"><span className="text-[36px] font-semibold tracking-[-0.04em] text-fg">${plan.price}</span><span className="text-[14px] text-fg-muted">/month</span></p>
              <p className="mt-2 text-[14px] text-fg-muted">{plan.prompts} prompts · {plan.engines === 'all' ? '6' : plan.engines.length} engines · {plan.cadence} runs</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/pricing" className={buttonClass({ variant: 'secondary' })}>Compare plans</Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions teams ask before they start" lede={<>Can’t find an answer? <Link href="/contact" className="font-medium text-accent hover:underline">Contact us</Link> or read the <Link href="/docs" className="font-medium text-accent hover:underline">documentation</Link>.</>} />
          <Faq items={FAQS} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
