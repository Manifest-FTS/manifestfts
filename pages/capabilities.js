/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/layout/Layout";
import { RetainerBuilder, RetainerTrigger } from "../components/retainer";

const capabilityCards = [
  {
    tag: 'Product & Platforms',
    title: 'Websites, web applications, and digital products',
    copy: 'From marketing sites to more involved product work, we can support planning, design, implementation, iteration, and ongoing improvement.',
  },
  {
    tag: 'Design & UX',
    title: 'Interface design, UX refinement, and conversion support',
    copy: 'We help shape clearer user journeys, stronger interfaces, and more cohesive product experiences without separating strategy from execution.',
  },
  {
    tag: 'Ongoing Support',
    title: 'Enhancements, maintenance, SEO implementation, and technical guidance',
    copy: 'The retainer is built for the real mix of digital work that accumulates over time — improvements, implementation, fixes, guidance, and momentum.',
  },
];

const faqItems = [
  {
    title: 'What fits inside the retainer?',
    copy: 'Most ongoing digital work fits naturally: websites, web apps, product support, UX/UI, technical strategy, SEO implementation support, maintenance, enhancements, and execution work that benefits from continuity.',
  },
  {
    title: 'Is this a fixed package?',
    copy: 'No. The monthly commitment creates planning clarity, but the work itself stays flexible. The goal is an ongoing partnership, not a rigid bundle of pre-defined deliverables.',
  },
  {
    title: 'Can the commitment change later?',
    copy: 'Yes. The builder uses soft anchor points so the relationship can scale up or down as priorities shift.',
  },
];

function CapabilitiesPage() {
  const [hours, setHours] = useState(10);

  return (
    <Layout>
      <section className="section-box bg-red-100">
        <div className="banner-hero banner-2 bg-about-1 bg-green-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <span className="tag-1 bg-5 color-green-900 mr-20 px-4 py-2 rounded-md">Capabilities + Retainer</span>
                <h1 className="text-display-3 mt-30">Flexible monthly support for design, development, strategy, and digital execution.</h1>
                <p className="text-body-lead-large color-gray-600 mt-30 pr-40">
                  Manifest FTS supports a broad range of digital work under one ongoing model — websites, applications, UX/UI, implementation, enhancements, maintenance, and growth-oriented support.
                </p>
                <div className="mt-40">
                  <RetainerTrigger className="btn btn-black icon-arrow-right-white mr-20 mb-15" source="capabilities_hero" hours={hours}>
                    Start a Retainer
                  </RetainerTrigger>
                  <a href="#retainer-builder" className="btn btn-link icon-triangle color-gray-900 mb-15">How it works</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-box">
        <div className="container mt-120">
          <div className="row">
            {capabilityCards.map((card) => (
              <div className="col-lg-4 col-sm-12" key={card.title}>
                <div className="bg-2 box-square hover-up" style={{ height: '100%', paddingBottom: 40 }}>
                  <span className="text-body-capitalized color-gray-500 text-uppercase">{card.tag}</span>
                  <h4 className="text-heading-4 color-gray-900 mb-15 mt-20">{card.title}</h4>
                  <p className="text-body-text-md color-gray-600">{card.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-box">
        <div className="container mt-120">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-40">
              <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">How the retainer works</span>
              <h2 className="text-heading-1 mt-30">A flexible monthly structure.</h2>
              <p className="text-body-lead-large color-gray-600 mt-30">
                Choose a monthly commitment, use those hours where they matter most, and keep the engagement flexible as needs evolve.
              </p>
              <p className="text-body-text color-gray-600 mt-20">
                Higher commitments improve the effective rate and create more continuity, but the model stays custom. It is meant to feel like an ongoing partnership, not a pricing table.
              </p>
            </div>
            <div className="col-lg-7" id="retainer-builder">
              <RetainerBuilder
                hours={hours}
                onHoursChange={setHours}
                title="Build the right monthly rhythm"
                subtitle="Choose a commitment that matches the pace of support you need right now."
              />
              <div className="mt-30">
                <RetainerTrigger className="btn btn-black icon-arrow-right-white mr-20 mb-15" source="capabilities_builder" hours={hours}>
                  Continue with {hours} hours / month
                </RetainerTrigger>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-box pt-140 pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 mb-40">
              <h3 className="text-heading-1">Frequently asked questions</h3>
              <p className="text-body-text color-gray-600 mt-30">A few practical notes on what the retainer covers and how the model works.</p>
              <div className="mt-60">
                <RetainerTrigger className="btn btn-black icon-arrow-right-white mr-20 mb-20" source="capabilities_faq" hours={hours}>
                  Start a Retainer
                </RetainerTrigger>
                <Link href="/work"><a className="btn btn-link text-heading-6">See Our Work</a></Link>
              </div>
            </div>
            <div className="col-lg-7">
              {faqItems.map((item) => (
                <div className="accordion-item mb-20" key={item.title}>
                  <div className="accordion-button collapsed">
                    <span className="text-heading-6 color-gray-900">{item.title}</span>
                  </div>
                  <div className="p-20 bg-white border border-top-0">
                    <p className="text-body-text color-gray-600 mb-0">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default CapabilitiesPage;