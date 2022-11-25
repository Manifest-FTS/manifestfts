/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "../components/layout/Layout";


function Terms() {
    return (
        <>
            <Layout>
                <section className="section-box mt-50 mb-50">
                    <div className="container text-center">
                        <h1 className="text-heading-1">Policy</h1>
                    </div>
                </section>
                <section className="section-box mt-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 mx-auto">
                                <div className="row">
                                    <div className="col-lg-2">
                                        <div className="table-of-content">
                                            <h6 className="mb-15">Table of content</h6>
                                            <ul>
                                                <li>
                                                    <Link href="#section-1"><a>Your Data</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-1"><a>Your Personal Data</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-1"><a>Your Non-Personal Data</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-2"><a>Cookies</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-4"><a>Consent</a></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="single-detail">
                                            <h6 className="mt-50">- Last Updated November 25, 2022 -</h6>
                                            <p>This is the Privacy Policy of Super Distros LLC dba Manifest FTS (&ldquo;Manifest&rdquo;). If you have any concerns about privacy and personal data you may contact dp@manifestfts.com.</p>
                                            <p>This Privacy Policy is part of our Terms of Service: <Link href="/terms"><a>https://manifestfts.com/terms</a></Link>.</p>
                                            
                                            <h6 className="mt-35 mb-25" id="section-1">Your data</h6>
                                            <p>Manifest collects personal and non-personal information such as name, address, contact phone number, email, browser type, operating system, referring website, and the date and time of each website visit. We may also collect personal information that you volunteer when you subscribe to our newsletter, fill out a form, or engage in services with us.</p>

                                            <h6 className="mt-35 mb-25" id="section-2">How We Use Your Personal Data?</h6>
                                            <p>Manifest&rsquo;s primary purpose in collecting personal information is to communicate with you, personalize you ruser experience, and to send you relevent information. We will never sell, lease, or share your data with third-parties without your notice.</p>

                                            <h6 className="mt-35 mb-25" id="section-3">How We Use Your Non-Personal Data?</h6>
                                            <p>Non-Personal data or data provided for use in The Customer&rsquo;s paid services are used to fulfull paid services. This data may be used by the software solutions used is said services according to the software solution&rsquo;s own privacy policies.</p>
                                            
                                            <h6 className="mt-35 mb-25" id="section-4">Cookies</h6>
                                            <p>Cookies are small data stores used by websites that are stored on a visitor&rsquo;s computer and that the visitor&rsquo;s browser provides to the website each time the visitor returns. Manifest uses cookies to identify visitors, improve their user experience and to track their usage of our website. Visitors who do not wish to have cookies placed on their computer can disable cookies within their browser before accessing our website.</p>

                                            <h6 className="mt-35 mb-25" id="section-5">Consent</h6>
                                            <p>By using the Manifest website, you consent to this privacy policy.

</p>
                                            
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-2">
                                        <h3 className="text-heading-6 color-gray-400 mb-20 mt-150">Share</h3>
                                        <Link href="https://facebook.com"><a className="share-social share-fb" target="_blank" rel="noreferrer" rel="noreferrer" ></a></Link><br />
                                        <Link href="https://twitter.com"><a className="share-social share-tw" target="_blank" rel="noreferrer" rel="noreferrer" ></a></Link><br />
                                        <Link href="https://www.pinterest.com"><a className="share-social share-pi" target="_blank" rel="noreferrer" rel="noreferrer" ></a></Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section-box overflow-visible mb-100">
                    <div className="container mt-100">
                        <div className="row">
                            <div className="col-lg-10 mx-auto">
                                <div className="bg-6 box-newsletter position-relative">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-7"><span className="text-body-capitalized color-gray-500 text-uppercase">newsletter</span>
                                            <h4 className="text-heading-2 mb-10 mt-10">Subscribe our newsletter</h4>
                                            <p className="text-body-text color-gray-500">By clicking the button, you are agreeing with our</p>
                                            <Link href="/page-terms"><a>Term &amp; Conditions</a></Link>

                                            <div className="box-form-newsletter mt-30">
                                                <form className="form-newsletter"><input className="input-newsletter"  placeholder="Enter you mail .." /><button className="btn btn-send" /></form>
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-5 mt-30 mt-lg-0 mt-md-30 mt-sm-30 position-relative text-end">
                                            <div className="block-chart shape-1"><img src="/assets/imgs/template/chart.png" alt="Agon" /></div><img className="img-responsive img-newsletter" src="assets/imgs/template/img-newsletter.png" alt="Agon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </Layout>

        </>
    )
}

export default Terms;