'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { signIn, type AuthState } from '../actions';
import { Field, Input, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert } from '@/components/ui/alert';
import { PasswordInput } from '../password-input';

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(signIn, {});
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <input type="hidden" name="next" value={next ?? ''} />
      <Field label="Email" htmlFor="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required autoFocus defaultValue={state.values?.email} {...describedBy('email', e.email)} />
      </Field>
      <Field label="Password" htmlFor="password" error={e.password} action={<Link href="/forgot-password" className="text-[13px] font-medium text-accent hover:underline">Forgot password?</Link>}>
        <PasswordInput id="password" name="password" autoComplete="current-password" required {...describedBy('password', e.password)} />
      </Field>
      <SubmitButton size="lg" className="mt-1 w-full" pendingLabel="Signing in…">Sign in</SubmitButton>
    </form>
  );
}
