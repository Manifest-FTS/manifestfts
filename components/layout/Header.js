/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
const Header = ({ handleOpen, headerStyle }) => {
    const [scroll, setScroll] = useState(0)
    useEffect(() => {
        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    })
    
    return (
        <>
            <header id="navbar" className={scroll ? `${headerStyle} header sticky-bar stick ` : `${headerStyle} header sticky-bar`}>
                <div className="container">
                    <div className="main-header">
                        <div className="header-left">
                            <div className="header-logo">
                                <Link href="/">
                                    <a className="d-flex">
                                        {headerStyle ? <img alt="Manifest Vector Logo" id="Logo" src="/assets/imgs/logo.svg" width="223" height="33"  className="img-fluid h-100 w-100" /> : <img id="Logo" alt="Manifest" src="/assets/imgs/logo-white.svg" width="223" height="33" className="img-fluid h-100 w-100" />}
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
                                            <Link href="/work"><a>Work</a></Link>
                                        </li>
                                        <li className="has-children">
                                            <Link href="#"><a>Solutions</a></Link>
                                            <ul className="sub-menu">
                                                <li>
                                                    <Link href="/sanity-cms"><a>Sanity API-1st CMS</a></Link>
                                                </li>
                                                <li>
                                                    <a href="https://www.datocms.com/" target="_blank" rel="noreferrer">DATO CMS*</a>
                                                </li>
                                                <li>
                                                    <a href="https://strapi.io/" target="_blank" rel="noreferrer">Strapi Extensible API CMS*</a>
                                                </li>
                                                <li>
                                                    <a href="https://www.netlifycms.org/" target="_blank" rel="noreferrer">Netlify CMS*</a>
                                                </li>
                                                <li>
                                                    <a href="https://developer.wordpress.org/rest-api/" target="_blank" rel="noreferrer">WordPress RESTful API*</a>
                                                </li>
                                                <li>
                                                    <a className="ml-2">*external link.</a>
                                                </li>
                                            </ul>
                                        </li>
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
                                <div className="burger-icon burger-icon-white" onClick={handleOpen}>
                                    <span className="burger-icon-top" /><span className="burger-icon-mid" /><span className="burger-icon-bottom" />
                                </div>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="block-signin">
                                <Link href="/#get-started"><a className="btn btn-default hover-up icon-arrow-right">Get Started</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </>
    );
};

export default Header;