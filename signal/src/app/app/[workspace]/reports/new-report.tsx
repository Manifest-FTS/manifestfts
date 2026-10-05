'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createReport } from '@/app/app/_actions/reports';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Field, Input, Select, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Alert } from '@/components/ui/alert';

export function NewReport({ workspaceId, defaultTitle }: { workspaceId: string; defaultTitle: string }) {
  const params = useSearchParams();
  const [open, setOpen] = React.useState(params.get('new') === '1');
  const [state, action] = useActionState<ActionState, FormData>(createReport, {});
  const e = state.fieldErrors ?? {};
  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus aria-hidden />New report</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Create a report" description="Captures the current metrics as a fixed snapshot so numbers don’t change after you share them.">
          <form action={action} className="grid gap-4">
            {state.error && <Alert tone="danger">{state.error}</Alert>}
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <Field label="Title" htmlFor="r-title" error={e.title}><Input id="r-title" name="title" defaultValue={defaultTitle} required {...describedBy('r-title', e.title)} /></Field>
            <Field label="Period" htmlFor="r-days"><Select id="r-days" name="days" defaultValue="30"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></Select></Field>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <SubmitButton pendingLabel="Building report…">Create report</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
