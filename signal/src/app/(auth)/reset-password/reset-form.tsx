'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { resetPassword, type AuthState } from '../actions';
import { Field, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert } from '@/components/ui/alert';
import { PasswordInput, PasswordStrength } from '../password-input';

export function ResetForm({ token }: { token: string }) {
  const [state, action] = useActionState<AuthState, FormData>(resetPassword, {});
  const [password, setPassword] = React.useState('');
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      {state.error && <Alert tone="danger">{state.error} <a href="/forgot-password" className="font-semibold underline">Request a new link</a></Alert>}
      <input type="hidden" name="token" value={token} />
      <Field label="New password" htmlFor="password" error={e.password}>
        <PasswordInput id="password" name="password" autoComplete="new-password" required autoFocus value={password} onChange={(ev) => setPassword(ev.target.value)} {...describedBy('password', e.password)} />
        <PasswordStrength value={password} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm" error={e.confirm}>
        <PasswordInput id="confirm" name="confirm" autoComplete="new-password" required {...describedBy('confirm', e.confirm)} />
      </Field>
      <SubmitButton size="lg" className="w-full" pendingLabel="Saving…">Set new password</SubmitButton>
      <p className="text-[12.5px] text-fg-faint">For your security, all other sessions will be signed out.</p>
    </form>
  );
}
