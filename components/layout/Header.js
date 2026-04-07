/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RetainerTrigger } from "../retainer";
import logo from '/public/assets/anim/mfts-animated-logo.json';

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Header = ({ handleOpen, headerStyle }) => {
  const [scroll, setScroll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 100);
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const style = { width: 225 };

  return (
    <header
      id="navbar"
      className={scroll ? `${headerStyle} header sticky-bar stick` : `${headerStyle} header sticky-bar`}
    >
      <div className="container">
        <div className="main-header">

          {/* LEFT */}
          <div className="header-left">

            {/* LOGO */}
            <div className="header-logo">
              <Link href="/">
                <a className="d-flex">
                  {!mounted || scroll ? (
                    <img
                      alt="Manifest Logo"
                      src="/assets/imgs/logo.svg"
                      width="223"
                      height="33"
                      className="img-fluid"
                    />
                  ) : (
                    <Lottie animationData={logo} loop={false} style={style} />
                  )}
                </a>
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <div className="header-nav">
              <nav className="nav-main-menu d-none d-xl-block">
                <ul className="main-menu">

                  <li>
                    <Link href="/capabilities"><a>Capabilities</a></Link>
                  </li>

                  <li>
                    <Link href="/work"><a>Work</a></Link>
                  </li>

                  <li>
                    <Link href="/about"><a>About</a></Link>
                  </li>

                  <li>
                    <Link href="/ahead-with-fts"><a>Ahead with FTS</a></Link>
                  </li>

                </ul>
              </nav>

              {/* MOBILE BURGER */}
              <div
                className="burger-icon burger-icon-white d-xl-none"
                onClick={handleOpen}
              >
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          {/* RIGHT (DESKTOP CTA) */}
          <div className="header-right d-none d-md-block">
            <RetainerTrigger
              className="btn btn-default hover-up px-3 py-3"
              source="header_cta"
              hours={10}
            >
              Start a Retainer
            </RetainerTrigger>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;