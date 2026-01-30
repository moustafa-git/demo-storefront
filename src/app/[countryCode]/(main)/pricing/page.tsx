import { Metadata } from "next"
import Link from "next/link"
import { isDemoMode, ENVATO_ITEM_URL, demoMessages } from "@lib/demo-config"
import { Tablet, ExternalLink, ArrowLeft, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "View our pricing plans",
}

// Demo mode pricing page component
function DemoPricingPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center px-6">
        {/* Icon */}
        <div className="flex justify-center mb-10">
          <div className="p-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl shadow-inner">
            <Tablet className="w-20 h-20 text-indigo-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Pricing Restricted in Demo
        </h1>

        {/* Message */}
        <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
          Full pricing plans, subscription management, and premium tier features are available in the production version of SpaceAids.
        </p>

        {/* Value Prop */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 text-left shadow-xl">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            Enterprise-Grade Features
          </h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            The full version includes Stripe integration with automated billing, customer portals, and enterprise-scale backend support via Medusa V2.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Tiered Subscriptions
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Stripe Customer Portal
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Automated Invoicing
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Priority 24/7 Support
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ENVATO_ITEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 px-8 rounded-2xl hover:opacity-95 transition-all hover:scale-[1.03] shadow-lg text-lg"
          >
            <span>Purchase on Envato</span>
            <ExternalLink className="w-5 h-5" />
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 font-bold py-4 px-8 rounded-2xl hover:bg-gray-50 transition-all text-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

import PricingSection from "@modules/home/components/sections/PricingSection"

export default function PricingPage() {
  // In demo mode, show demo page instead of pricing console
  if (isDemoMode) {
    return <DemoPricingPage />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Pricing Plans
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose a plan that grows with your recovery journey. Compare features below and find the support that fits your needs best.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PricingSection />
        </div>
      </div>

      {/* FAQ or Additional Info Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time through your account dashboard. Changes will be prorated automatically.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                You'll continue to have access to your plan features until the end of your current billing period. After that, you'll be moved to the free plan.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a free trial period. You can explore all features before being charged.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I manage my subscription?
              </h3>
              <p className="text-gray-600">
                You can manage your subscription, update payment methods, and view billing history through your account dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
