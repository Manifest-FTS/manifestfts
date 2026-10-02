import { Toaster } from 'react-hot-toast';
import "../public/assets/css/style.css";
import "../public/assets/css/swiper-custom.css";
import "../public/assets/css/globals.min.css";
import "../styles/manifest-system.css";

import React, { useEffect } from "react";
import 'react-modal-video/css/modal-video.css';

import Head from 'next/head'

import Script from 'next/script'
import { useRouter } from 'next/router'
import { GTM_ID, pageview } from '../lib/gtm'
import { RetainerModal, RetainerProvider } from '../components/retainer'
import { insights } from '../data/manifestSiteContent'

const SITE_URL = 'https://www.manifestfts.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/imgs/hero-image.png`

const pageMeta = {
  '/': {
    title: 'Manifest FTS | Your Long-Term Technology Partner',
    description:
      'Manifest FTS is an engineering-led digital partner for durable web platforms, secure infrastructure, and practical technology strategy.',
  },
  '/services': {
    title: 'Digital Product, Web & Infrastructure Services | Manifest FTS',
    description: 'Product design and UX engineering, full-stack web development, managed infrastructure and data trust, and practical AI search optimization.',
  },
  '/insights': {
    title: 'Insights on Web Architecture, Data Trust & AI Search | Manifest FTS',
    description: 'Practical guidance from Manifest FTS on durable web architecture, data trust, managed infrastructure, and responsible AI search visibility.',
  },
  '/contact': {
    title: 'Start a Technology Partnership | Manifest FTS',
    description: 'Tell Manifest FTS what you are building or improving. Share your needs and receive a clear, tailored project brief conversation.',
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
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const normalizedPath = (router.asPath || '/').split('#')[0].split('?')[0] || '/'
  const canonical = `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`
  const insight = insights.find((article) => normalizedPath === `/insights/${article.slug}`)
  const seo = pageMeta[normalizedPath] || (insight ? {
    title: `${insight.title} | Manifest FTS`,
    description: insight.summary,
  } : {
    title: 'Manifest FTS | Forward Thinking Digital Solutions',
    description:
      'Manifest FTS builds web and platform experiences that strengthen growth, clarity, and long-term digital performance.',
  })

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Manifest FTS',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/imgs/logo.svg`,
    sameAs: ['https://www.linkedin.com/company/manifestfts'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Manifest FTS',
    url: SITE_URL,
    inLanguage: 'en-US',
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      url: SITE_URL,
      name: 'Manifest FTS',
    },
  }

  const serviceSchemas = normalizedPath === '/services' ? [
    ['Product design and UX engineering', 'Human-centered product design and accessible UX engineering for websites and digital platforms.'],
    ['Full-stack web development', 'Modern CMS, enterprise websites, headless content platforms, and custom web application development.'],
    ['Managed infrastructure and data trust', 'Long-term hosting, domain governance, security review, backups, and resilient platform operations.'],
    ['AI search and citation optimization', 'Practical answer-engine visibility analysis and citation optimization, informed by Manifest Signal.'],
  ].map(([name, description]) => ({
    '@context': 'https://schema.org', '@type': 'Service', name, description,
    provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'United States', url: `${SITE_URL}/services`,
  })) : []

  const caseStudyTitles = {
    '/case-study/nc-waterfalls': ['NC Waterfalls', 'A searchable digital archive built from decades of North Carolina waterfall fieldwork.'],
    '/case-study/barclay-rex': ['Barclay Rex', 'A multi-year digital commerce and platform modernization partnership.'],
    '/case-study/optumpricer': ['OptumPricer', 'A SaaS platform modernization focused on onboarding, subscriptions, and a scalable product foundation.'],
  }
  const caseStudy = caseStudyTitles[normalizedPath]
    ? { '@context': 'https://schema.org', '@type': ['Article', 'CreativeWork'], headline: caseStudyTitles[normalizedPath][0], name: caseStudyTitles[normalizedPath][0], description: caseStudyTitles[normalizedPath][1], author: { '@id': `${SITE_URL}/#organization` }, publisher: { '@id': `${SITE_URL}/#organization` }, mainEntityOfPage: canonical, about: ['Digital transformation', 'Web platform engineering', 'Technology partnership'] }
    : null
  const schemaGraph = [organizationSchema, websiteSchema, webPageSchema, ...serviceSchemas, ...(caseStudy ? [caseStudy] : [])]

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
        <meta key="robots" name="robots" content="index, follow" />

        <link key="canonical" rel="canonical" href={canonical} />

        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:site_name" property="og:site_name" content="Manifest FTS" />
        <meta key="og:title" property="og:title" content={seo.title} />
        <meta key="og:description" property="og:description" content={seo.description} />
        <meta key="og:url" property="og:url" content={canonical} />
        <meta key="og:image" property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta key="og:image:alt" property="og:image:alt" content="Manifest FTS brand preview" />

        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="@manifestfts" />
        <meta key="twitter:title" name="twitter:title" content={seo.title} />
        <meta key="twitter:description" name="twitter:description" content={seo.description} />
        <meta key="twitter:image" name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script key="manifest-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph }).replace(/</g, '\\u003c') }} />
      </Head>

      {/* Google Tag Manager - Global base code */}
      <Script
        id="gtag-base"
        strategy="afterInteractive"
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