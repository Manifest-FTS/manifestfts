'use client';
import { useActionState } from 'react';
import { Globe, RotateCcw } from 'lucide-react';
import { runAudit } from '@/app/app/_actions/data';
import type { ActionState } from '@/app/app/_actions/workspace';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionToast } from '@/components/app/use-action-toast';
import { track } from '@/lib/analytics';

export function AuditForm({ workspaceId, defaultUrl, disabled }: { workspaceId: string; defaultUrl: string; disabled?: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(runAudit, {});
  useActionToast(state);
  const error = state.fieldErrors?.url?.[0];
  return (
    <form action={action} onSubmit={() => track('readiness_check_run', { surface: 'app' })} className="grid gap-2">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="audit-url" className="sr-only">Page URL to audit</label>
        <div className="relative flex-1">
          <Globe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden />
          <input id="audit-url" name="url" defaultValue={defaultUrl} spellCheck={false} aria-invalid={!!error} aria-describedby={error ? 'audit-url-error' : undefined}
            className="h-10 w-full rounded-control border border-border bg-panel pl-9 pr-3 font-mono text-[13.5px] text-fg focus:border-accent focus:outline-none focus:ring-4 focus:ring-[var(--ring)] aria-[invalid=true]:border-danger" />
        </div>
        <SubmitButton disabled={disabled} pendingLabel="Auditing…"><RotateCcw aria-hidden />Run audit</SubmitButton>
      </div>
      {error && <p id="audit-url-error" className="text-[13px] text-danger" role="alert">{error}</p>}
    </form>
  );
}
