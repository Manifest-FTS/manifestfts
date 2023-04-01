import React, { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

import {
  formatAmountForDisplay,
  formatAmountFromStripe,
} from '../../util/stripe-helpers'
import * as config from '../../config'
import CustomDonationInput from './CustomDonationInput'
import { fetchPostJSON } from '../../util/api-helpers'

const PaymentForm = ({ paymentIntent }) => {
  const defaultAmout = paymentIntent
    ? formatAmountFromStripe(paymentIntent.amount, paymentIntent.currency)
    : Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP)
  const [input, setInput] = useState({
    customDonation: defaultAmout,
    cardholderName: '',
  })
  const [paymentType, setPaymentType] = useState('')
  const [payment, setPayment] = useState({ status: 'initial' })
  const [errorMessage, setErrorMessage] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  const PaymentStatus = ({ status }) => {
    switch (status) {
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
        return <h2>Processing...</h2>

      case 'requires_action':
        return <h2>Authenticating...</h2>

      case 'succeeded':
        return <h2>Payment Succeeded 🥳</h2>

      case 'error':
        return (
          <>
            <h2>Error 😭</h2>
            <p className="error-message">{errorMessage}</p>
          </>
        )

      default:
        return null
    }
  }

  const handleInputChange = (e) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Abort if form isn't valid
    if (!e.currentTarget.reportValidity()) return
    if (!elements) return
    setPayment({ status: 'processing' })

    // Create a PaymentIntent with the specified amount.
    const response = await fetchPostJSON('/api/payment_intents', {
      amount: input.customDonation,
      payment_intent_id: paymentIntent?.id,
    })
    setPayment(response)

    if (response.statusCode === 500) {
      setPayment({ status: 'error' })
      setErrorMessage(response.message)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}funding/success`,
        payment_method_data: {
          billing_details: {
            name: input.cardholderName,
          },
        },
      },
    })

    if (error) {
      setPayment({ status: 'error' })
      setErrorMessage(error.message ?? 'An unknown error occurred')
    } else if (paymentIntent) {
      setPayment(paymentIntent)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomDonationInput
          className="w-full d-block form-control w-100"
          name="customDonation"
          value={input.customDonation}
          min={config.MIN_AMOUNT}
          max={config.MAX_AMOUNT}
          step={config.AMOUNT_STEP}
          currency={config.CURRENCY}
          onChange={handleInputChange}
        />
        <fieldset className="elements-style form-group">
          {/* <legend>Your payment details:</legend> */}
          {paymentType === 'card' ? (
            <input
              placeholder="Cardholder name"
              className="form-control mb-3 d-block"
              type="text"
              name="cardholderName"
              onChange={handleInputChange}
              required
            />
          ) : null}
          <div className="FormRow elements-style">
            <PaymentElement
              onChange={(e) => {
                setPaymentType(e.value.type)
              }}
            />
          </div>
        </fieldset>
        <div className="text-center">
        <button
          className="elements-style-background m-auto btn btn-black mr-40 mb-20"
          type="submit"
          disabled={
            !['initial', 'succeeded', 'error'].includes(payment.status) ||
            !stripe
          }
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
        </div>
      </form>
      <PaymentStatus status={payment.status} />
    </>
  )
}

export default PaymentForm