/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import 'react-modal-video/css/modal-video.css';
import support from './../public/assets/anim/customer-service.json';
import TeamSlider from "../components/slider/Team";
import Capabilities from "../components/capabilities";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const ModalVideo = dynamic(import("react-modal-video"), {
  ssr: false,
});

function About1() {
  const [isOpen, setOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 300) {
        controls.start({ opacity: 1, y: 0 });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return (
    <>
      <Layout>
        <section className="relative bg-gray-100 py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center">
              <div className="w-full lg:w-7/12">
                <span className="bg-orange-200 text-orange-600 px-4 py-2 rounded-full">Core Capabilities</span>
                <h1 className="text-4xl font-bold mt-6">We harness innovation to manifest value for businesses and brands.</h1>
                <p className="text-lg text-gray-600 mt-8">Manifest is a digital consultancy and software development agency that empowers forward-thinking brands through cutting-edge digital experiences.</p>
                <p className="text-lg text-gray-600 my-6">Our expertise spans brand and digital strategy, user experience design, software development, implementation, and data systems. We are a value-driven agency working with some of the most talented professionals to drive results.</p>
                <div className="mt-10 flex space-x-4 items-center">
                  <Link href="/#get-started">
                    <a className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">GET STARTED</a>
                  </Link>
                  <Link href="mailto:hello@manifestfts.com">
                    <a className="text-gray-900 text-lg font-medium hover:underline">Join Our Team</a>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block lg:w-5/12">
                <motion.div
                  className="relative"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <img className="rounded-lg" alt="Agon" src="assets/imgs/page/about/1/banner1.webp" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <h3 className="text-3xl font-semibold mb-8">Our Team</h3>
            <TeamSlider />
          </div>
        </section>

        <motion.section
          className="py-20 bg-gray-50"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto text-center">
            <div className="w-2/4 mx-auto">
              <Lottie animationData={support} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mt-8">Call, text, or email.</h2>
            <p className="text-lg text-gray-600 mt-4">We value our partners and your concerns. Connect with us on your terms, no inquiry is too small.</p>
          </div>
        </motion.section>

        <section className="py-14 bg-gray-900">
          <div className="container mx-auto text-center">
            <Link href="/#get-started">
              <a className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-teal-600 hover:text-teal-600">Get Started</a>
            </Link>
          </div>
        </section>

        <Capabilities />

        <ModalVideo
          channel="youtube"
          autoplay
          isOpen={isOpen}
          videoId="7e90gBu4pas"
          onClose={() => setOpen(false)}
        />
      </Layout>
    </>
  );
}

export default About1;
