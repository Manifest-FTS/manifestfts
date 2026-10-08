import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

// Public marketing and documentation pages are open to search and AI crawlers. The
// application, authentication flows, APIs, and private shared reports are not.
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/app/', '/api/', '/r/', '/embed/', '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/invite/'];
  return {
    rules: [{ userAgent: '*', allow: '/', disallow }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
