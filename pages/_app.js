import { Toaster } from 'react-hot-toast';
import "../public/assets/css/style.css";
import "../public/assets/css/swiper-custom.css";
import "../public/assets/css/globals.min.css";

import React, { useEffect } from "react";
import 'react-modal-video/css/modal-video.css';

import Head from 'next/head'

import Script from 'next/script'
import { useRouter } from 'next/router'
import { GTM_ID, pageview } from '../lib/gtm'
import { RetainerModal, RetainerProvider } from '../components/retainer'
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_SIZE, FOUNDER_ID, ORG_ID, WEBSITE_ID, absoluteUrl, entityGraph, jsonLd } from '../lib/site'
import { articlePath, articles } from '../data/articles'

const pageMeta = {
  '/': {
    title: 'Manifest FTS | Forward Thinking Digital Solutions',
    description:
      'Manifest FTS helps organizations build modern web platforms that increase leads, sales, and long-term digital resilience.',
  },
  '/work': {
    title: 'Our Work | Manifest FTS',
    description:
      'Explore selected digital partnerships, case studies, and platform outcomes delivered by Manifest FTS.',
  },
  '/sanity-cms': {
    title: 'Sanity CMS Case Study | Manifest FTS',
    description:
      'This page has moved to our Sanity CMS case study route with updated positioning, SEO context, and structured content.',
  },
  '/case-study/sanity-cms': {
    title: 'Case Study: Sanity CMS Platform | Manifest FTS',
    description:
      'A client-friendly case study on why Manifest FTS recommends Sanity CMS for flexible, scalable, and future-ready content operations.',
  },
  '/about': {
    title: 'About Manifest FTS',
    description:
      'Learn about Manifest FTS, our approach to strategy and engineering, and how we help teams build durable digital systems.',
  },
  '/capabilities': {
    title: 'Capabilities + Retainer | Manifest FTS',
    description:
      'Flexible monthly support for design, development, strategy, websites, applications, UX, enhancements, maintenance, and digital execution.',
  },
  '/case-study/barclay-rex': {
    title: 'Case Study: Barclay Rex | Manifest FTS',
    description:
      'How Manifest FTS helped Barclay Rex modernize its digital infrastructure and expand eCommerce beyond physical storefronts.',
  },
  '/case-study/optumpricer': {
    title: 'Case Study: OptumPricer | Manifest FTS',
    description:
      'A transformation from legacy prototype to scalable SaaS platform with improved onboarding, subscriptions, and performance.',
  },
  '/case-study/nc-waterfalls': {
    title: 'Case Study: NC Waterfalls | Manifest FTS',
    description:
      'How decades of waterfall fieldwork were translated into searchable, scalable digital infrastructure built for longevity.',
  },
  '/case-study/joyfeed': {
    title: 'Case Study Draft: JoyFeed | Manifest FTS',
    description:
      'Draft JoyFeed case study focused on strategy, UX, and a persistent BLS ambient audio layer for a restorative platform experience.',
  },
  '/ahead-with-fts': {
    title: 'Ahead with FTS: Technology Insights | Manifest FTS',
    description:
      'Articles from Manifest FTS on SaaS, analytics, AI, and the future of work, written for business owners planning their digital roadmap.',
  },
  '/free-website': {
    title: 'Free Website for Small Businesses & Nonprofits | Manifest FTS',
    description:
      'A professional website with no upfront build cost. Hosting, support, maintenance, backups, and SSL are included in a simple monthly plan.',
  },
  '/wordpress-hosting': {
    title: 'Managed WordPress Hosting | Manifest FTS',
    description:
      'Managed WordPress hosting with updates, security, performance tuning, and migrations handled by Manifest FTS engineers.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Manifest FTS',
    description: 'How Manifest FTS collects, uses, and protects information submitted through manifestfts.com.',
  },
  '/terms': {
    title: 'Terms of Use | Manifest FTS',
    description: 'Terms governing use of manifestfts.com and Manifest FTS website, hosting, and subscription services.',
  },
  ...Object.fromEntries(articles.map((article) => [articlePath(article), {
    title: `${article.title} | Ahead with FTS`,
    description: article.description,
  }])),
}

// Drafts, duplicates, and private flows: keep out of the index but let
// crawlers follow links.
const NOINDEX_PATHS = ['/home', '/funding', '/funding/success', '/case-study/joyfeed', '/blog-index.bak', '/blog-single.bak']
const isNoindex = (path) => NOINDEX_PATHS.includes(path) || path.startsWith('/admin')

