import type { EngineId, Plan } from '@/lib/db/schema';

export interface PlanDef {
  id: Exclude<Plan, 'trial'>;
  name: string;
  price: number;
  blurb: string;
  prompts: number;
  competitors: number;
  seats: number | null;
  engines: EngineId[] | 'all';
  cadence: 'weekly' | 'daily';
  features: string[];
  highlight?: boolean;
}

export const TRIAL_DAYS = 14;

export const PLANS: PlanDef[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    blurb: 'For a single brand establishing its first AI search baseline.',
    prompts: 25,
    competitors: 3,
    seats: 3,
    engines: ['chatgpt', 'perplexity', 'gemini'],
    cadence: 'weekly',
    features: ['25 tracked prompts', '3 answer engines', 'Weekly observation runs', '3 competitors', 'GEO audits and evidence-linked tasks', 'AI traffic analytics', 'Content briefs', 'Slack, webhooks, and IndexNow', '3 seats'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 149,
    blurb: 'For marketing teams running AI visibility as an ongoing program.',
    prompts: 100,
    competitors: 6,
    seats: 10,
    engines: 'all',
    cadence: 'daily',
    highlight: true,
    features: ['100 tracked prompts', 'All 6 answer engines', 'Daily observation runs', '6 competitors', 'Accuracy monitoring and fact sheet', 'AI-drafted pages from briefs', 'Shareable reports', '10 seats'],
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 399,
    blurb: 'For agencies and multi-brand teams reporting to stakeholders.',
    prompts: 300,
    competitors: 10,
    seats: null,
    engines: 'all',
    cadence: 'daily',
    features: ['300 tracked prompts', 'All 6 answer engines', 'Daily observation runs', '10 competitors', 'White-label client reports', 'Unlimited seats', 'Priority support from Manifest FTS'],
  },
];

export const PLAN_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<PlanDef['id'], PlanDef>;

/** Effective limits. Trials get Growth limits so teams can evaluate the full product. */
export function limitsFor(plan: Plan) {
  return plan === 'trial' ? PLAN_BY_ID.growth : PLAN_BY_ID[plan];
}

export function planLabel(plan: Plan) {
  return plan === 'trial' ? 'Growth trial' : PLAN_BY_ID[plan].name;
}
