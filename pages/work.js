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
                {/* // Barclay */}
                <section className="section-box">
                    <div className="container mt-120">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 block-img-we-do"><img className="bdrd-16 img-responsive" src="assets/imgs/work/work-barclay-rex.png" alt="Barclay Rex website on laptop" /></div>
                            <div className="col-lg-6 col-sm-12 block-we-do">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Strapi Extensible CMS API</span>
                                <h3 className="text-heading-1 mt-30">Barclay Rex</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">Barclay Rex has become one of the top tobacconists in New York City and is the last family-owned tobacconist in the city with over 111 years of service and excellence in fine tobacco</p>
                                <p className="text-body-lead-large color-gray-600 mt-30">Digital e-Commerce Strategy, Progressive Web Application Development</p>
                                <a href="https://barclayrex.com" target="_blank" rel="noreferrer" className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3">Visit Website</a>
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

                {/* // Ozone */}
                <section className="section-box">
                    <div className="container mt-120">
                        <div className="row">
                            
                            <div className="col-lg-6 col-sm-12 block-we-do">
                                <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">Sanity + WordPress Hybrid</span>
                                <h3 className="text-heading-1 mt-30">OZONE</h3>
                                <p className="text-body-lead-large color-gray-600 mt-30">Ozone paragliders and kites are one of the world's leading paragliding, paramotoring, kitesurf, snow kite and power kite manufacturers</p><p className="text-body-lead-large color-gray-600 mt-30">E-Commerce Web Application Development</p>
                                <a href="https://flyozone.com/" target="_blank" rel="noreferrer" className="btn icon-arrow-right color-gray-900 text-body-lead mb-15 mt-30 pl-0 pr-12 py-3">Visit Website</a>
                                <div className="row">
                                    <div className="col-12 mt-50">
                                        <h2 className="text-heading-7 text-center color-gray-900 mb-10">Powered by</h2>
                                        <ul className="list-partners border-0">
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Figma" src="assets/imgs/logos/figma.svg" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Sanity CMS" src="assets/imgs/logos/sanity.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="WordPress" src="assets/imgs/logos/wordpress.svg" />
                                                </a></Link>
                                            </li>  
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="React.js" src="assets/imgs/logos/reactjs.svg" />
                                                </a></Link>
                                            </li>
                                            <li>
                                                <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="Vue.js" src="assets/imgs/logos/vuejs.svg" />
                                                </a></Link>
                                            </li>                             
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-sm-12 block-img-we-do"><img className="bdrd-16 img-responsive" src="assets/imgs/work/work-ozone.png" alt="Ozone's website on laptop" /></div>
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