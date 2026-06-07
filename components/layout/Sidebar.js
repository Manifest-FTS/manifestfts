/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { RetainerTrigger } from "../retainer";

const PRIMARY_LINKS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/ahead-with-fts", label: "Ahead with FTS" },
];

const Sidebar = ({ openClass, onClose }) => {
  const [caseStudiesOpen, setCaseStudiesOpen] = useState(false);

  const close = () => {
    if (typeof onClose === "function") onClose();
  };

  return (
    <div
      id="mobile-navigation"
      className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar mobile-header-modern ${openClass || ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <PerfectScrollbar className="mobile-header-wrapper-inner">
        <div className="mobile-header-top">
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-header__brand">
              <div className="d-flex align-items-center" style={{ gap: 10 }}>
                <img
                  src="/assets/imgs/logo.svg"
                  alt=""
                  width="120"
                  height="18"
                  style={{ display: "block", height: 18, width: "auto" }}
                />
              </div>
            </div>
            <button
              type="button"
              className="site-header__drawer-close"
              onClick={close}
              aria-label="Close menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mobile-header-content-area">
          <div className="perfect-scroll">
            <div className="mobile-menu-wrap mobile-header-border">
              <nav aria-label="Mobile">
                <ul className="mobile-menu-modern">
                  {PRIMARY_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <a onClick={close}>{item.label}</a>
                      </Link>
                    </li>
                  ))}
                  <li className={caseStudiesOpen ? "has-children active" : "has-children"}>
                    <span
                      className="menu-expand"
                      onClick={() => setCaseStudiesOpen((open) => !open)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setCaseStudiesOpen((open) => !open);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={caseStudiesOpen}
                    >
                      <i className="fi-rr-angle-small-down" />
                    </span>
                    <span
                      className="font-heading mobile-case-studies-label"
                      onClick={() => setCaseStudiesOpen((open) => !open)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setCaseStudiesOpen((open) => !open);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      Case studies
                    </span>
                    <ul className={caseStudiesOpen ? "sub-menu d-block" : "sub-menu d-none"}>
                      <li>
                        <Link href="/case-study/nc-waterfalls">
                          <a onClick={close}>NC Waterfalls</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/case-study/sanity-cms">
                          <a onClick={close}>Sanity CMS</a>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
              <div className="mobile-menu-cta px-1">
                <RetainerTrigger
                  className="btn btn-black icon-arrow-right-white"
                  source="mobile_drawer"
                  hours={10}
                  onClick={close}
                >
                  Start a Retainer
                </RetainerTrigger>
              </div>
            </div>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default Sidebar;
