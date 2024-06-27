/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import 'react-modal-video/css/modal-video.css';
import Accordion from "../components/elements/Accordion";
import Faqs from "../components/faqs/Faqs";
import FormProject from "../components/form-project/FormProject";
import Layout from "../components/layout/Layout";
const ModalVideo = dynamic(import("react-modal-video"), {
    ssr: false,
});

function Work() {
    const [isOpen, setOpen] = useState(false);
    return (
        <>

            <Layout>
                <section className="section-box bg-red-100">
                    <div className="banner-hero banner-2 bg-about-1 bg-green-100">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-9"><span className="tag-1 bg-5 color-green-900 mr-20 px-4 py-2 rounded-md">Our Work</span>
                                    <h1 className="text-display-3 mt-30">We increase leads, sales, experiences and more for our valued partners.</h1>
                                    {/* <p className="text-body-lead-large color-gray-700 mt-40 pr-40">Manifest is a creative digital agency that offers branding, design, and innovative web technology to forward thinking businesses and brands. </p> */}

                                </div>
                                <div className="col-lg-5 d-none d-lg-block">
                                    {/* <div className="banner-imgs">
                                        <div className="block-1 shape-1"><img src="/assets/imgs/page/about/1/banner2.png" alt="Agon" /></div><img className="rounded img-responsive shape-2" alt="Agon" src="/assets/imgs/agencys1.jpg" />
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* // CCoalition on Race */}
                <section className="section-box">
                    <div className="container mt-120">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 block-img-we-do"><img className="bdrd-16 img-responsive" src="/assets/imgs/work/ccr-f1.webp" alt="Community Coalition on Race website on laptop" /></div>
                            <div className="col-lg-6 col-sm-12 block-we-do">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">NationBuilder Outreach Platform</span>
                                <h3 className="text-heading-1 mt-30">South Orange & Maplewood Community Coalition on Race</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">The South Orange/Maplewood Community Coalition on Race is a nationally recognized non-profit organization committed to building a unique, suburban community that is free of racial segregation.</p>
                                <p className="text-body-lead-large color-gray-600 mt-30">Strategic UI/UX in AdobeXD utlizing our partners existing brand, digital campaign strategy and search engine optimization.</p>
                                <a href="https://www.communitycoalitiononrace.org/" target="_blank" rel="noreferrer" className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3">Visit Website</a>
                                <div className="row">
                                    <div className="col-12 mt-50">
                                        <h2 className="text-heading-7 text-center color-gray-900 mb-10">Powered by</h2>
                                        <ul className="list-partners border-0">
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Adobe" src="/assets/imgs/logos/adobe.svg" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="NationBuilder" src="/assets/imgs/logos/nationbuilder-horizontal-black.svg" />
                                                </a></Link>
                                            </li>                         
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* // Garden State Equality */}
                <section className="section-box">
                    <div className="container mt-120 re-order">
                        <div className="row">
                            
                            <div className="col-lg-6 col-sm-12 block-we-do first">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">WordPress</span>
                                <h3 className="text-heading-1 mt-30">Garden State Equality</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">Garden State Equality lifts up the diverse voices of LGBTQ+ communities through education and advocacy to advance the movement for equality in New Jersey and nationally.</p>
                                <p className="text-body-lead-large color-gray-600 mt-30">Managed hosting, search engine optimization and digital strategy.</p>
                                <a href="https://www.gardenstateequality.org/" target="_blank" rel="noreferrer" className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3">Visit Website</a>
                                <div className="row">
                                    <div className="col-12 mt-50">
                                        <h2 className="text-heading-7 text-center color-gray-900 mb-10">Powered by</h2>
                                        <ul className="list-partners border-0">
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="WordPress" src="/assets/imgs/logos/wordpress.svg" />
                                                </a></Link>
                                            </li>                            
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-sm-12 block-img-we-do second"><img className="bdrd-16 img-responsive" src="/assets/imgs/work/gse-f1.webp" alt="Ozone's website on laptop" /></div>
                        </div>
                    </div>
                </section>


                {/* // Barclay */}
                <section className="section-box">
                    <div className="container mt-120">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 block-img-we-do"><img className="bdrd-16 img-responsive" src="/assets/imgs/work/rex-f1.webp" alt="Barclay Rex website on laptop" /></div>
                            <div className="col-lg-6 col-sm-12 block-we-do">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Strapi Extensible CMS API</span>
                                <h3 className="text-heading-1 mt-30">Barclay Rex</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">Barclay Rex has become one of the top tobacconists in New York City and is the last family-owned tobacconist in the city with over 111 years of service and excellence in fine tobacco</p>
                                <p className="text-body-lead-large color-gray-600 mt-30">Strategic UI/UX in AdobeXD utlizing our partners existing brand. Digital e-Commerce strategy, and progressive web application development with Strapi CMS/API.</p>
                                <div className="align-items-center">
                                    <Link href="/case-study/barclay-rex" passHref>
                                        <span className="btn btn-light icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 mr-10 pl-12 pr-12 py-3">View Case Study</span>
                                    </Link>
                                    <a href="https://barclayrex.com" target="_blank" rel="noreferrer" className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3">Visit Website</a>
                                </div>
                                <div className="row">
                                    <div className="col-12 mt-50">
                                        <h2 className="text-heading-7 text-center color-gray-900 mb-10">Powered by</h2>
                                        <ul className="list-partners border-0">
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Adobe" src="/assets/imgs/logos/adobe.svg" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Bootstrap" src="/assets/imgs/logos/tailwindcss.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Strapi CMS" src="/assets/imgs/logos/strapi.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Next.js" src="/assets/imgs/logos/nextjs.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Vercel" src="/assets/imgs/logos/vercel.svg" />
                                                </a></Link>
                                            </li>                              
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* // Ozone */}
                <section className="section-box">
                    <div className="container mt-120 re-order">
                        <div className="row">
                            
                            <div className="col-lg-6 col-sm-12 block-we-do first">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Sanity + WordPress Hybrid</span>
                                <h3 className="text-heading-1 mt-30">OZONE</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">Ozone paragliders and kites are one of the world's leading paragliding, paramotoring, kitesurf, snow kite and power kite manufacturers.</p><p className="text-body-lead-large color-gray-600 mt-30">Strategic development utlizing our partners existing brand and provided Figma UI/UX designs. Digital e-Commerce strategy, and e-commerce web application with Sanity API.</p>
                                <a href="https://flyozone.com/" target="_blank" rel="noreferrer" className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3">Visit Website</a>
                                <div className="row">
                                    <div className="col-12 mt-50">
                                        <h2 className="text-heading-7 text-center color-gray-900 mb-10">Powered by</h2>
                                        <ul className="list-partners border-0">
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Figma" src="/assets/imgs/logos/figma.svg" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Sanity CMS" src="/assets/imgs/logos/sanity.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="WordPress" src="/assets/imgs/logos/wordpress.svg" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="React.js" src="/assets/imgs/logos/reactjs.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Vue.js" src="/assets/imgs/logos/vuejs.svg" />
                                                </a></Link>
                                            </li>                             
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-sm-12 block-img-we-do second"><img className="bdrd-16 img-responsive" src="/assets/imgs/work/oz-f1.webp" alt="Ozone's website on laptop" /></div>
                        </div>
                    </div>
                </section>
        
                
                <FormProject/>

                <ModalVideo
                    channel="youtube"
                    autoplay
                    isOpen={isOpen}
                    videoId="7e90gBu4pas"
                    onClose={() => setOpen(false)}
                />

            </Layout>

        </>
    )
}

export default Work;