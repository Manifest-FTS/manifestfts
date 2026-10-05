import { BookOpen, FileSearch, Gauge, Layers, ListChecks, MessageSquareQuote, PieChart, Settings, ShieldCheck, Swords } from 'lucide-react';

export const NAV_GROUPS = [
  { label: null, items: [{ href: 'overview', label: 'Overview', icon: Gauge }] },
  {
    label: 'Measure',
    items: [
      { href: 'prompts', label: 'Prompts', icon: MessageSquareQuote },
      { href: 'sources', label: 'Sources', icon: Layers },
      { href: 'competitors', label: 'Competitors', icon: Swords },
    ],
  },
  {
    label: 'Improve',
    items: [
      { href: 'accuracy', label: 'Accuracy', icon: ShieldCheck },
      { href: 'readiness', label: 'Readiness', icon: FileSearch },
      { href: 'tasks', label: 'Tasks', icon: ListChecks },
    ],
  },
  { label: 'Share', items: [{ href: 'reports', label: 'Reports', icon: PieChart }] },
] as const;

export const SECONDARY_NAV = [
  { href: 'settings', label: 'Settings', icon: Settings },
  { href: '/docs', label: 'Help & docs', icon: BookOpen, external: true },
] as const;
