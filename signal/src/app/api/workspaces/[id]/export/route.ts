import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { authorize, logActivity } from '@/lib/workspace';
import { rateLimit } from '@/lib/rate-limit';

// Full JSON export for owners and admins (data portability). Secrets and billing identifiers are excluded.
export async function GET(_: Request, { params }: RouteContext<'/api/workspaces/[id]/export'>) {
  const { id } = await params;
  const auth = await authorize(id, 'admin');
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 403 });
  if (!(await rateLimit(`export:${id}`, 10, 3600)).ok) return NextResponse.json({ error: 'Export limit reached. Try again later.' }, { status: 429 });
  const db = await getDb();
  const by = <T extends { workspaceId: unknown }>(table: T) => eq(table.workspaceId as never, id);
  const [competitors, prompts, answers, facts, claims, audits, tasks, reports] = await Promise.all([
    db.select().from(schema.competitors).where(by(schema.competitors)),
    db.select().from(schema.prompts).where(by(schema.prompts)),
    db.select().from(schema.answers).where(by(schema.answers)),
    db.select().from(schema.facts).where(by(schema.facts)),
    db.select().from(schema.claims).where(by(schema.claims)),
    db.select().from(schema.audits).where(by(schema.audits)),
    db.select().from(schema.tasks).where(by(schema.tasks)),
    db.select().from(schema.reports).where(by(schema.reports)),
  ]);
  const workspace: Partial<typeof auth.workspace> = { ...auth.workspace };
  delete workspace.stripeCustomerId;
  delete workspace.stripeSubscriptionId;
  await logActivity(id, auth.user.id, 'workspace.exported', 'JSON export');
  const body = JSON.stringify({ exportedAt: new Date().toISOString(), format: 'manifest-signal-export/1', workspace, competitors, prompts, answers, facts, claims, audits, tasks, reports: reports.map((r) => ({ ...r, shareToken: undefined })) }, null, 2);
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="signal-${auth.workspace.slug}-${new Date().toISOString().slice(0, 10)}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
