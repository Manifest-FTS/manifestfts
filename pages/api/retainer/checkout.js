import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2020-08-27',
    })
  : null;

function getBaseUrl(req) {
  return process.env.NEXT_PUBLIC_CLIENT_URL || `https://${req.headers.host}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const {
    name,
    email,
    company,
    brief,
    source,
    commitmentHours,
    effectiveRate,
    monthlyTotal,
    supportLabel,
  } = req.body || {};

  if (!name || !email || !brief || !commitmentHours || !effectiveRate || !monthlyTotal) {
    return res.status(400).json({ ok: false, message: 'Missing required checkout details.' });
  }

  const metadata = {
    contactName: String(name),
    contactEmail: String(email),
    company: String(company || ''),
    brief: String(brief).slice(0, 500),
    source: String(source || 'site'),
    selectedCommitment: `${commitmentHours} hours/month`,
    effectiveRate: `${effectiveRate}`,
    monthlyTotal: `${monthlyTotal}`,
    supportLabel: String(supportLabel || ''),
  };

  if (!stripe) {
    return res.status(200).json({
      ok: true,
      mode: 'stub',
      message:
        'Stripe secret key is not configured yet. Connect STRIPE_SECRET_KEY and NEXT_PUBLIC_CLIENT_URL to enable live checkout.',
      metadata,
    });
  }

  try {
    const baseUrl = getBaseUrl(req).replace(/\/$/, '');
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
              name: `Manifest FTS Retainer — ${commitmentHours} hours/month`,
              description: `${supportLabel} · Flexible monthly support for design, development, strategy, and digital execution.`,
              metadata,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: Math.round(Number(monthlyTotal) * 100),
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