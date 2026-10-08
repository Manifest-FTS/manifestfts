import { ProsePage } from '@/components/marketing/prose-page';
import { JsonLd } from '@/components/json-ld';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Security', description: 'How Manifest Signal protects accounts and data, and how to report a vulnerability.', path: '/security' });

const BODY = `
Signal is designed to hold the minimum data it needs. It does not request access to your website, analytics, or advertising accounts. This page summarizes our controls; it is not a certification.

## Application security

- Passwords are hashed with scrypt and a per-user salt. Plain-text passwords are never stored or logged.
- Sessions use 256-bit random tokens in HTTP-only, Secure, SameSite cookies. Only a SHA-256 hash of each token is stored, so a database read does not expose usable sessions.
- Sign-in, sign-up, password reset, invitations, and the public readiness checker are rate limited.
- Every workspace query is scoped by membership and role on the server. Non-members receive a not-found response, so workspace identifiers cannot be enumerated.
- Responses carry a Content Security Policy, frame denial, strict referrer policy, and HSTS in production.

## Outbound requests

The readiness audit fetches user-supplied URLs. To prevent server-side request forgery it accepts only public http and https hosts on standard ports, re-checks every resolved IP address at connection time, follows at most four redirects with re-validation, and enforces strict timeouts and size limits.

## Payments

Payments are processed by Stripe. Signal never receives card numbers. Stripe webhooks are verified with a signing secret.

## Reporting a vulnerability

Email **signal@manifestfts.com** with a description and steps to reproduce. Please do not access data that is not yours, degrade service, or publicly disclose an issue before we have had a reasonable opportunity to fix it. We will acknowledge reports within three business days.
`;

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Security', path: '/security' }])} />
      <ProsePage eyebrow="Trust" title="Security at Manifest Signal" body={BODY} updated="2026-10-05" />
    </>
  );
}
