export const site = {
  name: 'Manifest Signal',
  shortName: 'Signal',
  company: 'Manifest FTS',
  companyUrl: 'https://www.manifestfts.com',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  tagline: 'Evidence-first AI search visibility',
  description:
    'Manifest Signal measures how ChatGPT, Perplexity, Gemini, Claude, and other answer engines describe and cite your organization, then turns every observation into prioritized, evidence-linked work.',
  supportEmail: 'signal@manifestfts.com',
  salesEmail: 'hello@manifestfts.com',
};

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
