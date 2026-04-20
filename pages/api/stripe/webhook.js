import Stripe from 'stripe';
import { promises as fs } from 'fs';
import path from 'path';
import {
  buildCustomerRetainerConfirmationEmail,
  buildInternalRetainerSubscriptionEmail,
} from '../../../lib/email/retainerCheckoutEmails';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

const SMTP2GO_API_URL = 'https://api.smtp2go.com/v3';
const SMTP2GO_API_KEY = process.env.SMTP2GO_API_KEY;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const NOTIFY_TO = ['hello@manifestfts.com'];
const NOTIFY_CC = ['mdm@manifestfts.com'];
const SENDER = 'noreply@manifestfts.com';
const SEND_CUSTOMER_RECEIPT =
  process.env.RETAINER_SEND_CUSTOMER_RECEIPT === '1' ||
  process.env.RETAINER_SEND_CUSTOMER_RECEIPT === 'true';

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
const FREE_WEBSITE_SUBMISSIONS_FILE = path.join(process.cwd(), 'data', 'free-website-submissions.json');

const processedEvents = new Map();
const EVENT_TTL_MS = 24 * 60 * 60 * 1000;

function rememberEvent(eventId) {
  const now = Date.now();
  processedEvents.set(eventId, now);

  for (const [key, timestamp] of processedEvents.entries()) {
    if (now - timestamp > EVENT_TTL_MS) processedEvents.delete(key);
  }
}

function hasProcessed(eventId) {
  const timestamp = processedEvents.get(eventId);
  if (!timestamp) return false;
  if (Date.now() - timestamp > EVENT_TTL_MS) {
    processedEvents.delete(eventId);
    return false;
  }
  return true;
}

async function kvSetIfNotExists(key, value, exSeconds) {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return null;

  const baseUrl = KV_REST_API_URL.replace(/\/$/, '');
  const url = `${baseUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/NX/EX/${encodeURIComponent(
    String(exSeconds)
  )}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
    },
  });

  if (!response.ok) throw new Error('KV request failed.');

  const payload = await response.json().catch(() => ({}));
  // Upstash REST returns { result: "OK" } when set, { result: null } when NX fails.
  return payload?.result;
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function sendSmtp2GoEmail({ to, cc, subject, text, html }) {
  if (!SMTP2GO_API_KEY) throw new Error('SMTP2GO_API_KEY is not configured.');

  const payload = {
    api_key: SMTP2GO_API_KEY,
    to: to || NOTIFY_TO,
    cc: cc || undefined,
    sender: SENDER,
    subject,
    text_body: text,
    html_body: html,
  };

  const response = await fetch(`${SMTP2GO_API_URL}/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.data?.error) throw new Error('SMTP2GO send failed.');
}

