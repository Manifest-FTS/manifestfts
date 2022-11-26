/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
const Footer = () => {
    return (
        <>
            <footer className="footer mt-50">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 width-20 mb-30">
                            <Image className="mx-auto w-50" alt="Manifest Forward Thinking Solutions" width="100" height="100" src="/assets/imgs/manifest-logo-mark-fts.svg" />
                        </div>
                        <div className="col-lg-3 width-20 mb-30">
                            <h4 className="text-heading-5">Manifest</h4>
                            <ul className="menu-footer mt-20">
                                <li>
                                    <Link href="/about">
                                        <a>About</a>
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
                                <Link href="/sanity-cms"><a>Sanity</a></Link>
                            </li>
                            <li>
                                <a href="https://www.datocms.com/" target="_blank" rel="noreferrer">DATO CMS</a>
                            </li>
                            <li>
                                <a href="https://strapi.io/" target="_blank" rel="noreferrer">Strapi</a>
                            </li>
                            <li>
                                <a href="https://www.netlifycms.org/" target="_blank" rel="noreferrer">Netlify CMS</a>
                            </li>
                            <li>
                                <a href="https://developer.wordpress.org/rest-api/" ><a target="_blank" rel="noreferrer">WordPress Rest API</a></a>
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
                                    <Link href="https://twitter.com/manifestfts">
                                        <a className="icon-socials icon-twitter"></a>
                                    </Link>
                                    <Link href="https://www.instagram.com/manifestfts">
                                        <a className="icon-socials icon-instagram"></a>
                                    </Link>
                                    <Link href="https://www.linkedin.com/company/manifest-fts">
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