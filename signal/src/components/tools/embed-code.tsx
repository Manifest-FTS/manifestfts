'use client';
import { Code2, ExternalLink } from 'lucide-react';
import { CopyButton } from './shared';

export function EmbedCode({ slug, name, siteUrl }: { slug: string; name: string; siteUrl: string }) {
  const src = `${siteUrl}/embed/${slug}?utm_source=embed&utm_medium=widget&utm_campaign=signal_tools`;
  const code = `<iframe src="${src}" title="${name} by Manifest Signal" width="100%" height="760" style="border:0;border-radius:16px;max-width:960px" loading="lazy"></iframe>`;
  return (
    <section aria-labelledby="embed-title" className="rounded-3xl border border-border bg-bg-subtle p-6 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-panel px-3 py-1 text-[12.5px] font-medium text-fg-soft"><Code2 className="size-3.5" aria-hidden />Embeddable tool</p>
          <h2 id="embed-title" className="mt-4 text-[26px] font-semibold tracking-[-0.03em] text-fg sm:text-[30px]">Embed the {name}</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-fg-muted">Give your readers or clients a working {name.toLowerCase()} without building one. Paste the snippet into a resource page, article, or client portal; readers can open the full report when they want more detail.</p>
          <ul className="mt-5 grid gap-2 text-[14px] text-fg-soft sm:grid-cols-2">
            {['Copy-paste embed', 'Responsive and accessible', 'Light and dark themes', 'Link to the full tool built in'].map((x) => <li key={x} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" aria-hidden />{x}</li>)}
          </ul>
          <a href={`/embed/${slug}`} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:underline">Preview widget <ExternalLink className="size-3.5" aria-hidden /></a>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13.5px] font-medium text-fg">Embed code</p>
            <CopyButton text={code} label="Copy embed code" />
          </div>
          <label htmlFor={`embed-${slug}`} className="sr-only">Embed code</label>
          <textarea id={`embed-${slug}`} readOnly value={code} rows={6} onFocus={(e) => e.currentTarget.select()} className="mt-2 w-full resize-none rounded-xl border border-border bg-panel p-3 font-mono text-[12px] leading-relaxed text-fg-soft focus:outline-none focus:ring-4 focus:ring-[var(--ring)]" />
        </div>
      </div>
    </section>
  );
}
