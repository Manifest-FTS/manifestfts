import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';
import { getDb, schema } from '@/lib/db';
import { planForPrice, stripe } from '@/lib/billing';
import { logActivity, notifyMembers } from '@/lib/workspace';

// Stripe is the source of truth for subscription state; this handler mirrors it onto the workspace.
export async function POST(request: Request) {
  const s = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  if (!s || !secret || !signature) return NextResponse.json({ error: 'Billing is not configured' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = await s.webhooks.constructEventAsync(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = await getDb();
  const sync = async (subscription: Stripe.Subscription) => {
    const workspaceId = subscription.metadata.workspaceId;
    if (!workspaceId) return;
    const item = subscription.items.data[0];
    const plan = planForPrice(item?.price.id);
    const periodEnd = item?.current_period_end;
    const active = ['active', 'trialing', 'past_due'].includes(subscription.status);
    await db.update(schema.workspaces).set({
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      ...(active && plan ? { plan } : {}),
    }).where(eq(schema.workspaces.id, workspaceId));
    await logActivity(workspaceId, null, 'billing.subscription', `${subscription.status}${plan ? ` · ${plan}` : ''}`);
    if (subscription.status === 'past_due') {
      await notifyMembers(workspaceId, { kind: 'billing', title: 'Payment failed', body: 'Update your payment method to keep runs active.', href: null });
    }
  };

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.subscription) await sync(await s.subscriptions.retrieve(typeof session.subscription === 'string' ? session.subscription : session.subscription.id));
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await sync(event.data.object);
      break;
  }
  return NextResponse.json({ received: true });
}
