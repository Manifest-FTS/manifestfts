'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Wordmark } from '@/components/brand/logo';
import { buttonClass } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';

const NAV = [
  { href: '/features', label: 'Product' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/tools/ai-readiness-checker', label: 'Free checker' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={cn('sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-200', scrolled || open ? 'border-border bg-bg/85 backdrop-blur-xl' : 'border-transparent bg-bg/0')}>
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="rounded-lg" aria-label="Manifest Signal home">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}
                className={cn('rounded-lg px-3 py-2 text-[14px] font-medium text-fg-soft transition-colors hover:bg-bg-muted hover:text-fg', active && 'text-fg')}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className={buttonClass({ variant: 'ghost', size: 'sm' })}>Sign in</Link>
          <Link href="/signup" onClick={() => track('cta_clicked', { label: 'header_trial' })} className={buttonClass({ size: 'sm' })}>Start free trial</Link>
        </div>
        <button type="button" className="grid size-10 place-items-center rounded-lg text-fg lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <div id="mobile-nav" hidden={!open} className="border-t border-border bg-bg lg:hidden">
        <nav aria-label="Mobile" className="container-page grid gap-1 py-4">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-3 text-[15px] font-medium text-fg hover:bg-bg-muted">{item.label}</Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
            <Link href="/login" className={buttonClass({ variant: 'secondary' })}>Sign in</Link>
            <Link href="/signup" className={buttonClass()}>Start free trial</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
