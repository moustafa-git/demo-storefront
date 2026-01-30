"use client"

import React, { useState, useEffect } from 'react'
import { HttpTypes } from '@medusajs/types'
import { useProfileCompletion } from '@lib/hooks/use-profile-completion'
import OnboardingModal from './onboarding-modal'

interface OnboardingWrapperProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ customer, children }) => {
  const { isProfileComplete, isLoading } = useProfileCompletion(customer)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    
    if (!isLoading && !isProfileComplete && customer) {
      setShowOnboarding(true)
    } else if (isProfileComplete) {
      setShowOnboarding(false)
    }
  }, [isProfileComplete, isLoading, customer])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    // Refresh the page to update the customer data
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized experience...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      
      {showOnboarding && customer && (
        <OnboardingModal
          customer={customer}
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}
    </>
  )
}

export default OnboardingWrapper 