/* eslint-disable @next/next/no-img-element */
import gsap, { Linear } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer mt-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 width-20 mb-30">
              <div className="footer-logo">
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
            </div>
            <div className="col-lg-3 width-20 mb-30">
              <h4 className="text-heading-5">Manifest</h4>
              <ul className="menu-footer mt-20">
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
                {/* <li>
                                    <Link href="/blog">
                                        <a>Blog</a>
                                    </Link>
                                </li> */}
                <li>
                  <Link href="/privacy-policy">
                    <a>Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms">
                    <a>Terms</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 width-20 mb-30">
              <h4 className="text-heading-5">Solutions</h4>
              <ul className="menu-footer mt-20">
                <li>
                  <Link href="/sanity-cms">
                    <a>Sanity</a>
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.datocms.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    DATO CMS
                  </a>
                </li>
                <li>
                  <a href="https://strapi.io/" target="_blank" rel="noreferrer">
                    Strapi
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.netlifycms.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Netlify CMS
                  </a>
                </li>
                <li>
                  <a href="https://developer.wordpress.org/rest-api/">
                    <a target="_blank" rel="noreferrer">
                      WordPress Rest API
                    </a>
                  </a>
                </li>
              </ul>
            </div>
            {/* <div className="col-lg-3 width-20 mb-30">
                            <h4 className="text-heading-5">Capabilities</h4>
                            <ul className="menu-footer mt-20">
                            <li>
                                <Link href="/capabilities#branding"><a>Branding</a></Link>
                            </li>
                            <li>
                                <Link href="/capabilities#design"><a>Design</a></Link>
                            </li>
                            <li>
                                <Link href="/capabilities#software"><a>Software</a></Link>
                            </li>
                            </ul>
                        </div> */}
            <div className="col-lg-3 width-16">
              <h4 className="text-heading-5">Social</h4>
              <ul className="menu-footer mt-20">
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
          <div className="footer-bottom mt-20">
            <div className="row">
              <div className="col-md-6">
                <span className="color-gray-400 text-body-lead">
                  &copy; 2022 Manifest.
                </span>
              </div>
              <div className="col-md-6 text-center text-lg-end text-md-end">
                <div className="footer-social">
                  <a
                    className="icon-socials icon-twitter"
                    href="https://twitter.com/manifestfts"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                  <a
                    className="icon-socials icon-instagram"
                    href="https://www.instagram.com/manifestfts"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                  <a
                    className="icon-socials icon-linkedin"
                    href="https://www.linkedin.com/company/manifest-fts"
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
