import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Inbox } from 'lucide-react';
import { requireWorkspace } from '@/lib/workspace';
import { promptDetail } from '@/lib/queries';
import { ENGINE_BY_ID } from '@/lib/engines';
import { marginPts } from '@/lib/metrics';
import { pct, formatShortDate } from '@/lib/format';
import { PageHeader } from '@/components/app/page-header';
import { AnswerCard, EngineTabs } from '@/components/app/answer-view';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Tooltip } from '@/components/ui/tooltip';

export const metadata = { title: 'Prompt' };

export default async function PromptDetailPage({ params }: PageProps<'/app/[workspace]/prompts/[id]'>) {
  const { workspace: slug, id } = await params;
  const { workspace } = await requireWorkspace(slug);
  const data = await promptDetail(workspace, id);
  if (!data) notFound();
  const { prompt, summary, latestByEngine, history, competitors } = data;
  const brand = { names: [workspace.brandName, ...workspace.brandAliases], domain: workspace.domain };
  const comps = competitors.map((c) => ({ names: [c.name, ...c.aliases], domain: c.domain }));

  return (
    <>
      <PageHeader
        eyebrow={<Link href={`/app/${slug}/prompts`} className="inline-flex items-center gap-1 text-[13px] font-medium text-fg-muted hover:text-fg"><ArrowLeft className="size-3.5" aria-hidden />All prompts</Link>}
        title={<span className="text-[22px] sm:text-[24px]">“{prompt.text}”</span>}
        description={<span className="flex flex-wrap items-center gap-2"><Badge tone="outline">{prompt.topic}</Badge><span className="capitalize">{prompt.intent} intent</span>{!prompt.active && <Badge>Paused</Badge>}</span>}
      />

      <section aria-label="Summary for this prompt" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Mention rate', pct(summary.mention.value), summary.mention.value === null ? '' : `±${marginPts(summary.mention)} pts`],
          ['Citation rate', pct(summary.citation.value), summary.citation.value === null ? '' : `±${marginPts(summary.citation)} pts`],
          ['Avg. position', summary.avgPosition ? summary.avgPosition.toFixed(1) : '—', 'when mentioned'],
          ['Answers observed', summary.n.toLocaleString(), 'all time'],
        ].map(([label, value, sub]) => (
          <div key={label} className="rounded-panel border border-border bg-panel p-4 shadow-card">
            <p className="text-[12.5px] font-medium text-fg-muted">{label}</p>
            <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-fg">{value}</p>
            <p className="text-[11.5px] text-fg-faint">{sub}</p>
          </div>
        ))}
      </section>

      {latestByEngine.length === 0 ? (
        <Card><EmptyState icon={<Inbox />} title="No answers yet" description="This prompt will be asked on the next run." /></Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardHeader title="Latest answers" description="The most recent answer from each engine. Your brand and competitors are highlighted." />
            <CardBody>
              <EngineTabs tabs={latestByEngine.map((a) => ({
                id: a.engine, label: ENGINE_BY_ID[a.engine].name, slot: ENGINE_BY_ID[a.engine].slot,
                content: <AnswerCard engineName={ENGINE_BY_ID[a.engine].name} slot={ENGINE_BY_ID[a.engine].slot} model={a.model} observedAt={a.observedAt.toISOString()} text={a.text} citations={a.citations}
                  brandMentioned={a.brandMentioned} brandPosition={a.brandPosition} brandCited={a.brandCited} sentiment={a.sentiment} brand={brand} competitors={comps} sample={a.source === 'sample'} />,
              }))} />
            </CardBody>
          </Card>
          <Card className="self-start">
            <CardHeader title="Run history" description="Each square is one run, oldest to newest." />
            <CardBody>
              <ul className="grid gap-3">
                {history.map((h) => (
                  <li key={h.engine}>
                    <p className="mb-1.5 text-[12.5px] font-medium text-fg-soft">{ENGINE_BY_ID[h.engine].name}</p>
                    <ol className="flex gap-1">
                      {h.points.map((p, i) => (
                        <li key={i}>
                          {p ? (
                            <Tooltip content={`${formatShortDate(p.at)}: ${p.mentioned ? `mentioned #${p.position}` : 'not mentioned'}${p.cited ? ', cited' : ''}`}>
                              <span tabIndex={0} aria-label={`${formatShortDate(p.at)}: ${p.mentioned ? 'mentioned' : 'not mentioned'}${p.cited ? ', cited' : ''}`}
                                className={`block size-5 rounded-[5px] ${p.mentioned ? (p.cited ? 'bg-accent ring-2 ring-success ring-offset-1 ring-offset-panel' : 'bg-accent') : 'border border-border-strong/60 bg-transparent'}`} />
                            </Tooltip>
                          ) : <span className="block size-5 rounded-[5px] bg-bg-muted" aria-label="No answer" />}
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 grid gap-1.5 border-t border-border pt-4 text-[12px] text-fg-muted">
                <li className="flex items-center gap-2"><span className="size-3 rounded-[3px] bg-accent" aria-hidden />Mentioned</li>
                <li className="flex items-center gap-2"><span className="size-3 rounded-[3px] bg-accent ring-2 ring-success ring-offset-1 ring-offset-panel" aria-hidden />Mentioned and cited</li>
                <li className="flex items-center gap-2"><span className="size-3 rounded-[3px] border border-border-strong/60" aria-hidden />Not mentioned</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
