/* eslint-disable @next/next/no-img-element */
import gsap, { Linear } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

const Footer = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  // Use gsap to control the rotation
  useLayoutEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotation: 360,
        duration: 10, // Adjust duration to control rotation speed
        repeat: -1,   // Infinite loop
        ease: Linear.easeNone, // Continuous, linear rotation
      });
    }
  }, []);

  return (
    <>
      <footer className="footer mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="footer-logo mx-auto">
              <div className="logo">
                <Image
                  className="mx-auto w-50 "
                  alt="Manifest Forward Thinking Solutions"
                  width="100"
                  height="100"
                  src="/assets/imgs/manifest-logo-mark-fts.svg"
                />
              </div>

              <Image
                className="mx-auto w-50 logo-circle rotating"
                alt="Manifest Forward Thinking Solutions"
                width="100"
                height="100"
                src="/assets/imgs/manifest-logo-mark-fts-circle.svg"
              />
            </div>

            {/* Menu Sections */}
            <div className="mb-8 text-center lg:text-left">
              <h4 className="text-lg font-semibold">Manifest</h4>
              <ul className="menu-footer mt-4">
                <li>
                  <Link href="/about">
                    <a>About</a>
                  </Link>
                </li>
                <li>
                  <Link href="/work">
                    <a>Work</a>
                  </Link>
                </li>
                <li>
                  <Link href="/ahead-with-fts">
                    <a>Ahead with FTS</a>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy">
                    <a>Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms">
                    <a>Terms of Use</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h4 className="text-lg font-semibold">Case Studies</h4>
              <ul className="menu-footer mt-4">
                <li>
                  <Link href="/case-study/barclay-rex">
                    <a>Barclay Rex</a>
                  </Link>
                </li>
                <li>
                  <Link href="/sanity-cms">
                    <a>Sanity API-1st CMS</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h4 className="text-lg font-semibold">Social</h4>
              <ul className="menu-footer mt-4">
                <li>
                  <a
                    href="https://twitter.com/manifestfts"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/manifestfts"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/manifest-fts"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom mt-12 text-center lg:text-left">
            <div className="flex justify-between items-center flex-col mb:flex-row">
              <div className="text-gray-500">
                <span>&copy; 2023{new Date().getFullYear() !== 2023 ? `– ${new Date().getFullYear()}` : ''} Manifest FTS LLC.</span>
              </div>
              <div className="footer-social">
                <a
                  className="icon-socials icon-twitter mx-2"
                  href="https://twitter.com/manifestfts"
                  target="_blank"
                  rel="noreferrer"
                ></a>
                <a
                  className="icon-socials icon-instagram mx-2"
                  href="https://www.instagram.com/manifestfts"
                  target="_blank"
                  rel="noreferrer"
                ></a>
                <a
                  className="icon-socials icon-linkedin mx-2"
                  href="https://www.linkedin.com/company/manifest-fts"
                  target="_blank"
                  rel="noreferrer"
                ></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
