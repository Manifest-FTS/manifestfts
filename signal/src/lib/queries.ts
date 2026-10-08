import 'server-only';
import { and, asc, desc, eq, gte, inArray, lt, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { EngineId, Workspace } from '@/lib/db/schema';
import { summarize, isMeaningfulChange, wilson } from '@/lib/metrics';
import { ENGINES, ENGINE_BY_ID } from '@/lib/engines';
import { domainMatches } from '@/lib/analysis';

export interface Filters {
  days: 7 | 30 | 90;
  engine: EngineId | 'all';
  topic: string | 'all';
}

export function parseFilters(params: Record<string, string | string[] | undefined>): Filters {
  const days = Number(params.range);
  const engine = typeof params.engine === 'string' && ENGINES.some((e) => e.id === params.engine) ? (params.engine as EngineId) : 'all';
  const topic = typeof params.topic === 'string' && params.topic ? params.topic : 'all';
  return { days: days === 7 || days === 90 ? days : 30, engine, topic };
}

async function loadAnswers(workspace: Workspace, from: Date, to: Date, filters: Filters) {
  const db = await getDb();
  const rows = await db
    .select({
      id: schema.answers.id,
      promptId: schema.answers.promptId,
      engine: schema.answers.engine,
      brandMentioned: schema.answers.brandMentioned,
      brandCited: schema.answers.brandCited,
      brandPosition: schema.answers.brandPosition,
      sentiment: schema.answers.sentiment,
      competitorMentions: schema.answers.competitorMentions,
      citations: schema.answers.citations,
      observedAt: schema.answers.observedAt,
      topic: schema.prompts.topic,
      intent: schema.prompts.intent,
    })
    .from(schema.answers)
    .innerJoin(schema.prompts, eq(schema.prompts.id, schema.answers.promptId))
    .where(and(
      eq(schema.answers.workspaceId, workspace.id),
      eq(schema.answers.source, workspace.dataMode),
      gte(schema.answers.observedAt, from),
      lt(schema.answers.observedAt, to),
      filters.engine !== 'all' ? eq(schema.answers.engine, filters.engine) : undefined,
      filters.topic !== 'all' ? eq(schema.prompts.topic, filters.topic) : undefined,
    ));
  return rows;
}

export type AnswerRow = Awaited<ReturnType<typeof loadAnswers>>[number];

function windows(days: number) {
  const now = new Date();
  const from = new Date(now.getTime() - days * 86400_000);
  const prevFrom = new Date(from.getTime() - days * 86400_000);
  return { now, from, prevFrom };
}

function bucketKey(d: Date, days: number) {
  if (days <= 7) return d.toISOString().slice(0, 10);
  // ISO-ish week bucket anchored on Monday (UTC).
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7));
  return day.toISOString().slice(0, 10);
}

function bucketLabel(key: string, days: number) {
  const d = new Date(`${key}T00:00:00Z`);
  const label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(d);
  return days <= 7 ? label : `Wk of ${label}`;
}

export async function workspaceTopics(workspaceId: string) {
  const db = await getDb();
  const rows = await db.selectDistinct({ topic: schema.prompts.topic }).from(schema.prompts).where(eq(schema.prompts.workspaceId, workspaceId)).orderBy(asc(schema.prompts.topic));
  return rows.map((r) => r.topic);
}

