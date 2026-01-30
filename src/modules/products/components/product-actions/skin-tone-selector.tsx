"use client"

import React, { useState, useEffect, useCallback } from "react"
import { clx } from "@medusajs/ui"
import { Button, Heading } from "@medusajs/ui"
import { SKIN_TONE_OPTIONS, getSkinToneById, type SkinToneOption } from "@lib/util/skin-tone-analyzer"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import Modal from "@modules/common/components/modal"
import useToggleState from "@lib/hooks/use-toggle-state"

interface SkinToneSelectorProps {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
  productId?: string
}

const SkinToneSelector: React.FC<SkinToneSelectorProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  productId,
}) => {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>("")
  const [filter, setFilter] = useState<'all' | 'fitzpatrick' | 'regional' | 'foundation'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const { state: isManualOpen, open: openManual, close: closeManual } = useToggleState(false)

  // Memoize the update function to prevent infinite loops
  const updateOptionCallback = useCallback((optionId: string, value: string) => {
    updateOption(optionId, value)
  }, [updateOption])

  // Single consolidated effect for initialization and auto-selection
  useEffect(() => {
    const initializeComponent = async () => {
      if (isInitialized) return

      try {
        // Fetch customer data
        const customerData = await retrieveCustomer()
        setCustomer(customerData)
        // No auto-selection or updateOptionCallback here!
      } catch (error) {
        setCustomer(null)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading && !isInitialized) {
        setIsLoading(false)
        setCustomer(null)
        setIsInitialized(true)
      }
    }, 2000)

    initializeComponent()

    return () => clearTimeout(timeoutId)
  }, [isInitialized, option.id, productId])

  // Reset selectedSkinTone to current when modal opens
  useEffect(() => {
    if (isManualOpen) {
      setSelectedSkinTone(current || "")
    }
  }, [isManualOpen, current])

  // Reset skin tone picker when current changes to undefined
  useEffect(() => {
    if (current === undefined) {
      setSelectedSkinTone("");
    } else {
      setSelectedSkinTone(current);
    }
  }, [current]);

  // Get customer's skin tone for automatic selection
  const customerSkinTone = customer?.metadata?.skin_tone as string | undefined
  const customerCustomColor = customer?.metadata?.custom_skin_color as string | undefined
  const customerToneInfo = customerSkinTone ? getSkinToneById(customerSkinTone) : null

  // Get custom tone from profile
  const getCustomToneFromProfile = () => {
    if (customerSkinTone === 'custom' && customerCustomColor) {
      return {
        id: 'custom',
        name: 'Custom Skin Tone',
        color: customerCustomColor,
        description: 'Your unique skin tone',
        undertone: 'neutral' as const
      }
    }
    return null
  }

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
  }

  // In the main palette display, current is the skin tone ID
  const currentTone = current ? (current === 'custom' ? getCustomToneFromProfile() : getSkinToneById(current)) : undefined;

  // Show loading state while fetching customer data (with timeout fallback)
  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-3">
        <span className="text-sm">Select {title}</span>
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled
          className="flex items-center gap-2"
        >
          🎨
          Loading...
        </Button>
        <div className="text-xs text-gray-500 mt-2">
          Loading your profile data... (will proceed automatically in 2 seconds)
        </div>
      </div>
    )
  }

  // In handleManualSelection, always use the ID for state and parent update
  const handleManualSelection = (skinToneId: string) => {
    setSelectedSkinTone(skinToneId)
    
    // Handle custom skin tone specially
    if (skinToneId === 'custom') {
      updateOptionCallback(option.id, skinToneId) // Pass ID to parent
      // Save custom skin tone data to sessionStorage
      try {
        const sessionKey = productId ? `skin_tone_selection_virtual_skin_tone_${productId}` : `skin_tone_selection_${option.id}`
        const sessionData = {
          skinToneId: 'custom',
          skinToneName: 'Custom Skin Tone',
          customColor: customerCustomColor,
          timestamp: Date.now()
        }
        sessionStorage.setItem(sessionKey, JSON.stringify(sessionData))
        
        // Mark this material as explicitly modified
        if (productId) {
          const materialName = 'virtual_skin_tone' // or get this from props if it's dynamic
          const materialModifiedKey = `material_modified_${materialName}_${productId}`
          sessionStorage.setItem(materialModifiedKey, 'true')
        }
      } catch (error) {
        console.error('Error saving custom skin tone selection:', error)
      }
      return
    }
    
    // Handle regular skin tones
    const tone = getSkinToneById(skinToneId)
    if (tone) {
      updateOptionCallback(option.id, skinToneId) // Pass ID to parent
      // Save both ID and name to sessionStorage
      try {
        const sessionKey = productId ? `skin_tone_selection_virtual_skin_tone_${productId}` : `skin_tone_selection_${option.id}`
        const sessionData = {
          skinToneId,
          skinToneName: tone.name,
          timestamp: Date.now()
        }
        sessionStorage.setItem(sessionKey, JSON.stringify(sessionData))
        
        // Mark this material as explicitly modified
        if (productId) {
          const materialName = 'virtual_skin_tone' // or get this from props if it's dynamic
          const materialModifiedKey = `material_modified_${materialName}_${productId}`
          sessionStorage.setItem(materialModifiedKey, 'true')
        }
      } catch (error) {
        console.error('Error saving skin tone selection:', error)
      }
    }
  }

  const clearSessionSelection = () => {
    try {
      const sessionKey = productId ? `skin_tone_selection_virtual_skin_tone_${productId}` : `skin_tone_selection_${option.id}`
      sessionStorage.removeItem(sessionKey)
      
      // Reset to customer profile skin tone if available
      if (customerToneInfo) {
        setSelectedSkinTone(customerToneInfo.id)
        // Always pass ID upward
        updateOptionCallback(option.id, customerToneInfo.id)
      } else if (customerSkinTone === 'custom') {
        setSelectedSkinTone('custom')
        updateOptionCallback(option.id, 'custom')
      }
    } catch (error) {
      console.error('❌ Failed to clear session storage:', error)
    }
  }

  const getCurrentSkinToneInfo = () => {
    
    // If we have a manually selected skin tone, use that
    if (selectedSkinTone) {
      // Handle custom skin tone with custom color from profile
      if (selectedSkinTone === 'custom') {
        return getCustomToneFromProfile()
      }
      
      // Return the manually selected skin tone
      const tone = getSkinToneById(selectedSkinTone)
      return tone
    }
    
    // If no manual selection, fall back to customer profile skin tone
    if (customerToneInfo) {
      return customerToneInfo
    }
    
    // Handle custom skin tone from profile (when no manual selection)
    if (customerSkinTone === 'custom') {
      return getCustomToneFromProfile()
    }
    
    return null
  }

  // In the Confirm button, call handleManualSelection(selectedSkinTone) with the ID
  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      
      {/* Current Selection Display */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
        <div 
          className="w-8 h-8 rounded-full border border-gray-300"
          style={{ backgroundColor: currentTone?.color || '#f3f4f6' }}
        />
        <div className="flex-1">
          <div className="font-medium">
            {currentTone?.name || <span className="text-gray-400">Choose a skin tone</span>}
          </div>
          {/* Show session indicator if using session data */}
          {(() => {
            try {
              const sessionKey = productId ? `skin_tone_selection_virtual_skin_tone_${productId}` : `skin_tone_selection_${option.id}`
              const sessionData = sessionStorage.getItem(sessionKey)
            } catch (error) {
              // Ignore session storage errors
            }
            return null
          })()}
          {/* Show profile indicator if using customer profile */}
          {customerSkinTone && !(() => {
            try {
              const sessionKey = productId ? `skin_tone_selection_virtual_skin_tone_${productId}` : `skin_tone_selection_${option.id}`
              const sessionData = sessionStorage.getItem(sessionKey)
              return !!sessionData
            } catch (error) {
              return false
            }
          })() && (
            <div className="text-xs text-green-600 mt-1">
              👤 From your profile
            </div>
          )}
        </div>
      </div>

      {/* Choose Manually Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={openManual}
        className="flex items-center gap-2"
        disabled={disabled}
      >
        🎨
        Choose Manually
      </Button>

      {/* Manual Selection Modal - Exact same as account page */}
      <Modal isOpen={isManualOpen} close={closeManual} size="large">
        <Modal.Title>
          <Heading className="mb-2">🎨 Choose Your Skin Tone</Heading>
        </Modal.Title>
        <Modal.Body>
          <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Instructions */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-purple-600 text-lg">🎯</div>
                <div>
                  <h3 className="text-sm font-medium text-purple-900 mb-1">How to choose:</h3>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• Look at your natural skin color in good lighting</li>
                    <li>• Consider your undertone (warm, cool, or neutral)</li>
                    <li>• Choose the option that most closely matches your skin</li>
                    <li>• You can always change this later in your profile</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Customer Profile Section */}
            {customerSkinTone && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-green-600 text-lg">👤</div>
                  <div>
                    <h3 className="text-sm font-medium text-green-900 mb-1">Your Profile Skin Tone</h3>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: customerCustomColor || getSkinToneById(customerSkinTone)?.color || '#D4A67C' }}
                      />
                      <div>
                        <div className="font-medium text-green-900">
                          {customerSkinTone === 'custom' ? 'Custom Skin Tone' : getSkinToneById(customerSkinTone)?.name}
                        </div>
                        <div className="text-xs text-green-700">
                          {customerSkinTone === 'custom' ? 'Your unique skin tone' : getSkinToneById(customerSkinTone)?.description}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (customerSkinTone === 'custom') {
                          setSelectedSkinTone('custom')
                          handleManualSelection('custom')
                        } else if (customerToneInfo) {
                          setSelectedSkinTone(customerToneInfo.id)
                          handleManualSelection(customerToneInfo.id)
                        }
                        closeManual()
                      }}
                      className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Use My Profile Tone
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Skin Tone Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Select Your Skin Tone</h3>
                <div className="text-xs text-gray-500">
                  {SKIN_TONE_OPTIONS.length} options available
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({SKIN_TONE_OPTIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('fitzpatrick')}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === 'fitzpatrick' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Fitzpatrick Scale
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('regional')}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === 'regional' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Regional
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('foundation')}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === 'foundation' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Foundation Shades
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {SKIN_TONE_OPTIONS
                  .filter(tone => {
                    if (filter === 'all') return true
                    if (filter === 'fitzpatrick') return tone.id.includes('fitzpatrick')
                    if (filter === 'regional') return tone.id.includes('nordic') || tone.id.includes('celtic') || tone.id.includes('mediterranean') || tone.id.includes('asian') || tone.id.includes('african') || tone.id.includes('melanesian')
                    if (filter === 'foundation') return tone.id.includes('foundation')
                    return true
                  })
                  .map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSelectedSkinTone(tone.id)}
                      className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                        selectedSkinTone === tone.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: tone.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{tone.name}</div>
                          <div className="text-xs text-gray-600 truncate">{tone.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {tone.undertone}
                          </div>
                        </div>
                        {selectedSkinTone === tone.id && (
                          <div className="text-blue-600 text-lg flex-shrink-0">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Selected Preview */}
            {selectedSkinTone && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Skin Tone</h4>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: (selectedSkinTone === 'custom' ? (customerCustomColor || '#D4A67C') : getSkinToneById(selectedSkinTone)?.color) }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedSkinTone === 'custom' ? 'Custom Skin Tone' : getSkinToneById(selectedSkinTone)?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedSkinTone === 'custom' ? 'Your unique skin tone' : getSkinToneById(selectedSkinTone)?.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" onClick={closeManual} className="flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSelectedSkinTone("");
                updateOption(option.id, "");
                // Optionally, clear session storage as well
                try {
                  const sessionKey = productId ? `skin_tone_selection_virtual_skin_tone_${productId}` : `skin_tone_selection_${option.id}`;
                  sessionStorage.removeItem(sessionKey);
                } catch {}
                closeManual();
              }}
              className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              data-testid="clear-skin-tone-button"
              aria-label="Clear skin tone selection"
              title="Clear skin tone selection"
            >
              🚫 Clear Skin Tone
            </Button>
            <Button
              onClick={() => {
                if (typeof selectedSkinTone === 'string' && selectedSkinTone) {
                  handleManualSelection(selectedSkinTone)
                  closeManual()
                }
              }}
              className="flex-1"
              disabled={!selectedSkinTone}
            >
              ✅ Confirm Selection
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default SkinToneSelector 