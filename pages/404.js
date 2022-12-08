/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "../components/layout/Layout";


function Error() {
    return (
        <>
            <Layout>
                <section className="section-box mt-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center mt-40">
                                <img className="img-responsive rounded-circle" src="/assets/imgs/404.jpg" alt="404. Manifest page not found." width="444" />
                                <h2 className="text-heading-1 color-gray-900 mb-20 mt-50">
                                    We&rsquo;re sorry!
                                </h2>
                                <p className="text-heading-5 color-gray-600 mt-30 mb-70">
                                    The page you requested no longer exists or never did.
                                </p>
                                <div className="text-center mb-50">
                                    <Link href="/">
                                    <a className="btn btn-black icon-arrow-left">Back to Homepage</a>
                                    
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </Layout>

        </>
    )
}

export default Error;