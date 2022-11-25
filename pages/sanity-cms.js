/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Accordion from "../components/elements/Accordion";
import Layout from "../components/layout/Layout";
import OfferSlider from "../components/slider/Offer";


function Service2() {
    return (
        <>

            <Layout>
                <section className="section-box">
                    <div className="banner-hero bg-service-2">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <h1 className="text-display-2">Sanity <span className="color-green-900">API-1st</span> CMS</h1>
                                    <p className="text-body-lead-large color-gray-500 mt-40 pr-40">Sanity is one of the most flexible platforms for creating data driven content applications.</p>
                                    <div className="mt-40 text-center">
                                        <Link href="/page-about-1"><a className="btn btn-black icon-arrow-right-white">Get Started</a></Link>

                                        <Link href="https://sanity.io" target="_blank"><a className="btn btn-link icon-arrow-right color-gray-900 ml-10">Visit Sanity.io</a></Link>
                                    </div>
                                </div>
                                <div className="col-lg-12 d-none d-lg-block">
                                    <div className="row">
                                        <div className="col-lg-2" />
                                        <div className="col-lg-8">
                                            <div className="banner-imgs">
                                                {/* <div className="block-1 shape-2"><img src="/assets/imgs/page/services/2/banner2.png" alt="Agon" /></div>
                                                <div className="block-2 shape-2"><img src="/assets/imgs/page/services/2/banner1.png" alt="Agon" /></div>
                                                <div className="block-3 shape-2"><img src="/assets/imgs/page/services/2/banner3.png" alt="Agon" /></div> */}
                                                <img src="/assets/imgs/sanitycms.gif" alt="Sanity CMS" />
                                            </div>
                                        </div>
                                        <div className="col-lg-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="section-box">
                    <div className="container mt-70 re-order">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 mb-30 first">
                                <h3 className="text-heading-1 mt-30">Ease of Use<br/><span className="color-violet-600">10 of 10</span></h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">It should be quick and straightforward for you to make changes to the content on your site after publishing it. Sanity gives you the benefits of page builders without limiting where your content can go.</p>
                                <p className="text-body-lead-large color-gray-600 mt-30">Sanity supports localization, language translations and allows you to preview everything before publishing.</p>
                            </div>
                            <div className="col-lg-6 col-sm-12 second">
                                <div className="inner-image"><img className="bdrd-16 img-responsive" src="assets/imgs/sanityease.webp" alt="Agon" />
                                    {/* <div className="block-image-bottom"><img className="bdrd-16 img-responsive" src="assets/imgs/page/homepage2/img-built-2.png" alt="Agon" /></div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mt-70">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                <div className="inner-image"><img className="bdrd-16 img-responsive" src="assets/imgs/sanitycollab.webp" alt="Agon" />
                                    {/* <div className="block-image-bottom"><img className="bdrd-16 img-responsive" src="assets/imgs/page/homepage2/img-built-2.png" alt="Agon" /></div> */}
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-12 mb-30">
                                <h3 className="text-heading-1 mt-30">Collaboration<br/><span className="color-violet-600">10 of 10</span></h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">A content management system should allow coworkers from anywhere to work together. A good CMS also includes versioning to allow admins to review and roll back content changes. Sanity shines in this regard with real-time collaboration and visual cues. No locking or overwriting, just sane content editing.</p>
                            </div>
                        </div>
                    </div>

                    <div className="container mt-70 re-order">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 mb-30 first">
                                <h3 className="text-heading-1 mt-30">Search Engine Optimization<br/><span className="color-violet-600">9 of 10</span></h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">Search Engine Optimization is essential to give your business visibility. More traffic is more opportunities to convert prospects into customers. Sanity’s <a href="https://www.sanity.io/plugins/sanity-plugin-seo-tools" target="_blank" className="font-bold">SEO Tools</a> uses YoastSEO.js bringing the familiarity of Yoast SEO into Sanity.</p>
                                <p className="text-body-lead-large color-gray-600 mt-30">We give SEO a 9 out of 10 due to the additional times it takes to configre for each project. Don’t worry, each project comes with SEO Tools configured and ready to go.
                                </p>
                            </div>
                            <div className="col-lg-6 col-sm-12 second">
                                <div className="inner-image"><img className="bdrd-16 img-responsive" src="assets/imgs/sanityseo.gif" alt="Sanity SEO" />
                                    {/* <div className="block-image-bottom"><img className="bdrd-16 img-responsive" src="assets/imgs/page/homepage2/img-built-2.png" alt="Agon" /></div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-box pt-60 pb-60 mt-100 bg-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <Link href="/get-started"><a className="btn btn-default icon-arrow-right color-gray-900 ml-20 btn-mb mb-15">Get Started</a></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>

        </>
    )
}

export default Service2;