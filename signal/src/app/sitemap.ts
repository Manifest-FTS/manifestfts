import type { MetadataRoute } from 'next';
import { docs } from '@/content/docs';
import { absoluteUrl } from '@/lib/site';

const LAUNCH = '2026-10-05';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['/', 1, 'weekly'],
    ['/features', 0.9, 'monthly'],
    ['/pricing', 0.9, 'monthly'],
    ['/methodology', 0.8, 'monthly'],
    ['/tools/ai-readiness-checker', 0.9, 'monthly'],
    ['/docs', 0.7, 'weekly'],
    ['/changelog', 0.5, 'weekly'],
    ['/about', 0.5, 'yearly'],
    ['/contact', 0.5, 'yearly'],
    ['/security', 0.4, 'yearly'],
    ['/privacy', 0.2, 'yearly'],
    ['/terms', 0.2, 'yearly'],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), lastModified: LAUNCH, priority, changeFrequency })),
    ...docs.map((d) => ({ url: absoluteUrl(`/docs/${d.slug}`), lastModified: d.updated, priority: 0.6, changeFrequency: 'monthly' as const })),
  ];
}
