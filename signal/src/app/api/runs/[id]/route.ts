import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

// Run progress for the signed-in member's workspace. Polled by the run status indicator.
export async function GET(_: Request, { params }: RouteContext<'/api/runs/[id]'>) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  const [row] = await db
    .select({ status: schema.runs.status, total: schema.runs.totalJobs, completed: schema.runs.completedJobs, failed: schema.runs.failedJobs, error: schema.runs.error })
    .from(schema.runs)
    .innerJoin(schema.memberships, and(eq(schema.memberships.workspaceId, schema.runs.workspaceId), eq(schema.memberships.userId, user.id)))
    .where(eq(schema.runs.id, id))
    .limit(1);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row, { headers: { 'Cache-Control': 'no-store' } });
}
