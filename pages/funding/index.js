import { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from "../../components/stripe";
import Layout from '../../components/layout/Layout';

import * as config from '../../config'
import { fetchPostJSON } from '../../util/api-helpers';

export default function Funding() {
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    fetchPostJSON('/api/payment_intents', {
      amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    }).then((data) => {
      setPaymentIntent(data)
    })
  }, [setPaymentIntent])

  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

  return (
    <Layout>
      <section className="section-box bg-red-100">
        <div className="banner-hero banner-2 bg-about-1 bg-green-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-9"><span className="tag-1 bg-5 color-green-900 mr-20 px-4 py-2 rounded-md">About</span>
                <h1 className="text-display-3 mt-30">Payment</h1>


              </div>
            </div>
          </div>
        </div>
        {/* Header End */}

        {/* Payment Start */}
        <div className="container">
          <div className="row">
            {paymentIntent && paymentIntent.client_secret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentIntent.client_secret,
                }}
              >
                <PaymentForm paymentIntent={paymentIntent} />
              </Elements>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </section>
    </Layout>

  )
}