"use client"

import React from "react"
import { Button } from "@medusajs/ui"
import { getRecommendedColors, getSkinToneById } from "@lib/util/skin-tone-analyzer"
import { retrieveCustomer } from "@lib/data/customer"

interface SkinToneRecommendationProps {
  productId: string
  productColors?: string[]
}

const SkinToneRecommendation: React.FC<SkinToneRecommendationProps> = ({ 
  productId, 
  productColors = [] 
}) => {
  const [customer, setCustomer] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [recommendations, setRecommendations] = React.useState<string[]>([])

  React.useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await retrieveCustomer()
        setCustomer(customerData)
        
        if (customerData?.metadata?.skin_tone) {
          const skinTone = getSkinToneById(customerData.metadata.skin_tone as string)
          if (skinTone) {
            const recommendedColors = getRecommendedColors(skinTone.id)
            setRecommendations(recommendedColors)
          }
        }
      } catch (error) {
        console.error('Failed to fetch customer data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomer()
  }, [])

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!customer?.metadata?.skin_tone) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Get Personalized Recommendations
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Set your skin tone in your profile to get personalized clothing recommendations.
        </p>
        <Button 
          variant="secondary" 
          size="small"
          onClick={() => window.location.href = '/account/profile'}
        >
          Set Skin Tone
        </Button>
      </div>
    )
  }

  const skinTone = getSkinToneById(customer.metadata.skin_tone as string)
  if (!skinTone) return null

  const hasMatchingColors = productColors.some(color => 
    recommendations.includes(color)
  )

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: skinTone.color }}
        />
        <div>
          <h3 className="text-sm font-medium text-green-900">
            Personalized for {skinTone.name} Skin
          </h3>
          <p className="text-xs text-green-700">
            Based on your skin tone profile
          </p>
        </div>
      </div>
      
      {hasMatchingColors ? (
        <div className="text-sm text-green-800">
          ✅ This product's colors complement your skin tone!
        </div>
      ) : (
        <div className="text-sm text-amber-800">
          💡 Consider trying our recommended colors for your skin tone
        </div>
      )}
      
      <div className="mt-3">
        <p className="text-xs text-gray-600 mb-2">Recommended colors for you:</p>
        <div className="flex gap-2 flex-wrap">
          {recommendations.slice(0, 5).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
              title={`Recommended color ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkinToneRecommendation 