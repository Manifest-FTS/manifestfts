import { desc, eq } from 'drizzle-orm';
import { History } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace } from '@/lib/workspace';
import { formatDateTime } from '@/lib/format';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Activity' };

const LABELS: Record<string, string> = {
  'workspace.created': 'created the workspace', 'workspace.updated': 'updated workspace settings', 'workspace.data_mode': 'changed the data source',
  'workspace.sample_cleared': 'cleared sample data', 'workspace.exported': 'exported workspace data', 'prompt.created': 'added a prompt',
  'prompt.updated': 'edited a prompt', 'prompt.deleted': 'deleted a prompt', 'competitor.added': 'added a competitor', 'run.started': 'started a run',
  'audit.run': 'ran a readiness audit', 'task.completed': 'completed a task', 'report.created': 'created a report', 'report.shared': 'shared a report',
  'report.unshared': 'revoked a report link', 'member.invited': 'invited', 'member.joined': 'joined the workspace', 'member.removed': 'removed a member',
  'member.left': 'left the workspace', 'member.role_changed': 'changed a role', 'billing.checkout_started': 'started checkout', 'billing.subscription': 'subscription updated',
};

export default async function ActivityPage({ params }: PageProps<'/app/[workspace]/settings/activity'>) {
  const { workspace: slug } = await params;
  const { workspace } = await requireWorkspace(slug, 'admin');
  const db = await getDb();
  const rows = await db.select({ a: schema.activity, name: schema.users.name }).from(schema.activity)
    .leftJoin(schema.users, eq(schema.users.id, schema.activity.actorId))
    .where(eq(schema.activity.workspaceId, workspace.id)).orderBy(desc(schema.activity.createdAt)).limit(100);
  return (
    <Card className="max-w-3xl">
      {rows.length === 0 ? <EmptyState icon={<History />} title="No activity yet" /> : (
        <ol className="divide-y divide-border">
          {rows.map(({ a, name }) => (
            <li key={a.id} className="flex items-start gap-3 px-5 py-3">
              <Avatar name={name ?? 'System'} size={28} />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] text-fg"><strong className="font-medium">{name ?? 'System'}</strong> {LABELS[a.action] ?? a.action}{a.detail && a.action !== 'prompt.deleted' && a.action !== 'task.completed' ? <span className="text-fg-muted"> · {a.detail}</span> : null}</p>
                <time className="text-[12px] text-fg-faint" dateTime={a.createdAt.toISOString()}>{formatDateTime(a.createdAt)}</time>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
