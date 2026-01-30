import { useState, useEffect } from 'react'
import { HttpTypes } from '@medusajs/types'

export const useProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!customer) {
      setIsProfileComplete(false)
      setIsLoading(false)
      return
    }

    // Check if profile is complete
    const hasSkinTone = customer.metadata?.skin_tone
    const isMarkedComplete = customer.metadata?.profile_completed === 'true'
    
    
    setIsProfileComplete(!!hasSkinTone || !!isMarkedComplete)
    setIsLoading(false)
  }, [customer])

  return {
    isProfileComplete,
    isLoading,
    hasSkinTone: !!customer?.metadata?.skin_tone
  }
} 