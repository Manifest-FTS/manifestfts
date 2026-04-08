/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { RetainerTrigger } from "../retainer";
import logo from '/public/assets/anim/mfts-animated-logo.json';

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const NAV_ITEMS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/ahead-with-fts", label: "Ahead with FTS" },
];

const Header = ({ handleOpen, headerStyle = "", isMobileMenuOpen = false }) => {
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const [mounted, setMounted] = useState(false);

  const headerClassName = useMemo(() => {
    return ["header", "sticky-bar", "site-header", headerStyle, scroll ? "stick" : ""]
      .filter(Boolean)
      .join(" ");
  }, [headerStyle, scroll]);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lottieStyle = { width: 225 };

  const normalizePath = (path) => {
    if (!path) return "/";
    const base = path.split("?")[0].split("#")[0];
    return base || "/";
  };

  const isActive = (href) => {
    const current = normalizePath(router.asPath || router.pathname || "/");
    if (href === "/") return current === "/";
    return current === href || current.startsWith(`${href}/`);
  };

  return (
    <header id="navbar" className={headerClassName}>
      <div className="container">
        <div className="main-header site-header__bar">
          <div className="site-header__brand">
            <div className="header-logo">
              <Link href="/">
                <a className="d-flex align-items-center" aria-label="Manifest FTS home">
                  {!mounted ? (
                    <img
                      alt=""
                      src="/assets/imgs/logo-white.svg"
                      width="200"
                      height="30"
                      className="img-fluid"
                      style={{ maxHeight: 32 }}
                    />
                  ) : scroll ? (
                    <img
                      alt=""
                      src="/assets/imgs/logo.svg"
                      width="200"
                      height="30"
                      className="img-fluid"
                      style={{ maxHeight: 32 }}
                    />
                  ) : (
                    <Lottie animationData={logo} loop={false} style={lottieStyle} />
                  )}
                </a>
              </Link>
            </div>
          </div>

          <nav className="site-header__center" aria-label="Primary">
            <div className="site-header__nav">
              <ul className="site-header__list">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href} className="site-header__item">
                    <Link href={item.href}>
                      <a
                        className={`site-header__link${isActive(item.href) ? " is-active" : ""}`}
                      >
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="site-header__actions">
            <div className="site-header__mobile-actions">
              <RetainerTrigger
                className="btn btn-default hover-up site-header__cta"
                source="header_cta"
                hours={10}
              >
                Retainer
              </RetainerTrigger>
              {!isMobileMenuOpen ? (
                <button
                  type="button"
                  className="site-header__burger burger-icon burger-icon-white"
                  onClick={handleOpen}
                  aria-label="Open menu"
                  aria-expanded="false"
                  aria-controls="mobile-navigation"
                >
                  <span className="burger-icon-top" />
                  <span className="burger-icon-mid" />
                  <span className="burger-icon-bottom" />
                </button>
              ) : null}
            </div>
            <div className="site-header__desktop-cta">
              <RetainerTrigger
                className="btn btn-default hover-up site-header__cta"
                source="header_cta"
                hours={10}
              >
                Start a Retainer
              </RetainerTrigger>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
