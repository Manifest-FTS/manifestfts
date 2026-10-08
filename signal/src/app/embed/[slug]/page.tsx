import { notFound } from 'next/navigation';
import { SignalMark } from '@/components/brand/logo';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import { TOOLS, TOOL_BY_SLUG } from '@/content/tools';
import { absoluteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.filter((t) => t.embeddable).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<'/embed/[slug]'>) {
  const tool = TOOL_BY_SLUG[(await params).slug];
  return { title: tool ? `${tool.name} widget` : 'Widget', robots: { index: false, follow: true }, alternates: tool ? { canonical: absoluteUrl(`/tools/${tool.slug}`) } : undefined };
}

/** Chrome-free, frameable version of a free tool for third-party sites. */
export default async function EmbedPage({ params }: PageProps<'/embed/[slug]'>) {
  const tool = TOOL_BY_SLUG[(await params).slug];
  if (!tool?.embeddable) notFound();
  return (
    <main id="main" className="min-h-dvh bg-bg p-4 sm:p-6">
      <h1 className="mb-4 text-[18px] font-semibold tracking-[-0.02em] text-fg">{tool.name}</h1>
      <ToolRenderer component={tool.component} engine={tool.engine} embed />
      <p className="mt-6 flex items-center gap-2 text-[12.5px] text-fg-muted">
        <SignalMark className="size-5" />
        <a href={absoluteUrl(`/tools/${tool.slug}?utm_source=embed`)} target="_blank" rel="noopener" className="font-medium hover:text-fg">Powered by Manifest Signal · open the full tool</a>
      </p>
    </main>
  );
}
