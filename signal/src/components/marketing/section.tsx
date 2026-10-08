import * as React from 'react';
import { cn } from '@/lib/cn';

export function Section({ id, className, children, tone = 'default', labelledBy }: { id?: string; className?: string; children: React.ReactNode; tone?: 'default' | 'subtle' | 'ink'; labelledBy?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'scroll-mt-20 py-20 sm:py-24 lg:py-28',
        tone === 'subtle' && 'bg-bg-subtle',
        tone === 'ink' && 'bg-[#0b1020] text-white [--fg:#f2f4f7] [--fg-soft:#c9d0db] [--fg-muted:#9aa4b5] [--fg-faint:#7c8698] [--border:#232a3b] [--panel:#111729] [--panel-raised:#151c30] [--bg-muted:#192037] [--bg-subtle:#0f1528] [--accent:#8b98ff] [--accent-subtle:rgb(139_152_255/0.14)] [--accent-on-subtle:#c3c9ff] [--success:#34c38f] [--success-subtle:rgb(52_195_143/0.13)] [--success-on-subtle:#6ee0b4] [--brand:#6fc2b5]',
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, lede, id, align = 'left', className, action }: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode; id?: string; align?: 'left' | 'center'; className?: string; action?: React.ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between', align === 'center' && 'items-center text-center sm:flex-col sm:items-center', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="mt-3 text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] text-fg sm:text-[40px]">{title}</h2>
        {lede && <p className="mt-4 text-[17px] leading-relaxed text-fg-muted">{lede}</p>}
      </div>
      {action}
    </div>
  );
}
