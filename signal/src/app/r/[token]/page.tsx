import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { ReportView } from '@/components/app/report-view';
import { Wordmark } from '@/components/brand/logo';
import type { ReportSnapshot } from '@/app/app/_actions/reports';

export const metadata = { title: 'Shared report', robots: { index: false, follow: false } };

export default async function SharedReportPage({ params }: PageProps<'/r/[token]'>) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) notFound();
  const db = await getDb();
  const [report] = await db.select().from(schema.reports).where(eq(schema.reports.shareToken, token)).limit(1);
  if (!report) notFound();
  return (
    <div className="min-h-dvh bg-bg-subtle">
      <header className="no-print border-b border-border bg-bg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" aria-label="Manifest Signal"><Wordmark /></Link>
          <span className="text-[12.5px] text-fg-muted">Shared report · view only</span>
        </div>
      </header>
      <main id="main" className="px-4 py-8">
        <ReportView title={report.title} snapshot={report.snapshot as ReportSnapshot} periodStart={report.periodStart} periodEnd={report.periodEnd} summary={report.summary} />
      </main>
    </div>
  );
}