export async function overviewData(workspace: Workspace, filters: Filters) {
  const { now, from, prevFrom } = windows(filters.days);
  const [current, previous] = await Promise.all([loadAnswers(workspace, from, now, filters), loadAnswers(workspace, prevFrom, from, filters)]);
  const cur = summarize(current);
  const prev = summarize(previous);

  const engines = [...new Set(current.map((a) => a.engine))].sort((a, b) => ENGINE_BY_ID[a].slot - ENGINE_BY_ID[b].slot);
  const byEngine = engines.map((engine) => ({ engine, ...summarize(current.filter((a) => a.engine === engine)) }));

  const bucketKeys = [...new Set(current.map((a) => bucketKey(a.observedAt, filters.days)))].sort();
  const trend = {
    labels: bucketKeys.map((k) => bucketLabel(k, filters.days)),
    series: engines.map((engine) => ({
      id: engine,
      label: ENGINE_BY_ID[engine].name,
      slot: ENGINE_BY_ID[engine].slot,
      values: bucketKeys.map((k) => {
        const rows = current.filter((a) => a.engine === engine && bucketKey(a.observedAt, filters.days) === k);
        return rows.length ? rows.filter((r) => r.brandMentioned).length / rows.length : null;
      }),
    })),
    overall: bucketKeys.map((k) => {
      const rows = current.filter((a) => bucketKey(a.observedAt, filters.days) === k);
      return rows.length ? rows.filter((r) => r.brandMentioned).length / rows.length : null;
    }),
  };

  return {
    current: cur,
    previous: prev,
    changes: {
      mention: { delta: (cur.mention.value ?? 0) - (prev.mention.value ?? 0), meaningful: isMeaningfulChange(cur.mention, prev.mention), hasPrev: prev.n > 0 },
      citation: { delta: (cur.citation.value ?? 0) - (prev.citation.value ?? 0), meaningful: isMeaningfulChange(cur.citation, prev.citation), hasPrev: prev.n > 0 },
      shareOfVoice: { delta: (cur.shareOfVoice.value ?? 0) - (prev.shareOfVoice.value ?? 0), meaningful: isMeaningfulChange(cur.shareOfVoice, prev.shareOfVoice), hasPrev: prev.n > 0 },
    },
    byEngine,
    trend,
    sources: sourceTable(workspace, current, await competitorDomains(workspace.id)).slice(0, 6),
    answers: current,
  };
}

async function competitorDomains(workspaceId: string) {
  const db = await getDb();
  return db.select().from(schema.competitors).where(eq(schema.competitors.workspaceId, workspaceId)).orderBy(asc(schema.competitors.createdAt));
}

export function sourceTable(workspace: Workspace, answers: AnswerRow[], competitors: { name: string; domain: string }[]) {
  const map = new Map<string, { domain: string; answers: number; urls: Map<string, { url: string; title?: string; count: number }>; engines: Map<string, number> }>();
  for (const a of answers) {
    const seen = new Set<string>();
    for (const c of a.citations) {
      const entry = map.get(c.domain) ?? { domain: c.domain, answers: 0, urls: new Map(), engines: new Map() };
      if (!seen.has(c.domain)) {
        entry.answers++;
        entry.engines.set(a.engine, (entry.engines.get(a.engine) ?? 0) + 1);
        seen.add(c.domain);
      }
      const u = entry.urls.get(c.url) ?? { url: c.url, title: c.title, count: 0 };
      u.count++;
      entry.urls.set(c.url, u);
      map.set(c.domain, entry);
    }
  }
  return [...map.values()]
    .map((e) => {
      const competitor = competitors.find((c) => domainMatches(e.domain, c.domain));
      return {
        domain: e.domain,
        answers: e.answers,
        share: answers.length ? e.answers / answers.length : 0,
        kind: domainMatches(e.domain, workspace.domain) ? ('owned' as const) : competitor ? ('competitor' as const) : ('third_party' as const),
        competitorName: competitor?.name,
        engines: [...e.engines.entries()].sort((a, b) => b[1] - a[1]).map(([engine, count]) => ({ engine: engine as EngineId, count })),
        urls: [...e.urls.values()].sort((a, b) => b.count - a.count).slice(0, 5),
      };
    })
    .sort((a, b) => b.answers - a.answers);
}

export async function sourcesData(workspace: Workspace, filters: Filters) {
  const { now, from } = windows(filters.days);
  const answers = await loadAnswers(workspace, from, now, filters);
  const competitors = await competitorDomains(workspace.id);
  const table = sourceTable(workspace, answers, competitors);
  const citedAnswers = answers.filter((a) => a.citations.length).length;
  return {
    total: answers.length,
    citedAnswers,
    table,
    kinds: (['owned', 'competitor', 'third_party'] as const).map((kind) => ({ kind, citations: table.filter((t) => t.kind === kind).reduce((s, t) => s + t.answers, 0) })),
  };
}

