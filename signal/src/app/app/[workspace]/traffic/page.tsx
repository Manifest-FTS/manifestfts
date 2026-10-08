import { and, eq } from 'drizzle-orm';
import { Bot, CircleCheck, Clock } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace } from '@/lib/workspace';
import { seedSampleTraffic, trafficData } from '@/lib/traffic-data';
import { parseFilters } from '@/lib/queries';
import { randomToken } from '@/lib/auth/tokens';
import { absoluteUrl } from '@/lib/site';
import { pct, relativeTime } from '@/lib/format';
import { SOURCE_SLOT } from '@/lib/traffic';
import { PageHeader } from '@/components/app/page-header';
import { FilterScope } from '@/components/app/filters';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LineChart } from '@/components/charts/line-chart';
import { BarList } from '@/components/charts/bars';
import { CopyButton } from '@/components/tools/shared';

export const metadata = { title: 'AI traffic' };

export default async function TrafficPage({ params, searchParams }: PageProps<'/app/[workspace]/traffic'>) {
  const { workspace: slug } = await params;
  const { workspace } = await requireWorkspace(slug);
  const filters = parseFilters(await searchParams);
  let key = workspace.trackingKey;
  if (!key) {
    key = `sg_${randomToken(18)}`;
    const db = await getDb();
    await db.update(schema.workspaces).set({ trackingKey: key }).where(eq(schema.workspaces.id, workspace.id));
  }
  let data = await trafficData(workspace, filters.days);
  // Sample workspaces created before AI traffic existed get labeled sample landings once.
  if (workspace.dataMode === 'sample' && data.total === 0) {
    const db = await getDb();
    const [any] = await db.select({ id: schema.trafficEvents.id }).from(schema.trafficEvents).where(and(eq(schema.trafficEvents.workspaceId, workspace.id), eq(schema.trafficEvents.dataSource, 'sample'))).limit(1);
    if (!any) {
      await seedSampleTraffic(workspace.id);
      data = await trafficData(workspace, filters.days);
    }
  }
  const snippet = `<script defer src="${absoluteUrl('/t.js')}" data-key="${key}"></script>`;
  const top = data.bySource.find((s) => s.ai);

  return (
    <>
      <PageHeader title="AI traffic" description={`Visits to ${workspace.domain} that arrive from AI assistants, so you can connect visibility in answers to real sessions.`} />

      <Card className="mb-5">
        <CardHeader
          title="Tracking snippet"
          description="Add once to every page, before </head>. One landing per session; no cookies, no personal data, and Global Privacy Control is respected."
          action={data.lastLiveEvent ? <Badge tone="success"><CircleCheck aria-hidden />Receiving data · {relativeTime(data.lastLiveEvent)}</Badge> : <Badge tone="warning"><Clock aria-hidden />Waiting for first visit</Badge>}
        />
        <CardBody className="grid gap-3">
          <div className="flex items-start gap-2">
            <pre className="min-w-0 flex-1 overflow-x-auto rounded-xl border border-border bg-bg-subtle p-3 font-mono text-[12.5px] text-fg-soft"><code>{snippet}</code></pre>
            <CopyButton text={snippet} />
          </div>
          <p className="text-[12.5px] text-fg-faint">Only landings on {workspace.domain} and its subdomains are counted. AI crawlers do not run JavaScript, so this measures people who clicked through from an assistant, not bot fetches.</p>
        </CardBody>
      </Card>

      <FilterScope showEngine={false} showTopic={false}>
        {data.total === 0 ? (
          <Card><EmptyState icon={<Bot />} title="No visits recorded in this period" description="Install the snippet above. Landings from ChatGPT, Perplexity, Gemini, Claude, Copilot, and other assistants will appear here within minutes." /></Card>
        ) : (
          <div className="grid gap-5">
            <section aria-label="AI traffic summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Landings from AI assistants', data.ai.toLocaleString(), `${filters.days} days`],
                ['Share of all landings', pct(data.share, 1), `of ${data.total.toLocaleString()} landings`],
                ['Unique AI visitors', data.aiVisitors.toLocaleString(), 'daily-unique, anonymized'],
                ['Top AI source', top?.label ?? '—', top ? `${top.n.toLocaleString()} landings` : 'No AI landings yet'],
              ].map(([l, v, sub]) => (
                <div key={l} className="rounded-panel border border-border bg-panel p-5 shadow-card">
                  <p className="text-[13px] font-medium text-fg-muted">{l}</p>
                  <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.04em] text-fg">{v}</p>
                  <p className="mt-2 text-[12px] text-fg-faint">{sub}</p>
                </div>
              ))}
            </section>
            <div className="grid gap-5 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader title="AI landings by assistant" description={filters.days > 30 ? 'Weekly landings.' : 'Daily landings.'} />
                <CardBody>
                  {data.trend.series.length ? <LineChart title="AI landings by assistant" labels={data.trend.labels} series={data.trend.series} valueFormat="count" /> : <p className="py-10 text-center text-[13.5px] text-fg-muted">No AI landings in this period yet.</p>}
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="All sources" description="Landings by referrer type." />
                <CardBody>
                  <BarList items={data.bySource.map((s) => ({ id: s.source, label: <span className="flex items-center gap-2">{s.label}{s.ai && <Badge tone="accent" className="h-[18px] px-1.5 text-[10.5px]">AI</Badge>}</span>, value: s.n, slot: s.ai ? SOURCE_SLOT[s.source] : undefined }))} format={(v) => v.toLocaleString()} max={data.bySource[0]?.n} />
                </CardBody>
              </Card>
            </div>
            <Card>
              <CardHeader title="Top landing pages from AI assistants" description="Where AI-referred visitors arrive. Strengthen these pages first." />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-[13.5px] tabular">
                  <caption className="sr-only">Landing pages by AI source</caption>
                  <thead><tr className="border-y border-border bg-bg-subtle text-left text-[12px] text-fg-muted">
                    <th scope="col" className="px-5 py-2.5 font-medium">Page</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">AI landings</th>
                    <th scope="col" className="px-5 py-2.5 font-medium">Assistants</th>
                  </tr></thead>
                  <tbody>
                    {data.pages.map((p) => (
                      <tr key={p.path} className="border-b border-border last:border-0">
                        <th scope="row" className="px-5 py-3 text-left font-mono text-[12.5px] font-normal text-fg">{p.path}</th>
                        <td className="px-5 py-3 text-right font-semibold text-fg">{p.total.toLocaleString()}</td>
                        <td className="px-5 py-3 text-[12.5px] text-fg-muted">{Object.entries(p.bySource).sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s === 'chatgpt' ? 'ChatGPT' : s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')} ${n}`).join(' · ')}</td>
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
