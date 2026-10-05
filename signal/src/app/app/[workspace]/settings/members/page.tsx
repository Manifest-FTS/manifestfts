import { and, asc, eq, gt, isNull } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole } from '@/lib/workspace';
import { limitsFor } from '@/lib/plans';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { InviteForm, InviteRow, MemberRow } from './member-ui';

export const metadata = { title: 'Members' };

const ROLE_HELP = [
  ['Viewer', 'Read everything, change nothing.'],
  ['Editor', 'Manage prompts, facts, tasks, runs, audits, and reports.'],
  ['Admin', 'Everything editors can do, plus members and workspace settings.'],
  ['Owner', 'Everything, plus billing, ownership, and deletion.'],
];

export default async function MembersPage({ params }: PageProps<'/app/[workspace]/settings/members'>) {
  const { workspace: slug } = await params;
  const { workspace, role, user } = await requireWorkspace(slug);
  const db = await getDb();
  const [members, invites] = await Promise.all([
    db.select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.memberships.role, joined: schema.memberships.createdAt })
      .from(schema.memberships).innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
      .where(eq(schema.memberships.workspaceId, workspace.id)).orderBy(asc(schema.memberships.createdAt)),
    db.select().from(schema.invitations).where(and(eq(schema.invitations.workspaceId, workspace.id), isNull(schema.invitations.acceptedAt), gt(schema.invitations.expiresAt, new Date()))),
  ]);
  const isAdmin = hasRole(role, 'admin');
  const seats = limitsFor(workspace.plan).seats;

  return (
    <div className="grid max-w-3xl gap-5">
      {isAdmin && (
        <Card>
          <CardHeader title="Invite a teammate" description={seats ? `${members.length + invites.length} of ${seats} seats used.` : 'Unlimited seats on your plan.'} />
          <CardBody><InviteForm workspaceId={workspace.id} /></CardBody>
        </Card>
      )}
      <Card>
        <CardHeader title="Members" description={`${members.length} ${members.length === 1 ? 'person has' : 'people have'} access.`} />
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {members.map((m) => <MemberRow key={m.id} workspaceId={workspace.id} currentUserId={user.id} viewerRole={role} member={{ ...m, joined: m.joined.toISOString() }} />)}
          {invites.map((i) => <InviteRow key={i.id} workspaceId={workspace.id} canManage={isAdmin} invite={{ id: i.id, email: i.email, role: i.role, expiresAt: i.expiresAt.toISOString() }} />)}
        </ul>
      </Card>
      <Card>
        <CardHeader title="Roles" />
        <CardBody>
          <dl className="grid gap-3 sm:grid-cols-2">
            {ROLE_HELP.map(([r, d]) => <div key={r}><dt className="text-[13.5px] font-semibold text-fg">{r}</dt><dd className="text-[13px] text-fg-muted">{d}</dd></div>)}
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
