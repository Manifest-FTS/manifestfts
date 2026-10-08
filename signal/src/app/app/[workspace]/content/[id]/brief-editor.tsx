'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Trash2 } from 'lucide-react';
import { deleteBrief, draftBrief, updateBrief } from '@/app/app/_actions/content';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';
import { Confirm } from '@/components/ui/confirm';
import { Alert } from '@/components/ui/alert';
import { CopyButton } from '@/components/tools/shared';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';

interface Props { workspaceId: string; slug: string; briefId: string; status: string; draft: string; draftModel: string | null; publishedUrl: string; canEdit: boolean; aiAvailable: boolean }

export function BriefEditor({ workspaceId, slug, briefId, status, draft, draftModel, publishedUrl, canEdit, aiAvailable }: Props) {
  const router = useRouter();
  const [state, action] = useActionState<ActionState, FormData>(updateBrief, {});
  useActionToast(state);
  const [drafting, startDraft] = React.useTransition();
  const placeholders = (draft.match(/\[VERIFY:[^\]]*\]/g) ?? []).length;

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <input type="hidden" name="briefId" value={briefId} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold text-fg">Draft</h2>
        <div className="flex flex-wrap gap-2">
          {draft && <CopyButton text={draft} label="Copy draft" />}
          {canEdit && aiAvailable && (
            <Button type="button" size="sm" variant="secondary" loading={drafting} onClick={() => startDraft(async () => { const r = await draftBrief(workspaceId, briefId); toastResult(r); if (r.ok) router.refresh(); })}>
              {!drafting && <Sparkles aria-hidden />}{drafting ? 'Drafting, up to a minute…' : draft ? 'Redraft with Claude' : 'Draft with Claude'}
            </Button>
          )}
        </div>
      </div>
      {draftModel && <p className="text-[12.5px] text-fg-muted">AI draft by {draftModel}. {placeholders ? <strong className="font-semibold text-warning">{placeholders} [VERIFY] placeholder{placeholders === 1 ? '' : 's'} to resolve before publishing.</strong> : 'Review every claim before publishing.'}</p>}
      {!aiAvailable && !draft && <Alert tone="info">Write the page from the brief, or paste a draft here. AI drafting is available when an Anthropic API key is configured.</Alert>}
      <label htmlFor="draft" className="sr-only">Draft</label>
      <Textarea id="draft" name="draft" key={draft} defaultValue={draft} rows={18} readOnly={!canEdit} placeholder="Paste or write the page here in Markdown." className="font-mono text-[13px] leading-relaxed" />
      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={status} disabled={!canEdit}>
            <option value="brief">Brief</option><option value="drafting">Drafting</option><option value="in_review">In review</option><option value="published">Published</option>
          </Select>
        </Field>
        <Field label="Published URL" htmlFor="publishedUrl" optional error={state.fieldErrors?.publishedUrl} hint="Once live, audit it and keep tracking the question.">
          <Input id="publishedUrl" name="publishedUrl" defaultValue={publishedUrl} placeholder="https://" readOnly={!canEdit} />
        </Field>
      </div>
      {canEdit && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
          <div className="flex gap-2">
            {publishedUrl && <a href={`/app/${slug}/readiness`} className="text-[13px] font-medium text-accent hover:underline">Audit the published page</a>}
            <Confirm trigger={<Button type="button" size="sm" variant="danger-ghost"><Trash2 aria-hidden />Delete</Button>} title="Delete this brief?" description="The brief and draft are permanently removed." onConfirm={async () => { const r = await deleteBrief(workspaceId, briefId); toastResult(r); if (r.ok) router.push(`/app/${slug}/content`); }} />
          </div>
        </div>
      )}
    </form>
  );
}
