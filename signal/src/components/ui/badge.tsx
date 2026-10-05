import * as React from 'react';
import { cn } from '@/lib/cn';

const tones = {
  neutral: 'bg-bg-muted text-fg-soft ring-border',
  accent: 'bg-accent-subtle text-accent-on-subtle ring-accent/15',
  brand: 'bg-brand-subtle text-brand-on-subtle ring-brand/15',
  success: 'bg-success-subtle text-success-on-subtle ring-success/15',
  warning: 'bg-warning-subtle text-warning-on-subtle ring-warning/20',
  danger: 'bg-danger-subtle text-danger-on-subtle ring-danger/15',
  outline: 'bg-transparent text-fg-soft ring-border',
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({ tone = 'neutral', className, dot, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; dot?: boolean }) {
  return (
    <span
      className={cn('inline-flex h-[22px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[12px] font-medium ring-1 ring-inset [&_svg]:size-3', tones[tone], className)}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {props.children}
    </span>
  );
}
