import Link from 'next/link';
import { ArrowRight, FileSearch, Inbox, ListChecks, MessageSquareQuote, Users } from 'lucide-react';
import { requireWorkspace } from '@/lib/workspace';
import { accuracySummary, latestAudit, latestRun, openTasks, overviewData, parseFilters, workspaceTopics } from '@/lib/queries';
import { PageHeader } from '@/components/app/page-header';
import { FilterScope } from '@/components/app/filters';
import { StatTile } from '@/components/app/stat-tile';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonClass } from '@/components/ui/button';
import { LineChart } from '@/components/charts/line-chart';
import { IntervalBar } from '@/components/charts/bars';
import { ScoreRing } from '@/components/readiness/report-view';
import { ENGINE_BY_ID } from '@/lib/engines';
import { pct, relativeTime } from '@/lib/format';
import { marginPts } from '@/lib/metrics';
import { PriorityBadge } from '@/components/app/task-badges';

export const metadata = { title: 'Overview' };

export default async function OverviewPage({ params, searchParams }: PageProps<'/app/[workspace]/overview'>) {
  const { workspace: slug } = await params;
  const sp = await searchParams;
  const { workspace } = await requireWorkspace(slug);
  const filters = parseFilters(sp);
  const [data, topics, accuracy, tasks, run, audit] = await Promise.all([
    overviewData(workspace, filters),
    workspaceTopics(workspace.id),
    accuracySummary(workspace.id),
    openTasks(workspace.id, 5),
    latestRun(workspace.id),
    latestAudit(workspace.id),
  ]);
  const base = `/app/${slug}`;
  const c = data.current;

  return (
    <>
      <PageHeader
        title="Overview"
        description={<>How answer engines represented <strong className="font-medium text-fg">{workspace.brandName}</strong> in the last {filters.days} days{run?.completedAt ? <> · last run {relativeTime(run.completedAt)}</> : null}.</>}
      />

      {sp.welcome && (
        <div className="mb-6 overflow-hidden rounded-panel border border-accent/25 bg-accent-subtle/60 p-5 sm:p-6">
          <h2 className="text-[16px] font-semibold text-fg">Your workspace is ready</h2>
          <p className="mt-1 text-[14px] text-fg-soft">We loaded eight weeks of labeled sample data so you can explore every view. A readiness audit of {workspace.domain} is running in the background.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { href: `${base}/prompts`, icon: MessageSquareQuote, label: 'Review your prompts' },
              { href: `${base}/readiness`, icon: FileSearch, label: 'See readiness results' },
              { href: `${base}/settings/members`, icon: Users, label: 'Invite your team' },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl border border-border bg-panel px-4 py-3 text-[13.5px] font-medium text-fg shadow-card transition hover:shadow-raised">
                <Icon className="size-4 text-accent" aria-hidden />{label}<ArrowRight className="ml-auto size-3.5 text-fg-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      )}

      <FilterScope topics={topics}>
        {c.n === 0 ? (
          <Card>
            <EmptyState icon={<Inbox />} title="No observations in this period" description="Start a run to collect answers, or widen the date range and filters." action={<Link href={`${base}/prompts`} className={buttonClass({ variant: 'secondary' })}>Review prompts</Link>} />
          </Card>
        ) : (
          <div className="grid gap-5">
            <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile label="Mention rate" rate={c.mention} change={data.changes.mention} trend={data.trend.overall} help="Share of answers that name your brand. Denominator: all answers in the period." />
              <StatTile label="Citation rate" rate={c.citation} change={data.changes.citation} help="Share of answers that cite a page on your domain." />
              <StatTile label="Share of voice" rate={c.shareOfVoice} change={data.changes.shareOfVoice} help="Your mentions divided by all mentions of you and tracked competitors." />
              <StatTile label="Accuracy" rate={accuracy.rate} emptyLabel="No reviewed claims yet" help="Share of reviewed claims about your brand marked accurate (all time)." />
            </section>

            <div className="grid gap-5 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader title="Mention rate by engine" description={`Share of answers naming ${workspace.brandName}, by ${filters.days <= 7 ? 'day' : 'week'}.`} />
                <CardBody>
                  <LineChart title="Mention rate by engine" labels={data.trend.labels} series={data.trend.series} max={1} description={`${c.n.toLocaleString()} answers. Hover or use arrow keys for values.`} />
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="By engine" description="Mention rate with 95% interval." />
                <CardBody>
                  <ul className="grid gap-5">
                    {data.byEngine.map((e) => (
                      <li key={e.engine}>
                        <div className="mb-2 flex items-baseline justify-between gap-3">
                          <span className="flex items-center gap-2 text-[13.5px] font-medium text-fg"><span className="size-2 rounded-full" style={{ background: `var(--series-${ENGINE_BY_ID[e.engine].slot})` }} aria-hidden />{ENGINE_BY_ID[e.engine].name}</span>
                          <span className="text-[13px] text-fg tabular"><strong className="font-semibold">{pct(e.mention.value)}</strong><span className="ml-1.5 text-fg-faint">±{marginPts(e.mention)} · n={e.n}</span></span>
                        </div>
                        <IntervalBar value={e.mention.value} low={e.mention.low} high={e.mention.high} slot={ENGINE_BY_ID[e.engine].slot} label={`${ENGINE_BY_ID[e.engine].name} mention rate`} />
                        <p className="mt-1.5 text-[11.5px] text-fg-faint">Cited {pct(e.citation.value)} · first named {pct(e.firstPosition.value)} of mentions</p>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <Card>
                <CardHeader title="Most cited sources" description="Domains engines relied on, by share of answers." action={<Link href={`${base}/sources`} className="text-[13px] font-medium text-accent hover:underline">View all</Link>} />
                <CardBody className="pt-4">
                  <ul className="divide-y divide-border">
                    {data.sources.map((s) => (
                      <li key={s.domain} className="flex items-center gap-3 py-2.5">
                        <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-fg">{s.domain}</span>
                        {s.kind === 'owned' ? <Badge tone="success">Yours</Badge> : s.kind === 'competitor' ? <Badge tone="warning">{s.competitorName}</Badge> : <Badge tone="outline">Third party</Badge>}
                        <span className="w-14 text-right text-[13px] font-semibold text-fg tabular">{pct(s.share)}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Top open tasks" description="Prioritized by impact; each links to its evidence." action={<Link href={`${base}/tasks`} className="text-[13px] font-medium text-accent hover:underline">All tasks</Link>} />
                <CardBody className="pt-4">
                  {tasks.length === 0 ? (
                    <EmptyState icon={<ListChecks />} title="No open tasks" description="New recommendations appear after runs and audits." className="py-8" />
                  ) : (
                    <ul className="divide-y divide-border">
                      {tasks.map((t) => (
                        <li key={t.id}>
                          <Link href={`${base}/tasks?task=${t.id}`} className="flex items-start gap-3 py-2.5 hover:opacity-80">
                            <PriorityBadge priority={t.priority} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13.5px] font-medium text-fg">{t.title}</span>
                              {t.evidence && <span className="block truncate text-[12px] text-fg-faint">{t.evidence.label}</span>}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Card className="flex items-center gap-5 p-5">
                {audit ? <ScoreRing score={audit.score} size={88} /> : <div className="skeleton size-[88px] rounded-full" />}
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-fg">AI readiness</h2>
                  <p className="mt-1 text-[13px] text-fg-muted">{audit ? <>Audited {relativeTime(audit.createdAt)} · {audit.results.filter((r) => r.status === 'fail').length} failing checks</> : 'The first audit is running or has not been started.'}</p>
                  <Link href={`${base}/readiness`} className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline">Open readiness <ArrowRight className="size-3.5" aria-hidden /></Link>
                </div>
              </Card>
              <Card className="p-5">
                <h2 className="text-[15px] font-semibold text-fg">Accuracy review</h2>
                <p className="mt-1 text-[13px] text-fg-muted">{accuracy.needsReview ? `${accuracy.needsReview} claims about ${workspace.brandName} are waiting for review.` : 'No claims are waiting for review.'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="success" dot>{accuracy.accurate} accurate</Badge>
                  <Badge tone="danger" dot>{accuracy.inaccurate} inaccurate</Badge>
                  <Badge tone="warning" dot>{accuracy.needsReview} to review</Badge>
                </div>
                <Link href={`${base}/accuracy`} className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline">Review claims <ArrowRight className="size-3.5" aria-hidden /></Link>
              </Card>
            </div>
          </div>
        )}
      </FilterScope>
    </>
  );
}
