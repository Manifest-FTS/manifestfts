'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { savePrompt } from '@/app/app/_actions/data';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Field, Input, Select, Textarea, describedBy } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionToast } from '@/components/app/use-action-toast';

export interface PromptValues { id?: string; text: string; topic: string; intent: string }

export function PromptDialog({ workspaceId, topics, open, onOpenChange, initial }: { workspaceId: string; topics: string[]; open: boolean; onOpenChange: (o: boolean) => void; initial?: PromptValues }) {
  const [state, action] = useActionState<ActionState, FormData>(savePrompt, {});
  useActionToast(state, () => onOpenChange(false));
  const e = state.fieldErrors ?? {};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={initial?.id ? 'Edit prompt' : 'Add a prompt'} description="Write the question the way a customer would ask it. Each run asks every active prompt once per engine.">
        <form action={action} className="grid gap-4" key={initial?.id ?? 'new'}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          {initial?.id && <input type="hidden" name="promptId" value={initial.id} />}
          <Field label="Question" htmlFor="p-text" error={e.text}>
            <Textarea id="p-text" name="text" rows={3} required defaultValue={initial?.text} placeholder="What is the best accounting software for a small nonprofit?" {...describedBy('p-text', e.text)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Topic" htmlFor="p-topic" error={e.topic} hint="Group related prompts.">
              <Input id="p-topic" name="topic" required list="topic-options" defaultValue={initial?.topic ?? topics[0] ?? 'General'} {...describedBy('p-topic', e.topic, true)} />
              <datalist id="topic-options">{topics.map((t) => <option key={t} value={t} />)}</datalist>
            </Field>
            <Field label="Intent" htmlFor="p-intent">
              <Select id="p-intent" name="intent" defaultValue={initial?.intent ?? 'discovery'}>
                <option value="discovery">Discovery</option>
                <option value="comparison">Comparison</option>
                <option value="evaluation">Evaluation</option>
                <option value="brand">Brand</option>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="secondary" type="button">Cancel</Button></DialogClose>
            <SubmitButton pendingLabel="Saving…">{initial?.id ? 'Save changes' : 'Add prompt'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
