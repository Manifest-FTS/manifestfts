'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { signUp, type AuthState } from '../actions';
import { Field, Input, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert } from '@/components/ui/alert';
import { PasswordInput, PasswordStrength } from '../password-input';
import { track } from '@/lib/analytics';

export function SignupForm({ next, email: presetEmail }: { next?: string; email?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(signUp, {});
  const [password, setPassword] = React.useState('');
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5" onSubmit={() => track('signup_completed')}>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <input type="hidden" name="next" value={next ?? ''} />
      <Field label="Full name" htmlFor="name" error={e.name}>
        <Input id="name" name="name" autoComplete="name" required autoFocus defaultValue={state.values?.name} {...describedBy('name', e.name)} />
      </Field>
      <Field label="Work email" htmlFor="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email ?? presetEmail} {...describedBy('email', e.email)} />
      </Field>
      <Field label="Password" htmlFor="password" error={e.password}>
        <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={10} value={password} onChange={(ev) => setPassword(ev.target.value)} {...describedBy('password', e.password)} />
        <PasswordStrength value={password} />
      </Field>
      <SubmitButton size="lg" className="mt-1 w-full" pendingLabel="Creating your account…">Create account</SubmitButton>
      <p className="text-center text-[12.5px] leading-relaxed text-fg-faint">
        By creating an account you agree to the <a href="/terms" className="underline hover:text-fg">Terms</a> and <a href="/privacy" className="underline hover:text-fg">Privacy policy</a>.
      </p>
    </form>
  );
}
