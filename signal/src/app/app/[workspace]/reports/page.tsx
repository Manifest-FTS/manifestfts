import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { FileText, Globe2 } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/app/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { NewReport } from './new-report';

export const metadata = { title: 'Reports' };

export default async function ReportsPage({ params }: PageProps<'/app/[workspace]/reports'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const reports = await db.select({ id: schema.reports.id, title: schema.reports.title, periodStart: schema.reports.periodStart, periodEnd: schema.reports.periodEnd, shareToken: schema.reports.shareToken, createdAt: schema.reports.createdAt })
    .from(schema.reports).where(eq(schema.reports.workspaceId, workspace.id)).orderBy(desc(schema.reports.createdAt));
  const canCreate = hasRole(role, 'editor') && !isReadOnly(workspace);
  const month = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
  return (
    <>
      <PageHeader title="Reports" description="Fixed snapshots of a period’s results with your commentary. Print them or share a private link." actions={canCreate && <NewReport workspaceId={workspace.id} defaultTitle={`${workspace.brandName} AI visibility · ${month}`} />} />
      {reports.length === 0 ? (
        <Card><EmptyState icon={<FileText />} title="No reports yet" description="Create a report to share progress with leadership or clients." /></Card>
      ) : (
        <Card className="divide-y divide-border">
          {reports.map((r) => (
            <Link key={r.id} href={`/app/${slug}/reports/${r.id}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-bg-subtle">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-subtle text-accent"><FileText className="size-5" aria-hidden /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] font-medium text-fg">{r.title}</span>
                <span className="block text-[12.5px] text-fg-muted">{formatDate(r.periodStart)} – {formatDate(r.periodEnd)}</span>
              </span>
              {r.shareToken && <Badge tone="success"><Globe2 aria-hidden />Shared</Badge>}
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