export async function competitorsData(workspace: Workspace, filters: Filters) {
  const { now, from } = windows(filters.days);
  const answers = await loadAnswers(workspace, from, now, filters);
  const competitors = await competitorDomains(workspace.id);
  const n = answers.length;
  const brandMentions = answers.filter((a) => a.brandMentioned).length;
  const counts = new Map<string, { mentions: number; first: number; positions: number[] }>();
  for (const a of answers) {
    for (const m of a.competitorMentions) {
      const c = counts.get(m.competitorId) ?? { mentions: 0, first: 0, positions: [] };
      c.mentions++;
      if (m.position === 1) c.first++;
      c.positions.push(m.position);
      counts.set(m.competitorId, c);
    }
  }
  const totalMentions = brandMentions + [...counts.values()].reduce((s, c) => s + c.mentions, 0);
  const brandPositions = answers.map((a) => a.brandPosition).filter((p): p is number => p !== null);
  const rows = [
    {
      id: 'brand', name: workspace.brandName, domain: workspace.domain, isBrand: true,
      mention: wilson(brandMentions, n), share: wilson(brandMentions, totalMentions),
      firstRate: wilson(brandPositions.filter((p) => p === 1).length, brandMentions),
      avgPosition: brandPositions.length ? brandPositions.reduce((a, b) => a + b, 0) / brandPositions.length : null,
    },
    ...competitors.map((c) => {
      const s = counts.get(c.id) ?? { mentions: 0, first: 0, positions: [] };
      return {
        id: c.id, name: c.name, domain: c.domain, isBrand: false,
        mention: wilson(s.mentions, n), share: wilson(s.mentions, totalMentions),
        firstRate: wilson(s.first, s.mentions),
        avgPosition: s.positions.length ? s.positions.reduce((a, b) => a + b, 0) / s.positions.length : null,
      };
    }),
  ];

  // Prompts where a competitor is named and the brand is not: the clearest gaps.
  const db = await getDb();
  const prompts = await db.select({ id: schema.prompts.id, text: schema.prompts.text }).from(schema.prompts).where(eq(schema.prompts.workspaceId, workspace.id));
  const gaps = prompts.map((p) => {
    const rowsForPrompt = answers.filter((a) => a.promptId === p.id);
    const lost = rowsForPrompt.filter((a) => !a.brandMentioned && a.competitorMentions.length);
    const winners = new Map<string, number>();
    for (const a of lost) for (const m of a.competitorMentions) winners.set(m.competitorId, (winners.get(m.competitorId) ?? 0) + 1);
    const top = [...winners.entries()].sort((a, b) => b[1] - a[1])[0];
    return { id: p.id, text: p.text, total: rowsForPrompt.length, lost: lost.length, topCompetitor: top ? competitors.find((c) => c.id === top[0])?.name : undefined };
  }).filter((g) => g.total > 0 && g.lost > 0).sort((a, b) => b.lost / b.total - a.lost / a.total).slice(0, 8);

  return { n, rows, gaps, competitors };
}

export async function promptsData(workspace: Workspace, filters: Filters) {
  const { now, from } = windows(filters.days);
  const answers = await loadAnswers(workspace, from, now, { ...filters, topic: 'all' });
  const db = await getDb();
  const prompts = await db.select().from(schema.prompts).where(eq(schema.prompts.workspaceId, workspace.id)).orderBy(asc(schema.prompts.topic), asc(schema.prompts.createdAt));
  return prompts
    .filter((p) => filters.topic === 'all' || p.topic === filters.topic)
    .map((p) => {
      const rows = answers.filter((a) => a.promptId === p.id);
      const s = summarize(rows);
      const engines = [...new Set(rows.map((r) => r.engine))].sort((a, b) => ENGINE_BY_ID[a].slot - ENGINE_BY_ID[b].slot).map((engine) => {
        const er = rows.filter((r) => r.engine === engine);
        return { engine, mentioned: er.filter((r) => r.brandMentioned).length, total: er.length };
      });
      const last = rows.reduce<Date | null>((acc, r) => (!acc || r.observedAt > acc ? r.observedAt : acc), null);
      return { prompt: p, summary: s, engines, lastObserved: last };
    });
}

