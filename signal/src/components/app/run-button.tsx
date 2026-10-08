'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { startRun } from '@/app/app/_actions/runs';
import { track } from '@/lib/analytics';

interface Progress { status: string; total: number; completed: number; failed: number; error: string | null }

/** Starts a run and shows live progress until it finishes, then refreshes the page data. */
export function RunButton({ workspaceId, initialRunId, disabled, sample }: { workspaceId: string; initialRunId: string | null; disabled?: boolean; sample: boolean }) {
  const router = useRouter();
  const [runId, setRunId] = React.useState(initialRunId);
  const [progress, setProgress] = React.useState<Progress | null>(null);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!runId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const res = await fetch(`/api/runs/${runId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data: Progress = await res.json();
        if (cancelled) return;
        setProgress(data);
        if (data.status === 'completed' || data.status === 'failed') {
          setRunId(null);
          setProgress(null);
          if (data.status === 'completed') toast.success('Run complete', { description: `${data.completed} answers collected${data.failed ? `, ${data.failed} failed` : ''}.` });
          else toast.error('Run failed', { description: data.error ?? 'No answers were collected.' });
          router.refresh();
          return;
        }
      } catch {
        if (cancelled) return;
      }
      timer = setTimeout(poll, 1500);
    };
    void poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [runId, router]);

  if (runId) {
    const pct = progress && progress.total ? Math.round(((progress.completed + progress.failed) / progress.total) * 100) : 0;
    return (
      <div className="flex h-8 items-center gap-2.5 rounded-lg border border-border bg-panel px-3 text-[12.5px] text-fg-soft" role="status" aria-live="polite">
        <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-accent" /></span>
        <span className="hidden sm:inline">Running</span>
        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-muted" aria-hidden><span className="block h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} /></span>
        <span className="tabular">{pct}%</span>
      </div>
    );
  }

  const button = (
    <Button
      size="sm"
      variant="secondary"
      loading={pending}
      disabled={disabled}
      onClick={() => startTransition(async () => {
        const result = await startRun(workspaceId);
        if (result.error) toast.error(result.error);
        else if (result.runId) {
          track('run_started', { sample });
          setRunId(result.runId);
        }
      })}
    >
      {!pending && <Play aria-hidden />}Run now
    </Button>
  );
  return disabled ? <Tooltip content="Editors and above can start runs.">{<span tabIndex={0}>{button}</span>}</Tooltip> : button;
}
