import React from 'react'
import Link from 'next/link'
import Accordion from '../elements/Accordion'

function Faqs() {
  return (
    <section className="section-box pt-140 pb-100">
        <div className="container">
            <div className="row">
                <div className="col-lg-5 mb-40">
                    <h3 className="text-heading-1">Frequently asked questions</h3>
                    <p className="text-body-text color-gray-600 mt-30">Feeling inquisitive? Have a read through some of our FAQs or contact our supporters for help</p>
                    <div className="row">
                        <div className="col-lg-12 mt-50">
                            <h4 className="text-heading-6 icon-leaf">Boost your sale</h4>
                            <p className="text-body-excerpt color-gray-600 mt-15">The latest design trends meet hand-crafted templates.</p>
                        </div>
                        <div className="col-lg-12 mt-50">
                            <h4 className="text-heading-6 icon-leaf">Introducing New Features</h4>
                            <p className="text-body-excerpt color-gray-600 mt-15">The latest design trends meet hand-crafted templates.</p>
                        </div>
                    </div>
                    <div className="mt-60">
                        <Link href="/page-contact"><a className="btn btn-black icon-arrow-right-white">Contact Us
                        </a></Link>
                        <Link href="/page-login"><a className="btn btn-link text-heading-6">Support Center
                        </a></Link>
                    </div>
                </div>
                <div className="col-lg-7">
                    <Accordion/>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Faqs