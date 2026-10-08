'use client';
import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/field';

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className="pr-11" />
      <button type="button" onClick={() => setVisible((v) => !v)} className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-fg-faint hover:text-fg" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible}>
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

/** Lightweight strength hint; the server enforces the actual rules. */
export function PasswordStrength({ value }: { value: string }) {
  const score = [value.length >= 10, value.length >= 14, /[A-Z]/.test(value) && /[a-z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
  const label = value.length < 10 ? 'At least 10 characters' : score <= 2 ? 'Fair' : score <= 3 ? 'Good' : 'Strong';
  const tone = value.length < 10 ? 'bg-border-strong/40' : score <= 2 ? 'bg-warning' : 'bg-success';
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < Math.max(1, score - 1) && value ? tone : 'bg-bg-muted'}`} />)}
      </div>
      <span className="w-36 text-right text-[12px] text-fg-muted">{value ? label : 'At least 10 characters'}</span>
    </div>
  );
}
