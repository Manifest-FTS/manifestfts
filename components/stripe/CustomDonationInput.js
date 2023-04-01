import React from 'react'
import { formatAmountForDisplay } from '../../util/stripe-helpers'

const CustomDonationInput = ({
  name,
  value,
  min,
  max,
  currency,
  step,
  onChange,
  className,
}) => (
  <div className="form-group">
    <label className="control-label form-group d-block">
      Donation amount ({formatAmountForDisplay(min, currency)}-
      {formatAmountForDisplay(max, currency)}):
      <input
        className={className}
        type="number"
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      ></input>
      <input
        type="range"
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      ></input>
    </label>
  </div>
)

export default CustomDonationInput