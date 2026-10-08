import type { Intent } from '@/lib/db/schema';

export interface SuggestedPrompt {
  text: string;
  topic: string;
  intent: Intent;
}

/** Starter prompts derived from what the brand offers. Users edit these during onboarding. */
export function suggestPrompts({ brand, category, audience, competitors }: { brand: string; category: string; audience?: string; competitors: string[] }): SuggestedPrompt[] {
  const c = category.trim() || 'providers';
  const forWhom = audience?.trim() ? ` for ${audience.trim()}` : '';
  const list: SuggestedPrompt[] = [
    { text: `What is the best ${c}${forWhom}?`, topic: 'Discovery', intent: 'discovery' },
    { text: `Which ${c} do experts recommend?`, topic: 'Discovery', intent: 'discovery' },
    { text: `How do I choose the right ${c}${forWhom}?`, topic: 'Discovery', intent: 'discovery' },
    { text: `What are affordable ${c} options${forWhom}?`, topic: 'Pricing', intent: 'discovery' },
    { text: `What does ${brand} do?`, topic: 'Brand', intent: 'brand' },
    { text: `Is ${brand} a good choice for ${audience?.trim() || 'my organization'}?`, topic: 'Brand', intent: 'evaluation' },
    { text: `What are the pros and cons of ${brand}?`, topic: 'Brand', intent: 'evaluation' },
    { text: `How much does ${brand} cost?`, topic: 'Pricing', intent: 'evaluation' },
  ];
  for (const competitor of competitors.slice(0, 3)) {
    list.push({ text: `${brand} vs ${competitor}: which is better?`, topic: 'Comparison', intent: 'comparison' });
    list.push({ text: `What are the best alternatives to ${competitor}?`, topic: 'Comparison', intent: 'comparison' });
  }
  return list;
}

export const INDUSTRIES = ['Software and SaaS', 'Healthcare', 'Professional services', 'Nonprofit', 'Ecommerce and retail', 'Financial services', 'Education', 'Hospitality and travel', 'Home and local services', 'Agency and marketing', 'Other'];

export interface QueryInput { category: string; audience?: string; brand?: string; competitors?: string[]; location?: string }

/** Broader buyer-question set for the public AI prompt generator, grouped by intent. */
export function generateQueries({ category, audience, brand, competitors = [], location }: QueryInput): SuggestedPrompt[] {
  const c = category.trim();
  if (!c) return [];
  const a = audience?.trim();
  const forWhom = a ? ` for ${a}` : '';
  const loc = location?.trim();
  const inLoc = loc ? ` in ${loc}` : '';
  const out: SuggestedPrompt[] = [
    { text: `What is the best ${c}${forWhom}${inLoc}?`, topic: 'Discovery', intent: 'discovery' },
    { text: `Which ${c} do experts recommend${forWhom}?`, topic: 'Discovery', intent: 'discovery' },
    { text: `Top-rated ${c}${inLoc}`, topic: 'Discovery', intent: 'discovery' },
    { text: `How do I choose a ${c}${forWhom}?`, topic: 'Discovery', intent: 'discovery' },
    { text: `What should I look for in a ${c}?`, topic: 'Discovery', intent: 'discovery' },
    { text: `What questions should I ask before hiring or buying a ${c}?`, topic: 'Discovery', intent: 'discovery' },
    { text: `What are affordable ${c} options${forWhom}?`, topic: 'Pricing', intent: 'discovery' },
    { text: `How much does a ${c} cost${inLoc}?`, topic: 'Pricing', intent: 'evaluation' },
    { text: `Is a ${c} worth it${forWhom}?`, topic: 'Evaluation', intent: 'evaluation' },
    { text: `What are common problems with ${c}s and how do I avoid them?`, topic: 'Evaluation', intent: 'evaluation' },
    ...(loc ? [{ text: `${c} near ${loc}`, topic: 'Local', intent: 'discovery' as const }, { text: `Who is the most trusted ${c} in ${loc}?`, topic: 'Local', intent: 'discovery' as const }] : []),
  ];
  if (brand?.trim()) {
    const b = brand.trim();
    out.push(
      { text: `What does ${b} do?`, topic: 'Brand', intent: 'brand' },
      { text: `Is ${b} legit?`, topic: 'Brand', intent: 'brand' },
      { text: `${b} reviews`, topic: 'Brand', intent: 'evaluation' },
      { text: `What are the pros and cons of ${b}?`, topic: 'Brand', intent: 'evaluation' },
      { text: `How much does ${b} cost?`, topic: 'Pricing', intent: 'evaluation' },
      { text: `Is ${b} a good ${c}${forWhom}?`, topic: 'Brand', intent: 'evaluation' },
    );
  }
  for (const comp of competitors.map((x) => x.trim()).filter(Boolean).slice(0, 4)) {
    if (brand?.trim()) out.push({ text: `${brand.trim()} vs ${comp}: which is better${forWhom}?`, topic: 'Comparison', intent: 'comparison' });
    out.push({ text: `What are the best alternatives to ${comp}?`, topic: 'Comparison', intent: 'comparison' });
  }
  return out;
}
