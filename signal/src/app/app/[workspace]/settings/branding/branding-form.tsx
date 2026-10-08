'use client';
import { useActionState } from 'react';
import { saveBranding } from '@/app/app/_actions/integrations';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Field, Input, describedBy } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionToast } from '@/components/app/use-action-toast';

export function BrandingForm({ workspaceId, values, canEdit }: { workspaceId: string; values: { name: string; color: string; logo: string; hide: boolean }; canEdit: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(saveBranding, {});
  useActionToast(state);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <fieldset disabled={!canEdit} className="grid gap-4 sm:grid-cols-2 disabled:opacity-70">
        <Field label="Agency or brand name" htmlFor="rb-name" hint="Shown in the report header."><Input id="rb-name" name="reportBrandName" defaultValue={values.name} placeholder="Northwind Agency" {...describedBy('rb-name', undefined, true)} /></Field>
        <Field label="Accent color" htmlFor="rb-color" error={e.reportAccentColor}><Input id="rb-color" name="reportAccentColor" defaultValue={values.color} placeholder="#1d4ed8" {...describedBy('rb-color', e.reportAccentColor)} /></Field>
        <Field label="Logo URL" htmlFor="rb-logo" error={e.reportLogoUrl} hint="An https image, ideally an SVG or PNG on a transparent background." className="sm:col-span-2"><Input id="rb-logo" name="reportLogoUrl" defaultValue={values.logo} placeholder="https://" {...describedBy('rb-logo', e.reportLogoUrl, true)} /></Field>
        <label className="flex items-center gap-2.5 text-[14px] text-fg sm:col-span-2">
          <input type="checkbox" name="hideSignalBranding" defaultChecked={values.hide} className="size-4 accent-[var(--accent)]" />
          Hide Manifest Signal branding on shared reports
        </label>
      </fieldset>
      {canEdit && <div><SubmitButton pendingLabel="Saving…">Save branding</SubmitButton></div>}
    </form>
  );
}
