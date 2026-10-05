import { and, count, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireWorkspace, hasRole, trialDaysLeft, isReadOnly } from '@/lib/workspace';
import { PLANS, limitsFor, planLabel } from '@/lib/plans';
import { billingConfigured } from '@/lib/billing';
import { formatDate } from '@/lib/format';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PlanPicker, PortalButton } from './billing-ui';

export const metadata = { title: 'Billing' };

function Meter({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const ratio = limit ? Math.min(1, used / limit) : 0;
  const tone = ratio >= 1 ? 'var(--danger)' : ratio >= 0.8 ? 'var(--warning)' : 'var(--accent)';
  return (
    <div>
      <div className="flex justify-between text-[13px]"><span className="text-fg-soft">{label}</span><span className="font-medium text-fg tabular">{used}{limit ? ` / ${limit}` : ' · unlimited'}</span></div>
      <div className="mt-2 h-2 rounded-full bg-bg-muted" role="progressbar" aria-label={label} aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit ?? undefined}>
        <div className="h-full rounded-full" style={{ width: `${limit ? Math.max(2, ratio * 100) : 0}%`, background: tone }} />
      </div>
    </div>
  );
}

export default async function BillingPage({ params, searchParams }: PageProps<'/app/[workspace]/settings/billing'>) {
  const { workspace: slug } = await params;
  const sp = await searchParams;
  const { workspace, role } = await requireWorkspace(slug);
  const db = await getDb();
  const [[prompts], [competitors], [members]] = await Promise.all([
    db.select({ value: count() }).from(schema.prompts).where(and(eq(schema.prompts.workspaceId, workspace.id), eq(schema.prompts.active, true))),
    db.select({ value: count() }).from(schema.competitors).where(eq(schema.competitors.workspaceId, workspace.id)),
    db.select({ value: count() }).from(schema.memberships).where(eq(schema.memberships.workspaceId, workspace.id)),
  ]);
  const limits = limitsFor(workspace.plan);
  const days = trialDaysLeft(workspace);
  const isOwner = hasRole(role, 'owner');

  return (
    <div className="grid max-w-4xl gap-5">
      {sp.checkout === 'success' && <Alert tone="success" title="Thanks for subscribing">Your plan will update within a few seconds once Stripe confirms the payment.</Alert>}
      {sp.checkout === 'cancelled' && <Alert tone="info">Checkout was cancelled. Your plan has not changed.</Alert>}
      {isReadOnly(workspace) && <Alert tone="danger" title="This workspace is read-only">Choose a plan to resume runs and audits. All data is intact.</Alert>}
      {!billingConfigured() && <Alert tone="warning" title="Online billing is not configured">Stripe keys are not set for this deployment. Plans can be changed by contacting hello@manifestfts.com.</Alert>}

      <Card>
        <CardHeader title="Current plan" action={isOwner && workspace.stripeCustomerId ? <PortalButton workspaceId={workspace.id} /> : undefined} />
        <CardBody className="grid gap-6 sm:grid-cols-[220px_1fr]">
          <div>
            <p className="text-[22px] font-semibold tracking-[-0.03em] text-fg">{planLabel(workspace.plan)}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {workspace.subscriptionStatus && <Badge tone={workspace.subscriptionStatus === 'active' ? 'success' : 'warning'} className="capitalize">{workspace.subscriptionStatus.replace('_', ' ')}</Badge>}
              {days !== null && <Badge tone={days <= 3 ? 'warning' : 'accent'}>{days} days left in trial</Badge>}
            </div>
            {workspace.currentPeriodEnd && <p className="mt-2 text-[12.5px] text-fg-muted">Renews {formatDate(workspace.currentPeriodEnd)}</p>}
          </div>
          <div className="grid gap-4">
            <Meter label="Active prompts" used={prompts!.value} limit={limits.prompts} />
            <Meter label="Competitors" used={competitors!.value} limit={limits.competitors} />
            <Meter label="Seats" used={members!.value} limit={limits.seats} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Plans" description={isOwner ? 'Billed monthly per workspace. Change or cancel anytime.' : 'Only workspace owners can change the plan.'} />
        <CardBody><PlanPicker workspaceId={workspace.id} plans={PLANS} current={workspace.plan} canManage={isOwner} /></CardBody>
      </Card>
      <p className="text-[12.5px] text-fg-faint">Payments are processed securely by Stripe. Signal never sees your card details.</p>
    </div>
  );
}
