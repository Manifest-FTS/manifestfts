import React, { forwardRef, useId } from 'react';
import styles from './Signal.module.css';

export const SignalButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'; loading?: boolean;
}>(function SignalButton({ variant = 'primary', loading = false, disabled, children, className = '', type = 'button', ...props }, ref) {
  return <button {...props} ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
    className={`${styles.button} ${variant === 'secondary' ? styles.secondary : ''} ${className}`}>
    {loading ? 'Working…' : children}
  </button>;
});

export function SignalBadge({ tone = 'neutral', children }: { tone?: 'success' | 'warning' | 'neutral'; children: React.ReactNode }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

export function SignalInsightCard({ title, children, status }: { title: string; children: React.ReactNode; status?: React.ReactNode }) {
  return <article className={styles.card}>
    <div className={styles.cardHeader}>{status}<span className={styles.eyebrow}>Signal insight</span></div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <div className={styles.cardBody}>{children}</div>
  </article>;
}

export function SignalGauge({ value, label, citations, sampleSize }: {
  value: number | null; label: string; citations?: number; sampleSize?: number;
}) {
  const known = value !== null && Number.isFinite(value);
  const score = known ? Math.min(100, Math.max(0, value as number)) : 0;
  return <div className={styles.gauge}>
    <div className={styles.gaugeHeading}><span>{label}</span></div>
    <p className={styles.score}>{known ? Math.round(score) : '—'}<span>{known ? '%' : 'No data'}</span></p>
    {known ? <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}
      aria-valuetext={`${Math.round(score)} percent of evaluated responses cited your brand`} className={styles.track}>
      <span style={{ width: `${score}%` }} />
    </div> : <div className={styles.track} aria-hidden="true" />}
    <p className={styles.metricNote}>{citations !== undefined && sampleSize !== undefined
      ? `${citations} of ${sampleSize} evaluated responses cited your brand.`
      : 'Percentage of evaluated responses that cite your brand.'}</p>
  </div>;
}

export const SignalInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  label: string; hint?: string; error?: string;
}>(function SignalInput({ label, hint, error, id, className = '', 'aria-describedby': describedBy, ...props }, ref) {
  const generated = useId();
  const inputId = id || generated;
  const noteId = `${inputId}-note`;
  const description = [describedBy, (hint || error) && noteId].filter(Boolean).join(' ') || undefined;
  return <div className={styles.field}>
    <label htmlFor={inputId}>{label}{props.required && <span> (required)</span>}</label>
    <input {...props} ref={ref} id={inputId} aria-describedby={description} aria-invalid={error ? true : props['aria-invalid']}
      className={`${styles.input} ${className}`} />
    {(error || hint) && <p id={noteId} className={error ? styles.error : styles.hint}>{error || hint}</p>}
  </div>;
});