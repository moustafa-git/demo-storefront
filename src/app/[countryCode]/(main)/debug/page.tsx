'use client'

import { useState } from 'react'

export default function DebugPage() {
  const [customerData, setCustomerData] = useState<any>(null)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const fetchCustomerData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/customer')
      const data = await response.json()
      setCustomerData(data)
    } catch (error) {
      console.error('Error fetching customer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriptionData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/subscription')
      const data = await response.json()
      setSubscriptionData(data)
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const linkCustomer = async () => {
    if (!email) {
      alert('Please enter an email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/debug/link-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error linking customer:', error)
      alert('Error linking customer')
    } finally {
      setLoading(false)
    }
  }

  const fixSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/fix-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      alert(JSON.stringify(data, null, 2))
      if (data.success) {
        // Refresh the page to show updated subscription
        window.location.href = '/account/subscription'
      }
    } catch (error) {
      console.error('Error fixing subscription:', error)
      alert('Error fixing subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Subscription Issues</h1>
      
      <div className="space-y-8">
        {/* Customer Data Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">1. Customer Data</h2>
          <button
            onClick={fetchCustomerData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Check Customer Data'}
          </button>
          {customerData && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(customerData, null, 2)}
            </pre>
          )}
        </div>

        {/* Subscription Data Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">2. Subscription Data</h2>
          <button
            onClick={fetchSubscriptionData}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Check Subscription Data'}
          </button>
          {subscriptionData && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(subscriptionData, null, 2)}
            </pre>
          )}
        </div>

        {/* Quick Fix Section */}
        <div className="border rounded-lg p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">🚀 Quick Fix</h2>
          <p className="text-gray-600 mb-4">
            This will automatically link your account to your Stripe subscription and fix the issue.
          </p>
          <button
            onClick={fixSubscription}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50 text-lg font-semibold"
          >
            {loading ? 'Fixing...' : '🔧 Fix My Subscription'}
          </button>
        </div>

        {/* Link Customer Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">3. Manual Link Customer to Stripe</h2>
          <p className="text-gray-600 mb-4">
            If the quick fix doesn't work, use this to manually link your customer.
          </p>
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter customer email"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={linkCustomer}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Linking...' : 'Link Customer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