const breadcrumbLabels = {
  'ahead-with-fts': 'Ahead with FTS',
  'case-study': 'Work',
  'wordpress-hosting': 'WordPress Hosting',
  'free-website': 'Free Website',
  'privacy-policy': 'Privacy Policy',
}

function breadcrumbSchema(path, currentName) {
  if (path === '/') return null
  const segments = path.split('/').filter(Boolean)
  const items = [{ name: 'Home', path: '/' }]
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    // /case-study has no index page; point that crumb at /work.
    const crumbPath = segment === 'case-study' ? '/work' : `/${segments.slice(0, index + 1).join('/')}`
    const label = isLast && currentName
      ? currentName
      : breadcrumbLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    items.push({ name: label, path: crumbPath })
  })
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const normalizedPath = (router.asPath || '/').split('#')[0].split('?')[0] || '/'
  const canonical = absoluteUrl(normalizedPath)
  const seo = pageMeta[normalizedPath] || {
    title: 'Manifest FTS | Forward Thinking Digital Solutions',
    description:
      'Manifest FTS builds web and platform experiences that strengthen growth, clarity, and long-term digital performance.',
  }

  const article = articles.find((entry) => articlePath(entry) === normalizedPath)
  const noindex = isNoindex(normalizedPath)
  const crumbName = article ? article.title : seo.title.split(' | ')[0].replace(/^Case Study: /, '')
  const breadcrumbs = noindex ? null : breadcrumbSchema(normalizedPath, crumbName)

  const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    name: seo.title,
    description: seo.description,
    url: canonical,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    ...(breadcrumbs ? { breadcrumb: { '@id': breadcrumbs['@id'] } } : {}),
  }

  const articleSchema = article ? {
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    image: absoluteUrl(article.image),
    author: { '@id': article.byFounder ? FOUNDER_ID : ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${canonical}#webpage` },
    isPartOf: { '@type': 'Blog', name: 'Ahead with FTS', url: absoluteUrl('/ahead-with-fts') },
    inLanguage: 'en-US',
  } : null

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [...entityGraph(), webPageSchema, breadcrumbs, articleSchema].filter(Boolean),
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', pageview)
    return () => {
      router.events.off('routeChangeComplete', pageview)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <title key="title">{seo.title}</title>
        <meta key="description" name="description" content={seo.description} />
        <meta key="robots" name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'} />
        <meta key="theme-color" name="theme-color" content="#101828" />
        <link key="icon-svg" rel="icon" href="/favicon.ico" sizes="any" />
        <link key="apple-touch-icon" rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link key="manifest" rel="manifest" href="/site.webmanifest" />

        <link key="canonical" rel="canonical" href={canonical} />

        <meta key="og:type" property="og:type" content={article ? 'article' : 'website'} />
        <meta key="og:locale" property="og:locale" content="en_US" />
        <meta key="og:site_name" property="og:site_name" content="Manifest FTS" />
        <meta key="og:title" property="og:title" content={seo.title} />
        <meta key="og:description" property="og:description" content={seo.description} />
        <meta key="og:url" property="og:url" content={canonical} />
        <meta key="og:image" property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta key="og:image:width" property="og:image:width" content={String(DEFAULT_OG_IMAGE_SIZE.width)} />
        <meta key="og:image:height" property="og:image:height" content={String(DEFAULT_OG_IMAGE_SIZE.height)} />
        <meta key="og:image:alt" property="og:image:alt" content="Manifest FTS — Forward Thinking Solutions, Greenville, SC" />
        {article && <meta key="article:published_time" property="article:published_time" content={article.datePublished} />}

        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="@manifestfts" />
        <meta key="twitter:title" name="twitter:title" content={seo.title} />
        <meta key="twitter:description" name="twitter:description" content={seo.description} />
        <meta key="twitter:image" name="twitter:image" content={DEFAULT_OG_IMAGE} />

        {/* Server-rendered so crawlers that skip JS still see the entity graph. */}
        <script key="jsonld-site" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schemaGraph) }} />
      </Head>

      {/* Google Tag Manager - Global base code */}
      <Script
        id="gtag-base"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
      <RetainerProvider>
        <Toaster />
        <Component {...pageProps} />
        <RetainerModal />
      </RetainerProvider>
    </>
  )
}

export default MyApp