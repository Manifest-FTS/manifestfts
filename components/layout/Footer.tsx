import gsap, { Linear } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Footer = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  // Use gsap to control the rotation
  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: Linear.easeNone,
      });
    }
  }, []);

  const [year, setYear] = useState(2023);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <footer className="footer mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <Link href="/case-study/nc-waterfalls">
                    <a>NC Waterfalls</a>
                  </Link>
                </li>
                {/* JoyFeed case study link intentionally hidden until publish-ready */}
                <li>
                  <Link href="/case-study/sanity-cms">
                    <a>Sanity CMS</a>
                  </Link>
                </li>
              </ul>
            </div>

          </div>
          <div className="footer-bottom mt-12 text-center lg:text-left">
            <div className="flex justify-center items-center flex-col">
              <div className="text-gray-500">
                <span> &copy; 2023{year !== 2023 ? `– ${year}` : ''} Manifest FTS LLC. </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
