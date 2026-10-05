import { ProsePage } from '@/components/marketing/prose-page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Privacy policy', description: 'How Manifest FTS collects, uses, and protects personal information in Manifest Signal.', path: '/privacy' });

const BODY = `
This policy explains how Manifest FTS ("we") handles personal information in Manifest Signal ("Signal"). It should be read with the Manifest FTS site privacy policy.

## Information we collect

- **Account information:** your name, email address, and a password hash.
- **Workspace content:** brand details, competitors, prompts, facts, tasks, reports, and the answers and sources Signal collects.
- **Usage information:** sign-in times, session device and IP address (for security), and product events without personal content.
- **Billing information:** handled by Stripe. We receive the subscription status and customer identifier, not card numbers.
- **Inquiries:** details you submit through the contact form.

## How we use information

To provide and secure the service, send transactional email (verification, password reset, invitations, run notifications you enable), process payments, respond to inquiries, and improve the product. We do not sell personal information or use workspace content to train models.

## Processors

Signal uses infrastructure, database, and email providers (including Mailjet) and Stripe for payments. When live observation is enabled, prompts you track are sent to the answer-engine APIs you select (OpenAI, Perplexity, Google, Anthropic); account information is not included in those requests. Analytics, when enabled, uses a cookieless provider.

## Cookies

Signal sets a strictly necessary session cookie after you sign in, and stores your theme preference in your browser. We do not use advertising cookies.

## Retention and deletion

Workspace data is kept while the workspace exists. Owners can export or delete a workspace at any time; you can delete your account from account settings. Backups containing deleted data expire within 35 days.

## Your rights

Depending on where you live, you may have rights to access, correct, export, or delete personal information. Contact **signal@manifestfts.com** to make a request.

## Changes

We will post changes on this page and update the date above. Material changes will be emailed to account owners.
`;

export default function PrivacyPage() {
  return <ProsePage eyebrow="Legal" title="Privacy policy" body={BODY} updated="2026-10-05" />;
}
