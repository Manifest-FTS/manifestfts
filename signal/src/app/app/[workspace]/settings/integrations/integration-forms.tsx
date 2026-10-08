'use client';
import * as React from 'react';
import { useActionState } from 'react';
import { KeyRound, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import { checkIndexNowKey, createIndexNowKey, rotateWebhookSecret, saveDestinations, sendTestEvent, submitToIndexNow } from '@/app/app/_actions/integrations';
import type { ActionState } from '@/app/app/_actions/workspace';
import { Field, Input, Textarea, describedBy } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionToast, toastResult } from '@/components/app/use-action-toast';
import { CopyButton } from '@/components/tools/shared';

export function DestinationsForm({ workspaceId, slack, webhook, secret, canEdit }: { workspaceId: string; slack: string; webhook: string; secret: string | null; canEdit: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(saveDestinations, {});
  useActionToast(state);
  const [pending, startTransition] = React.useTransition();
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <Field label="Slack incoming webhook URL" htmlFor="slack" error={e.slackWebhookUrl} hint="Create one in Slack: Apps → Incoming Webhooks → choose a channel.">
        <Input id="slack" name="slackWebhookUrl" defaultValue={slack} placeholder="https://hooks.slack.com/services/…" spellCheck={false} readOnly={!canEdit} {...describedBy('slack', e.slackWebhookUrl, true)} />
      </Field>
      <Field label="Webhook URL" htmlFor="webhook" error={e.webhookUrl} hint="Receives JSON for run.completed, run.failed, audit.completed, and accuracy.inaccurate, signed with HMAC-SHA256.">
        <Input id="webhook" name="webhookUrl" defaultValue={webhook} placeholder="https://example.com/hooks/signal" spellCheck={false} readOnly={!canEdit} {...describedBy('webhook', e.webhookUrl, true)} />
      </Field>
      {secret && (
        <div className="rounded-xl border border-border bg-bg-subtle p-3">
          <p className="text-[12.5px] font-medium text-fg">Signing secret</p>
          <p className="mt-1 text-[12px] text-fg-muted">Verify the <code className="font-mono">x-signal-signature</code> header: <code className="font-mono">sha256=</code> HMAC of the raw body with this secret.</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-panel px-2 py-1 font-mono text-[12px] text-fg-soft">{secret}</code>
            <CopyButton text={secret} />
            {canEdit && <Button type="button" size="sm" variant="ghost" disabled={pending} onClick={() => startTransition(async () => toastResult(await rotateWebhookSecret(workspaceId)))}><RefreshCw aria-hidden />Rotate</Button>}
          </div>
        </div>
      )}
      {canEdit && (
        <div className="flex flex-wrap gap-2">
          <SubmitButton pendingLabel="Saving…">Save destinations</SubmitButton>
          <Button type="button" variant="secondary" loading={pending} onClick={() => startTransition(async () => toastResult(await sendTestEvent(workspaceId)))}><Send aria-hidden />Send test</Button>
        </div>
      )}
    </form>
  );
}

export function IndexNowPanel({ workspaceId, domain, keyValue, canEdit }: { workspaceId: string; domain: string; keyValue: string | null; canEdit: boolean }) {
  const [pending, startTransition] = React.useTransition();
  const [state, action] = useActionState<ActionState, FormData>(submitToIndexNow, {});
  useActionToast(state);
  if (!keyValue) {
    return (
      <div className="grid gap-3">
        <p className="text-[13.5px] text-fg-muted">IndexNow tells Bing (which grounds Copilot and ChatGPT search), Yandex, Naver, Seznam, and other participating engines that pages changed, so updates are picked up in minutes instead of days.</p>
        {canEdit && <Button className="justify-self-start" loading={pending} onClick={() => startTransition(async () => toastResult(await createIndexNowKey(workspaceId)))}><KeyRound aria-hidden />Generate IndexNow key</Button>}
      </div>
    );
  }
  const location = `https://${domain}/${keyValue}.txt`;
  return (
    <div className="grid gap-4">
      <ol className="grid list-decimal gap-2 pl-5 text-[13.5px] text-fg-soft marker:text-fg-faint">
        <li>Publish a text file at <code className="break-all font-mono text-[12.5px]">{location}</code> containing only the key below.</li>
        <li>Verify the file, then submit changed URLs whenever you publish or update pages.</li>
      </ol>
      <div className="flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-bg-subtle px-2 py-1.5 font-mono text-[12.5px] text-fg-soft">{keyValue}</code>
        <CopyButton text={keyValue} label="Copy key" />
        <Button size="sm" variant="secondary" loading={pending} onClick={() => startTransition(async () => toastResult(await checkIndexNowKey(workspaceId)))}><ShieldCheck aria-hidden />Verify</Button>
      </div>
      {canEdit && (
        <form action={action} className="grid gap-3">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <Field label="URLs to submit" htmlFor="urls" hint="One per line. Or submit every URL in your sitemap." error={state.fieldErrors?.urls}>
            <Textarea id="urls" name="urls" rows={4} placeholder={`https://${domain}/pricing\nhttps://${domain}/blog/new-guide`} className="font-mono text-[12.5px]" />
          </Field>
          <div className="flex flex-wrap gap-2">
            <SubmitButton name="mode" value="urls" pendingLabel="Submitting…">Submit URLs</SubmitButton>
            <SubmitButton name="mode" value="sitemap" variant="secondary" pendingLabel="Submitting…">Submit entire sitemap</SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
}
