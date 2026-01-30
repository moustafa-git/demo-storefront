import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { isDemoMode, ENVATO_ITEM_URL, demoMessages } from "@lib/demo-config"
import { ShoppingCart, ExternalLink, ArrowLeft, Palette } from "lucide-react"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

// Demo mode cart page component
function DemoCartPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto text-center px-4">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
            <ShoppingCart className="w-16 h-16 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Demo Mode Active
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {demoMessages.cart}
        </p>

        {/* Demo feature highlight */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            Try our 3D Product Customizer!
          </h3>
          <p className="text-indigo-700 text-sm mb-4">
            Explore our interactive 3D product customization with real-time color and material changes.
          </p>
          <Link 
            href="/store"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm"
          >
            Browse Products →
          </Link>
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

export default async function Cart() {
  // In demo mode, show demo page instead of cart
  if (isDemoMode) {
    return <DemoCartPage />
  }

  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()

  return <CartTemplate cart={cart} customer={customer} />
}
