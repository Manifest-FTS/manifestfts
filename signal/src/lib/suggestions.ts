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
