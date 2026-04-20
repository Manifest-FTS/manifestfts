import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

type CheckoutRequestBody = {
  name?: string;
  email?: string;
  businessName?: string;
  businessType?: string;
  primaryGoal?: string;
  selectedPlan?: "starter" | "growth" | string;
  intakeId?: string;
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const clientBaseUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    })
  : null;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitByIp = new Map<string, { windowStart: number; count: number }>();

function getClientIp(req: NextApiRequest): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function checkRateLimit(req: NextApiRequest): boolean {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateLimitByIp.get(ip) || { windowStart: now, count: 0 };

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitByIp.set(ip, { windowStart: now, count: 1 });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  rateLimitByIp.set(ip, entry);
  return true;
}

function asString(value: unknown): string {
  return String(value || "").trim();
}

function isValidEmail(value: string): boolean {
  if (!value || value.length > 254) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function planConfig(planInput: string): {
  planKey: "starter" | "growth";
  label: string;
  amount: number;
} {
  if (planInput === "growth") {
    return {
      planKey: "growth",
      label: "Professional",
      amount: 29800,
    };
  }

  return {
    planKey: "starter",
    label: "Basic",
    amount: 14900,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  if (!checkRateLimit(req)) {
    return res.status(429).json({
      ok: false,
      message: "Too many checkout attempts. Please try again in a moment.",
    });
  }

  const body = (req.body || {}) as CheckoutRequestBody;

  const name = asString(body.name);
  const email = asString(body.email).toLowerCase();
  const businessName = asString(body.businessName);
  const businessType = asString(body.businessType);
  const primaryGoal = asString(body.primaryGoal);
  const intakeId = asString(body.intakeId);

  if (!name || !email || !businessName || !businessType || !primaryGoal) {
    return res.status(400).json({
      ok: false,
      message: "Missing required checkout details.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      ok: false,
      message: "Please provide a valid email address.",
    });
  }

  if (!stripe) {
    return res.status(500).json({
      ok: false,
      message: "Checkout is not configured yet (missing STRIPE_SECRET_KEY).",
    });
  }

  if (!clientBaseUrl) {
    return res.status(500).json({
      ok: false,
      message: "Checkout is not configured yet (missing NEXT_PUBLIC_CLIENT_URL).",
    });
  }

  const selectedPlan = planConfig(asString(body.selectedPlan));

  const metadata = {
    checkoutType: "free_website",
    selectedPlan: selectedPlan.planKey,
    selectedPlanLabel: selectedPlan.label,
    intakeId,
    contactName: name,
    contactEmail: email,
    businessName,
    businessType,
    primaryGoal,
    gclid: asString(body.gclid),
    utmSource: asString(body.utmSource),
    utmMedium: asString(body.utmMedium),
    utmCampaign: asString(body.utmCampaign),
    utmTerm: asString(body.utmTerm),
    utmContent: asString(body.utmContent),
  };

  try {
    const baseUrl = clientBaseUrl.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      success_url: `${baseUrl}/free-website?checkout=success`,
      cancel_url: `${baseUrl}/free-website?checkout=cancelled`,
      metadata,
      subscription_data: {
        metadata,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            recurring: {
              interval: "month",
            },
            unit_amount: selectedPlan.amount,
            product_data: {
              name: `Manifest FTS ${selectedPlan.label} Plan`,
              description:
                "AI-assisted launch, managed hosting, maintenance, support, and ongoing technical partnership.",
              metadata,
            },
          },
        },
      ],
      allow_promotion_codes: false,
    });

    return res.status(200).json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : "Unable to create checkout session.",
    });
  }
}
