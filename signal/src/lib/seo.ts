import type { Metadata } from 'next';
import { site, absoluteUrl } from '@/lib/site';

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

/** Consistent title, description, canonical, Open Graph, and X metadata for public pages. */
export function pageMetadata({ title, description, path, noindex, type = 'website', publishedTime, modifiedTime }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type, locale: 'en_US', ...(type === 'article' ? { publishedTime, modifiedTime } : {}) },
    twitter: { card: 'summary_large_image', title, description },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

export const organizationLd = {
  '@type': 'Organization',
  '@id': `${site.companyUrl}/#organization`,
  name: site.company,
  url: site.companyUrl,
  logo: `${site.companyUrl}/assets/imgs/logo.svg`,
};

export const softwareLd = {
  '@type': 'SoftwareApplication',
  '@id': `${site.url}/#software`,
  name: site.name,
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'AI search visibility monitoring',
  operatingSystem: 'Web',
  url: site.url,
  description: site.description,
  publisher: { '@id': `${site.companyUrl}/#organization` },
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}
