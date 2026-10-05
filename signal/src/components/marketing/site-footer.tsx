import Link from 'next/link';
import Image from 'next/image';
import { Wordmark } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { site } from '@/lib/site';

const COLUMNS = [
  { title: 'Product', links: [['/features', 'Features'], ['/pricing', 'Pricing'], ['/methodology', 'Methodology'], ['/changelog', 'Changelog'], ['/tools/ai-readiness-checker', 'AI readiness checker']] },
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
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
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
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 text-[13px] text-fg-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Manifest FTS. All rights reserved.</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
