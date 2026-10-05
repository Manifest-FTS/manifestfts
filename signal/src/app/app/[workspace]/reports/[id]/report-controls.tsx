'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, Link2, Printer, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteReport, setReportSharing, updateReportSummary } from '@/app/app/_actions/data';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/field';
import { Confirm } from '@/components/ui/confirm';
import { toastResult } from '@/components/app/use-action-toast';
import { track } from '@/lib/analytics';

export function ReportToolbar({ workspaceId, reportId, slug, shareUrl, canShare, canEdit }: { workspaceId: string; reportId: string; slug: string; shareUrl: string | null; canShare: boolean; canEdit: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      {canShare && (
        <label className="flex h-8 items-center gap-2 rounded-lg border border-border bg-panel px-3 text-[13px] font-medium text-fg-soft">
          <Switch checked={!!shareUrl} disabled={pending} onCheckedChange={(v) => startTransition(async () => { const r = await setReportSharing(workspaceId, reportId, v); toastResult(r.error ? r : { message: v ? 'Share link created.' : 'Share link revoked.' }); if (v && !r.error) track('report_shared'); })} aria-label="Share with a private link" />
          Private link
        </label>
      )}
      {shareUrl && (
        <Button size="sm" variant="secondary" onClick={async () => { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}{copied ? 'Copied' : 'Copy link'}
        </Button>
      )}
      <Button size="sm" variant="secondary" onClick={() => window.print()}><Printer aria-hidden />Print or PDF</Button>
      {canEdit && (
        <Confirm trigger={<Button size="sm" variant="danger-ghost" aria-label="Delete report"><Trash2 aria-hidden /></Button>} title="Delete this report?" description="Anyone with the share link will lose access. Underlying data is not affected."
          onConfirm={async () => { const r = await deleteReport(workspaceId, reportId); toastResult(r); if (r.ok) router.push(`/app/${slug}/reports`); }} />
      )}
      {shareUrl && <span className="sr-only" id="share-url"><Link2 />{shareUrl}</span>}
    </div>
  );
}

export function SummaryEditor({ workspaceId, reportId, initial }: { workspaceId: string; reportId: string; initial: string }) {
  const [value, setValue] = React.useState(initial);
  const [pending, startTransition] = React.useTransition();
  const dirty = value !== initial;
  return (
    <div className="no-print mt-3 grid gap-2">
      <label htmlFor="report-summary" className="sr-only">Executive summary</label>
      <Textarea id="report-summary" rows={5} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Write the takeaways in your own words: what changed, why it matters, and what happens next." />
      <div className="flex items-center gap-3">
        <Button size="sm" disabled={!dirty} loading={pending} onClick={() => startTransition(async () => { const r = await updateReportSummary(workspaceId, reportId, value); if (r.error) toast.error(r.error); else toast.success('Summary saved.'); })}>Save summary</Button>
        <span className="text-[12px] text-fg-faint">Supports **bold** and simple lists.</span>
      </div>
    </div>
  );
}
