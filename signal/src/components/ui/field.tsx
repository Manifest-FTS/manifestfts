import * as React from 'react';
import { cn } from '@/lib/cn';

const control =
  'w-full rounded-control border border-border bg-panel px-3 text-[14.5px] text-fg shadow-[0_1px_2px_rgb(16_24_40/0.04)] placeholder:text-fg-faint transition-[border-color,box-shadow] duration-150 hover:border-border-strong/70 focus:border-accent focus:outline-none focus:ring-4 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/20';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(control, 'h-10', className)} {...props} />;
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(control, 'min-h-24 py-2.5 leading-relaxed', className)} {...props} />;
});

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        control,
        "h-10 appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23667085' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")] bg-[right_10px_center] bg-no-repeat pr-9",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-[13.5px] font-medium text-fg', className)} {...props} />;
}

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  error?: string | string[];
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/** Label + control + hint + error, with ids wired for aria-describedby. */
export function Field({ label, htmlFor, hint, error, optional, className, children, action }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>
          {label}
          {optional && <span className="ml-1.5 font-normal text-fg-faint">Optional</span>}
        </Label>
        {action}
      </div>
      {children}
      {message ? (
        <p id={`${htmlFor}-error`} className="text-[13px] text-danger" role="alert">{message}</p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-[13px] text-fg-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string | string[], hint?: unknown) {
  if (error && (!Array.isArray(error) || error.length)) return { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` };
  return hint ? { 'aria-describedby': `${id}-hint` } : {};
}
