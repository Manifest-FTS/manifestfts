import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { listWorkspaces } from '@/lib/workspace';

export default async function AppIndex() {
  const user = await requireUser();
  const workspaces = await listWorkspaces(user.id);
  if (!workspaces.length) redirect('/app/onboarding');
  const target = workspaces.find((w) => w.workspace.id === user.lastWorkspaceId) ?? workspaces[0]!;
  redirect(`/app/${target.workspace.slug}/overview`);
}
