import Link from 'next/link';
import { and, asc, desc, eq } from 'drizzle-orm';
import { ShieldCheck } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { accuracySummary } from '@/lib/queries';
import { ENGINE_BY_ID } from '@/lib/engines';
import { pct } from '@/lib/format';
import { marginPts } from '@/lib/metrics';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ClaimList } from './claim-list';
import { FactSheet } from './fact-sheet';
import { cn } from '@/lib/cn';
import type { ClaimStatus } from '@/lib/db/schema';

export const metadata = { title: 'Accuracy' };

const TABS: { id: ClaimStatus | 'all'; label: string }[] = [
  { id: 'needs_review', label: 'Needs review' },
  { id: 'inaccurate', label: 'Inaccurate' },
  { id: 'outdated', label: 'Outdated' },
  { id: 'accurate', label: 'Accurate' },
  { id: 'all', label: 'All' },
];

export default async function AccuracyPage({ params, searchParams }: PageProps<'/app/[workspace]/accuracy'>) {
  const { workspace: slug } = await params;
  const sp = await searchParams;
  const { workspace, role } = await requireWorkspace(slug);
  const status = (TABS.find((t) => t.id === sp.status)?.id ?? 'needs_review') as ClaimStatus | 'all';
  const db = await getDb();
  const [summary, facts, rows] = await Promise.all([
    accuracySummary(workspace.id),
    db.select().from(schema.facts).where(eq(schema.facts.workspaceId, workspace.id)).orderBy(asc(schema.facts.createdAt)),
    db.select({ claim: schema.claims, engine: schema.answers.engine, observedAt: schema.answers.observedAt, source: schema.answers.source, promptId: schema.prompts.id, promptText: schema.prompts.text, factLabel: schema.facts.label, factValue: schema.facts.value })
      .from(schema.claims)
      .innerJoin(schema.answers, eq(schema.answers.id, schema.claims.answerId))
      .innerJoin(schema.prompts, eq(schema.prompts.id, schema.answers.promptId))
      .leftJoin(schema.facts, eq(schema.facts.id, schema.claims.factId))
      .where(and(eq(schema.claims.workspaceId, workspace.id), status === 'all' ? undefined : eq(schema.claims.status, status)))
      .orderBy(desc(schema.answers.observedAt)).limit(60),
  ]);
  const canEdit = hasRole(role, 'editor') && !isReadOnly(workspace);
  const counts: Record<string, number> = { needs_review: summary.needsReview, inaccurate: summary.inaccurate, outdated: summary.outdated, accurate: summary.accurate };

  return (
    <>
      <PageHeader title="Accuracy" description={`Statements engines make about ${workspace.brandName}, checked against your fact sheet. Review the ones that could not be confirmed automatically.`} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <nav aria-label="Claim status" className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
            {TABS.map((t) => (
              <Link key={t.id} href={`?status=${t.id}`} scroll={false} aria-current={status === t.id ? 'page' : undefined}
                className={cn('-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13.5px] font-medium', status === t.id ? 'border-accent text-fg' : 'border-transparent text-fg-muted hover:text-fg')}>
                {t.label}{t.id !== 'all' && <span className="rounded-full bg-bg-muted px-1.5 text-[11px] tabular text-fg-muted">{counts[t.id] ?? 0}</span>}
              </Link>
            ))}
          </nav>
          {rows.length === 0 ? (
            <Card><EmptyState icon={<ShieldCheck />} title={status === 'needs_review' ? 'Nothing to review' : 'No claims here'} description={status === 'needs_review' ? 'New claims appear after each run. Claims that match your fact sheet are confirmed automatically.' : 'Claims you review will appear in this list.'} /></Card>
          ) : (
            <ClaimList workspaceId={workspace.id} slug={slug} canEdit={canEdit} claims={rows.map((r) => ({
              id: r.claim.id, text: r.claim.text, status: r.claim.status, note: r.claim.note, engine: ENGINE_BY_ID[r.engine].name, engineSlot: ENGINE_BY_ID[r.engine].slot,
              promptId: r.promptId, promptText: r.promptText, observedAt: r.observedAt.toISOString(), fact: r.factLabel ? { label: r.factLabel, value: r.factValue! } : null, sample: r.source === 'sample',
            }))} />
          )}
        </div>
        <div className="grid content-start gap-5">
          <Card className="p-5">
            <p className="text-[13px] font-medium text-fg-muted">Accuracy of reviewed claims</p>
            <p className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-fg">{pct(summary.rate.value)}</p>
            <p className="mt-1 text-[12px] text-fg-faint">{summary.rate.n ? `±${marginPts(summary.rate)} pts · ${summary.rate.n} reviewed` : 'Review claims to calculate accuracy.'}</p>
          </Card>
          <Card id="fact-sheet" className="scroll-mt-20">
            <CardHeader title="Fact sheet" description="Claims that restate these values are confirmed automatically." />
            <CardBody><FactSheet workspaceId={workspace.id} facts={facts.map((f) => ({ id: f.id, label: f.label, value: f.value }))} canEdit={canEdit} /></CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
