import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import SubscriptionStatus from "@modules/account/components/subscription-status"

type Props = {
  params: { countryCode: string }
}

export const metadata: Metadata = {
  title: "Subscription",
  description: "Manage your subscription and billing information.",
}

export default async function SubscriptionPage({ params }: Props) {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-y-8 w-full">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl-semi">Subscription</h1>
        <p className="text-base-regular text-gray-700">
          Manage your subscription, view billing information, and update your plan.
        </p>
      </div>
      <SubscriptionStatus />
    </div>
  )
}
