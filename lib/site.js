// Single source of truth for the public origin and entity facts used in
// canonical URLs, Open Graph tags, sitemap and JSON-LD.
//
// Cloudflare currently 301s www -> apex, so the apex is canonical. If the
// cutover flips that, set NEXT_PUBLIC_SITE_URL instead of editing pages.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://manifestfts.com').replace(/\/$/, '')

export const absoluteUrl = (path = '/') => `${SITE_URL}${path === '/' ? '' : path}`

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const FOUNDER_ID = `${SITE_URL}/#founder`

// 1200x630 social card (rendered from the hero + brand fonts).
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/imgs/og-default.jpg`
export const DEFAULT_OG_IMAGE_SIZE = { width: 1200, height: 630 }

// Studio offerings, mirrored from /capabilities and /wordpress-hosting copy.
const offerings = [
  {
    name: 'Website and web application development',
    description: 'Design and engineering of websites, web applications, and digital products, including headless CMS builds such as Sanity.',
    url: absoluteUrl('/capabilities'),
  },
  {
    name: 'UX and interface design',
    description: 'Interface design, UX refinement, and conversion support for existing and new digital products.',
    url: absoluteUrl('/capabilities'),
  },
  {
    name: 'Monthly technology retainer',
    description: 'Ongoing enhancements, maintenance, SEO implementation, and technical guidance on a flexible monthly commitment.',
    url: absoluteUrl('/capabilities'),
  },
  {
    name: 'Managed WordPress hosting',
    description: 'Managed WordPress hosting with updates, backups, security monitoring, and support.',
    url: absoluteUrl('/wordpress-hosting'),
  },
]

const greenville = {
  '@type': 'City',
  name: 'Greenville',
  containedInPlace: { '@type': 'State', name: 'South Carolina' },
}

export function entityGraph() {
  return [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: 'Manifest FTS',
      legalName: 'Manifest FTS LLC',
      alternateName: 'Manifest Forward Thinking Solutions',
      url: SITE_URL,
      logo: `${SITE_URL}/assets/imgs/logo.svg`,
      image: DEFAULT_OG_IMAGE,
      description: 'Manifest FTS is a design, development, and technology studio based in Greenville, South Carolina, building and supporting websites, applications, and digital platforms.',
      email: 'devkev@manifestfts.com',
      founder: { '@id': FOUNDER_ID },
      // City-level only: no public street address is published.
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Greenville',
        addressRegion: 'SC',
        postalCode: '29601',
        addressCountry: 'US',
      },
      location: { '@type': 'Place', name: 'Greenville, SC', address: { '@type': 'PostalAddress', addressLocality: 'Greenville', addressRegion: 'SC', addressCountry: 'US' } },
      areaServed: [greenville, { '@type': 'State', name: 'South Carolina' }, { '@type': 'Country', name: 'United States' }],
      knowsAbout: ['Web development', 'UX design', 'Headless CMS', 'Sanity CMS', 'WordPress hosting', 'Technical SEO', 'Digital platforms'],
      sameAs: ['https://www.linkedin.com/company/manifestfts'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Manifest FTS studio services',
        itemListElement: offerings.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            ...service,
            provider: { '@id': ORG_ID },
            areaServed: { '@type': 'Country', name: 'United States' },
          },
        })),
      },
    },
    {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: 'Kevin Williams',
      jobTitle: 'Founder, Software Engineer',
      image: `${SITE_URL}/assets/imgs/page/about/1/kevin_williams.webp`,
      worksFor: { '@id': ORG_ID },
      homeLocation: greenville,
      url: absoluteUrl('/about'),
      sameAs: ['https://www.linkedin.com/in/kevinorin', 'https://www.instagram.com/kevinorin'],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: 'Manifest FTS',
      url: SITE_URL,
      inLanguage: 'en-US',
      publisher: { '@id': ORG_ID },
    },
  ]
}

// Serialise for a <script type="application/ld+json">; escape "<" so content
// can never close the script tag.
export const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c')
