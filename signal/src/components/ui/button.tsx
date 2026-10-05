import * as React from 'react';
import { Slot } from 'radix-ui';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

const variants = {
  primary: 'bg-accent text-white shadow-[0_1px_2px_rgb(16_24_40/0.12),inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-accent-hover dark:text-[#0a0d14]',
  secondary: 'bg-panel text-fg border border-border hover:bg-bg-subtle hover:border-border-strong/60 shadow-card',
  ghost: 'text-fg-soft hover:bg-bg-muted hover:text-fg',
  danger: 'bg-danger text-white hover:brightness-110 dark:text-[#0a0d14]',
  'danger-ghost': 'text-danger hover:bg-danger-subtle',
  ink: 'bg-fg text-bg hover:opacity-90',
  link: 'text-accent underline-offset-4 hover:underline px-0! h-auto!',
} as const;

const sizes = {
  sm: 'h-8 gap-1.5 rounded-[8px] px-3 text-[13px]',
  md: 'h-10 gap-2 rounded-control px-4 text-sm',
  lg: 'h-12 gap-2 rounded-control px-5 text-[15px]',
  icon: 'h-9 w-9 rounded-control',
  'icon-sm': 'h-8 w-8 rounded-[8px]',
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
  loading?: boolean;
}

export function buttonClass({ variant = 'primary', size = 'md', className }: { variant?: keyof typeof variants; size?: keyof typeof sizes; className?: string } = {}) {
  return cn(
    'relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap font-semibold transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&_svg]:size-4 [&_svg]:shrink-0',
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant, size, asChild, loading, className, children, disabled, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp className={buttonClass({ variant, size, className })} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {asChild ? children : (
        <>
          {loading && <LoaderCircle className="animate-spin" aria-hidden />}
          {children}
        </>
      )}
    </Comp>
  );
}
