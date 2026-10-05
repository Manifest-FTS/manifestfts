// Conversion and product events. Sent to Plausible (cookieless) when configured and to a
// dataLayer for tag managers. Never include personal data in event properties.
export type AnalyticsEvent =
  | 'cta_clicked'
  | 'signup_started'
  | 'signup_completed'
  | 'onboarding_step'
  | 'onboarding_completed'
  | 'readiness_check_run'
  | 'run_started'
  | 'checkout_started'
  | 'contact_submitted'
  | 'report_shared';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    (window.dataLayer ??= []).push({ event, ...props });
  } catch {
    // Analytics must never break the product.
  }
}
