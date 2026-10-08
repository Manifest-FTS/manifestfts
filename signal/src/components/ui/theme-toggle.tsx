'use client';
import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/cn';

type Theme = 'light' | 'dark' | 'system';

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;

function apply(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

const THEME_EVENT = 'signal-theme-change';

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function readTheme(): Theme {
  try {
    return (localStorage.getItem('theme') as Theme) || 'system';
  } catch {
    return 'system';
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  // The stored preference is external state; read it without a hydration mismatch.
  const theme = React.useSyncExternalStore(subscribe, readTheme, () => null);

  React.useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => readTheme() === 'system' && apply('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const choose = (next: Theme) => {
    try {
      localStorage.setItem('theme', next);
    } catch {}
    apply(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'dark', label: 'Dark', Icon: Moon },
    { value: 'system', label: 'System', Icon: Monitor },
  ];

  return (
    <div role="radiogroup" aria-label="Color theme" className={cn('inline-flex items-center gap-0.5 rounded-full border border-border bg-bg-subtle p-0.5', className)}>
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => choose(value)}
          className={cn('grid size-7 place-items-center rounded-full text-fg-faint transition hover:text-fg', theme === value && 'bg-panel text-fg shadow-card')}
        >
          <Icon className="size-3.5" aria-hidden />
        </button>
      ))}
    </div>
  );
}
