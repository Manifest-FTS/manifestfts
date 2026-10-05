'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { Download, FlaskConical, Radio } from 'lucide-react';
import { clearSampleData, deleteWorkspace, setDataMode, updateWorkspace, type ActionState } from '@/app/app/_actions/workspace';
import { Field, Input, Select, Textarea, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Button, buttonClass } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Confirm } from '@/components/ui/confirm';
import { Badge } from '@/components/ui/badge';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';
import { ENGINES } from '@/lib/engines';
import { cn } from '@/lib/cn';
import type { EngineId } from '@/lib/db/schema';

interface WS { id: string; slug: string; name: string; brandName: string; domain: string; description: string; aliases: string; engines: EngineId[]; runFrequency: string; dataMode: 'sample' | 'live' }

export function GeneralForm({ ws, canEdit, allowedEngines, dailyAllowed }: { ws: WS; canEdit: boolean; allowedEngines: EngineId[] | 'all'; dailyAllowed: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(updateWorkspace, {});
  useActionToast(state);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="workspaceId" value={ws.id} />
      <fieldset disabled={!canEdit} className="grid gap-5 disabled:opacity-70">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Workspace name" htmlFor="name" error={e.name}><Input id="name" name="name" defaultValue={ws.name} required {...describedBy('name', e.name)} /></Field>
          <Field label="Brand name" htmlFor="brandName" error={e.brandName} hint="Used to detect mentions."><Input id="brandName" name="brandName" defaultValue={ws.brandName} required {...describedBy('brandName', e.brandName, true)} /></Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Primary domain" htmlFor="domain" error={e.domain} hint="Used to detect citations, including subdomains."><Input id="domain" name="domain" defaultValue={ws.domain} required spellCheck={false} {...describedBy('domain', e.domain, true)} /></Field>
          <Field label="Other names" htmlFor="aliases" hint="Comma-separated."><Input id="aliases" name="aliases" defaultValue={ws.aliases} {...describedBy('aliases', undefined, true)} /></Field>
        </div>
        <Field label="Description" htmlFor="description"><Textarea id="description" name="description" rows={2} defaultValue={ws.description} /></Field>
        <fieldset>
          <legend className="text-[13.5px] font-medium text-fg">Engines</legend>
          {e.engines && <p className="mt-1 text-[13px] text-danger" role="alert">{e.engines[0]}</p>}
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {ENGINES.map((en) => {
              const allowed = allowedEngines === 'all' || allowedEngines.includes(en.id);
              return (
                <label key={en.id} className={cn('flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-[13.5px]', !allowed && 'opacity-50')}>
                  <input type="checkbox" name="engines" value={en.id} defaultChecked={ws.engines.includes(en.id)} disabled={!allowed} className="size-4 accent-[var(--accent)]" />
                  <span className="size-2 rounded-full" style={{ background: `var(--series-${en.slot})` }} aria-hidden />
                  <span className="flex-1 text-fg">{en.name}</span>
                  {!allowed && <span className="text-[11px] text-fg-faint">Upgrade</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
        <Field label="Run frequency" htmlFor="runFrequency" error={e.runFrequency}>
          <Select id="runFrequency" name="runFrequency" defaultValue={ws.runFrequency} className="sm:max-w-xs">
            <option value="weekly">Weekly</option>
            <option value="daily" disabled={!dailyAllowed}>Daily{dailyAllowed ? '' : ' (Growth and Agency)'}</option>
            <option value="manual">Manual only</option>
          </Select>
        </Field>
      </fieldset>
      {canEdit && <div><SubmitButton pendingLabel="Saving…">Save changes</SubmitButton></div>}
    </form>
  );
}

export function DataSourceControl({ ws, canEdit, liveAvailable }: { ws: WS; canEdit: boolean; liveAvailable: string[] }) {
  const [pending, startTransition] = React.useTransition();
  const options = [
    { id: 'sample' as const, icon: FlaskConical, title: 'Sample data', body: 'Generated answers for exploring Signal. Never presented as real observations.' },
    { id: 'live' as const, icon: Radio, title: 'Live observations', body: liveAvailable.length ? `Collected from official APIs: ${liveAvailable.join(', ')}.` : 'Not yet enabled for this deployment.' },
  ];
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Data source">
        {options.map(({ id, icon: Icon, title, body }) => {
          const active = ws.dataMode === id;
          const disabled = !canEdit || pending || (id === 'live' && !liveAvailable.length);
          return (
            <button key={id} type="button" role="radio" aria-checked={active} disabled={disabled && !active}
              onClick={() => !active && startTransition(async () => toastResult(await setDataMode(ws.id, id)))}
              className={cn('flex gap-3 rounded-xl border p-4 text-left transition', active ? 'border-accent bg-accent-subtle/50 ring-1 ring-accent' : 'border-border hover:border-border-strong/60', disabled && !active && 'cursor-not-allowed opacity-60')}>
              <Icon className={cn('mt-0.5 size-5 shrink-0', active ? 'text-accent' : 'text-fg-faint')} aria-hidden />
              <span>
                <span className="flex items-center gap-2 text-[14px] font-semibold text-fg">{title}{active && <Badge tone="accent">Current</Badge>}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-fg-muted">{body}</span>
              </span>
            </button>
          );
        })}
      </div>
      {canEdit && (
        <Confirm
          trigger={<Button variant="secondary" size="sm" className="justify-self-start">Clear sample data</Button>}
          title="Clear sample data?"
          description="This removes all sample runs, answers, and claims, plus open recommendations created from them. Live data, audits, and manual tasks are kept."
          confirmLabel="Clear sample data"
          onConfirm={async () => toastResult(await clearSampleData(ws.id))}
        />
      )}
    </div>
  );
}

export function DangerZone({ ws }: { ws: WS }) {
  const [state, action] = useActionState<ActionState, FormData>(deleteWorkspace, {});
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[14px] font-medium text-fg">Export workspace data</p>
          <p className="text-[13px] text-fg-muted">Download prompts, observations, claims, audits, tasks, and reports as JSON.</p>
        </div>
        <a href={`/api/workspaces/${ws.id}/export`} className={buttonClass({ variant: 'secondary', size: 'sm' })} download><Download aria-hidden />Export JSON</a>
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[14px] font-medium text-danger">Delete workspace</p>
          <p className="text-[13px] text-fg-muted">Permanently deletes all data in this workspace. This cannot be undone.</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>Delete workspace</Button>
      </div>
      {open && (
        <form action={action} className="grid gap-3 rounded-xl border border-danger/30 bg-danger-subtle/50 p-4">
          {state.error && <Alert tone="danger">{state.error}</Alert>}
          <input type="hidden" name="workspaceId" value={ws.id} />
          <Field label={`Type ${ws.slug} to confirm`} htmlFor="confirm" error={state.fieldErrors?.confirm}>
            <Input id="confirm" name="confirm" autoComplete="off" spellCheck={false} {...describedBy('confirm', state.fieldErrors?.confirm)} />
          </Field>
          <SubmitButton variant="danger" className="justify-self-start" pendingLabel="Deleting…">Permanently delete</SubmitButton>
        </form>
      )}
    </div>
  );
}
