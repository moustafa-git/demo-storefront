"use client"

import React from 'react'
import { Button } from '@medusajs/ui'
import { Camera } from '@medusajs/icons'
import { HttpTypes } from '@medusajs/types'
import { useProfileCompletion } from '@lib/hooks/use-profile-completion'

interface SkinToneRequiredBannerProps {
  customer: HttpTypes.StoreCustomer | null
  onSetupSkinTone: () => void
}

const SkinToneRequiredBanner: React.FC<SkinToneRequiredBannerProps> = ({ 
  customer, 
  onSetupSkinTone 
}) => {
  const { hasSkinTone } = useProfileCompletion(customer)

  if (hasSkinTone || !customer) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Complete Your Profile</h3>
              <p className="text-purple-100">
                Set your skin tone to get personalized clothing recommendations
              </p>
            </div>
          </div>
          
          <Button
            onClick={onSetupSkinTone}
            className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Set Skin Tone
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SkinToneRequiredBanner 