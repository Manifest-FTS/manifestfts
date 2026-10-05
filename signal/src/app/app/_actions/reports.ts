'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { and, eq, gte } from 'drizzle-orm';
import { schema } from '@/lib/db';
import { authorize, isReadOnly, logActivity } from '@/lib/workspace';
import { overviewData, accuracySummary, competitorsData } from '@/lib/queries';
import { newId } from '@/lib/utils';
import type { ActionState } from './workspace';

export interface ReportSnapshot {
  brandName: string;
  domain: string;
  days: number;
  dataMode: 'sample' | 'live';
  n: number;
  mention: { value: number | null; low: number | null; high: number | null; n: number };
  citation: { value: number | null; low: number | null; high: number | null; n: number };
  shareOfVoice: { value: number | null; low: number | null; high: number | null; n: number };
  changes: { mention: number; citation: number; mentionMeaningful: boolean; citationMeaningful: boolean; hasPrev: boolean };
  byEngine: { engine: string; mention: number | null; low: number | null; high: number | null; citation: number | null; n: number }[];
  trend: { labels: string[]; series: { id: string; label: string; slot: number; values: (number | null)[] }[] };
  sources: { domain: string; share: number; kind: string }[];
  competitors: { name: string; isBrand: boolean; share: number | null; mention: number | null }[];
  accuracy: { accurate: number; inaccurate: number; needsReview: number; rate: number | null };
  completedTasks: { title: string; category: string }[];
}

const strip = (r: { value: number | null; low: number | null; high: number | null; n: number }) => ({ value: r.value, low: r.low, high: r.high, n: r.n });

export async function createReport(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object({ workspaceId: z.string(), title: z.string().trim().min(3, 'Add a title.').max(120), days: z.coerce.number().refine((d) => [7, 30, 90].includes(d)) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  const auth = await authorize(parsed.data.workspaceId, 'editor');
  if (!auth.ok) return { error: auth.error };
  if (isReadOnly(auth.workspace)) return { error: 'This workspace is read-only.' };
  const days = parsed.data.days as 7 | 30 | 90;
  const filters = { days, engine: 'all' as const, topic: 'all' };
  const [data, accuracy, comp] = await Promise.all([overviewData(auth.workspace, filters), accuracySummary(auth.workspace.id), competitorsData(auth.workspace, filters)]);
  const since = new Date(Date.now() - days * 86400_000);
  const completed = await auth.db.select({ title: schema.tasks.title, category: schema.tasks.category }).from(schema.tasks)
    .where(and(eq(schema.tasks.workspaceId, auth.workspace.id), eq(schema.tasks.status, 'done'), gte(schema.tasks.completedAt, since))).limit(20);

  const snapshot: ReportSnapshot = {
    brandName: auth.workspace.brandName,
    domain: auth.workspace.domain,
    days,
    dataMode: auth.workspace.dataMode,
    n: data.current.n,
    mention: strip(data.current.mention),
    citation: strip(data.current.citation),
    shareOfVoice: strip(data.current.shareOfVoice),
    changes: { mention: data.changes.mention.delta, citation: data.changes.citation.delta, mentionMeaningful: data.changes.mention.meaningful, citationMeaningful: data.changes.citation.meaningful, hasPrev: data.changes.mention.hasPrev },
    byEngine: data.byEngine.map((e) => ({ engine: e.engine, mention: e.mention.value, low: e.mention.low, high: e.mention.high, citation: e.citation.value, n: e.n })),
    trend: data.trend,
    sources: data.sources.map((s) => ({ domain: s.domain, share: s.share, kind: s.kind })),
    competitors: comp.rows.map((r) => ({ name: r.name, isBrand: r.isBrand, share: r.share.value, mention: r.mention.value })),
    accuracy: { accurate: accuracy.accurate, inaccurate: accuracy.inaccurate, needsReview: accuracy.needsReview, rate: accuracy.rate.value },
    completedTasks: completed,
  };
  const id = newId('rpt');
  await auth.db.insert(schema.reports).values({ id, workspaceId: auth.workspace.id, title: parsed.data.title, periodStart: since, periodEnd: new Date(), snapshot, createdById: auth.user.id });
  await logActivity(auth.workspace.id, auth.user.id, 'report.created', parsed.data.title);
  redirect(`/app/${auth.workspace.slug}/reports/${id}`);
}
