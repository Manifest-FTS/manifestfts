'use client';
import { useActionState } from 'react';
import { MailCheck } from 'lucide-react';
import { requestPasswordReset, type AuthState } from '../actions';
import { Field, Input, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert } from '@/components/ui/alert';

export function ForgotForm() {
  const [state, action] = useActionState<AuthState, FormData>(requestPasswordReset, {});
  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-bg-subtle p-6 text-center" role="status">
        <MailCheck className="mx-auto size-8 text-accent" aria-hidden />
        <p className="mt-3 text-[15px] text-fg-soft">{state.message}</p>
      </div>
    );
  }
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <Field label="Email" htmlFor="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required autoFocus defaultValue={state.values?.email} {...describedBy('email', e.email)} />
      </Field>
      <SubmitButton size="lg" className="w-full" pendingLabel="Sending…">Send reset link</SubmitButton>
    </form>
  );
}
