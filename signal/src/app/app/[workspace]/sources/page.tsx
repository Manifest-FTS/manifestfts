import { Layers } from 'lucide-react';
import { requireWorkspace } from '@/lib/workspace';
import { parseFilters, sourcesData, workspaceTopics } from '@/lib/queries';
import { ENGINE_BY_ID } from '@/lib/engines';
import { pct } from '@/lib/format';
import { PageHeader } from '@/components/app/page-header';
import { FilterScope } from '@/components/app/filters';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { BarList } from '@/components/charts/bars';

export const metadata = { title: 'Sources' };

const KIND = { owned: { label: 'Your domain', tone: 'success' }, competitor: { label: 'Competitor', tone: 'warning' }, third_party: { label: 'Third party', tone: 'outline' } } as const;

export default async function SourcesPage({ params, searchParams }: PageProps<'/app/[workspace]/sources'>) {
  const { workspace: slug } = await params;
  const { workspace } = await requireWorkspace(slug);
  const filters = parseFilters(await searchParams);
  const [data, topics] = await Promise.all([sourcesData(workspace, filters), workspaceTopics(workspace.id)]);
  const totalKind = data.kinds.reduce((s, k) => s + k.citations, 0) || 1;

  return (
    <>
      <PageHeader title="Sources" description="The domains answer engines cite for your prompts. Third-party sources that appear often are where engines learn about your category." />
      <FilterScope topics={topics}>
        {data.table.length === 0 ? (
          <Card><EmptyState icon={<Layers />} title="No citations in this period" description="Some engines answer without citing sources. Widen the date range or include more engines." /></Card>
        ) : (
          <div className="grid gap-5">
            <div className="grid gap-5 lg:grid-cols-3">
              <Card className="p-5">
                <p className="text-[13px] font-medium text-fg-muted">Answers with citations</p>
                <p className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-fg">{pct(data.citedAnswers / Math.max(1, data.total))}</p>
                <p className="mt-1 text-[12px] text-fg-faint">{data.citedAnswers.toLocaleString()} of {data.total.toLocaleString()} answers · {data.table.length} domains</p>
              </Card>
              <Card className="p-5 lg:col-span-2">
                <p className="text-[13px] font-medium text-fg-muted">Where citations point</p>
                <div className="mt-4 flex h-3 overflow-hidden rounded-full" role="img" aria-label={data.kinds.map((k) => `${KIND[k.kind].label} ${Math.round((k.citations / totalKind) * 100)}%`).join(', ')}>
                  {data.kinds.map((k, i) => (
                    <div key={k.kind} className={i > 0 ? 'border-l-2 border-panel' : ''} style={{ width: `${(k.citations / totalKind) * 100}%`, background: k.kind === 'owned' ? 'var(--series-3)' : k.kind === 'competitor' ? 'var(--series-2)' : 'var(--series-1)' }} />
                  ))}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-fg-muted">
                  {data.kinds.map((k) => (
                    <li key={k.kind} className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-sm" style={{ background: k.kind === 'owned' ? 'var(--series-3)' : k.kind === 'competitor' ? 'var(--series-2)' : 'var(--series-1)' }} aria-hidden />
                      {KIND[k.kind].label} <strong className="font-semibold text-fg tabular">{Math.round((k.citations / totalKind) * 100)}%</strong>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card>
              <CardHeader title="Cited domains" description="Share of answers that cite each domain at least once." />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[760px] text-[13.5px]">
                  <caption className="sr-only">Cited domains</caption>
                  <thead>
                    <tr className="border-y border-border bg-bg-subtle text-left text-[12px] text-fg-muted">
                      <th scope="col" className="px-5 py-2.5 font-medium">Domain</th>
                      <th scope="col" className="px-5 py-2.5 font-medium">Type</th>
                      <th scope="col" className="w-56 px-5 py-2.5 font-medium">Share of answers</th>
                      <th scope="col" className="px-5 py-2.5 font-medium">Top engines</th>
                      <th scope="col" className="px-5 py-2.5 font-medium">Most cited page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.table.slice(0, 50).map((row) => (
                      <tr key={row.domain} className="border-b border-border last:border-0">
                        <th scope="row" className="px-5 py-3 text-left font-mono text-[13px] font-medium text-fg">{row.domain}</th>
                        <td className="px-5 py-3"><Badge tone={KIND[row.kind].tone}>{row.kind === 'competitor' ? row.competitorName : KIND[row.kind].label}</Badge></td>
                        <td className="px-5 py-3">
                          <BarList items={[{ id: row.domain, label: <span className="sr-only">{row.domain}</span>, value: row.share, slot: row.kind === 'owned' ? 3 : row.kind === 'competitor' ? 2 : 1, detail: `(${row.answers})` }]} max={data.table[0]!.share} />
                        </td>
                        <td className="px-5 py-3 text-[12.5px] text-fg-muted">{row.engines.slice(0, 3).map((e) => ENGINE_BY_ID[e.engine].name).join(', ')}</td>
                        <td className="max-w-[260px] px-5 py-3">
                          <a href={row.urls[0]!.url} target="_blank" rel="noopener noreferrer nofollow" className="block truncate text-[12.5px] text-accent hover:underline" title={row.urls[0]!.url}>{row.urls[0]!.title ?? row.urls[0]!.url}</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </FilterScope>
    </>
  );
}