export async function promptDetail(workspace: Workspace, promptId: string) {
  const db = await getDb();
  const [prompt] = await db.select().from(schema.prompts).where(and(eq(schema.prompts.id, promptId), eq(schema.prompts.workspaceId, workspace.id)));
  if (!prompt) return null;
  const answers = await db.select().from(schema.answers)
    .where(and(eq(schema.answers.promptId, promptId), eq(schema.answers.workspaceId, workspace.id), eq(schema.answers.source, workspace.dataMode)))
    .orderBy(desc(schema.answers.observedAt)).limit(400);
  const competitors = await competitorDomains(workspace.id);
  const latestByEngine = ENGINES.map((e) => answers.find((a) => a.engine === e.id)).filter((a): a is NonNullable<typeof a> => !!a);
  const runs = [...new Set(answers.map((a) => a.runId))];
  const history = ENGINES.filter((e) => answers.some((a) => a.engine === e.id)).map((e) => ({
    engine: e.id,
    points: runs.slice(0, 12).reverse().map((runId) => {
      const a = answers.find((x) => x.runId === runId && x.engine === e.id);
      return a ? { at: a.observedAt, mentioned: a.brandMentioned, cited: a.brandCited, position: a.brandPosition } : null;
    }),
  }));
  return { prompt, answers, latestByEngine, history, competitors, summary: summarize(answers) };
}

export async function latestRun(workspaceId: string) {
  const db = await getDb();
  const [run] = await db.select().from(schema.runs).where(eq(schema.runs.workspaceId, workspaceId)).orderBy(desc(schema.runs.startedAt)).limit(1);
  return run ?? null;
}

export async function latestAudit(workspaceId: string) {
  const db = await getDb();
  const [audit] = await db.select().from(schema.audits).where(eq(schema.audits.workspaceId, workspaceId)).orderBy(desc(schema.audits.createdAt)).limit(1);
  return audit ?? null;
}

export async function accuracySummary(workspaceId: string) {
  const db = await getDb();
  const rows = await db.select({ status: schema.claims.status, count: sql<number>`count(*)::int` }).from(schema.claims)
    .where(eq(schema.claims.workspaceId, workspaceId)).groupBy(schema.claims.status);
  const get = (s: string) => rows.find((r) => r.status === s)?.count ?? 0;
  const reviewed = get('accurate') + get('inaccurate') + get('outdated');
  return { needsReview: get('needs_review'), accurate: get('accurate'), inaccurate: get('inaccurate'), outdated: get('outdated'), unverifiable: get('unverifiable'), rate: wilson(get('accurate'), reviewed) };
}

export async function openTasks(workspaceId: string, limit = 5) {
  const db = await getDb();
  const priorityOrder = sql`case ${schema.tasks.priority} when 'high' then 0 when 'medium' then 1 else 2 end`;
  return db.select().from(schema.tasks)
    .where(and(eq(schema.tasks.workspaceId, workspaceId), inArray(schema.tasks.status, ['todo', 'in_progress'])))
    .orderBy(priorityOrder, desc(schema.tasks.createdAt)).limit(limit);
}

export async function taskCounts(workspaceId: string) {
  const db = await getDb();
  const rows = await db.select({ status: schema.tasks.status, count: sql<number>`count(*)::int` }).from(schema.tasks).where(eq(schema.tasks.workspaceId, workspaceId)).groupBy(schema.tasks.status);
  return Object.fromEntries(rows.map((r) => [r.status, r.count])) as Partial<Record<'todo' | 'in_progress' | 'done', number>>;
}

export async function brandPerception(workspace: Workspace, days: number) {
  const { brandDescriptors } = await import('@/lib/analysis');
  const db = await getDb();
  const rows = await db.select({ text: schema.answers.text }).from(schema.answers)
    .where(and(eq(schema.answers.workspaceId, workspace.id), eq(schema.answers.source, workspace.dataMode), eq(schema.answers.brandMentioned, true), gte(schema.answers.observedAt, new Date(Date.now() - days * 86400_000))))
    .orderBy(desc(schema.answers.observedAt)).limit(300);
  return { sampled: rows.length, ...brandDescriptors(rows.map((r) => r.text), [workspace.brandName, ...workspace.brandAliases]) };
}
