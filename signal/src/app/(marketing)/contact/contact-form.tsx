'use client';
import { useActionState, useEffect } from 'react';
import { CircleCheck } from 'lucide-react';
import { submitContact, type ContactState } from './actions';
import { Field, Input, Select, Textarea, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert } from '@/components/ui/alert';
import { track } from '@/lib/analytics';

export function ContactForm() {
  const [state, action] = useActionState<ContactState, FormData>(submitContact, {});
  const e = state.fieldErrors ?? {};
  const v = state.values ?? {};

  useEffect(() => {
    if (state.ok) track('contact_submitted');
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-8 text-center shadow-card" role="status">
        <CircleCheck className="mx-auto size-10 text-success" aria-hidden />
        <h2 className="mt-4 text-[20px] font-semibold text-fg">Message sent</h2>
        <p className="mt-2 text-[15px] text-fg-muted">Thanks. We’ll reply within one business day. A copy is on its way to your inbox.</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grid gap-5 rounded-2xl border border-border bg-panel p-6 shadow-card sm:p-8">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={e.name}>
          <Input id="name" name="name" autoComplete="name" required defaultValue={v.name} {...describedBy('name', e.name)} />
        </Field>
        <Field label="Work email" htmlFor="email" error={e.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} {...describedBy('email', e.email)} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company" htmlFor="company" optional error={e.company}>
          <Input id="company" name="company" autoComplete="organization" defaultValue={v.company} />
        </Field>
        <Field label="Topic" htmlFor="topic" error={e.topic}>
          <Select id="topic" name="topic" defaultValue={v.topic ?? 'demo'} {...describedBy('topic', e.topic)}>
            <option value="demo">Product demo</option>
            <option value="pricing">Pricing, annual, or nonprofit plans</option>
            <option value="services">Hands-on help from Manifest FTS</option>
            <option value="support">Support for an existing account</option>
            <option value="other">Something else</option>
          </Select>
        </Field>
      </div>
      <Field label="How can we help?" htmlFor="message" error={e.message} hint="Share your goals, the brands you track, or questions about the data.">
        <Textarea id="message" name="message" rows={5} required defaultValue={v.message} {...describedBy('message', e.message, true)} />
      </Field>
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px] text-fg-faint">We use your details only to respond. See our <a href="/privacy" className="underline hover:text-fg">privacy policy</a>.</p>
        <SubmitButton size="lg" pendingLabel="Sending…">Send message</SubmitButton>
      </div>
    </form>
  );
}
