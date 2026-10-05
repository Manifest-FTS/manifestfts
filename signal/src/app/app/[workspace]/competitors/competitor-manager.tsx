'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { addCompetitor, removeCompetitor } from '@/app/app/_actions/data';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Field, Input, describedBy } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { Confirm } from '@/components/ui/confirm';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';

export function CompetitorManager({ workspaceId, competitors, limit, canEdit }: { workspaceId: string; competitors: { id: string; name: string; domain: string }[]; limit: number; canEdit: boolean }) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<ActionState, FormData>(addCompetitor, {});
  useActionToast(state, () => formRef.current?.reset());
  const e = state.fieldErrors ?? {};
  return (
    <div className="grid gap-4">
      <ul className="divide-y divide-border rounded-xl border border-border">
        {competitors.length === 0 && <li className="px-4 py-6 text-center text-[13.5px] text-fg-muted">No competitors yet.</li>}
        {competitors.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium text-fg">{c.name}</span><span className="block truncate font-mono text-[12px] text-fg-faint">{c.domain}</span></span>
            {canEdit && (
              <Confirm trigger={<Button variant="ghost" size="icon-sm" aria-label={`Remove ${c.name}`}><Trash2 aria-hidden /></Button>} title={`Remove ${c.name}?`} description="Past mentions stay in stored answers, but this competitor will no longer appear in share of voice." confirmLabel="Remove" onConfirm={async () => toastResult(await removeCompetitor(workspaceId, c.id))} />
            )}
          </li>
        ))}
      </ul>
      {canEdit && competitors.length < limit && (
        <form ref={formRef} action={action} className="grid gap-3 rounded-xl border border-dashed border-border p-4">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" htmlFor="c-name" error={e.name}><Input id="c-name" name="name" required placeholder="Contoso" {...describedBy('c-name', e.name)} /></Field>
            <Field label="Domain" htmlFor="c-domain" error={e.domain}><Input id="c-domain" name="domain" required placeholder="contoso.com" spellCheck={false} {...describedBy('c-domain', e.domain)} /></Field>
          </div>
          <Field label="Other names" htmlFor="c-aliases" optional><Input id="c-aliases" name="aliases" placeholder="Comma-separated" /></Field>
          <SubmitButton variant="secondary" size="sm" className="justify-self-start" pendingLabel="Adding…"><Plus aria-hidden />Add competitor</SubmitButton>
        </form>
      )}
      <p className="text-[12px] text-fg-faint">{competitors.length} of {limit} competitors on your plan.</p>
    </div>
  );
}
