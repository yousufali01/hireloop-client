import type { Metadata } from "next"

import { CheckoutClient } from "./client"

export const metadata: Metadata = { title: "Public / Checkout — Stripe Payment" }

const checkoutPage = () => {
  return <CheckoutClient />
}

export default checkoutPage
