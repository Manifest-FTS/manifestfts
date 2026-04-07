import Stripe from 'stripe';
import { getRetainerSnapshot } from '../../../util/retainer';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const clientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2020-08-27',
    })
  : null;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitByIp = new Map();

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) return forwardedFor.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function checkRateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateLimitByIp.get(ip) || { windowStart: now, count: 0 };

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitByIp.set(ip, { windowStart: now, count: 1 });
    return { ok: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) return { ok: false };

  entry.count += 1;
  rateLimitByIp.set(ip, entry);
  return { ok: true };
}

function isValidEmail(value) {
  const email = String(value || '').trim();
  if (!email || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function assertMaxLength(value, max) {
  return String(value || '').trim().length <= max;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const rateLimit = checkRateLimit(req);
  if (!rateLimit.ok) return res.status(429).json({ ok: false, message: 'Too many requests. Please try again shortly.' });

  const {
    name,
    email,
    company,
    brief,
    source,
    commitmentHours,
  } = req.body || {};

  if (!name || !email || !brief || !commitmentHours) {
    return res.status(400).json({ ok: false, message: 'Missing required checkout details.' });
  }

  if (!assertMaxLength(name, 120)) {
    return res.status(400).json({ ok: false, message: 'Name is too long.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Please provide a valid email address.' });
  }

  if (!assertMaxLength(company, 120)) {
    return res.status(400).json({ ok: false, message: 'Company name is too long.' });
  }

  if (!assertMaxLength(brief, 2000)) {
    return res.status(400).json({ ok: false, message: 'Brief is too long.' });
  }

  const snapshot = getRetainerSnapshot(commitmentHours);

  const metadata = {
    contactName: String(name),
    contactEmail: String(email),
    company: String(company || ''),
    brief: String(brief).slice(0, 500),
    source: String(source || 'site'),
    selectedCommitment: `${snapshot.hours} hours/month`,
    effectiveRate: `${snapshot.effectiveRate}`,
    monthlyTotal: `${snapshot.monthlyTotal}`,
    supportLabel: String(snapshot.supportLabel || ''),
  };

  if (!stripe) {
    return res.status(200).json({
      ok: true,
      mode: 'stub',
      message:
        'Stripe checkout is not configured yet. Connect STRIPE_SECRET_KEY and NEXT_PUBLIC_CLIENT_URL to enable live checkout.',
      metadata,
    });
  }

  if (!clientBaseUrl) {
    return res.status(500).json({
      ok: false,
      message: 'Checkout is not configured yet (missing NEXT_PUBLIC_CLIENT_URL).',
    });
  }

  try {
    const baseUrl = clientBaseUrl.replace(/\/$/, '');
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${baseUrl}/capabilities?checkout=success`,
      cancel_url: `${baseUrl}/capabilities?checkout=cancelled`,
      customer_email: email,
      metadata,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Manifest FTS Retainer — ${snapshot.hours} hours/month`,
              description: `${snapshot.supportLabel} · Flexible monthly support for design, development, strategy, and digital execution.`,
              metadata,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: Math.round(Number(snapshot.monthlyTotal) * 100),
          },
        },
      ],
      subscription_data: {
        metadata,
      },
      allow_promotion_codes: false,
      custom_text: {
        submit: {
          message: 'Your brief and retainer preferences will be included with this checkout session.',
        },
      },
    });

    return res.status(200).json({ ok: true, checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Unable to create checkout session.',
    });
  }
}