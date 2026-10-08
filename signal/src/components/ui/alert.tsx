import * as React from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

const tones = {
  info: { cls: 'border-accent/20 bg-accent-subtle text-accent-on-subtle', Icon: Info },
  success: { cls: 'border-success/20 bg-success-subtle text-success-on-subtle', Icon: CircleCheck },
  warning: { cls: 'border-warning/25 bg-warning-subtle text-warning-on-subtle', Icon: TriangleAlert },
  danger: { cls: 'border-danger/20 bg-danger-subtle text-danger-on-subtle', Icon: CircleAlert },
} as const;

export function Alert({ tone = 'info', title, children, className, action }: { tone?: keyof typeof tones; title?: React.ReactNode; children?: React.ReactNode; className?: string; action?: React.ReactNode }) {
  const { cls, Icon } = tones[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-[13.5px] leading-relaxed', cls, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5', 'opacity-95')}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
