import 'server-only';
import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { TrafficSource, Workspace } from '@/lib/db/schema';
import { AI_SOURCES, SOURCE_LABEL, SOURCE_SLOT } from '@/lib/traffic';
import { newId } from '@/lib/utils';
import { rng } from '@/lib/providers/sample';

export async function trafficData(workspace: Workspace, days: number) {
  const db = await getDb();
  const since = new Date(Date.now() - days * 86400_000);
  const scope = and(eq(schema.trafficEvents.workspaceId, workspace.id), eq(schema.trafficEvents.dataSource, workspace.dataMode), gte(schema.trafficEvents.occurredAt, since));
  const day = sql<string>`to_char(date_trunc('day', ${schema.trafficEvents.occurredAt}), 'YYYY-MM-DD')`;

  const [bySource, daily, pages, [last], [visitors]] = await Promise.all([
    db.select({ source: schema.trafficEvents.source, n: sql<number>`count(*)::int` }).from(schema.trafficEvents).where(scope).groupBy(schema.trafficEvents.source),
    db.select({ day, source: schema.trafficEvents.source, n: sql<number>`count(*)::int` }).from(schema.trafficEvents)
      .where(and(scope, inArray(schema.trafficEvents.source, AI_SOURCES))).groupBy(day, schema.trafficEvents.source),
    db.select({ path: schema.trafficEvents.landingPath, source: schema.trafficEvents.source, n: sql<number>`count(*)::int` }).from(schema.trafficEvents)
      .where(and(scope, inArray(schema.trafficEvents.source, AI_SOURCES))).groupBy(schema.trafficEvents.landingPath, schema.trafficEvents.source),
    db.select({ at: schema.trafficEvents.occurredAt }).from(schema.trafficEvents).where(and(eq(schema.trafficEvents.workspaceId, workspace.id), eq(schema.trafficEvents.dataSource, 'live'))).orderBy(desc(schema.trafficEvents.occurredAt)).limit(1),
    db.select({ n: sql<number>`count(distinct ${schema.trafficEvents.visitorHash})::int` }).from(schema.trafficEvents).where(and(scope, inArray(schema.trafficEvents.source, AI_SOURCES))),
  ]);

  const total = bySource.reduce((s, r) => s + r.n, 0);
  const ai = bySource.filter((r) => AI_SOURCES.includes(r.source)).reduce((s, r) => s + r.n, 0);
  const keys = Array.from({ length: days }, (_, i) => new Date(Date.now() - (days - 1 - i) * 86400_000).toISOString().slice(0, 10));
  const weekly = days > 30;
  const buckets = weekly ? keys.filter((_, i) => i % 7 === (days - 1) % 7) : keys;
  const bucketOf = (k: string) => (weekly ? buckets.find((b) => b >= k) ?? buckets.at(-1)! : k);
  const activeAi = AI_SOURCES.filter((s) => bySource.some((r) => r.source === s && r.n > 0));

  const pageMap = new Map<string, { path: string; total: number; bySource: Partial<Record<TrafficSource, number>> }>();
  for (const p of pages) {
    const e = pageMap.get(p.path) ?? { path: p.path, total: 0, bySource: {} };
    e.total += p.n;
    e.bySource[p.source] = (e.bySource[p.source] ?? 0) + p.n;
    pageMap.set(p.path, e);
  }

  return {
    total,
    ai,
    aiVisitors: visitors?.n ?? 0,
    share: total ? ai / total : null,
    bySource: [...bySource].sort((a, b) => b.n - a.n).map((r) => ({ ...r, label: SOURCE_LABEL[r.source], ai: AI_SOURCES.includes(r.source) })),
    trend: {
      labels: buckets.map((b) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${b}T00:00:00Z`))),
      series: activeAi.map((s) => ({
        id: s, label: SOURCE_LABEL[s], slot: SOURCE_SLOT[s] ?? 5,
        values: buckets.map((b) => daily.filter((d) => d.source === s && bucketOf(d.day) === b).reduce((sum, d) => sum + d.n, 0)),
      })),
    },
    pages: [...pageMap.values()].sort((a, b) => b.total - a.total).slice(0, 10),
    lastLiveEvent: last?.at ?? null,
  };
}

const SAMPLE_PATHS = ['/', '/pricing', '/services', '/about', '/contact', '/blog/how-to-choose', '/blog/buyers-guide', '/case-studies', '/faq'];

/** Labeled sample landings so the AI traffic view is explorable before the snippet is installed. */
export async function seedSampleTraffic(workspaceId: string, days = 56) {
  const db = await getDb();
  const r = rng(`traffic|${workspaceId}`);
  const rows: (typeof schema.trafficEvents.$inferInsert)[] = [];
  const aiMix: [TrafficSource, number][] = [['chatgpt', 0.56], ['perplexity', 0.2], ['gemini', 0.1], ['claude', 0.08], ['copilot', 0.06]];
  const other: [TrafficSource, number][] = [['search', 0.55], ['direct', 0.25], ['referral', 0.12], ['social', 0.08]];
  const pick = (mix: [TrafficSource, number][]) => { let x = r(); for (const [s, w] of mix) { if ((x -= w) <= 0) return s; } return mix[0]![0]; };
  for (let d = days - 1; d >= 0; d--) {
    const progress = 1 - d / days;
    const total = 70 + Math.floor(r() * 50);
    const aiShare = 0.025 + 0.035 * progress;
    for (let i = 0; i < total; i++) {
      const isAi = r() < aiShare;
      const source = isAi ? pick(aiMix) : pick(other);
      rows.push({
        id: newId('trf'), workspaceId, source, dataSource: 'sample',
        referrerHost: source === 'direct' ? null : source === 'search' ? 'google.com' : source === 'social' ? 'linkedin.com' : source === 'referral' ? 'example.org' : null,
        landingPath: SAMPLE_PATHS[Math.floor(r() * (isAi ? 6 : SAMPLE_PATHS.length))]!,
        visitorHash: `s${Math.floor(r() * 1e9).toString(36)}`,
        occurredAt: new Date(Date.now() - d * 86400_000 - Math.floor(r() * 86400_000)),
      });
    }
  }
  for (let i = 0; i < rows.length; i += 1000) await db.insert(schema.trafficEvents).values(rows.slice(i, i + 1000));
}
