import * as React from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-panel border border-border bg-panel shadow-card', className)} {...props} />;
}

export function CardHeader({ title, description, action, className, as: Heading = 'h2' }: { title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; className?: string; as?: 'h2' | 'h3' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="min-w-0">
        <Heading className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</Heading>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between gap-3 border-t border-border px-5 py-3.5 text-[13px] text-fg-muted', className)} {...props} />;
}
