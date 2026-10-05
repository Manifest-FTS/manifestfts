'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

/** A Link that records a conversion event on click. */
export function TrackLink({ event = 'cta_clicked', label, onClick, ...props }: ComponentProps<typeof Link> & { event?: AnalyticsEvent; label: string }) {
  return <Link {...props} onClick={(e) => { track(event, { label }); onClick?.(e); }} />;
}
