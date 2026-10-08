'use client';
import * as React from 'react';
import { Switch as S } from 'radix-ui';
import { cn } from '@/lib/cn';

export function Switch({ className, ...props }: React.ComponentProps<typeof S.Root>) {
  return (
    <S.Root
      className={cn('relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer items-center rounded-full bg-border-strong/50 transition-colors data-[state=checked]:bg-accent disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    >
      <S.Thumb className="block size-[18px] translate-x-[2px] rounded-full bg-white shadow-[0_1px_3px_rgb(16_24_40/0.25)] transition-transform duration-150 data-[state=checked]:translate-x-[18px]" />
    </S.Root>
  );
}
