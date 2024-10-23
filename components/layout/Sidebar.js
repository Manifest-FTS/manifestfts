/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const Sidebar = ({ openClass }) => {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    });

    const handleToggle = (key) => {        
        if (isActive.key === key) {
            setIsActive({
                status: false,
            });
        } else {
            setIsActive({
                status: true,
                key,
            });
        }
    };
    return (
        <>
            <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${openClass}`}>
                <PerfectScrollbar className="mobile-header-wrapper-inner">
                    <div className="mobile-header-top">
                        <div className="user-account">
                            {/* <img src="/assets/imgs/template/ava_1.png" alt="Agon" /> */}
                            <div className="content">
                                <h6 className="user-name">
                                    Menu
                                </h6>
                                <p className="font-xs text-muted">
                                    Click outside menu to close.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mobile-header-content-area">
                        <div className="perfect-scroll">
                            <div className="mobile-menu-wrap mobile-header-border">
                                <nav>
                                    <ul className="mobile-menu font-heading">
                                        <li>
                                            <Link href="/work"><a className="active">Work</a></Link>
                                        </li>
                                        {/* <li className={isActive.key == 2 ? "has-children active" : "has-children"}>
                                            <span onClick={() => handleToggle(2)} className="menu-expand"><i className="fi-rr-angle-small-down"></i></span>

                                            <Link href="/about"><a>Manifest</a></Link>
                                            <ul className={isActive.key == 2 ? "sub-menu d-block" : "sub-menu d-none"}>
                                                <li>

                                                    <Link href="/about"><a>About</a></Link>
                                                </li>
                                                <li>

                                                    <Link href="/get-started"><a>Contact</a></Link>
                                                </li>
                                            </ul>
                                        </li> */}
                                        <li onClick={() => handleToggle(3)} className={isActive.key == 3 ? "has-children active" : "has-children"}>
                                            <span className="menu-expand"><i className="fi-rr-angle-small-down"></i></span>

                                            <Link href="#"><a>Case Study</a></Link>
                                            <ul className={isActive.key == 3 ? "sub-menu d-block" : "sub-menu d-none"}>
                                                <li>
                                                    <Link href="/case-study/barclay-rex"><a>Barclay Rex</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="/sanity-cms"><a>Sanity API-1st CMS</a></Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link href="/ahead-with-fts"><a className="/about" title="FTS Blog">Ahead with FTS</a></Link>
                                        </li>
                                        <li>
                                            <Link href="/about"><a className="/about">About</a></Link>
                                        </li>
                                        
                                        {/* <li className={isActive.key == 5 ? "has-children active" : "has-children"}>
                                            <span onClick={() => handleToggle(5)}  className="menu-expand"><i className="fi-rr-angle-small-down"></i></span>

                                            <Link href="/blog-1"><a>Blog</a></Link>
                                            <ul className={isActive.key == 5 ? "sub-menu d-block" : "sub-menu d-none"}>
                                                <li>

                                                    <Link href="/blog-1"><a className="closer">Blog 1</a></Link>
                                                </li>
                                                <li>

                                                    <Link href="/blog-2"><a className="closer">Blog 2</a></Link>
                                                </li>
                                                <li className="hr"><span /></li>
                                                <li>

                                                    <Link href="/blog-single"><a>Blog Single</a></Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className={isActive.key == 6 ? "has-children active" : "has-children"}>
                                            <span onClick={() => handleToggle(6)}  className="menu-expand"><i className="fi-rr-angle-small-down"></i></span>

                                            <Link href="/page-shop-grid-1"><a>Shop</a></Link>
                                            <ul className={isActive.key == 6 ? "sub-menu d-block" : "sub-menu d-none"}>
                                                <li>

                                                    <Link href="/page-shop-grid-1"><a className="closer">Shop Grid - 1</a></Link>
                                                </li>
                                                <li>

                                                    <Link href="/page-shop-grid-2"><a className="closer">Shop Grid - 2</a></Link>
                                                </li>
                                                <li>

                                                    <Link href="/shop/1"><a>Product Details</a></Link>
                                                </li>
                                            </ul>
                                        </li> */}
                                    </ul>
                                </nav>
                            </div>
                            {/* <div className="mobile-account">
                                <h6 className="mb-10">Your Account</h6>
                                <ul className="mobile-menu font-heading">
                                    <li>
                                        <Link href="/#"><a>Profile</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a>Work Preferences</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a>My Boosted Shots</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a>My Collections</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a>Account Settings</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a>Go Pro</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/page-login"><a>Sign Out</a></Link>
                                    </li>
                                </ul>
                            </div> */}
                            {/* <div className="site-copyright color-gray-400">
                                Copyright 2022 © Manifest FTS
                            </div> */}
                        </div>
                    </div>
                </PerfectScrollbar>
            </div>

        </>
    );
};

export default Sidebar;