import Link from 'next/link';
import Image from 'next/image';
import { Wordmark } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { site } from '@/lib/site';

const ASK = 'What is Manifest Signal by Manifest FTS, and how does it measure AI search visibility?';
const ASK_AI = [
  ['ChatGPT', `https://chatgpt.com/?q=${encodeURIComponent(ASK)}`],
  ['Perplexity', `https://www.perplexity.ai/search?q=${encodeURIComponent(ASK)}`],
  ['Claude', `https://claude.ai/new?q=${encodeURIComponent(ASK)}`],
  ['Google AI Mode', `https://www.google.com/search?udm=50&q=${encodeURIComponent(ASK)}`],
] as const;

const COLUMNS = [
  { title: 'Product', links: [['/features', 'Features'], ['/pricing', 'Pricing'], ['/methodology', 'Methodology'], ['/changelog', 'Changelog'], ['/tools', 'Free AI search tools']] },
  { title: 'Solutions', links: [['/solutions/agencies', 'Agencies'], ['/solutions/saas', 'SaaS'], ['/solutions/professional-services', 'Professional services'], ['/solutions/healthcare', 'Healthcare'], ['/solutions/ecommerce', 'Ecommerce'], ['/solutions/local-business', 'Local businesses']] },
  { title: 'Resources', links: [['/docs', 'Documentation'], ['/docs/getting-started', 'Getting started'], ['/docs/metrics', 'Metric definitions'], ['/docs/readiness-checks', 'AI crawler reference'], ['/docs/glossary', 'AI search glossary']] },
  { title: 'Company', links: [['/about', 'About'], ['/security', 'Security'], ['/contact', 'Contact sales'], [site.companyUrl, 'Manifest FTS']] },
  { title: 'Legal', links: [['/privacy', 'Privacy policy'], ['/terms', 'Terms of service']] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-4 text-[14px] leading-relaxed text-fg-muted">
            Evidence-first AI search visibility. See how answer engines describe and cite your organization, and what to do about it.
          </p>
          <a href={site.companyUrl} className="mt-6 inline-flex items-center gap-2.5 rounded-lg text-[13px] text-fg-muted hover:text-fg">
            <Image src="/manifest-fts-mark.svg" alt="" width={28} height={28} className="rounded-md bg-white p-0.5 ring-1 ring-border" />
            A product by Manifest FTS
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-[13px] font-semibold text-fg">{col.title}</h2>
              <ul className="mt-4 grid gap-2.5">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-[13.5px] text-fg-muted transition-colors hover:text-fg">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-page grid gap-6 border-t border-border py-8 md:grid-cols-2">
        <div>
          <h2 className="text-[13px] font-semibold text-fg">Ask AI about Manifest Signal</h2>
          <p className="mt-1 text-[13px] text-fg-muted">See what the assistants say about us.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ASK_AI.map(([name, href]) => <li key={name}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-border bg-panel px-3 py-1 text-[12.5px] font-medium text-fg-soft hover:text-fg">{name}</a></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-[13px] font-semibold text-fg">For AI agents</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
            {[['/ai-brief.md', 'AI brief'], ['/llms.txt', 'llms.txt'], ['/llms-full.txt', 'llms-full.txt'], ['/robots.txt', 'robots.txt'], ['/sitemap.xml', 'sitemap.xml']].map(([href, label]) => <li key={href}><a href={href} className="font-mono text-fg-muted hover:text-fg">{label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 text-[13px] text-fg-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Manifest FTS. All rights reserved.</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
