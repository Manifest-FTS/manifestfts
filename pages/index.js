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
                                <div className="text-body-lead-large color-gray-600 mt-60">We harness innovative software<br className="d-lg-block d-none" />to craft valuable digital experiences.</div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="section-box overflow-visible mt-80">
                    <div className="container">
                        <h2 className="text-heading-6 text-center color-gray-900 mb-60">emPowered by the Best Software on Earth</h2>
                        <div className="row">
                            <div className="col-lg-12">
                                <ul className="list-partners border-0 pb-0">
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Adobe" src="assets/imgs/logos/adobe.svg" />
                                        </a></Link>
                                    </li>  
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Figma Vector Logo" src="assets/imgs/logos/figma.svg" />
                                        </a></Link>
                                    </li> 
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Netlify CMS Vector Logo" src="assets/imgs/logos/netlifycms.svg" />
                                        </a></Link>
                                    </li> 
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Wordpress CMS Vector Logo" src="assets/imgs/logos/wordpress.svg" />
                                        </a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Strapi CMS Vector Logo" src="assets/imgs/logos/strapi.svg" />
                                        </a></Link>
                                    </li> 
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Sanity CMS Vector Logo" src="assets/imgs/logos/sanity.svg" />
                                        </a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="React.js Vector Logo" src="assets/imgs/logos/reactjs.svg" />
                                        </a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Next.js" src="assets/imgs/logos/nextjs.svg" />
                                        </a></Link>
                                    </li>                                        
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="TailwindCSS" src="assets/imgs/logos/tailwindcss.svg" />
                                        </a></Link>
                                    </li>        
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="HTML5 Vector Logo" src="assets/imgs/logos/html5.svg" />
                                        </a></Link>
                                    </li>   
                                    <li> 
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Bootstrap Vector Logo" src="assets/imgs/logos/bootstrap.svg" />
                                        </a></Link>
                                    </li>   
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Netlify Vector Logo" src="assets/imgs/logos/netlify.svg" />
                                        </a></Link>
                                    </li>   
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Pantheon" src="assets/imgs/logos/pantheon.svg" />
                                        </a></Link>
                                    </li>
                                    <li>
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Vercel Vector Logo" src="assets/imgs/logos/vercel.svg" />
                                        </a></Link>
                                    </li>   
                                    <li>  
                                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Heroku Vector Logo" src="assets/imgs/logos/heroku.svg" />
                                        </a></Link>
                                    </li>                            
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="section-box">
                    <div className="container mt-120">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 block-img-we-do"><img className="bdrd-16 img-responsive" src="assets/imgs/work/work-barclay-rex.png" alt="Barclay Rex website on laptop" /></div>
                            <div className="col-lg-6 col-sm-12 block-we-do">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Work</span>
                                <h3 className="text-heading-1 mt-30">Barclay Rex</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">Digital e-Commerce Strategy, Progressive Web Application Development</p>
                                <Link href="https://barclayrex.com" target="_blank"><a className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3">Visit Website</a></Link>
                                <div className="row">
                                    <div className="col-12 mt-50">
                                        <h2 className="text-heading-7 text-center color-gray-900 mb-10">Powered by</h2>
                                        <ul className="list-partners border-0">
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Adobe" src="assets/imgs/logos/adobe.svg" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Bootstrap" src="assets/imgs/logos/tailwindcss.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Strapi CMS" src="assets/imgs/logos/strapi.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Next.js" src="assets/imgs/logos/nextjs.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Vercel" src="assets/imgs/logos/vercel.svg" />
                                                </a></Link>
                                            </li>                              
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-box pt-100 pb-100 mt-100 bg-green-900">
                    <div className="d-flex justify-content-center">
                        <Link href="/#get-started"><a className="btn btn-black icon-arrow-right-white mb-15">Get Started</a></Link>
                        <Link href="/sanity-cms"><a className="btn btn-default icon-arrow-right color-gray-900 ml-20 btn-mb mb-15">Our Solutions</a></Link>
                    </div>
                </section>
            

                <section className="section-box">
                    <div className="section-box mt-70">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-1 col-sm-1 col-12" />
                                <div className="col-lg-10 col-sm-10 col-12 text-center">
                                    <div className="d-flex p-40 justify-content-center">
                                        <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Software Solutions</span>
                                    </div>
                                    <h2 className="text-heading-1 color-gray-900 mb-10">A CMS that allures you<br/>to edit content</h2>
                                    <p className="text-body-lead-large color-gray-600 mt-20">Sanity has a long list of technical benefits. The ease of editing provides a rich experience and long-lasting value to our clients.</p>
                                </div>
                                <div className="col-lg-1 col-sm-1 col-12" />
                            </div>
                        </div>
                        <div className="container mt-50">
                            <div className="row">
                                <div className="col-lg-1" />
                                    <div className="col-lg-10">
                                        <div className="box-image">
                                            <img className="img-responsive bdrd-16 shadow" src="assets/imgs/sanitycms.gif" alt="Sanity CMS" />
                                        </div>
                                </div>
                                <div className="col-lg-1" />
                            </div>
                        </div>
                    </div>
                    <div className="section-box mt-10">
                        
                        <div className="container mt-40">
                            <div className="row">
                                <div className="col-lg-4 col-md-12 col-sm-12">
                                    <div className="list-icons mt-50">
                                        <div className="item-icon border-0">
                                            <h4 className="text-heading-4">Real-Time Collaboration</h4>
                                            <p className="text-body-text color-gray-600 mt-15">Track changes with live multi-user editing, visual cues, and communication tools.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12 col-sm-12">
                                    <div className="list-icons mt-50">
                                        <div className="item-icon border-0">
                                            <h4 className="text-heading-4">Content First Experience</h4>
                                            <p className="text-body-text color-gray-600 mt-15">An inituive administrative interface with no software to manage means you're never blocked from editing content.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12 col-sm-12">
                                    <div className="list-icons mt-50">
                                        <div className="item-icon border-0">
                                            <h4 className="text-heading-4">Powerful Solution</h4>
                                            <p className="text-body-text color-gray-600 mt-15">It's powerful API allows manifestation of dynamic relational systems and ecommerce platforms.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Link href="/sanity-cms"><a className="btn btn-black icon-arrow-right-white mb-15">Overview of Sanity CMS</a></Link>
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