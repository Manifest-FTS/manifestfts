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

const SITE_URL = 'https://www.manifestfts.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/imgs/hero-image.png`

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
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const normalizedPath = (router.asPath || '/').split('#')[0].split('?')[0] || '/'
  const canonical = `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`
  const seo = pageMeta[normalizedPath] || {
    title: 'Manifest FTS | Forward Thinking Digital Solutions',
    description:
      'Manifest FTS builds web and platform experiences that strengthen growth, clarity, and long-term digital performance.',
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
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
      </Head>

      <Script
        id="schema-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-webpage"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

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
      <Toaster />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp