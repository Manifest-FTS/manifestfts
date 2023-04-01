import { useRouter } from 'next/router'

import Layout from '../../../components/layout/Layout';
import { useEffect } from 'react';

export default function FundingSuccess() {
  const router = useRouter();
  // useEffect(() => {
  //   console.log('arun jha', router.query.payment_intent)
  //   // if ((router.query.payment_intent && !router.query.payment_intent.length) || !router.query.payment_intent) router.push('/404')
  // }, [router.query.payment_intent])

  return (
    <Layout>
      <section className="section-box bg-red-100">
        <div className="banner-hero banner-2 bg-about-1 bg-green-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-9"><span className="tag-1 bg-5 color-green-900 mr-20 px-4 py-2 rounded-md">Funding</span>
                {/* <h1 className="text-display-3 mt-30">Payment</h1> */}


              </div>
            </div>
          </div>
        </div>
        {/* Header End */}

        {/* Payment Start */}
        <div className="container mt-50 box-gray-100">
          <div className="row">
            <h2 className="text-center">Thanks for the Donation!</h2>
          </div>
        </div>
      </section>
    </Layout>

  )
}