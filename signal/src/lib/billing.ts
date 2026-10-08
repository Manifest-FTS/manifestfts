import 'server-only';
import Stripe from 'stripe';
import type { Plan } from '@/lib/db/schema';

let client: Stripe | null = null;

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key, { appInfo: { name: 'Manifest Signal' }, maxNetworkRetries: 2 });
  return client;
}

export function billingConfigured() {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PRICE_GROWTH;
}

const PRICE_ENV: Record<Exclude<Plan, 'trial'>, string> = { starter: 'STRIPE_PRICE_STARTER', growth: 'STRIPE_PRICE_GROWTH', agency: 'STRIPE_PRICE_AGENCY' };

export function priceFor(plan: Exclude<Plan, 'trial'>) {
  return process.env[PRICE_ENV[plan]] ?? null;
}

export function planForPrice(priceId: string | undefined | null): Exclude<Plan, 'trial'> | null {
  if (!priceId) return null;
  return (Object.keys(PRICE_ENV) as Exclude<Plan, 'trial'>[]).find((p) => process.env[PRICE_ENV[p]] === priceId) ?? null;
}
