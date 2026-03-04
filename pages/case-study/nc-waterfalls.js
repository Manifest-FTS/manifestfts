/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";

const statBlocks = [
  { value: "4,700+", label: "users", sub: "during launch week" },
  { value: "11,000+", label: "page views", sub: "and counting" },
  { value: "60%+", label: "of traffic", sub: "from organic search and social" },
  {
    value: "Global",
    label: "visitor footprint",
    sub: "United States, China, Singapore, Vietnam, Iraq, and beyond",
  },
];

function NcWaterfallsCaseStudy() {
  const canonical = "https://www.manifestfts.com/case-study/nc-waterfalls";

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "NC Waterfalls Case Study",
    headline: "A Living Archive for North Carolina Waterfalls",
    description:
      "How Manifest FTS translated decades of waterfall exploration and field research into a searchable, scalable, high-performance digital archive.",
    url: canonical,
    author: {
      "@type": "Organization",
      name: "Manifest FTS",
    },
    about: ["Digital Infrastructure", "Information Architecture", "SEO", "Performance Optimization"],
  };

  return (
    <>
      <Head>
        <title>Case Study: NC Waterfalls | Manifest FTS</title>
        <meta
          name="description"
          content="How Manifest FTS translated decades of NC waterfall exploration into a durable, searchable, and globally discoverable digital archive."
        />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="NC Waterfalls Case Study | Manifest FTS" />
        <meta
          property="og:description"
          content="Translating decades of waterfall exploration into enduring digital infrastructure built for discovery and longevity."
        />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://www.manifestfts.com/assets/imgs/hero-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NC Waterfalls Case Study | Manifest FTS" />
        <meta
          name="twitter:description"
          content="A multi-year effort to transform waterfall fieldwork into scalable digital infrastructure."
        />
        <meta name="twitter:image" content="https://www.manifestfts.com/assets/imgs/hero-image.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
        />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="section-box">
          <div className="banner-hero bg-[#102a3a] relative overflow-hidden pt-20 pb-20">
            <div className="diffusion-orb diffusion-orb-1" />
            <div className="diffusion-orb diffusion-orb-2" />
            <div className="grain-overlay" />
            
            <div className="container relative z-10 flex pt-20">
              <div className="max-w-4xl">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white"
                >
                  Case Study
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-5xl md:text-6xl font-bold mt-6 leading-tight text-white"
                >
                 A living archive for<br/>North Carolina waterfalls
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-300 mt-8 mb-8 max-w-3xl"
                >
                  For decades, photographer, author, and explorer Kevin Adams has documented North Carolina’s waterfalls — building one of the most comprehensive private archives in the region.<br/><br/>
                  Our conversation began in 2022 and became a multi-year effort to transform existing waterfall indexes into a comprehensive digital archive — rich in historical, educational, and recreational depth, built to endure and evolve over time.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mt-10 flex gap-4"
                >
                  <Link href="#case-study">
                    <a className="btn btn-default icon-arrow-down-white">Continue Reading</a>
                  </Link>
                  <a 
                    href="https://www.ncwaterfalls.com?utm_source=manifestfts&utm_medium=case_study&utm_campaign=nc_waterfalls_feature"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-link hover:text-green-400 text-white"
                  >
                    Visit ncwaterfalls.com →
                  </a>
                </motion.div>
              </div>
            </div>

            <div className="mt-16 container" id="case-study">
              
            </div>
          </div>
        </section>

        {/* The Challenge Section */}
        <section className="section-box py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row md:flex-row-reverse gap-12 items-center">
              <div className="order-2 md:order-1 md:w-1/2">
                <img 
                  src="/assets/imgs/case-studies/ncwf-map.jpg" 
                  alt="NC Waterfalls Map" 
                  className="w-full rounded-2xl mb-6 shadow-lg"
                />
                <img 
                  src="/assets/imgs/case-studies/ncwf-attributes.jpg" 
                  alt="Waterfall Data Attributes and Specifications" 
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
              <div className="order-1 md:order-2 md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900"><span className="text-green-600">Building</span> the archive</h2>
                <p className="text-lg text-gray-700 my-8">
                  Each waterfall represents more than an image. It carries geographic nuance, access considerations, seasonal variables, safety context, and experiential insight gathered over years in the field.
                </p>
                <p className="text-lg text-gray-700 mt-6">
                  The platform needed to support both precision and discovery. Some visitors arrive knowing exactly which waterfall they want. Others browse by region, accessibility, or experience. The system needed to serve both audiences without overwhelming either.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Data Section */}
        <section className="section-box py-20 bg-gray-50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  <span className="text-green-600">Expanding</span> the archive
                </h2>

                <p className="text-lg text-gray-700 mt-8">
                  Kevin&rsquo;s archive of data was expanded into a comprehensive digital archive &mdash; layered with historical context, educational depth, and recreational insight. Beyond individual waterfall entries, the platform explores waterfalls featured in film, includes a growing learning section on geology and preservation, and offers select &ldquo;then and now&rdquo; comparisons revealing how certain landscapes have changed across decades — each account meticulously documented and written by Kevin Adams.
                </p>

                <p className="text-lg text-gray-700 mt-6">
                  The archive itself reflects decades of collaboration &mdash; mentors, geologists, hiking partners, fellow authors, mapping experts, and family. Waterfalling, like most meaningful pursuits, is rarely solitary. The digital foundation was built to honor that depth, allowing photography and narrative to work in tandem within a system designed to endure.
                </p>
              </div>
              <div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full rounded-2xl shadow-lg"
                >
                  <source
                    src="/assets/imgs/case-studies/ncwaterfalls-then-now-looking-glass.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </section>

        <section className="section-box py-20">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Early signals</h2>
              <p className="text-lg text-gray-700 mt-6">Within the first weeks of launch, the platform signaled strong engagement and retention — evidence of meaningful, organic exploration. <a href="https://ncwaterfalls.com/waterfalls/sliding-rock-falls?utm_source=fts_case_study&utm_medium=referral&utm_campaign=nc_waterfalls" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Sliding Rock Falls</a> quickly emerged as the most searched and viewed waterfall.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {statBlocks.map((stat) => (
                <motion.div
                  key={stat.value + stat.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="p-8 bg-white border border-gray-200 rounded-xl text-center"
                >
                  <p className="text-5xl md:text-6xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wide text-gray-500 mt-2">{stat.label}</p>
                  <p className="text-gray-700 mt-4">{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-box py-20 bg-[#102a3a] text-white">
          <div className="container text-center">
            <blockquote className="text-3xl md:text-4xl leading-relaxed text-white font-medium">
              &ldquo;Kevin built this site beautifully and somehow was able to include nearly every feature I wanted… Kevin steered me and presented ideas that I never would have thought of.&rdquo;
            </blockquote>
            <p className="mt-8 text-base uppercase tracking-wide text-white/70">
              — Kevin Adams
            </p>
          </div>
        </section>

        <section className="section-box py-20">
          <div className="container max-w-7xl">
            <p className="text-lg text-gray-700 mb-6">
              Working with Kevin A. was genuinely enjoyable. Our conversations moved naturally between creative nuance and technical possibilities. He brought decades of field experience and careful writing; I brought the systems thinking needed to support and elevate it.
            </p>

            <p className="text-lg text-gray-700 mb-6">
              My job wasn&rsquo;t to reshape the work, but to build a foundation strong enough to hold it — translating his archive into a structure that preserves voice, invites exploration, and scales as it grows.
            </p>

            <p className="text-lg text-gray-700">
              <span className="font-semibold">
                The right foundation changes what&rsquo;s possible.
              </span>{" "}
              If you&rsquo;re looking for a builder who can think across design, systems, and strategy,{" "}
              <Link href="/#get-started">
                <a className="text-green-600 underline hover:text-green-700 transition-colors">
                  let&rsquo;s talk
                </a>
              </Link>.
            </p>
          </div>
        </section>
      </Layout>

      <style jsx>{`
        .diffusion-orb {
          position: absolute;
          filter: blur(60px);
          opacity: 0.4;
          border-radius: 9999px;
          animation: floaty 10s ease-in-out infinite;
        }
        .diffusion-orb-1 {
          width: 320px;
          height: 320px;
          background: #3f7f6a;
          top: -80px;
          right: -60px;
        }
        .diffusion-orb-2 {
          width: 240px;
          height: 240px;
          background: #2f6f8f;
          bottom: -80px;
          left: -60px;
          animation-delay: 2s;
        }
        .grain-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.25;
        }
        @keyframes floaty {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-12px) translateX(8px);
          }
        }
      `}</style>
    </>
  );
}

export default NcWaterfallsCaseStudy;
