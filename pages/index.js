/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import gsap, { Power3, Sine } from "gsap";
import dynamic from "next/dynamic";
import Link from "next/link";
import MuxPlayer, {
  MuxPlayerProps,
  MaxResolution,
  MinResolution,
  RenditionOrder,
} from "@mux/mux-player-react";
import { useEffect, useRef, useState } from "react";
import "react-modal-video/css/modal-video.css";
import FormProject from "../components/form-project/FormProject";
import Layout from "../components/layout/Layout";
import ModalVideos from "../components/elements/ModalVideo";
const ModalVideo = dynamic(import("react-modal-video"), {
  ssr: false,
});

function Index3() {
  const [isOpen, setOpen] = useState(false);
  const yInfiniteEl = useRef();

  useEffect(() => {
    gsap.to(yInfiniteEl.current, {
      y: 40,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <>
      <Layout>
        <section
          id="home-hero"
          className="section-box position-relative overflow-hidden"
        >
          <MuxPlayer
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
          />
          <div className="text-center brand-video-copy">
            <h1 className="mt-10">
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

        <div className="section-box overflow-visible mt-80">
          <div className="container">
            <h2 className="text-heading-6 text-center color-gray-900 mb-60">
              emPowered by the Best Software on Earth
            </h2>
            <div className="row">
              <div className="col-lg-12">
                <ul className="list-partners border-0 pb-0">
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img alt="Adobe" src="/assets/imgs/logos/adobe.svg" />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Figma Vector Logo"
                          src="/assets/imgs/logos/figma.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Netlify CMS Vector Logo"
                          src="/assets/imgs/logos/netlifycms.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Wordpress CMS Vector Logo"
                          src="/assets/imgs/logos/wordpress.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Strapi CMS Vector Logo"
                          src="/assets/imgs/logos/strapi.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Sanity CMS Vector Logo"
                          src="/assets/imgs/logos/sanity.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="React.js Vector Logo"
                          src="/assets/imgs/logos/reactjs.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Next.js"
                          src="/assets/imgs/logos/nextjs.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="TailwindCSS"
                          src="/assets/imgs/logos/tailwindcss.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="HTML5 Vector Logo"
                          src="/assets/imgs/logos/html5.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Bootstrap Vector Logo"
                          src="/assets/imgs/logos/bootstrap.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Netlify Vector Logo"
                          src="/assets/imgs/logos/netlify.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Pantheon"
                          src="/assets/imgs/logos/pantheon.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Vercel Vector Logo"
                          src="/assets/imgs/logos/vercel.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Heroku Vector Logo"
                          src="/assets/imgs/logos/heroku.svg"
                        />
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="section-box">
          <div className="container mt-120">
            <div className="row">
              <div className="col-lg-6 col-sm-12 block-img-we-do">
                <img
                  className="bdrd-16 img-responsive"
                  // ref={yInfiniteEl}
                  src="/assets/imgs/work/work-barclay-rex.webp"
                  alt="Barclay Rex website on laptop"
                />
              </div>
              <div className="col-lg-6 col-sm-12 block-we-do">
                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">
                  Work
                </span>
                <h3 className="text-heading-1 mt-30">Barclay Rex</h3>
                <p className="text-body-lead-large color-gray-600 mt-30">
                  Digital e-Commerce Strategy, Progressive Web Application
                  Development
                </p>
                <div className="align-items-center">
                  <Link href="/case-study/barclay-rex" passHref>
                    <span className="btn btn-light icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 mr-10 pl-12 pr-12 py-3">
                      View Case Study
                    </span>
                  </Link>
                  <a
                    href="https://barclayrex.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3"
                  >
                    Visit Website
                  </a>
                </div>
                <div className="row">
                  <div className="col-12 mt-50">
                    <h2 className="text-heading-7 text-center color-gray-900 mb-10">
                      Powered by
                    </h2>
                    <ul className="list-partners border-0">
                      <li>
                        <Link href="/#">
                          <a className="item-logo box-hover-shadow hover-up">
                            <img
                              alt="Adobe"
                              src="/assets/imgs/logos/adobe.svg"
                            />
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/#">
                          <a className="item-logo box-hover-shadow hover-up">
                            <img
                              alt="Bootstrap"
                              src="/assets/imgs/logos/tailwindcss.svg"
                            />
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/#">
                          <a className="item-logo box-hover-shadow hover-up">
                            <img
                              alt="Strapi CMS"
                              src="/assets/imgs/logos/strapi.svg"
                            />
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/#">
                          <a className="item-logo box-hover-shadow hover-up">
                            <img
                              alt="Next.js"
                              src="/assets/imgs/logos/nextjs.svg"
                            />
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/#">
                          <a className="item-logo box-hover-shadow hover-up">
                            <img
                              alt="Vercel"
                              src="/assets/imgs/logos/vercel.svg"
                            />
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-box pt-100 pb-100 mt-100 bg-green-900">
          <div className="d-flex justify-content-center">
            <Link href="/#get-started">
              <a className="btn btn-black icon-arrow-right-white mb-15 hover:text-black hover:bg-white">
                Get Started
              </a>
            </Link>
            <Link href="/work">
              <a className="btn btn-default icon-arrow-right color-gray-900 ml-20 btn-mb mb-15 hover:bg-black">
                Our Work
              </a>
            </Link>
          </div>
        </section>

        <section className="section-box">
          <div className="section-box mt-70">
            <div className="container">
              <div className="row">
                <div className="col-lg-2 col-sm-2 col-12" />
                <div className="col-lg-8 col-sm-8 col-12 text-center">
                  <div className="d-flex p-40 justify-content-center">
                    <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">
                      Software Solutions
                    </span>
                  </div>
                  <h2 className="text-heading-1 color-gray-900 mb-10">
                    Our recommended CMS
                    <br />
                    for your next project
                  </h2>
                  <p className="ft-lead text-body-lead-large color-gray-600 mt-30">
                    Sanity has a long list of technical benefits, but the clean
                    interface and visual cues make it our recommended content
                    management system. It provides a hassle-free editing
                    experience and adds long-lasting value for our clients.
                  </p>
                </div>
                <div className="col-lg-2 col-sm-2 col-12" />
              </div>
            </div>
            <div className="container mt-50">
              <div className="row">
                <div className="col-lg-1" />
                <div className="col-lg-10">
                  <div className="box-image">
                    <div className="img-responsive bdrd-16 shadow effect-1">
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
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-1" />
              </div>
            </div>
          </div>
          <div className="section-box mt-10">
            <div className="container mt-40">
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="list-icons mt-50">
                    <div className="item-icon border-0">
                      <h4 className="text-heading-4">
                        Real-Time Collaboration
                      </h4>
                      <p className="text-body-text color-gray-600 mt-15">
                        Track changes with live multi-user editing, visual cues,
                        and communication tools.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="list-icons mt-50">
                    <div className="item-icon border-0">
                      <h4 className="text-heading-4">
                        Content First Experience
                      </h4>
                      <p className="text-body-text color-gray-600 mt-15">
                        An inituive administrative interface with no software to
                        manage means you're never blocked from editing content.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="list-icons mt-50">
                    <div className="item-icon border-0">
                      <h4 className="text-heading-4">Powerful Solution</h4>
                      <p className="text-body-text color-gray-600 mt-15">
                        It's powerful API allows manifestation of dynamic
                        relational systems and ecommerce platforms.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <Link href="/sanity-cms">
                    <a className="btn btn-black icon-arrow-right-white mb-15">
                      Overview of Sanity CMS
                    </a>
                  </Link>
                </div>
              </div>
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
          // url="https://motoringstyle.com/manifest-brand-2002-2003-final.mp4"
          isOpen={isOpen}
          onClose={() => setOpen(false)}
        />
      </Layout>
    </>
  );
}

export default Index3;
