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

function Index3() {
    const [isOpen, setOpen] = useState(false);
    return (
        <>

            <Layout>
                <section className="section-box">
                    <div className="banner-hero banner-3">
                        <div className="container">
                            <div className="text-center">
                                <h1 className="text-display-2 color-gray-900 mt-40">Forward thinking<br className="d-lg-block d-none" /> solutions</h1>
                                <div className="text-body-lead-large color-gray-600 mt-60">We harness innovative software<br className="d-lg-block d-none" />to provide your performant digital experiences.</div>
                                <div className="mt-60">
                                    <Link href="/get-started"><a className="btn btn-black icon-arrow-right-white mb-15">Get Started</a></Link>
                                    <Link href="/capabilities"><a className="btn btn-default icon-arrow-right color-gray-900 ml-20 btn-mb mb-15">Our Capabilities</a></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="section-box overflow-visible mt-80">
                    <div className="container">
                        <h2 className="text-heading-6 text-center color-gray-900 mb-60">Powered by the Best Software on Earth</h2>
                        <div className="row">
                            <div className="col-lg-12">
                                <ul className="list-partners">
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-1.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-2.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-3.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-4.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-5.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-6.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-7.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-8.svg" />
                                        </a></Link>
                                    </li>                                        <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Agon" src="assets/imgs/slider/logo/sample-logo-9.svg" />
                                        </a></Link>
                                    </li>                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="section-box">
                    <div className="section-box mt-70">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-1" />
                                <div className="col-lg-10">
                                    <div className="box-image">
                                            <a className="popup-youtube btn-play-video btn-play-middle" onClick={() => setOpen(true)}></a>
                                        <img className="img-responsive bdrd-16" src="assets/imgs/page/homepage3/img-banner-video.png" alt="Agon" /></div>
                                </div>
                                <div className="col-lg-1" />
                            </div>
                        </div>
                    </div>
                    <div className="section-box mt-100">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-1 col-sm-1 col-12" />
                                <div className="col-lg-10 col-sm-10 col-12 text-center">
                                    <h2 className="text-heading-1 color-gray-900 mb-10">We harness innovation</h2>
                                    <p className="text-body-lead-large color-gray-600 mt-20">Manifest is a creative digital agency that offers branding, design, and innovative web technology to forward thinking businesses and brands. Our forward-thinking approach leverages thoughful creativity and cutting-edge software and technology to give value-rich experiences to our parters.</p>
                                </div>
                                <div className="col-lg-1 col-sm-1 col-12" />
                            </div>
                        </div>
                        <div className="container mt-40">
                            <div className="row">
                                <div className="col-lg-4 col-md-12 col-sm-12">
                                    <div className="list-icons mt-50">
                                        <div className="item-icon"><span className="icon-left"><img src="/assets/imgs/page/homepage2/icon-acquis.svg" alt="Branding" /></span>
                                            <h4 className="text-heading-4">Branding</h4>
                                            <p className="text-body-text color-gray-600 mt-15">Manifest your ideas or evolve your current brand through customer awareness and loyalty achieved with inspired design and strategy.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12 col-sm-12">
                                    <div className="list-icons mt-50">
                                        <div className="item-icon"><span className="icon-left"><img src="/assets/imgs/page/homepage2/icon-active.svg" alt="Design" /></span>
                                            <h4 className="text-heading-4">Design</h4>
                                            <p className="text-body-text color-gray-600 mt-15">Offer consistently beautiful experiences across digital and print media with thoughtfully crafted design.
    </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12 col-sm-12">
                                    <div className="list-icons mt-50">
                                        <div className="item-icon"><span className="icon-left"><img src="/assets/imgs/page/homepage2/icon-retent.svg" alt="Software" /></span>
                                            <h4 className="text-heading-4">Software</h4>
                                            <p className="text-body-text color-gray-600 mt-15">Reach customers near and far by leveraging cutting-edge software solutions for mobile and web applications.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-box">
                    <div className="container mt-120">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 block-img-we-do"><img className="bdrd-16 img-responsive" src="assets/imgs/work/work-newark-thrives.png" alt="Newark Thrives" /></div>
                            <div className="col-lg-6 col-sm-12 block-we-do">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Design</span>
                                <span className="tag-1 bg-6 color-green-900 px-4 py-2 rounded-md">Development</span>
                                <h3 className="text-heading-1 mt-30">Newark Thrives</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">UI/UX Design, Digital Strategy, Progressive Web Application Software Development</p>
                                <div className="line-bd-green mt-50" />
                                <div className="row">
                                    <div className="col-12 mt-50">
                                        <h2 className="text-heading-7 text-center color-gray-900 mb-10">Powered by</h2>
                                        <ul className="list-partners">
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Adobe" src="assets/imgs/logos/adobe.png" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Bootstrap" src="assets/imgs/logos/tailwindcss.png" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Strapi CMS" src="assets/imgs/logos/strapi.png" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Next.js" src="assets/imgs/logos/nextjs.png" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Vercel" src="assets/imgs/logos/vercel.png" />
                                                </a></Link>
                                            </li>                              
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="section-box">
                    <div className="container mt-100">
                        <div className="row">
                            <div className="col-lg-8">
                                <h3 className="text-heading-1 mb-10">Research & News</h3>
                                <p className="text-body-lead-large color-gray-600">The latest from our blog.</p>
                            </div>
                            <div className="col-lg-4 text-lg-end text-start pt-30">
                                <Link href="/blog"><a className="btn btn-black icon-arrow-right-white">View More
                                </a></Link>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-90">
                        <div className="row">
                            <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                <div className="card-grid-style-4"><span className="tag-dot">Our Partners</span>
                                    <Link href="/blog-single"><a className="text-heading-4">Explore North Carolina Waterfalls</a></Link>

                                    <div className="grid-4-img color-bg-5">
                                        <Link href="/blog-single"><a><img src="/assets/imgs/blog/partner-explore-north-carolina-waterfalls.jpg" alt="Agon" />
                                        </a></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                <div className="card-grid-style-4"><span className="tag-dot">Software Solutions</span>
                                    <Link href="/blog-single"><a className="text-heading-4">The Benefits of Choosing a Headless CMS
                                    </a></Link>

                                    <div className="grid-4-img color-bg-5">
                                        <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-2.png" alt="Agon" />
                                        </a></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                <div className="card-grid-style-4"><span className="tag-dot">Software Solutions</span>
                                    <Link href="/blog-single"><a className="text-heading-4">Our Preferred Headless CMS and API</a></Link>

                                    <div className="grid-4-img color-bg-5">
                                        <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-3.png" alt="Agon" />
                                        </a></Link>
                                    </div>
                                </div>
                            </div>
                       
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

export default Index3;