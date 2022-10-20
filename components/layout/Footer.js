/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
const Footer = () => {
    return (
        <>
            <footer className="footer mt-50">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 width-20 mb-30">
                            <img className="mx-auto w-50" alt="Manifest Forward Thinking Solutions" src="assets/imgs/manifest-logo-mark-fts.svg" />
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
                                    <Link href="/blog">
                                        <a>Blog</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms">
                                        <a>Terms of Use</a>
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
                                    <Link href="/dato-cms">
                                        <a>DATO CMS</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/strapi-cms">
                                        <a>Strapi</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/netlify-cms">
                                        <a>Netlifys</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/wordpress-restful-api">
                                        <a>WordPress</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3 width-20 mb-30">
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
                        </div>
                        <div className="col-lg-3 width-16">
                            <h4 className="text-heading-5">Support</h4>
                            <ul className="menu-footer mt-20">
                                <li>
                                    <Link href="/#">
                                        <a>Client login</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#">
                                        <a>Pricing</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#">
                                        <a>Reviews</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom mt-20">
                        <div className="row">
                            <div className="col-md-6">
                                <span className="color-gray-400 text-body-lead">&copy; 2022 Manifest.</span>
                            </div>
                            <div className="col-md-6 text-center text-lg-end text-md-end">
                                <div className="footer-social">
                                    <Link href="https://facebook.com">
                                        <a className="icon-socials icon-facebook"></a>
                                    </Link>
                                    <Link href="https://twitter.com">
                                        <a className="icon-socials icon-twitter"></a>
                                    </Link>
                                    <Link href="https://www.instagram.com">
                                        <a className="icon-socials icon-instagram"></a>
                                    </Link>
                                    <Link href="https://www.linkedin.com">
                                        <a className="icon-socials icon-linkedin"></a>
                                    </Link>
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