'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

export function SettingsNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/app/${slug}/settings`;
  const items = [
    { href: base, label: 'General' },
    { href: `${base}/members`, label: 'Members' },
    { href: `${base}/billing`, label: 'Billing' },
    { href: `${base}/activity`, label: 'Activity' },
  ];
  return (
    <nav aria-label="Settings" className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
      {items.map((i) => {
        const active = pathname === i.href;
        return (
          <Link key={i.href} href={i.href} aria-current={active ? 'page' : undefined}
            className={cn('-mb-px shrink-0 border-b-2 px-3 py-2.5 text-[13.5px] font-medium transition-colors', active ? 'border-accent text-fg' : 'border-transparent text-fg-muted hover:text-fg')}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
