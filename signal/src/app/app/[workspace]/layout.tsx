import { and, desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { hasRole, isReadOnly, listWorkspaces, requireWorkspace, trialDaysLeft } from '@/lib/workspace';
import { activeRun } from '@/lib/pipeline';
import { accuracySummary, taskCounts } from '@/lib/queries';
import { planLabel } from '@/lib/plans';
import { AppShell } from '@/components/app/app-shell';
import { ReadOnlyBanner, SampleBanner, TrialBanner, VerifyBanner } from '@/components/app/banners';

export default async function WorkspaceLayout({ children, params }: LayoutProps<'/app/[workspace]'>) {
  const { workspace: slug } = await params;
  const { user, workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const [workspaces, run, counts, accuracy, notes] = await Promise.all([
    listWorkspaces(user.id),
    activeRun(workspace.id),
    taskCounts(workspace.id),
    accuracySummary(workspace.id),
    db.select().from(schema.notifications).where(and(eq(schema.notifications.userId, user.id), eq(schema.notifications.workspaceId, workspace.id))).orderBy(desc(schema.notifications.createdAt)).limit(12),
  ]);
  if (user.lastWorkspaceId !== workspace.id) await db.update(schema.users).set({ lastWorkspaceId: workspace.id }).where(eq(schema.users.id, user.id));

  const readOnly = isReadOnly(workspace);
  const days = trialDaysLeft(workspace);
  const banners = (
    <>
      {readOnly ? <ReadOnlyBanner slug={slug} /> : days !== null && days <= 7 && <TrialBanner slug={slug} days={days} />}
      {workspace.dataMode === 'sample' && <SampleBanner slug={slug} canManage={hasRole(role, 'admin')} />}
      {!user.emailVerifiedAt && <VerifyBanner email={user.email} />}
    </>
  );

  return (
    <AppShell
      user={{ name: user.name, email: user.email }}
      workspace={{ slug: workspace.slug, name: workspace.name, domain: workspace.domain, planLabel: `${planLabel(workspace.plan)}${days !== null ? ` · ${days}d left` : ''}` }}
      workspaces={workspaces.map((w) => ({ slug: w.workspace.slug, name: w.workspace.name }))}
      counts={{ openTasks: (counts.todo ?? 0) + (counts.in_progress ?? 0), needsReview: accuracy.needsReview }}
      workspaceId={workspace.id}
      notifications={notes.map((n) => ({ id: n.id, title: n.title, body: n.body, href: n.href, read: !!n.readAt, createdAt: n.createdAt.toISOString() }))}
      activeRunId={run?.id ?? null}
      canRun={hasRole(role, 'editor') && !readOnly}
      sample={workspace.dataMode === 'sample'}
      banners={banners}
    >
      {children}
    </AppShell>
  );
}
