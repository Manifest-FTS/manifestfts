/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import logo from '/public/assets/anim/mfts-animated-logo.json';
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Header = ({ handleOpen, headerStyle }) => {
  const [scroll, setScroll] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const scrollCheck = window.scrollY > 100;
      setScroll(scrollCheck);
    };

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      document.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const style = {
    width: 225,
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <>
      <header id="navbar" className={scroll ? `${headerStyle} header sticky-bar stick ` : `${headerStyle} header sticky-bar`}>
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <a className="d-flex">
                    {!mounted ? (
                      // Render static image only on the server
                      <img
                        alt="Manifest Vector Logo"
                        id="Logo"
                        src="/assets/imgs/logo.svg"
                        width="223"
                        height="33"
                        className="img-fluid h-100 w-100"
                      />
                    ) : scroll ? (
                      // After mount, show static logo if scroll=true
                      <img
                        alt="Manifest Vector Logo"
                        id="Logo"
                        src="/assets/imgs/logo.svg"
                        width="223"
                        height="33"
                        className="img-fluid h-100 w-100"
                      />
                    ) : (
                      // After mount, show animated logo if scroll=false
                      <Lottie animationData={logo} loop={false} style={style} />
                    )}
                  </a>
                </Link>

              </div>
              <div className="header-nav">
                <nav className="nav-main-menu d-none d-xl-block">
                  <ul className="main-menu">
                    {/* <li className="has-children">
                                            <Link href="/capabilities"><a className="active">Capabilities</a></Link>
                                            <ul className="sub-menu two-col">
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
                                        </li> */}
                    <li className="">
                      <Link href="/about"><a>About</a></Link>
                      {/* <ul className="sub-menu">
                                                <li>
                                                    <Link href="/about"><a className="closer"><i className="" />About</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="/blog"><a className="closer"><i className="" />Blog</a></Link>
                                                </li>
                                                <li className="hr"><span /></li>
                                                <li>
                                                    <Link href="/get-started"><a className="closer"><i className="" />Contact</a></Link>
                                                </li>
                                                
                                            </ul> */}
                    </li>

                    <li className="">
                      <Link href="/work"><a>Work</a></Link>
                    </li>
                    <li className="has-children">
                      <Link href="#"><a>Case Studies</a></Link>
                      <ul className="sub-menu">
                        <li>
                          <Link href="/case-study/barclay-rex"><a>Barclay Rex</a></Link>
                        </li>
                        <li>
                          <Link href="/sanity-cms"><a>Sanity API-1st CMS</a></Link>
                        </li>
                      </ul>
                    </li>
                    <li className="">
                      <Link href="/ahead-with-fts/"><a>Ahead with FTS</a></Link>
                    </li>


                    <li className="has-children hidden">
                      <a href="#">Shop</a>
                      <ul className="sub-menu">
                        <li><Link href="/page-shop-grid-1"><a className="closer"><i className="fi fi-rr-edit"></i>Shop Grid - 1</a></Link></li>
                        <li><Link href="/page-shop-grid-2"><a className="closer"><i className="fi fi-rr-edit"></i>Shop Grid - 2</a></Link></li>
                        <li><Link href="/shop/1"><a className="closer"><i className="fi fi-rr-edit"></i>Product Details</a></Link></li>
                      </ul>
                    </li>
                  </ul>
                </nav>
                <div className="burger-icon burger-icon-white block xg:hidden" onClick={handleOpen}>
                  <span className="burger-icon-top" /><span className="burger-icon-mid" /><span className="burger-icon-bottom" />
                </div>
              </div>
            </div>
            <div className="header-right hidden md:block">
              <div className="block-signin mr-6">
                <Link href="/#get-started"><a className="btn btn-default hover-up px-3 py-3">Get Started</a></Link>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
};

export default Header;