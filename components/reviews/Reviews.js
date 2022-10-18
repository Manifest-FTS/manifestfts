import Link from 'next/link'
import React from 'react'

export default function Reviews() {
  return (
        <section className="section-box pt-100 pb-100 mt-100 bg-orange-100">
        <div className="container">
            <div className="row">
                <div className="col-lg-5 mb-30"><span className="tag-1 bg-6 color-gray-900">Built Exclusively For You</span>
                    <h3 className="text-heading-1 mt-30">Don't take our word for it. See what our clients say.</h3>
                    <p className="text-body-lead-large color-gray-600 mt-30">Aliquam a augue suscipit, luctus neque purus ipsum neque at dolor primis libero tempus, blandit</p>
                    <div className="mt-40">
                        <Link href="/page-contact"><a className="btn btn-default btn-white icon-arrow-right">Learn More
                        </a></Link>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="row" data-masonry="{&quot;percentPosition&quot;: true }">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="card-grid-style-2 card-square hover-up mb-20">
                                <p className="text-body-text color-gray-600 text-comment">"No matter where you go, It's is the coolest, most happening thing around! Not able to tell you how happy I am with it."</p>
                                <div className="box-img-user">
                                    <div className="img-user img-user-round"><img src="/assets/imgs/page/homepage2/user-1.png" alt="Agon" /></div>
                                    <h4 className="text-body-lead color-gray-900 mb-5">Jane Cooper</h4>
                                    <p className="text-body-text-md">Biffco Enterprises Ltd.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="card-grid-style-2 card-square hover-up mb-20">
                                <p className="text-body-text color-gray-600 text-comment">"Wow what great service, I love it! It's is the most valuable business resource we have EVER purchased. We can't understand how we've been living without it. I couldn't have asked for more than this."</p>
                                <div className="box-img-user">
                                    <div className="img-user img-user-round"><img src="/assets/imgs/page/homepage2/user-2.png" alt="Agon" /></div>
                                    <h4 className="text-body-lead color-gray-900 mb-5">Wade Warren</h4>
                                    <p className="text-body-text-md">Krusty Krab</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="card-grid-style-2 card-square hover-up mb-20">
                                <p className="text-body-text color-gray-600 text-comment">"Your company is truly upstanding and is behind its product 100%. It's the perfect solution for our business. It has really helped our business. Needless to say we are extremely satisfied with the results."</p>
                                <div className="box-img-user">
                                    <div className="img-user img-user-round"><img src="/assets/imgs/page/homepage2/user-3.png" alt="Agon" /></div>
                                    <h4 className="text-body-lead color-gray-900 mb-5">Leslie Alexander</h4>
                                    <p className="text-body-text-md">Biffco Enterprises Ltd.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="card-grid-style-2 card-square hover-up mb-20">
                                <p className="text-body-text color-gray-600 text-comment">"It's is both attractive and highly adaptable. It's exactly what I've been looking for. Definitely worth the investment."</p>
                                <div className="box-img-user">
                                    <div className="img-user img-user-round"><img src="/assets/imgs/page/homepage2/user-4.png" alt="Agon" /></div>
                                    <h4 className="text-body-lead color-gray-900 mb-5">Jenny Wilson</h4>
                                    <p className="text-body-text-md">Soylent Corp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}
