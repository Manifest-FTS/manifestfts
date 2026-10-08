import * as React from 'react';
import { cn } from '@/lib/cn';

export function PageHero({ eyebrow, title, lede, children, className }: { eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <section className={cn('relative overflow-hidden border-b border-border pb-16 pt-14 sm:pb-20 sm:pt-20', className)}>
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_70%_at_50%_0%,#000_20%,transparent)]" />
      <div className="container-page relative">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-[36px] font-semibold leading-[1.06] tracking-[-0.04em] text-fg sm:text-[52px]">{title}</h1>
          {lede && <p className="mt-5 max-w-2xl text-[17.5px] leading-relaxed text-fg-muted">{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
