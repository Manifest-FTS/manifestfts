import { cn } from '@/lib/cn';

/** Manifest Signal product mark: a source point with three widening arcs (signal, evidence, reach). */
export function SignalMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-7', className)} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <circle cx="10" cy="22" r="2.6" fill="#fff" />
      <path d="M10 15.2a6.8 6.8 0 0 1 6.8 6.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 9.4A12.6 12.6 0 0 1 22.6 22" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".72" />
      <path d="M10 3.8A18.2 18.2 0 0 1 28.2 22" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".42" />
    </svg>
  );
}

export function Wordmark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <SignalMark />
      <span className="flex items-baseline gap-1.5 text-[16px] font-semibold tracking-[-0.025em] text-fg">
        {!compact && <span className="font-medium text-fg-muted">Manifest</span>}
        Signal
      </span>
    </span>
  );
}
