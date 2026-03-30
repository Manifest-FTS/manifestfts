import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout/Layout";

const keyFeatures = [
  {
    title: "AI Positivity Filtering",
    body:
      "Machine learning models analyze posts and metadata to prioritize constructive, uplifting content and reduce digital noise.",
  },
  {
    title: "Bloom Streaks",
    body:
      "Users build streaks through positive actions and meaningful engagement, reinforcing consistent healthy platform habits.",
  },
  {
    title: "Community Voting",
    body:
      "Community upvotes and downvotes help shape feed quality and improve what rises to the top over time.",
  },
  {
    title: "Curated Resource Hub",
    body:
      "A curated library of mental wellness resources, articles, audio, and video gives users practical support beyond the feed.",
  },
  {
    title: "BLS Ambient Audio Layer",
    body:
      "A persistent wellness audio feature accessible from a floating bottom-right icon on every page, allowing users to activate calming BLS audio while browsing content, watching videos, and using guided meditations.",
  },
  {
    title: "Cross-Platform Experience",
    body:
      "Designed for mobile and web with a consistent product experience across sessions, contexts, and screen sizes.",
  },
];

const designProcessPoints = [
  "Persistent playback across route changes so wellness audio does not reset between pages",
  "Coexistence with other media playback, including videos, audio clips, and guided meditations",
  "Intuitive mute, pause, and volume behavior with clear user control",
  "Non-intrusive placement and interaction patterns for mobile and desktop",
  "Accessibility-first controls with keyboard support and assistive-label clarity",
];

const technologyApproachPoints = [
  "Global audio state/store architecture to maintain playback status across all routes",
  "Persistent playback lifecycle management across navigation events",
  "Floating bottom-right trigger that remains available throughout the platform",
  "Compatibility handling with embedded media and overlapping audio states",
  "Graceful pause, resume, and volume management with predictable fallback behavior",
];

function JoyFeedCaseStudyDraftPage() {
  const canonical = "https://www.manifestfts.com/case-study/joyfeed";

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "JoyFeed Case Study (Draft)",
    headline: "JoyFeed: Designing a restorative, atmosphere-driven social wellness platform",
    description:
      "Draft case study for JoyFeed, including strategy, UX, and technical direction for an atmosphere-driven platform with a persistent BLS ambient audio layer.",
    url: canonical,
    author: {
      "@type": "Organization",
      name: "Manifest FTS",
    },
    about: [
      "Wellness Platform",
      "Product Strategy",
      "UX Design",
      "Persistent Audio Architecture",
    ],
  };

  return (
    <>
      <Head>
        <title>Case Study Draft: JoyFeed | Manifest FTS</title>
        <meta
          name="description"
          content="Draft JoyFeed case study focused on strategy, UX, and a persistent BLS ambient audio layer for a restorative platform experience."
        />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="Case Study Draft: JoyFeed | Manifest FTS" />
        <meta
          property="og:description"
          content="A draft case study showing how JoyFeed combines positive content systems with persistent wellness audio to create a restorative digital environment."
        />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content="https://www.manifestfts.com/assets/imgs/hero-image.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Case Study Draft: JoyFeed | Manifest FTS" />
        <meta
          name="twitter:description"
          content="Draft case study for JoyFeed with BLS Ambient Audio Layer as a signature platform feature."
        />
        <meta
          name="twitter:image"
          content="https://www.manifestfts.com/assets/imgs/hero-image.jpg"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
        />
      </Head>

      <Layout>
        <section
          className="text-white"
          style={{
            background:
              "linear-gradient(272.82deg, #E84B8B -8.44%, #FF5542 57.04%, #FEB804 117.67%)",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-20">
            <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide">
              Case Study Draft
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-white md:text-6xl">
              JoyFeed
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-purple-100 sm:text-xl">
              JoyFeed is positioned as a restorative social platform where positive content,
              supportive community interaction, and calming atmosphere work together.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-purple-100 sm:text-lg">
              A major differentiator is the persistent BLS ambient audio experience available
              from a floating bottom-right icon on every page.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="#solution-strategy">
                <a className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#FCE7F1] sm:w-auto">
                  Read draft strategy
                </a>
              </Link>
            </div>
          </div>
        </section>

        <section id="solution-strategy" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Solution Strategy</h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-800">
                JoyFeed’s differentiation is not only visual and content-driven, but
                atmosphere-driven. Users can activate a persistent BLS ambient audio layer from
                anywhere on the site, creating a calming environment that continues across page
                transitions and supports all other interactions.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-800">
                This reinforces JoyFeed’s goal of feeling restorative rather than
                overstimulating, while still supporting active engagement with platform
                content and community.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[#FAD0E4] bg-[#FCE7F1] p-6">
              <h3 className="text-xl font-semibold text-[#BA1C50]">Atmosphere callout</h3>
              <p className="mt-3 text-base leading-relaxed text-[#801B3A]">
                The persistent BLS audio layer is a signature product feature, accessed from a
                subtle floating control in the bottom-right corner. It remains available on every
                page as an optional wellness layer for focus, calm, and emotional regulation.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#FAFAFA]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Key Features</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {keyFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-[#E7E7E7] bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900">Design Process</h3>
              <p className="mt-4 text-base leading-relaxed text-gray-700">
                The UX direction includes a persistent wellness control system with a floating
                bottom-right audio icon that is subtle, always available, and easy to use without
                distracting from core content.
              </p>
              <ul className="mt-5 space-y-3 text-base leading-relaxed text-gray-800">
                {designProcessPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#057AFF]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900">Technology Approach</h3>
              <p className="mt-4 text-base leading-relaxed text-gray-700">
                JoyFeed should support a persistent global audio player architecture for BLS
                playback so audio remains active while users browse the feed, navigate pages, and
                engage with videos, audio clips, and guided meditations.
              </p>
              <ul className="mt-5 space-y-3 text-base leading-relaxed text-gray-800">
                {technologyApproachPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#E84B8B]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="bg-[#171717] text-white">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Draft status: ready for content and asset iteration
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#E7E7E7]">
              This draft follows the existing case study structure while integrating BLS Ambient
              Audio Layer as a primary JoyFeed feature across strategy, UX, and technical planning.
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default JoyFeedCaseStudyDraftPage;
