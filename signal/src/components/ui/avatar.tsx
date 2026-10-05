import { initials } from '@/lib/format';
import { cn } from '@/lib/cn';

const HUES = ['#4353c7', '#3f8077', '#9a5b00', '#b93838', '#6941c6', '#087a55', '#c4320a'];

export function Avatar({ name, size = 28, className }: { name: string; size?: number; className?: string }) {
  const hue = HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
  return (
    <span
      aria-hidden
      className={cn('inline-grid shrink-0 place-items-center rounded-full font-semibold text-white ring-2 ring-panel', className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38), background: hue }}
    >
      {initials(name)}
    </span>
  );
}
