import { and, desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, isReadOnly } from '@/lib/workspace';
import { PageHeader } from '@/components/app/page-header';
import { TaskBoard } from './task-board';

export const metadata = { title: 'Tasks' };

export default async function TasksPage({ params }: PageProps<'/app/[workspace]/tasks'>) {
  const { workspace: slug } = await params;
  const { workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const assignee = alias(schema.users, 'assignee');
  const priorityOrder = sql`case ${schema.tasks.priority} when 'high' then 0 when 'medium' then 1 else 2 end`;
  const [rows, members] = await Promise.all([
    db.select({ task: schema.tasks, assigneeName: assignee.name }).from(schema.tasks).leftJoin(assignee, eq(assignee.id, schema.tasks.assigneeId))
      .where(eq(schema.tasks.workspaceId, workspace.id)).orderBy(priorityOrder, desc(schema.tasks.createdAt)).limit(300),
    db.select({ id: schema.users.id, name: schema.users.name }).from(schema.memberships).innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
      .where(and(eq(schema.memberships.workspaceId, workspace.id))),
  ]);
  return (
    <>
      <PageHeader title="Tasks" description="Prioritized work to improve how engines represent you. Every recommendation links to the evidence behind it." />
      <TaskBoard
        workspaceId={workspace.id}
        slug={slug}
        members={members}
        canEdit={hasRole(role, 'editor') && !isReadOnly(workspace)}
        tasks={rows.map(({ task, assigneeName }) => ({
          id: task.id, title: task.title, description: task.description, status: task.status, priority: task.priority, category: task.category,
          evidence: task.evidence, assignee: task.assigneeId && assigneeName ? { id: task.assigneeId, name: assigneeName } : null,
          dueDate: task.dueDate?.toISOString() ?? null, automatic: !!task.dedupeKey, createdAt: task.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
