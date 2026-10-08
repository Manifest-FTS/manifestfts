'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { Mail, Send, X } from 'lucide-react';
import { changeRole, inviteMember, removeMember, revokeInvite } from '@/app/app/_actions/members';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Field, Input, Select, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Confirm } from '@/components/ui/confirm';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';
import { relativeTime } from '@/lib/format';
import type { Role } from '@/lib/db/schema';

export function InviteForm({ workspaceId }: { workspaceId: string }) {
  const ref = React.useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<ActionState, FormData>(inviteMember, {});
  useActionToast(state, () => ref.current?.reset());
  const e = state.fieldErrors ?? {};
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <Field label="Email address" htmlFor="inv-email" error={e.email}><Input id="inv-email" name="email" type="email" required placeholder="teammate@company.com" {...describedBy('inv-email', e.email)} /></Field>
      <Field label="Role" htmlFor="inv-role">
        <Select id="inv-role" name="role" defaultValue="editor"><option value="viewer">Viewer</option><option value="editor">Editor</option><option value="admin">Admin</option></Select>
      </Field>
      <SubmitButton pendingLabel="Sending…"><Send aria-hidden />Send invite</SubmitButton>
    </form>
  );
}

export function MemberRow({ workspaceId, member, currentUserId, viewerRole }: { workspaceId: string; member: { id: string; name: string; email: string; role: Role; joined: string }; currentUserId: string; viewerRole: Role }) {
  const [, startTransition] = React.useTransition();
  const self = member.id === currentUserId;
  const canManage = (viewerRole === 'owner' || viewerRole === 'admin') && !self && !(member.role === 'owner' && viewerRole !== 'owner');
  return (
    <li className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={member.name} size={34} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-fg">{member.name}{self && <span className="ml-1.5 text-fg-faint">(you)</span>}</p>
          <p className="truncate text-[12.5px] text-fg-muted">{member.email} · joined {relativeTime(member.joined)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {canManage ? (
          <>
            <label htmlFor={`role-${member.id}`} className="sr-only">Role for {member.name}</label>
            <select id={`role-${member.id}`} defaultValue={member.role} onChange={(e) => startTransition(async () => toastResult(await changeRole(workspaceId, member.id, e.target.value as Role)))}
              className="h-8 rounded-lg border border-border bg-panel px-2.5 text-[13px] text-fg focus:outline-none focus:ring-4 focus:ring-[var(--ring)]">
              <option value="viewer">Viewer</option><option value="editor">Editor</option><option value="admin">Admin</option>
              {viewerRole === 'owner' && <option value="owner">Owner</option>}
            </select>
            <Confirm trigger={<Button variant="ghost" size="icon-sm" aria-label={`Remove ${member.name}`}><X aria-hidden /></Button>} title={`Remove ${member.name}?`} description="They will lose access to this workspace immediately. Their past activity is kept." confirmLabel="Remove" onConfirm={async () => toastResult(await removeMember(workspaceId, member.id))} />
          </>
        ) : (
          <Badge tone={member.role === 'owner' ? 'accent' : 'neutral'} className="capitalize">{member.role}</Badge>
        )}
        {self && member.role !== 'owner' && (
          <Confirm trigger={<Button variant="ghost" size="sm">Leave</Button>} title="Leave this workspace?" description="You will lose access until someone invites you again." confirmLabel="Leave workspace" onConfirm={async () => toastResult(await removeMember(workspaceId, member.id))} />
        )}
      </div>
    </li>
  );
}

export function InviteRow({ workspaceId, invite, canManage }: { workspaceId: string; invite: { id: string; email: string; role: string; expiresAt: string }; canManage: boolean }) {
  const [pending, startTransition] = React.useTransition();
  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <span className="grid size-[34px] place-items-center rounded-full border border-dashed border-border-strong/60 text-fg-faint"><Mail className="size-4" aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] text-fg">{invite.email}</p>
        <p className="text-[12.5px] text-fg-muted">Invited as {invite.role} · expires {relativeTime(invite.expiresAt)}</p>
      </div>
      <Badge tone="warning">Pending</Badge>
      {canManage && <Button variant="ghost" size="sm" disabled={pending} onClick={() => startTransition(async () => toastResult(await revokeInvite(workspaceId, invite.id)))}>Revoke</Button>}
    </li>
  );
}
