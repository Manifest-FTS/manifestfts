'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createBrief } from '@/app/app/_actions/content';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Field, Select, Textarea } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert } from '@/components/ui/alert';

export function NewBrief({ workspaceId, prompts }: { workspaceId: string; prompts: { id: string; text: string; mention: number | null }[] }) {
  const params = useSearchParams();
  const preset = params.get('prompt');
  const [open, setOpen] = React.useState(!!preset || params.get('new') === '1');
  const [mode, setMode] = React.useState<'prompt' | 'custom'>(prompts.length ? 'prompt' : 'custom');
  const [state, action] = useActionState<ActionState, FormData>(createBrief, {});
  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus aria-hidden />New brief</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Create a content brief" description="Signal compiles what engines say today, who they name, which sources they cite, and your facts into a brief for one page.">
          <form action={action} className="grid gap-4">
            {state.error && <Alert tone="danger">{state.error}</Alert>}
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <div className="inline-flex rounded-lg border border-border p-0.5" role="radiogroup" aria-label="Brief source">
              {(['prompt', 'custom'] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} disabled={m === 'prompt' && !prompts.length}
                  className={`h-8 rounded-md px-3 text-[13px] font-medium ${mode === m ? 'bg-bg-muted text-fg' : 'text-fg-muted'}`}>{m === 'prompt' ? 'From a tracked prompt' : 'Custom question'}</button>
              ))}
            </div>
            {mode === 'prompt' ? (
              <Field label="Prompt" htmlFor="b-prompt" hint="Prompts where you are rarely named are listed first.">
                <Select id="b-prompt" name="promptId" defaultValue={preset ?? prompts[0]?.id}>
                  {prompts.map((p) => <option key={p.id} value={p.id}>{p.mention === null ? '—' : `${Math.round(p.mention * 100)}%`} · {p.text}</option>)}
                </Select>
              </Field>
            ) : (
              <Field label="Question the page should answer" htmlFor="b-question" error={state.fieldErrors?.question}>
                <Textarea id="b-question" name="question" rows={2} required placeholder="How much does managed WordPress hosting cost for an agency?" />
              </Field>
            )}
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <SubmitButton pendingLabel="Building brief…">Create brief</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
