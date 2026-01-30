'use client'

import { useState, useEffect } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline'

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

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/subscription/status')
      const data = await response.json()
      
      console.log('🔍 FRONTEND DEBUG - Full API Response:', data)
      console.log('🔍 FRONTEND DEBUG - Subscription data:', data.subscription)
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscription')
      }
      
      setSubscription(data.subscription)
      console.log('✅ FRONTEND DEBUG - Subscription set:', data.subscription)
    } catch (error) {
      console.error('❌ FRONTEND DEBUG - Fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch subscription')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/portal', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }
      
      // Open Stripe Customer Portal in new tab
      window.open(data.url, '_blank')
    } catch (error) {
      console.error('Failed to create portal session:', error)
      setError(error instanceof Error ? error.message : 'Failed to open customer portal')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'trialing':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'past_due':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'canceled':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'trialing':
        return 'bg-blue-100 text-blue-800'
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'trialing':
        return 'Trial'
      case 'past_due':
        return 'Past Due'
      case 'canceled':
        return 'Canceled'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    } catch {
      return `${currency} ${amount}`
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
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
          <h3 className="text-lg font-semibold text-red-800">Subscription Error</h3>
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

  if (!subscription) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Subscription Status</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No active subscription found</p>
          <a
            href="/pricing"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Plans
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Subscription Status</h3>
        <div className="flex items-center gap-2">
          {getStatusIcon(subscription.status)}
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
            {formatStatus(subscription.status)}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Plan:</span>
          <span className="font-medium">{subscription.plan}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Price:</span>
          <span className="font-medium">
            {formatCurrency(subscription.price, subscription.currency)}/{subscription.interval}
          </span>
        </div>

        {subscription.daysRemaining > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Days Remaining:</span>
            <span className="font-medium">{subscription.daysRemaining} days</span>
          </div>
        )}


        {subscription.cancelAtPeriodEnd && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ Your subscription will be canceled at the end of the current billing period.
            </p>
          </div>
        )}

        {subscription.trialEnd && subscription.trialEnd > Date.now() / 1000 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-800 text-sm">
              🎉 You're currently on a free trial. Trial ends in {Math.ceil((subscription.trialEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleManageSubscription}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Manage Subscription
        </button>
        <button
          onClick={fetchSubscriptionStatus}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
