'use server';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { schema } from '@/lib/db';
import { authorize, logActivity } from '@/lib/workspace';
import { billingConfigured, priceFor, stripe } from '@/lib/billing';
import { absoluteUrl } from '@/lib/site';
import type { ActionState } from './workspace';

export async function startCheckout(workspaceId: string, plan: 'starter' | 'growth' | 'agency'): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'owner');
  if (!auth.ok) return { error: 'Only workspace owners can change billing.' };
  const s = stripe();
  const price = priceFor(plan);
  if (!s || !price || !billingConfigured()) return { error: 'Online billing is not configured yet. Contact hello@manifestfts.com to subscribe.' };

  if (auth.workspace.stripeSubscriptionId && ['active', 'trialing', 'past_due'].includes(auth.workspace.subscriptionStatus ?? '')) {
    return openBillingPortal(workspaceId);
  }
  let customer = auth.workspace.stripeCustomerId;
  if (!customer) {
    const created = await s.customers.create({ email: auth.user.email, name: auth.workspace.name, metadata: { workspaceId } });
    customer = created.id;
    await auth.db.update(schema.workspaces).set({ stripeCustomerId: customer }).where(eq(schema.workspaces.id, workspaceId));
  }
  const session = await s.checkout.sessions.create({
    mode: 'subscription',
    customer,
    client_reference_id: workspaceId,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    subscription_data: { metadata: { workspaceId } },
    metadata: { workspaceId, plan },
    success_url: absoluteUrl(`/app/${auth.workspace.slug}/settings/billing?checkout=success`),
    cancel_url: absoluteUrl(`/app/${auth.workspace.slug}/settings/billing?checkout=cancelled`),
  });
  await logActivity(workspaceId, auth.user.id, 'billing.checkout_started', plan);
  redirect(session.url!);
}

export async function openBillingPortal(workspaceId: string): Promise<ActionState> {
  const auth = await authorize(workspaceId, 'owner');
  if (!auth.ok) return { error: 'Only workspace owners can manage billing.' };
  const s = stripe();
  if (!s || !auth.workspace.stripeCustomerId) return { error: 'No billing account exists for this workspace yet.' };
  const portal = await s.billingPortal.sessions.create({ customer: auth.workspace.stripeCustomerId, return_url: absoluteUrl(`/app/${auth.workspace.slug}/settings/billing`) });
  redirect(portal.url);
}
