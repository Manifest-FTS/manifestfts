import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { absoluteUrl } from '@/lib/site';
import { ReportView } from '@/components/app/report-view';
import { ReportToolbar, SummaryEditor } from './report-controls';
import type { ReportSnapshot } from '@/app/app/_actions/reports';

export const metadata = { title: 'Report' };

export default async function ReportPage({ params }: PageProps<'/app/[workspace]/reports/[id]'>) {
  const { workspace: slug, id } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const [report] = await db.select().from(schema.reports).where(and(eq(schema.reports.id, id), eq(schema.reports.workspaceId, workspace.id)));
  if (!report) notFound();
  const canEdit = hasRole(role, 'editor') && !isReadOnly(workspace);
  return (
    <>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/app/${slug}/reports`} className="inline-flex items-center gap-1 text-[13px] font-medium text-fg-muted hover:text-fg"><ArrowLeft className="size-3.5" aria-hidden />All reports</Link>
        <ReportToolbar workspaceId={workspace.id} reportId={report.id} slug={slug} shareUrl={report.shareToken ? absoluteUrl(`/r/${report.shareToken}`) : null} canShare={hasRole(role, 'admin')} canEdit={canEdit} />
      </div>
      <ReportView
        title={report.title}
        snapshot={report.snapshot as ReportSnapshot}
        periodStart={report.periodStart}
        periodEnd={report.periodEnd}
        summary={report.summary}
        summarySlot={canEdit ? <SummaryEditor workspaceId={workspace.id} reportId={report.id} initial={report.summary} /> : undefined}
      />
    </>
  );
}
