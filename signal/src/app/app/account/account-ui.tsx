'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { Laptop, Smartphone } from 'lucide-react';
import { deleteAccount, revokeSession, signOutOtherSessions, updateEmailPrefs, updateProfile } from '@/app/app/_actions/account';
import { changePassword, type AuthState } from '@/app/(auth)/actions';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Field, Input, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';
import { relativeTime } from '@/lib/format';
import type { EmailPrefs } from '@/lib/db/schema';

export function ProfileForm({ name, email, verified }: { name: string; email: string; verified: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(updateProfile, {});
  useActionToast(state);
  return (
    <form action={action} className="grid gap-4 sm:max-w-md">
      <Field label="Name" htmlFor="acc-name" error={state.fieldErrors?.name}><Input id="acc-name" name="name" defaultValue={name} autoComplete="name" required /></Field>
      <Field label="Email" htmlFor="acc-email" hint={verified ? 'Confirmed.' : 'Not yet confirmed. Check your inbox for the confirmation link.'}>
        <div className="flex items-center gap-2"><Input id="acc-email" value={email} readOnly aria-readonly className="bg-bg-subtle" {...describedBy('acc-email', undefined, true)} />{verified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Unverified</Badge>}</div>
      </Field>
      <div><SubmitButton size="sm" pendingLabel="Saving…">Save profile</SubmitButton></div>
    </form>
  );
}

const PREFS: { key: keyof EmailPrefs; label: string; hint: string }[] = [
  { key: 'weeklyDigest', label: 'Weekly digest', hint: 'A Monday summary of visibility changes across your workspaces.' },
  { key: 'runAlerts', label: 'Run alerts', hint: 'When a run completes or fails.' },
  { key: 'accuracyAlerts', label: 'Accuracy alerts', hint: 'When new claims about your brand need review.' },
  { key: 'productUpdates', label: 'Product updates', hint: 'Occasional news about Signal features.' },
];

export function EmailPrefsForm({ initial }: { initial: EmailPrefs }) {
  const [prefs, setPrefs] = React.useState(initial);
  const [, startTransition] = React.useTransition();
  return (
    <ul className="divide-y divide-border">
      {PREFS.map((p) => (
        <li key={p.key} className="flex items-center justify-between gap-6 py-3.5 first:pt-0 last:pb-0">
          <div>
            <p id={`pref-${p.key}`} className="text-[14px] font-medium text-fg">{p.label}</p>
            <p className="text-[13px] text-fg-muted">{p.hint}</p>
          </div>
          <Switch aria-labelledby={`pref-${p.key}`} checked={prefs[p.key]} onCheckedChange={(v) => {
            const next = { ...prefs, [p.key]: v };
            setPrefs(next);
            startTransition(async () => { const r = await updateEmailPrefs(next); if (r.error) toastResult(r); });
          }} />
        </li>
      ))}
    </ul>
  );
}

export function PasswordForm() {
  const ref = React.useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<AuthState, FormData>(changePassword, {});
  useActionToast(state, () => ref.current?.reset());
  const e = state.fieldErrors ?? {};
  return (
    <form ref={ref} action={action} className="grid gap-4 sm:max-w-md">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <Field label="Current password" htmlFor="pw-current" error={e.current}><Input id="pw-current" name="current" type="password" autoComplete="current-password" required {...describedBy('pw-current', e.current)} /></Field>
      <Field label="New password" htmlFor="pw-new" error={e.password} hint="At least 10 characters."><Input id="pw-new" name="password" type="password" autoComplete="new-password" required {...describedBy('pw-new', e.password, true)} /></Field>
      <Field label="Confirm new password" htmlFor="pw-confirm" error={e.confirm}><Input id="pw-confirm" name="confirm" type="password" autoComplete="new-password" required {...describedBy('pw-confirm', e.confirm)} /></Field>
      <div><SubmitButton size="sm" pendingLabel="Updating…">Update password</SubmitButton></div>
    </form>
  );
}

export function SessionList({ sessions }: { sessions: { id: string; device: string; mobile: boolean; ip: string | null; lastSeen: string; current: boolean }[] }) {
  const [pending, startTransition] = React.useTransition();
  return (
    <div className="grid gap-4">
      <ul className="divide-y divide-border rounded-xl border border-border">
        {sessions.map((s) => (
          <li key={s.id} className="flex items-center gap-3 px-4 py-3">
            {s.mobile ? <Smartphone className="size-5 text-fg-faint" aria-hidden /> : <Laptop className="size-5 text-fg-faint" aria-hidden />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium text-fg">{s.device}{s.current && <Badge tone="success" className="ml-2">This device</Badge>}</p>
              <p className="text-[12.5px] text-fg-muted">{s.ip ?? 'Unknown IP'} · active {relativeTime(s.lastSeen)}</p>
            </div>
            {!s.current && <Button variant="ghost" size="sm" disabled={pending} onClick={() => startTransition(async () => toastResult(await revokeSession(s.id)))}>Sign out</Button>}
          </li>
        ))}
      </ul>
      {sessions.length > 1 && <Button variant="secondary" size="sm" className="justify-self-start" loading={pending} onClick={() => startTransition(async () => toastResult(await signOutOtherSessions()))}>Sign out all other sessions</Button>}
    </div>
  );
}

export function DeleteAccountForm() {
  const [state, action] = useActionState<ActionState, FormData>(deleteAccount, {});
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid gap-3">
      <p className="text-[13.5px] text-fg-muted">Permanently delete your account and personal data. Workspaces you share with others are kept; transfer ownership first if you are the only owner.</p>
      {!open ? <Button variant="danger" size="sm" className="justify-self-start" onClick={() => setOpen(true)}>Delete my account</Button> : (
        <form action={action} className="grid gap-3 rounded-xl border border-danger/30 bg-danger-subtle/50 p-4 sm:max-w-md">
          {state.error && <Alert tone="danger">{state.error}</Alert>}
          <Field label="Confirm with your password" htmlFor="del-pw" error={state.fieldErrors?.password}><Input id="del-pw" name="password" type="password" autoComplete="current-password" required /></Field>
          <div className="flex gap-2"><SubmitButton variant="danger" size="sm" pendingLabel="Deleting…">Permanently delete account</SubmitButton><Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button></div>
        </form>
      )}
    </div>
  );
}
