/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/layout/Layout";
import 'react-modal-video/css/modal-video.css';
import Lottie from 'lottie-react';
import support from './../public/assets/anim/customer-service.json';
import TeamSlider from "../components/slider/Team";

// import FormProject from "../components/form-project/FormProject";
// import CounterUp from "../components/elements/CounterUp";
// import TestimonialSlider from "../components/slider/Testimonial";

const ModalVideo = dynamic(import("react-modal-video"), {
    ssr: false,
});

function About1() {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <Layout>
                <section className="section-box">
                    <div className="banner-hero banner-2 bg-about-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-7"><span className="tag-1 color-orange-900">Forward Thinking Team</span>
                                    <h1 className="text-display-3 mt-30">We harness innovation to manifest value for businesses and brands.</h1>
                                    <p className="text-body-lead-large color-gray-500 mt-40 pr-40">Manifest is a digital consultancy and software development agency that empowers forward-thinking brands through cutting-edge digital experiences.</p>
                                    <p className="text-body-lead-large color-gray-500 mt-40 pr-40">Our expertise spans brand and digital strategy, user experience design, software development, implementation, and data systems. We are a value-driven agency working with some of the most talented professionals to drive results.</p>
                                    <div className="mt-40">
                                        <Link href="/#get-started"><a
                                            className="btn btn-black shape-square icon-arrow-right-white">GET STARTED
                                        </a></Link>
                                        <Link href="mailto:hello@manifestfts.com"><a className="btn btn-link color-gray-900 icon-arrow-right text-heading-6">Join Our Team
                                        </a></Link>
                                    </div>
                                </div>
                                <div className="col-lg-5 d-none d-lg-block">
                                    <div className="banner-imgs">
                                        <img className="img-responsive shape-2" alt="Agon"
                                             src="assets/imgs/page/about/1/banner1.webp"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section-box">
                    <div className="container mt-110">
                        <div className="row">
                            <div className="col-lg-9 col-sm-8">
                                <h3 className="text-heading-1 mb-10">Our Team</h3>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-80">
                        <TeamSlider/>
                    </div>
                </section>
                <section className="section-box mt-100">
                    <div className="container">
                        <div className="text-center mb-20">
                            <div className="block px-0 rounded-md w-75 mx-auto mobAnim">
                                <Lottie animationData={support}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-2 col-sm-1 col-12"/>
                            <div className="col-lg-8 col-sm-10 col-12 text-center">
                                <h2 className="text-heading-1 color-gray-900">Call, text, or email.</h2>
                                <p className="text-body-lead-large color-gray-600 mt-20">We value our partners and your
                                    concerns. Connect with us on your terms, no inquiry is too small. </p>
                            </div>
                            <div className="col-lg-2 col-sm-1 col-12"/>
                        </div>
                    </div>
                </section>

                <section className="section-box pt-60 pb-60 mt-100 bg-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <Link href="/#get-started"><a
                                        className="btn btn-default icon-arrow-right color-gray-900 ml-20 btn-mb mb-15">Get
                                        Started</a></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-box mt-100">
                    <div className="container">
                        <div className="text-center mb-20"><span
                            className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Core Capabilities</span>
                        </div>
                        <div className="row">
                            <div className="col-lg-2 col-sm-1 col-12"/>
                            <div className="col-lg-8 col-sm-10 col-12 text-center">
                                <h2 className="text-heading-1 color-gray-900">Forward thinking solutions</h2>
                                <p className="text-body-lead-large color-gray-600 mt-20">Our forward-thinking approach
                                    leverages thoughful creativity, cutting-edge software and technology to give
                                    value-rich experiences to our partners.</p>
                            </div>
                            <div className="col-lg-2 col-sm-1 col-12"/>
                        </div>
                    </div>
                    <div className="container mt-70">
                        <div className="row">
                            <div className="col-lg-4 col-sm-12">
                                <div className="card-grid-style-6 bg-transparent pb-40 mb-30">
                                    <div className="grid-1-img"><img src="/assets/imgs/icon-branding.webp" alt="Branding"
                                                                     height="100"/></div>
                                    <h3 className="text-heading-3 mt-20">Branding</h3>
                                    <p className="text-body-excerpt mt-20">Manifest your ideas or evolve your current
                                        brand through customer awareness and loyalty achieved with inspired design and
                                        strategy.</p>
                                    {/* <div className="mt-30">
                                        <Link href="/capabilities#branding"><a className="btn btn-default icon-arrow-right">Learn more about our Branding Solutions
                                        </a></Link>
                                    </div> */}
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-12">
                                <div className="card-grid-style-6 bg-transparent pb-40 mb-30">
                                    <div className="grid-1-img"><img src="/assets/imgs/icon-design.webp" alt="Design"
                                                                     height="100"/></div>
                                    <h3 className="text-heading-3 mt-20">Design</h3>
                                    <p className="text-body-excerpt mt-20">Offer consistently beautiful experiences
                                        across digital and print media with thoughtfully crafted design.</p>
                                    {/* <div className="mt-30">
                                        <Link href="/capabilities#design"><a className="btn btn-default icon-arrow-right">Learn more about our Design Solutions
                                        </a></Link>
                                    </div> */}
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-12">
                                <div className="card-grid-style-6 bg-transparent pb-40 mb-30">
                                    <div className="grid-1-img"><img src="/assets/imgs/monitor.webp" alt="Software"
                                                                     height="100"/></div>
                                    <h3 className="text-heading-3 mt-20">Software</h3>
                                    <p className="text-body-excerpt mt-20">Reach customers near and far by leveraging
                                        cutting-edge software solutions for mobile and web applications.</p>
                                    {/* <div className="mt-30">
                                        <Link href="/capabilities#software"><a className="btn btn-default icon-arrow-right">Learn more about our Software Solutions
                                        </a></Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


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

export default About1;