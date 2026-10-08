'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { addFact, deleteFact } from '@/app/app/_actions/data';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Field, Input, describedBy } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';

const EXAMPLES = ['Founded', 'Headquarters', 'Starting price', 'Locations', 'Certifications', 'Key integrations'];

export function FactSheet({ workspaceId, facts, canEdit }: { workspaceId: string; facts: { id: string; label: string; value: string }[]; canEdit: boolean }) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<ActionState, FormData>(addFact, {});
  useActionToast(state, () => formRef.current?.reset());
  const [, startTransition] = React.useTransition();
  const e = state.fieldErrors ?? {};
  return (
    <div className="grid gap-4">
      {facts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-[13px] leading-relaxed text-fg-muted">Add facts engines should get right, such as {EXAMPLES.slice(0, 3).join(', ').toLowerCase()}.</p>
      ) : (
        <dl className="divide-y divide-border rounded-xl border border-border">
          {facts.map((f) => (
            <div key={f.id} className="flex items-start gap-3 px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <dt className="text-[12px] font-medium text-fg-muted">{f.label}</dt>
                <dd className="text-[13.5px] text-fg">{f.value}</dd>
              </div>
              {canEdit && <Button variant="ghost" size="icon-sm" aria-label={`Delete fact ${f.label}`} onClick={() => startTransition(async () => toastResult(await deleteFact(workspaceId, f.id)))}><Trash2 aria-hidden /></Button>}
            </div>
          ))}
        </dl>
      )}
      {canEdit && (
        <form ref={formRef} action={action} className="grid gap-3">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <Field label="Label" htmlFor="f-label" error={e.label}>
            <Input id="f-label" name="label" list="fact-examples" placeholder="Founded" required {...describedBy('f-label', e.label)} />
            <datalist id="fact-examples">{EXAMPLES.map((x) => <option key={x} value={x} />)}</datalist>
          </Field>
          <Field label="Value" htmlFor="f-value" error={e.value}>
            <Input id="f-value" name="value" placeholder="2012" required {...describedBy('f-value', e.value)} />
          </Field>
          <SubmitButton variant="secondary" size="sm" className="justify-self-start" pendingLabel="Adding…"><Plus aria-hidden />Add fact</SubmitButton>
        </form>
      )}
    </div>
  );
}
