import { ProsePage } from '@/components/marketing/prose-page';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: 'Terms of service', description: 'The terms that govern use of Manifest Signal.', path: '/terms' });

const BODY = `
These terms govern your use of Manifest Signal ("Signal"), provided by Manifest FTS ("we"). By creating an account you agree to them on behalf of yourself and any organization you represent.

## The service

Signal observes and analyzes answers from third-party AI systems and audits publicly accessible web pages. Third-party systems change without notice; we do not control their output and cannot guarantee that any engine will mention, cite, or recommend you.

## Accounts

You are responsible for your account credentials and for activity in workspaces you own. Provide accurate information and keep it current.

## Acceptable use

Do not use Signal to audit sites you are not authorized to test at scale, to attempt to access systems or data that are not yours, to interfere with the service, or to violate the terms of the AI systems Signal observes.

## Subscriptions

Plans renew monthly until cancelled. Trials convert only when you choose a plan. Fees are non-refundable except where required by law. We may change prices with 30 days' notice to account owners.

## Your content

You own the content you add to Signal. You grant us a limited license to host and process it to provide the service. You can export or delete it at any time.

## Disclaimers and liability

Signal is provided "as is." Metrics are statistical estimates from samples of AI output and should be interpreted with their stated intervals. To the extent permitted by law, our total liability is limited to the fees you paid in the twelve months before the claim.

## Contact

Questions about these terms: **signal@manifestfts.com**.
`;

export default function TermsPage() {
  return <ProsePage eyebrow="Legal" title="Terms of service" body={BODY} updated="2026-10-05" />;
}
