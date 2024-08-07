import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from '../../../config'

import Stripe from 'stripe'
import { formatAmountForStripe } from '../../../util/stripe-helpers'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

export default async function handler(
  req,
  res
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }
  const {
    amount,
    payment_intent_id,
  } = req.body
  // Validate the amount that was passed from the client.
  if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
    res.status(500).json({ statusCode: 400, message: 'Invalid amount.' })
    return
  }
  if (payment_intent_id) {
    try {
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      )
      // If PaymentIntent has been created, just update the amount.
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: formatAmountForStripe(amount, CURRENCY),
          }
        )
        res.status(200).json(updated_intent)
        return
      }
    } catch (e) {
      if ((e).code !== 'resource_missing') {
        const errorMessage =
          e instanceof Error ? e.message : 'Internal server error'
        res.status(500).json({ statusCode: 500, message: errorMessage })
        return
      }
    }
  }
  try {
    // Create PaymentIntent from body params.
    const params = {
      amount: formatAmountForStripe(amount, CURRENCY),
      currency: CURRENCY,
      description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
      automatic_payment_methods: {
        enabled: true,
      },
    }
    const payment_intent =
      await stripe.paymentIntents.create(params)

    res.status(200).json(payment_intent)
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ statusCode: 500, message: errorMessage })
  }
}