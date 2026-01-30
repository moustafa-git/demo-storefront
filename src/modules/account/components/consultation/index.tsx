"use client"

import { useState, useEffect } from "react"
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface SubscriptionData {
  id: string
  status: string
  plan: string
  daysRemaining: number
  price: number
  currency: string
  interval: string
  cancelAtPeriodEnd: boolean
  trialEnd?: number
}

export default function ConsultationPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/subscription/status")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch subscription")
      }

      setSubscription(data.subscription)
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
      setError(
        error instanceof Error ? error.message : "Failed to fetch subscription"
      )
    } finally {
      setLoading(false)
    }
  }

  const hasBuyMeSubscription = () => {
    if (!subscription) return false
    // Check if the plan name contains "BUY ME" or similar indicators
    return (
      subscription.plan.toLowerCase().includes("buy me") ||
      subscription.plan.toLowerCase().includes("buy") ||
      subscription.price > 0
    ) // Assuming BUY ME is the paid plan
  }

  const handleSupportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: formData.get("subject"),
          message: formData.get("message"),
          priority: formData.get("priority"),
        }),
      })

      if (response.ok) {
        alert(
          "Support request sent successfully! We'll get back to you within 24 hours."
        )
        e.currentTarget.reset()
      } else {
        alert("Failed to send support request. Please try again.")
      }
    } catch (error) {
      console.error("Error sending support request:", error)
      alert("Failed to send support request. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
        <div className="flex items-center gap-2 mb-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-red-800">Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchSubscriptionStatus}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  // If no subscription or not BUY ME plan
  if (!subscription || !hasBuyMeSubscription()) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <div className="mb-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Premium Features
          </h2>
          <p className="text-gray-600 mb-6">
            Personal consultation and precision support are available with our
            BUY ME subscription plan.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span>Personal Consultation with experts</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span>Relief/Heal Precision Support</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span>Direct access to specialists</span>
          </div>
        </div>

        <div className="mt-8">
          <LocalizedClientLink
            href="/pricing"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upgrade to BUY ME Plan
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  // User has BUY ME subscription - show features
  return (
    <div className="space-y-8">
      {/* Personal Consultation Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Personal Consultation</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Book a one-on-one consultation with our skin care experts to get
          personalized advice for your specific needs.
        </p>

        {/* Calendly Embed */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Click below to book your consultation
            </p>
          </div>
          {/* Replace with your actual Calendly link */}
          <div className="text-center">
            <a
              href="https://calendly.com/sara-asal/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Book Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Precision Support Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold">
            Relief/Heal Precision Support
          </h2>
        </div>
        <p className="text-gray-600 mb-6">
          Get ongoing support and guidance for your healing journey. Our
          specialists are here to help you every step of the way.
        </p>

        {/* Support Contact Form */}
        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your concern"
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low - General question</option>
              <option value="medium">Medium - Need guidance</option>
              <option value="high">High - Urgent concern</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your concern in detail. Include any relevant information about your skin condition, current products, or specific questions you have."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Send Support Request
          </button>
        </form>
      </div>

      {/* Subscription Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircleIcon className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Active Subscription</span>
        </div>
        <p className="text-blue-800 text-sm">
          You have access to all BUY ME features including personal consultation
          and precision support.
        </p>
      </div>
    </div>
  )
}
