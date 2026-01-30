import { Metadata } from "next"
import Link from "next/link"
import { isDemoMode, ENVATO_ITEM_URL, demoMessages } from "@lib/demo-config"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { notFound } from "next/navigation"
import { ShoppingBag, ExternalLink, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Checkout",
}

// Demo mode checkout page component
function DemoCheckoutPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto text-center px-4">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
            <ShoppingBag className="w-16 h-16 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Demo Mode Active
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {demoMessages.checkout}
        </p>

        {/* Features preserved */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            What you can explore in this demo:
          </h3>
          <ul className="space-y-2 text-green-700 text-sm">
            <li>• Full 3D product customization</li>
            <li>• Interactive material & color selection</li>
            <li>• Skin tone matching technology</li>
            <li>• Product browsing & filtering</li>
            <li>• Responsive design across devices</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <a
            href={ENVATO_ITEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
          >
            <span>Get Full Version on Envato</span>
            <ExternalLink className="w-5 h-5" />
          </a>

          <Link
            href="/store"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Exploring Products</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function Checkout() {
  // In demo mode, show demo page instead of checkout
  if (isDemoMode) {
    return <DemoCheckoutPage />
  }

  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
