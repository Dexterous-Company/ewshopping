import RefundPolicy from '@/main_pages/footerPages/RefundPolicy'
import React from 'react'

export const metadata = {
  title: "EW Shopping Refund Policy: Easy Returns & 100% Money-Back Guarantee",
  description:
    "EW Shopping's secure online refund policy gives easy returns & refunds on all purchases. Enjoy safe online shopping with clear terms and customer support",
  keywords:
    "secure online refund policy, safe online shopping, EW Shopping refund charges India, refund policy after return accepted, how to get a refund",
  alternates: {
    canonical: "https://ewshopping.com/refundpolicy"
  }
};


const page = () => {
  return (
    <div>
      <RefundPolicy />
    </div>
  )
}

export default page
