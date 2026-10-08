import Link from 'next/link';
import { and, desc, eq } from 'drizzle-orm';
import { FileSearch } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { formatDateTime, relativeTime } from '@/lib/format';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ChecksList, CrawlerAccessView, GeoReport, ScoreRing } from '@/components/readiness/report-view';
import { AuditForm } from './audit-form';
import { cn } from '@/lib/cn';

export const metadata = { title: 'Readiness' };

export default async function ReadinessPage({ params, searchParams }: PageProps<'/app/[workspace]/readiness'>) {
  const { workspace: slug } = await params;
  const sp = await searchParams;
  const { workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const history = await db.select({ id: schema.audits.id, url: schema.audits.url, score: schema.audits.score, createdAt: schema.audits.createdAt })
    .from(schema.audits).where(eq(schema.audits.workspaceId, workspace.id)).orderBy(desc(schema.audits.createdAt)).limit(12);
  const selectedId = typeof sp.audit === 'string' ? sp.audit : history[0]?.id;
  const [audit] = selectedId ? await db.select().from(schema.audits).where(and(eq(schema.audits.id, selectedId), eq(schema.audits.workspaceId, workspace.id))).limit(1) : [];
  const canRun = hasRole(role, 'editor') && !isReadOnly(workspace);
  const counts = audit ? { fail: audit.results.filter((r) => r.status === 'fail').length, warn: audit.results.filter((r) => r.status === 'warn').length, pass: audit.results.filter((r) => r.status === 'pass').length } : null;

  return (
    <>
      <PageHeader title="Readiness" description="GEO audit: whether answer engines can reach, parse, trust, and cite your pages. Failing checks become tasks and close automatically when a later audit passes." />
      <Card className="mb-5 p-5">
        <AuditForm workspaceId={workspace.id} defaultUrl={audit?.url ?? `https://${workspace.domain}`} disabled={!canRun} />
        <p className="mt-2 text-[12px] text-fg-faint">Audit any page on {workspace.domain}. Checks run from our servers as ManifestSignalBot and take about ten seconds.</p>
      </Card>

      {!audit ? (
        <Card><EmptyState icon={<FileSearch />} title="No audits yet" description={`Run an audit of ${workspace.domain} to check crawler access, metadata, and structured data.`} /></Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          {audit.subscores && audit.details ? (
            <GeoReport
              score={audit.score}
              subscores={audit.subscores}
              crawlers={audit.crawlers}
              details={audit.details}
              results={audit.results}
              header={
                <>
                  <p className="mt-3 break-all font-mono text-[13px] text-fg-soft">{audit.url}</p>
                  <p className="mt-1 text-[12px] text-fg-faint">{counts!.fail} failing · {counts!.warn} warnings · {counts!.pass} passing · audited {formatDateTime(audit.createdAt)}{audit.durationMs ? ` in ${(audit.durationMs / 1000).toFixed(1)}s` : ''}</p>
                </>
              }
            />
          ) : (
            <div className="grid gap-5">
              <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                <ScoreRing score={audit.score} />
                <div className="min-w-0">
                  <h2 className="break-all font-mono text-[15px] font-semibold text-fg">{audit.url}</h2>
                  <p className="mt-1 text-[13.5px] text-fg-muted">{counts!.fail} failing · {counts!.warn} warnings · {counts!.pass} passing</p>
                  <p className="mt-1 text-[12px] text-fg-faint">Audited {formatDateTime(audit.createdAt)} with an earlier version of the audit. Run a new audit for the full GEO report.</p>
                </div>
              </Card>
              {audit.crawlers.length > 0 && (
                <Card>
                  <CardHeader title="AI crawler access" />
                  <CardBody><CrawlerAccessView crawlers={audit.crawlers} /></CardBody>
                </Card>
              )}
              <Card>
                <CardHeader title="Checks" />
                <CardBody><ChecksList results={audit.results} /></CardBody>
              </Card>
            </div>
          )}
          <Card className="self-start">
            <CardHeader title="Audit history" />
            <CardBody className="pt-3">
              <ol className="grid gap-1">
                {history.map((h) => (
                  <li key={h.id}>
                    <Link href={`?audit=${h.id}`} scroll={false} aria-current={h.id === audit.id ? 'true' : undefined}
                      className={cn('flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] transition hover:bg-bg-muted', h.id === audit.id && 'bg-bg-muted')}>
                      <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg text-[12px] font-semibold tabular', h.score >= 80 ? 'bg-success-subtle text-success-on-subtle' : h.score >= 55 ? 'bg-warning-subtle text-warning-on-subtle' : 'bg-danger-subtle text-danger-on-subtle')}>{h.score}</span>
                      <span className="min-w-0"><span className="block truncate font-mono text-[12px] text-fg">{new URL(h.url).pathname}</span><span className="block text-[11.5px] text-fg-faint">{relativeTime(h.createdAt)}</span></span>
                    </Link>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
