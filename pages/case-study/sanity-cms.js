import Head from "next/head";
import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";
import Layout from "../../components/layout/Layout";

const platformHighlights = [
  {
    title: "Structured content modeling",
    technical:
      "Sanity stores content as structured data, not locked-in page blocks. That means each piece of content can be reused across web pages, landing pages, apps, and future channels.",
    client:
      "You publish once and reuse everywhere. Your team avoids duplicate work, and your content stays more consistent as your business grows.",
  },
  {
    title: "Real-time collaboration",
    technical:
      "Multiple teammates can edit in the same workspace at once with live presence, drafts, and revision history.",
    client:
      "Marketing, operations, and leadership can move faster together without version chaos or “who overwrote this?” moments.",
  },
  {
    title: "API-first delivery",
    technical:
      "Sanity is designed to feed websites, mobile apps, and other digital products through APIs, so content is not tied to a single front-end.",
    client:
      "Your platform can evolve without rebuilding your entire content system every time your business changes direction.",
  },
  {
    title: "Workflow and governance",
    technical:
      "Role-based access, staged publishing, and structured workflows help teams control who can draft, review, and publish.",
    client:
      "You get more speed with less risk, especially when multiple people or departments are involved.",
  },
  {
    title: "Localization and multi-market publishing",
    technical:
      "Sanity supports multilingual and region-specific content structures with flexible schemas and editorial tooling.",
    client:
      "You can speak to different audiences clearly without creating a fragmented, hard-to-maintain website stack.",
  },
  {
    title: "Media and performance readiness",
    technical:
      "Modern image and asset workflows support responsive delivery and better front-end performance outcomes.",
    client:
      "Your site feels faster and cleaner to visitors, which supports trust, engagement, and conversion.",
  },
];

const fitGuidance = [
  "Teams that publish frequently and need content to stay organized over time",
  "Organizations managing multiple pages, campaigns, regions, or content contributors",
  "Businesses that want a modern website now and flexibility for future digital products",
];

const notIdealGuidance = [
  "Very small websites with rare updates and no growth roadmap",
  "Projects that need an immediate drag-and-drop template solution only",
  "Situations where long-term flexibility is less important than short-term simplicity",
];

function SanityCMSCaseStudyPage() {
  const canonical = "https://www.manifestfts.com/case-study/sanity-cms";

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Sanity CMS Platform Case Study",
    headline: "Why Manifest FTS Recommends Sanity CMS for Modern Content Operations",
    description:
      "A client-friendly case study on why Manifest FTS uses and recommends Sanity CMS for teams that need flexible, scalable, and future-ready content systems.",
    url: canonical,
    author: {
      "@type": "Organization",
      name: "Manifest FTS",
    },
    about: [
      "Sanity CMS",
      "Content Operations",
      "API-first Architecture",
      "Digital Platform Strategy",
    ],
  };

  return (
    <>
      <Head>
        <title>Case Study: Sanity CMS Platform | Manifest FTS</title>
        <meta
          name="description"
          content="A client-friendly case study on why Manifest FTS recommends Sanity CMS for flexible, scalable, and future-ready content operations."
        />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="Case Study: Sanity CMS Platform | Manifest FTS" />
        <meta
          property="og:description"
          content="How Manifest FTS uses Sanity CMS to create practical publishing systems that scale with business growth."
        />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content="https://www.manifestfts.com/assets/imgs/hero-image.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Case Study: Sanity CMS Platform | Manifest FTS" />
        <meta
          name="twitter:description"
          content="Why Manifest FTS recommends Sanity CMS for modern, scalable, and client-friendly content operations."
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
        <section className="bg-[#102a3a] text-white">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-20">
            <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide">
              Case Study
            </p>

            <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight text-white">
              Sanity CMS is not our product.
              <br className="hidden sm:block" />
              It is one we love building with.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-200 sm:text-xl">
              Over the years, Sanity has evolved from a modern CMS into a strong content
              operating system for teams that need flexibility, structure, and long-term
              scalability.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-100 sm:text-lg">
              Our role is to design and implement the right setup for your business goals,
              so your team can publish confidently and your platform can grow without
              constant rework.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="https://sanity.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 sm:w-auto"
              >
                Visit Sanity.io
              </a>
              <Link href="#why-we-recommend-it">
                <a className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#102a3a] sm:w-auto">
                  Why it’s recommended
                </a>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
              <MuxPlayer
                streamType="on-demand"
                playbackId="xVEspFYOw6gtvRjEMk8xFnrjXtJ3YqGzajrvtjdV1cU"
                metadataVideoTitle="Sanity CMS Case Study Overview"
                metadataViewerUserId=""
                primaryColor="#FFFFFF"
                secondaryColor="#000000"
                autoPlay
                loop
                muted
                className="aspect-video w-full"
              />
            </div>
          </div>
        </section>

        <section id="why-we-recommend-it" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Why we recommend Sanity for the right projects
              </h2>
              <p className="my-4 text-lg leading-relaxed text-gray-800">
                Most clients don’t need a “more technical” CMS — they need a system that
                makes publishing easier today and future growth less painful tomorrow.
                That is where Sanity continues to stand out.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {platformHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-900">
                        Technical explanation
                      </p>
                      <p className="mt-2 text-base leading-relaxed text-gray-800">
                        {item.technical}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-900">
                        What this means for clients
                      </p>
                      <p className="mt-2 text-base leading-relaxed text-gray-800">
                        {item.client}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900">Great fit when you need</h3>
              <ul className="mt-5 space-y-3 text-base leading-relaxed text-gray-800">
                {fitGuidance.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-green-900" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900">May not be ideal when</h3>
              <ul className="mt-5 space-y-3 text-base leading-relaxed text-gray-800">
                {notIdealGuidance.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-gray-700" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#102a3a] text-white">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-white text-3xl font-bold sm:text-4xl">
              We help teams turn Sanity into a practical publishing system
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-gray-100">
              That includes architecture, editor experience, governance, and front-end
              integration — all designed around your real workflows, not generic templates.
            </p>
            <div className="mt-8">
              <Link href="/#contact-us">
                <a className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200">
                  Let’s plan your content foundation
                </a>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default SanityCMSCaseStudyPage;