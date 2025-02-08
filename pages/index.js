/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import dynamic from "next/dynamic";
import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { motion } from "framer-motion";
import "react-modal-video/css/modal-video.css";
import FormProject from "../components/form-project/FormProject";
import Layout from "../components/layout/Layout";
// Note: The original GSAP animation has been replaced by Framer Motion.
// If you still need GSAP for other purposes, you can import it separately.

const ModalVideo = dynamic(import("react-modal-video"), {
  ssr: false,
});

function Index3() {
  const [isOpen, setOpen] = useState(false);

  return (
    <Layout>
        <section
          id="home-hero"
          className="section-box position-relative overflow-hidden"
        >
          <MuxPlayer id="hp-reel"
            streamType="on-demand"
            playbackId="9aEC9vgcsVx01MgwwTGwU7G3i02B4jhtShGymd2HjyU8M"          
            metadataViewerUserId=""
            primaryColor="#FFFFFF"
            secondaryColor="#000000"
            muted={true}
            loop={true}
            autoPlay={true}
            className='background-video'      
            thumbnailTime={0}   
            controls={false}                          
          />
          <div className="flex brand-video-copy">
            <h1 className="text-3xl md:text-7xl font-bold mt-10">
              Forward Thinking
              <br className="d-lg-block d-none" /> Solutions
            </h1>
            <div className="text-body-lead-medium mt-30">
              <a className="play-reel" onClick={() => setOpen(true)}>
                <img
                  width="55"
                  height="55"
                  src="/assets/imgs/SVG/icon-video-play.svg"
                />
                <div className="text-body-small text-bold">PLAY REEL</div>
              </a>
            </div>
          </div>
        </section>

      {/* Partners Section */}
      <div className="my-20 overflow-visible">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-lg font-semibold text-gray-900 mb-16">
            emPowered by the Best Software on Earth
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { href: "/#", alt: "Adobe", src: "/assets/imgs/logos/adobe.svg" },
              { href: "/#", alt: "Figma", src: "/assets/imgs/logos/figma.svg" },
              { href: "/#", alt: "Netlify CMS", src: "/assets/imgs/logos/netlifycms.svg" },
              { href: "/#", alt: "Wordpress", src: "/assets/imgs/logos/wordpress.svg" },
              { href: "/#", alt: "Strapi", src: "/assets/imgs/logos/strapi.svg" },
              { href: "/#", alt: "Sanity", src: "/assets/imgs/logos/sanity.svg" },
              { href: "/#", alt: "React.js", src: "/assets/imgs/logos/reactjs.svg" },
              { href: "/#", alt: "Next.js", src: "/assets/imgs/logos/nextjs.svg" },
              { href: "/#", alt: "TailwindCSS", src: "/assets/imgs/logos/tailwindcss.svg" },
              { href: "/#", alt: "HTML5", src: "/assets/imgs/logos/html5.svg" },
              { href: "/#", alt: "Bootstrap", src: "/assets/imgs/logos/bootstrap.svg" },
              { href: "/#", alt: "Netlify", src: "/assets/imgs/logos/netlify.svg" },
              { href: "/#", alt: "Vercel", src: "/assets/imgs/logos/vercel.svg" },
              { href: "/#", alt: "Heroku", src: "/assets/imgs/logos/heroku.svg" },
              { href: "/#", alt: "Pantheon", src: "/assets/imgs/logos/pantheon.svg" },
            ].map((partner, index) => (
              <Link key={index} href={partner.href}>
                <a className="transition transform hover:-translate-y-1 hover:shadow-lg">
                  <img alt={partner.alt} src={partner.src} className="mx-auto" />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Work Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 mt-[120px] flex flex-wrap">
          {/* Image Column */}
          <div className="w-full lg:w-1/2 px-4">
            <motion.img
              src="/assets/imgs/work/work-barclay-rex.webp"
              alt="Barclay Rex website on laptop"
              className="rounded-lg w-full"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />
          </div>
          {/* Content Column */}
          <div className="w-full lg:w-1/2 px-4 justify-center">
            <span className="bg-green-100 text-green-900 px-4 py-2 rounded-full">Our Work</span>
            <h3 className="mt-9 text-5xl font-bold text-gray-900">Barclay Rex</h3>
            <p className="text-xl text-gray-600 my-4">
              Digital e-Commerce Strategy, Progressive Web Application Development
            </p>
            <div className="flex items-center mt-8 space-x-4">
              <Link href="/case-study/barclay-rex" passHref>
                <a className="inline-flex items-center text-gray-900 border bg-gray-100 px-6 py-3 rounded-full transition">
                  View Case Study
                </a>
              </Link>
              <a
                href="https://barclayrex.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-full transition"
              >
                Visit Website
              </a>
            </div>
            <div className="mt-12">
              <h2 className="text-center text-sm font-semibold text-gray-900 mb-4">
                Powered by
              </h2>
              <div className="flex justify-center gap-6">
                {[
                  { href: "/#", alt: "Adobe", src: "/assets/imgs/logos/adobe.svg" },
                  { href: "/#", alt: "Bootstrap", src: "/assets/imgs/logos/tailwindcss.svg" },
                  { href: "/#", alt: "Strapi CMS", src: "/assets/imgs/logos/strapi.svg" },
                  { href: "/#", alt: "Next.js", src: "/assets/imgs/logos/nextjs.svg" },
                  { href: "/#", alt: "Vercel", src: "/assets/imgs/logos/vercel.svg" },
                ].map((partner, index) => (
                  <Link key={index} href={partner.href}>
                    <a className="transition transform hover:-translate-y-1 hover:shadow-lg">
                      <img alt={partner.alt} src={partner.src} className="mx-auto" />
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-[60px] mt-[70px] bg-green-900">
        <div className="flex justify-center items-center space-x-5">
          <Link href="/#get-started" className="cursor-pointer">
            <span className="inline-flex items-center font-bold bg-black text-white transition px-6 py-3 rounded-full cursor-pointer">
              Get Started
            </span>
          </Link>
          <Link href="/work" className="cursor-pointer">
            <span className="inline-flex items-center font-bold bg-white text-gray-900 border border-gray-300 transition px-6 py-3 rounded-full cursor-pointer">
              Our Work
            </span>
          </Link>
        </div>
      </section>

      {/* CMS Recommendation Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 mt-16">
          <div className="flex justify-center px-4">
            <span className="bg-green-100 text-green-900 mr-5 px-4 py-2 rounded-full">
              Software Solutions
            </span>
          </div>
          <h2 className="text-center text-5xl font-bold text-gray-900 mb-4">
            Our recommended CMS
            <br />
            for your next project
          </h2>
          <p className="mt-8 text-2xl text-gray-600 text-center max-w-3xl mx-auto">
            Sanity has a long list of technical benefits, but the clean interface and visual cues make it our recommended content management system. It provides a hassle-free editing experience and adds long-lasting value for our clients.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex justify-center">
            <div className="w-full lg:w-10/12">
              <div className="rounded-lg shadow-lg overflow-hidden img-responsive bdrd-16 effect-1">
                <MuxPlayer
                  streamType="on-demand"
                  playbackId="xVEspFYOw6gtvRjEMk8xFnrjXtJ3YqGzajrvtjdV1cU"
                  metadataVideoTitle=""
                  metadataViewerUserId=""
                  primaryColor="#FFFFFF"
                  secondaryColor="#000000"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-1/3 px-4 mt-12">
              <h4 className="text-2xl font-semibold">
                Real-Time Collaboration
              </h4>
              <p className="mt-4 text-lg text-gray-600">
                Track changes with live multi-user editing, visual cues, and communication tools.
              </p>
            </div>
            <div className="w-full lg:w-1/3 px-4 mt-12">
              <h4 className="text-2xl font-semibold">
                Content First Experience
              </h4>
              <p className="mt-4 text-lg text-gray-600">
                An intuitive administrative interface that lets you edit content without software hassles.
              </p>
            </div>
            <div className="w-full lg:w-1/3 px-4 mt-12">
              <h4 className="text-2xl font-semibold">Powerful Solution</h4>
              <p className="mt-4 text-lg text-gray-600">
                Its powerful API allows dynamic relational systems and ecommerce platforms to come to life.
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-9 font-bold">
            <Link href="/sanity-cms">
              <a className="inline-flex items-center bg-black text-white transition px-6 py-3 rounded-full hover:bg-gray-800">
                Overview of Sanity CMS
              </a>
            </Link>
          </div>
        </div>
      </section>

      <FormProject />

      <ModalVideo
        channel="youtube"
        videoId="-SqGLNUkM30"
        youtube={{
          autoplay: 1,
          rel: 0,
        }}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
      />
    </Layout>
  );
}

export default Index3;
