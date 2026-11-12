import type { Metadata } from "next"

import SuccessClient from "./client"

export const metadata: Metadata = {
  title: "Public / Checkout — Payment Successful",
}

const successPage = () => {
  return <SuccessClient />
}

export default successPage