async function markFreeWebsiteSubmissionPaid(session) {
  const intakeId = typeof session?.metadata?.intakeId === 'string' ? session.metadata.intakeId.trim() : '';
  if (!intakeId) return { updated: false, reason: 'missing_intake_id' };

  let raw;
  try {
    raw = await fs.readFile(FREE_WEBSITE_SUBMISSIONS_FILE, 'utf8');
  } catch {
    return { updated: false, reason: 'missing_data_file' };
  }

  let submissions;
  try {
    submissions = JSON.parse(raw);
  } catch {
    return { updated: false, reason: 'invalid_data_file' };
  }

  if (!Array.isArray(submissions)) {
    return { updated: false, reason: 'invalid_data_shape' };
  }

  const index = submissions.findIndex((item) => item?.id === intakeId);
  if (index < 0) {
    return { updated: false, reason: 'submission_not_found' };
  }

  const submission = submissions[index];
  const now = new Date().toISOString();
  submission.status = 'converted_to_paid';
  submission.updatedAt = now;
  submission.fulfillment = {
    ...(submission.fulfillment || {}),
    paidConversion: true,
  };

  submission.payment = {
    stripeSessionId: session.id,
    customerEmail: session.customer_email || '',
    paidAt: now,
  };

  const timelineEntry = {
    id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'status_changed',
    message: 'Stripe checkout completed. Submission marked converted_to_paid.',
    createdAt: now,
    actor: 'stripe_webhook',
  };

  submission.timeline = Array.isArray(submission.timeline)
    ? [timelineEntry, ...submission.timeline]
    : [timelineEntry];

  submissions[index] = submission;
  await fs.writeFile(FREE_WEBSITE_SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');
  return { updated: true, submission };
}

function buildInternalFreeWebsitePaidEmail(session) {
  const metadata = session?.metadata || {};
  const lines = [
    'Free Website checkout completed.',
    '',
    `Session ID: ${session?.id || 'N/A'}`,
    `Intake ID: ${metadata.intakeId || 'N/A'}`,
    `Plan: ${metadata.selectedPlanLabel || metadata.selectedPlan || 'N/A'}`,
    `Name: ${metadata.contactName || 'N/A'}`,
    `Email: ${session?.customer_email || metadata.contactEmail || 'N/A'}`,
    `Business: ${metadata.businessName || 'N/A'}`,
    `Business Type: ${metadata.businessType || 'N/A'}`,
    `Primary Goal: ${metadata.primaryGoal || 'N/A'}`,
    `GCLID: ${metadata.gclid || 'N/A'}`,
    `UTM Source: ${metadata.utmSource || 'N/A'}`,
    `UTM Medium: ${metadata.utmMedium || 'N/A'}`,
    `UTM Campaign: ${metadata.utmCampaign || 'N/A'}`,
    `UTM Term: ${metadata.utmTerm || 'N/A'}`,
    `UTM Content: ${metadata.utmContent || 'N/A'}`,
  ];

  const text = lines.join('\n');
  const html = `<pre style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;white-space:pre-wrap;">${text}</pre>`;

  return {
    subject: 'Free Website Checkout Completed - Manifest FTS',
    text,
    html,
  };
}

function buildCustomerFreeWebsitePaidEmail(session) {
  const metadata = session?.metadata || {};
  const contactName = metadata.contactName || 'there';
  const plan = metadata.selectedPlanLabel || metadata.selectedPlan || 'your selected plan';

  const text = [
    `Hi ${contactName},`,
    '',
    'Thank you for your checkout with Manifest FTS.',
    `Your ${plan} subscription is confirmed and our onboarding team will follow up shortly.`,
    '',
    'What happens next:',
    '- We review your intake details',
    '- We confirm launch priorities and timeline',
    '- We begin setup and ongoing support',
    '',
    'If you need anything right away, reply to this email or contact hello@manifestfts.com.',
    '',
    '- Manifest FTS',
  ].join('\n');

  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#111827;">
    <p>Hi ${contactName},</p>
    <p>Thank you for your checkout with Manifest FTS.</p>
    <p>Your <strong>${plan}</strong> subscription is confirmed and our onboarding team will follow up shortly.</p>
    <p><strong>What happens next:</strong></p>
    <ul>
      <li>We review your intake details</li>
      <li>We confirm launch priorities and timeline</li>
      <li>We begin setup and ongoing support</li>
    </ul>
    <p>If you need anything right away, reply to this email or contact hello@manifestfts.com.</p>
    <p>- Manifest FTS</p>
  </div>`;

  return {
    subject: 'Your Manifest FTS Checkout Is Confirmed',
    text,
    html,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  if (!WEBHOOK_SECRET) return res.status(500).json({ ok: false, message: 'Missing STRIPE_WEBHOOK_SECRET.' });
  if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ ok: false, message: 'Missing STRIPE_SECRET_KEY.' });

  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') return res.status(400).json({ ok: false, message: 'Missing stripe-signature.' });

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Invalid webhook signature.',
    });
  }

  if (hasProcessed(event.id)) return res.status(200).json({ received: true, deduped: true });

  try {
    const dedupeKey = `stripe:event:${event.id}`;
    const kvResult = await kvSetIfNotExists(dedupeKey, '1', 24 * 60 * 60);
    if (KV_REST_API_URL && KV_REST_API_TOKEN && kvResult !== 'OK') {
      return res.status(200).json({ received: true, deduped: true });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Only notify for retainer Stripe checkouts (recurring or one-time).
      const isSupportedCheckout = session && (session.mode === 'subscription' || session.mode === 'payment');
      const isRetainer = typeof session?.metadata?.selectedCommitment === 'string';
      if (isSupportedCheckout && isRetainer) {
        const internal = buildInternalRetainerSubscriptionEmail(session);
        await sendSmtp2GoEmail({
          to: NOTIFY_TO,
          cc: NOTIFY_CC,
          subject: internal.subject,
          text: internal.text,
          html: internal.html,
        });

        if (SEND_CUSTOMER_RECEIPT) {
          const customerEmail =
            typeof session.customer_email === 'string' ? session.customer_email.trim() : '';
          if (customerEmail) {
            const customer = buildCustomerRetainerConfirmationEmail(session);
            await sendSmtp2GoEmail({
              to: [customerEmail],
              subject: customer.subject,
              text: customer.text,
              html: customer.html,
            });
          }
        }
      }

      const isFreeWebsite = session?.metadata?.checkoutType === 'free_website';
      if (isSupportedCheckout && isFreeWebsite) {
        const result = await markFreeWebsiteSubmissionPaid(session);
        const paidEmail = buildInternalFreeWebsitePaidEmail(session);

        await sendSmtp2GoEmail({
          to: NOTIFY_TO,
          cc: NOTIFY_CC,
          subject: paidEmail.subject,
          text:
            `${paidEmail.text}\n\nSubmission update result: ${result.updated ? 'updated' : `not updated (${result.reason})`}`,
          html: `${paidEmail.html}<p style="font-family:Segoe UI,Arial,sans-serif;">Submission update result: ${result.updated ? 'updated' : `not updated (${result.reason})`}</p>`,
        });

        const customerEmail =
          typeof session.customer_email === 'string' ? session.customer_email.trim() : '';
        if (customerEmail) {
          const customer = buildCustomerFreeWebsitePaidEmail(session);
          await sendSmtp2GoEmail({
            to: [customerEmail],
            subject: customer.subject,
            text: customer.text,
            html: customer.html,
          });
        }
      }
    }

    rememberEvent(event.id);
    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Webhook processing failed.',
    });
  }
}

