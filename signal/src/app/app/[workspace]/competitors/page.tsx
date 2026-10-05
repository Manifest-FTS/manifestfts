import Link from 'next/link';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { competitorsData, parseFilters, workspaceTopics } from '@/lib/queries';
import { limitsFor } from '@/lib/plans';
import { marginPts } from '@/lib/metrics';
import { pct } from '@/lib/format';
import { PageHeader } from '@/components/app/page-header';
import { FilterScope } from '@/components/app/filters';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { IntervalBar } from '@/components/charts/bars';
import { CompetitorManager } from './competitor-manager';

export const metadata = { title: 'Competitors' };

export default async function CompetitorsPage({ params, searchParams }: PageProps<'/app/[workspace]/competitors'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const filters = parseFilters(await searchParams);
  const [data, topics] = await Promise.all([competitorsData(workspace, filters), workspaceTopics(workspace.id)]);
  const sorted = [...data.rows].sort((a, b) => (b.share.value ?? 0) - (a.share.value ?? 0));

  return (
    <>
      <PageHeader title="Competitors" description="Share of voice and mention rates for you and the organizations buyers compare you with." />
      <FilterScope topics={topics}>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-5">
            <Card>
              <CardHeader title="Share of voice" description={`Share of all tracked-organization mentions across ${data.n.toLocaleString()} answers.`} />
              <CardBody>
                {data.n === 0 ? <EmptyState title="No answers in this period" /> : (
                  <ul className="grid gap-5">
                    {sorted.map((r, i) => (
                      <li key={r.id}>
                        <div className="mb-2 flex items-baseline justify-between gap-3">
                          <span className="flex items-center gap-2 text-[13.5px] font-medium text-fg">
                            <span className="font-mono text-[11.5px] text-fg-faint">{i + 1}</span>{r.name}{r.isBrand && <Badge tone="accent">You</Badge>}
                          </span>
                          <span className="text-[13px] tabular"><strong className="font-semibold text-fg">{pct(r.share.value)}</strong><span className="ml-1.5 text-fg-faint">±{marginPts(r.share) ?? '—'}</span></span>
                        </div>
                        <IntervalBar value={r.share.value} low={r.share.low} high={r.share.high} slot={r.isBrand ? 1 : 2} label={`${r.name} share of voice`} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Head to head" description="How often each organization is named, and how often it is named first." />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-[13.5px] tabular">
                  <caption className="sr-only">Mention rate, first-position rate, and average position by organization</caption>
                  <thead><tr className="border-y border-border bg-bg-subtle text-left text-[12px] text-fg-muted">
                    <th scope="col" className="px-5 py-2.5 font-medium">Organization</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Mention rate</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Named first</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Avg. position</th>
                  </tr></thead>
                  <tbody>
                    {data.rows.map((r) => (
                      <tr key={r.id} className={`border-b border-border last:border-0 ${r.isBrand ? 'bg-accent-subtle/40' : ''}`}>
                        <th scope="row" className="px-5 py-3 text-left font-medium text-fg">{r.name}<span className="block font-mono text-[11.5px] font-normal text-fg-faint">{r.domain}</span></th>
                        <td className="px-5 py-3 text-right text-fg">{pct(r.mention.value)} <span className="text-[11.5px] text-fg-faint">±{marginPts(r.mention) ?? '—'}</span></td>
                        <td className="px-5 py-3 text-right text-fg">{pct(r.firstRate.value)}</td>
                        <td className="px-5 py-3 text-right text-fg">{r.avgPosition ? r.avgPosition.toFixed(1) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <CardHeader title="Where competitors appear without you" description="Prompts where a competitor was named and you were not, ranked by gap." />
              <CardBody className="pt-3">
                {data.gaps.length === 0 ? <p className="py-6 text-center text-[13.5px] text-fg-muted">No gaps in this period.</p> : (
                  <ul className="divide-y divide-border">
                    {data.gaps.map((g) => (
                      <li key={g.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
                        <Link href={`/app/${slug}/prompts/${g.id}`} className="min-w-0 flex-1 text-[13.5px] font-medium text-fg hover:text-accent">{g.text}</Link>
                        <span className="shrink-0 text-[12.5px] text-fg-muted">{g.lost}/{g.total} answers{g.topCompetitor && <> · mostly <strong className="font-medium text-fg">{g.topCompetitor}</strong></>}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </div>

          <Card className="self-start">
            <CardHeader title="Tracked competitors" description="Used for share of voice and gap analysis." />
            <CardBody>
              <CompetitorManager workspaceId={workspace.id} competitors={data.competitors.map((c) => ({ id: c.id, name: c.name, domain: c.domain }))} limit={limitsFor(workspace.plan).competitors} canEdit={hasRole(role, 'editor') && !isReadOnly(workspace)} />
            </CardBody>
          </Card>
        </div>
      </FilterScope>
    </>
  );
}
