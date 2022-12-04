import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Newsletter() {
  return (
    <section className="section-box overflow-visible mb-100">
        <div className="container mt-100">
            <div className="row">
                <div className="col-lg-10 mx-auto">
                    <div className="bg-2 box-newsletter position-relative">
                        <div className="row">
                            <div className="col-lg-5 col-md-7"><span className="text-body-capitalized color-gray-500 text-uppercase">newsletter</span>
                                <h4 className="text-heading-2 mb-10 mt-10">Subscribe our newsletter</h4>
                                <p className="text-body-text color-gray-500">By clicking the button, you are agreeing with our</p>
                                <Link href="/page-terms"><a>Term &amp; Conditions
                                </a></Link>

                                <div className="box-form-newsletter mt-30">
                                    <form className="form-newsletter"><input className="input-newsletter"  placeholder="Enter you mail .." /><button className="btn btn-send" /></form>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-5 mt-30 mt-lg-0 mt-md-30 mt-sm-30 position-relative text-end">
                                <div className="block-chart shape-1">
                                    <Image src="/assets/imgs/template/chart.png" alt="Chart" width={100} height={100} /></div><Image src="/assets/imgs/template/chart.png" className="img-responsive img-newsletter" src="assets/imgs/template/img-newsletter.png" alt="Manifest" width={100} height={100} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Newsletter