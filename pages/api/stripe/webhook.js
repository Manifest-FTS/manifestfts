import Stripe from 'stripe';
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
const SENDER = 'noreply@manifestfts.com';
const SEND_CUSTOMER_RECEIPT =
  process.env.RETAINER_SEND_CUSTOMER_RECEIPT === '1' ||
  process.env.RETAINER_SEND_CUSTOMER_RECEIPT === 'true';

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

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

async function sendSmtp2GoEmail({ to, subject, text, html }) {
  if (!SMTP2GO_API_KEY) throw new Error('SMTP2GO_API_KEY is not configured.');

  const payload = {
    api_key: SMTP2GO_API_KEY,
    to: to || NOTIFY_TO,
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

      // Only notify for retainer subscription checkouts.
      const isSubscription = session && session.mode === 'subscription';
      const isRetainer = typeof session?.metadata?.selectedCommitment === 'string';
      if (isSubscription && isRetainer) {
        const internal = buildInternalRetainerSubscriptionEmail(session);
        await sendSmtp2GoEmail({
          to: NOTIFY_TO,
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

