import Link from 'next/link';
import { ArrowRight, Code2, FileSearch, Sparkles, Wand2 } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { CtaBand } from '@/components/marketing/cta-band';
import { JsonLd } from '@/components/json-ld';
import { TOOLS, TOOL_CATEGORIES } from '@/content/tools';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Free AI search tools: GEO audit, llms.txt, robots.txt, schema, and visibility checkers',
  description: 'Free tools for AI search optimization: GEO audit, AI robots.txt checker, ChatGPT, Perplexity, Gemini, and Claude visibility checkers, llms.txt and schema generators, and validators.',
  path: '/tools',
});

const ICONS = { 'Audit and analysis': FileSearch, Generators: Wand2, Validators: Sparkles } as const;

export default function ToolsIndex() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Free tools', path: '/tools' }]), { '@type': 'ItemList', name: 'Free AI search tools', itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: absoluteUrl(`/tools/${t.slug}`) })) }]} />
      <PageHero eyebrow="Free tools" title="Free tools for AI search visibility" lede="Audit, generate, and validate everything answer engines rely on: crawler access, citability, structured data, sitemaps, and llms.txt. No account needed." />
      <div className="container-page grid gap-14 py-16">
        {TOOL_CATEGORIES.map((category) => {
          const Icon = ICONS[category];
          return (
            <section key={category} aria-labelledby={`tc-${category}`}>
              <h2 id={`tc-${category}`} className="flex items-center gap-2 text-[20px] font-semibold tracking-[-0.02em] text-fg"><Icon className="size-5 text-accent" aria-hidden />{category}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TOOLS.filter((t) => t.category === category).map((t) => (
                  <li key={t.slug}>
                    <Link href={`/tools/${t.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-panel p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[15.5px] font-semibold text-fg">{t.name}</span>
                        {t.embeddable && <span className="inline-flex items-center gap-1 rounded-full bg-bg-muted px-2 py-0.5 text-[11px] font-medium text-fg-muted"><Code2 className="size-3" aria-hidden />Embeddable</span>}
                      </span>
                      <span className="mt-2 flex-1 text-[13.5px] leading-relaxed text-fg-muted">{t.description}</span>
                      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-accent">Open tool <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <CtaBand title="Go from one-off checks to continuous measurement." body="Signal tracks how every major answer engine describes you, week after week, and turns gaps into evidence-linked tasks." />
    </>
  );
}
