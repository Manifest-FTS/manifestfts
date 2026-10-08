import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Manifest Signal',
    short_name: 'Signal',
    description: 'Evidence-first AI search visibility and citation monitoring.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4353c7',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
