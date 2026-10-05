import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { and, desc, eq, gte, inArray, isNotNull, ne } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { safeEqual } from '@/lib/auth/tokens';
import { activeRun, createRun, executeRun, runnableEngines } from '@/lib/pipeline';
import { isReadOnly, trialDaysLeft } from '@/lib/workspace';
import { overviewData } from '@/lib/queries';
import { sendEmail } from '@/lib/email';
import { absoluteUrl } from '@/lib/site';
import { pct } from '@/lib/format';

/**
 * Scheduler entry point. Call hourly from your platform's cron (for example Coolify scheduled
 * tasks): `curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://host/api/cron`.
 * Starts due runs, sends Monday digests, and sends trial reminders. Safe to call repeatedly.
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get('authorization') ?? '';
  if (!secret || !safeEqual(header, `Bearer ${secret}`)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const workspaces = await db.select().from(schema.workspaces).where(ne(schema.workspaces.runFrequency, 'manual'));
  const started: string[] = [];

  for (const ws of workspaces) {
    if (isReadOnly(ws) || !runnableEngines(ws).length || (await activeRun(ws.id))) continue;
    const [last] = await db.select({ startedAt: schema.runs.startedAt }).from(schema.runs)
      .where(and(eq(schema.runs.workspaceId, ws.id), eq(schema.runs.source, ws.dataMode))).orderBy(desc(schema.runs.startedAt)).limit(1);
    const interval = ws.runFrequency === 'daily' ? 23 * 3600_000 : 7 * 86400_000 - 3600_000;
    if (last && Date.now() - last.startedAt.getTime() < interval) continue;
    const runId = await createRun(ws, 'scheduled');
    started.push(runId);
  }
  // Execute sequentially after responding so a slow engine never blocks the scheduler.
  after(async () => {
    for (const id of started) await executeRun(id);
  });

  const now = new Date();
  let digests = 0;
  let reminders = 0;
  if (now.getUTCDay() === 1 && now.getUTCHours() === 13) digests = await sendDigests();
  if (now.getUTCHours() === 14) reminders = await sendTrialReminders();
  return NextResponse.json({ started: started.length, digests, reminders });
}

async function membersWith(workspaceId: string, pref: 'weeklyDigest' | 'runAlerts') {
  const db = await getDb();
  const rows = await db.select({ email: schema.users.email, name: schema.users.name, prefs: schema.users.emailPrefs }).from(schema.memberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
    .where(and(eq(schema.memberships.workspaceId, workspaceId), isNotNull(schema.users.emailVerifiedAt)));
  return rows.filter((r) => r.prefs[pref]);
}

async function sendDigests() {
  const db = await getDb();
  const since = new Date(Date.now() - 7 * 86400_000);
  const active = await db.selectDistinct({ id: schema.runs.workspaceId }).from(schema.runs).where(gte(schema.runs.startedAt, since));
  if (!active.length) return 0;
  const workspaces = await db.select().from(schema.workspaces).where(inArray(schema.workspaces.id, active.map((a) => a.id)));
  let sent = 0;
  for (const ws of workspaces) {
    const data = await overviewData(ws, { days: 7, engine: 'all', topic: 'all' });
    if (!data.current.n) continue;
    for (const m of await membersWith(ws.id, 'weeklyDigest')) {
      await sendEmail({
        to: m.email,
        subject: `${ws.name}: your weekly AI visibility digest`,
        paragraphs: [
          `Here is how answer engines represented ${ws.brandName} over the last 7 days${ws.dataMode === 'sample' ? ' (sample data)' : ''}.`,
          `Mention rate: ${pct(data.current.mention.value)} of ${data.current.n} answers${data.changes.mention.hasPrev ? ` (${data.changes.mention.meaningful ? 'a meaningful change' : 'within normal variation'} vs the prior week)` : ''}.`,
          `Citation rate: ${pct(data.current.citation.value)}. Share of voice: ${pct(data.current.shareOfVoice.value)}.`,
        ],
        action: { label: 'Open dashboard', url: absoluteUrl(`/app/${ws.slug}/overview?range=7`) },
      });
      sent++;
    }
  }
  return sent;
}

async function sendTrialReminders() {
  const db = await getDb();
  const trials = await db.select().from(schema.workspaces).where(eq(schema.workspaces.plan, 'trial'));
  let sent = 0;
  for (const ws of trials) {
    const days = trialDaysLeft(ws);
    if (days !== 3 && days !== 0) continue;
    const owners = await db.select({ email: schema.users.email }).from(schema.memberships).innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
      .where(and(eq(schema.memberships.workspaceId, ws.id), eq(schema.memberships.role, 'owner')));
    for (const o of owners) {
      await sendEmail({
        to: o.email,
        subject: days === 0 ? `Your ${ws.name} trial ends today` : `3 days left in your ${ws.name} trial`,
        paragraphs: ['Choose a plan to keep runs and audits going. If you do nothing, the workspace becomes read-only and your data stays safe.'],
        action: { label: 'Choose a plan', url: absoluteUrl(`/app/${ws.slug}/settings/billing`) },
      });
      sent++;
    }
  }
  return sent;
}
