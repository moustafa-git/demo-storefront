import React, { useState, useEffect, useCallback } from "react"
import { Button, Heading } from "@medusajs/ui"
import Modal from "@modules/common/components/modal"
import useToggleState from "@lib/hooks/use-toggle-state"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"

interface ColorPickerProps {
  option: { id: string }
  current: string | undefined
  updateColor: (optionId: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
  productId?: string
}

const DEFAULT_COLOR = "#AABBCC"

const isValidHex = (hex: string) => /^#([0-9A-Fa-f]{6})$/.test(hex)

const ColorPicker: React.FC<ColorPickerProps> = ({
  option,
  current,
  updateColor,
  title,
  "data-testid": dataTestId,
  disabled,
  productId,
}) => {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [hexInput, setHexInput] = useState<string>("")
  const [hexError, setHexError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const { state: isManualOpen, open: openManual, close: closeManual } = useToggleState(false)

  // Fetch customer and session color on mount
  useEffect(() => {
    const initialize = async () => {
      if (isInitialized) return
      try {
        const customerData = await retrieveCustomer()
        setCustomer(customerData)
      } catch {
        setCustomer(null)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }
    // Timeout fallback
    const timeoutId = setTimeout(() => {
      if (isLoading && !isInitialized) {
        setIsLoading(false)
        setCustomer(null)
        setIsInitialized(true)
      }
    }, 2000)
    initialize()
    return () => clearTimeout(timeoutId)
  }, [isInitialized, option.id, productId])

  // On modal open, reset to current
  useEffect(() => {
    if (isManualOpen) {
      const color = current || getProfileColor() || DEFAULT_COLOR
      setSelectedColor(color)
      setHexInput(color)
      setHexError("")
    }
  }, [isManualOpen, current])

  // Reset color picker when current changes to undefined
  useEffect(() => {
    if (current === undefined) {
      setSelectedColor("");
      setHexInput("");
      setHexError("");
    } else {
      setSelectedColor(current);
      setHexInput(current);
      setHexError("");
    }
  }, [current]);

  // Get color from customer profile
  const getProfileColor = () => {
    return customer?.metadata?.custom_skin_color as string | undefined
  }

  // Get color from session storage
  const getSessionColor = () => {
    try {
      const sessionKey = productId ? `color_selection_virtual_color_${productId}` : `color_selection_${option.id}`
      const sessionData = sessionStorage.getItem(sessionKey)
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        if (typeof parsed.colorValue === "string" && parsed.colorValue) {
          return parsed.colorValue
        }
      }
    } catch {}
    return undefined
  }

  // Save color to session storage
  const saveSessionColor = (colorValue: string) => {
    try {
      const sessionKey = productId ? `color_selection_virtual_color_${productId}` : `color_selection_${option.id}`
      const sessionData = {
        colorValue,
        timestamp: Date.now(),
      }
      sessionStorage.setItem(sessionKey, JSON.stringify(sessionData))
    } catch {}
  }

  // Handle manual color selection
  const handleManualSelection = (colorValue: string) => {
    setSelectedColor(colorValue)
    updateColor(option.id, colorValue)
    saveSessionColor(colorValue)
    
    // Mark this material as explicitly modified
    if (productId) {
      const materialName = 'virtual_color' // or get this from props if it's dynamic
      const materialModifiedKey = `material_modified_${materialName}_${productId}`
      try {
        sessionStorage.setItem(materialModifiedKey, 'true')
      } catch (error) {
        console.error('Error saving material modified flag:', error)
      }
    }
  }

  // Handle "Use My Profile Color"
  const handleUseProfileColor = () => {
    const profileColor = getProfileColor()
    if (profileColor) {
      setSelectedColor(profileColor)
      updateColor(option.id, profileColor)
      saveSessionColor(profileColor)
      closeManual()
    }
  }

  // Handle color input change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value)
    setHexInput(e.target.value)
    setHexError("")
  }

  // Handle hex input change
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value.startsWith("#")) value = "#" + value.replace(/[^0-9A-Fa-f]/g, "")
    setHexInput(value)
    if (isValidHex(value)) {
      setSelectedColor(value)
      setHexError("")
    } else {
      setHexError("Invalid hex code")
    }
  }

  // Handle clearing color selection
  const handleClearColor = () => {
    setSelectedColor("")
    setHexInput("")
    updateColor(option.id, "")
    saveSessionColor("")
  }

  // Show loading skeleton
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
        <Button type="button" variant="secondary" disabled className="flex items-center gap-2">
          🎨 Loading...
        </Button>
        <div className="text-xs text-gray-500 mt-2">Loading your profile data... (will proceed automatically in 2 seconds)</div>
      </div>
    )
  }

  // Current color: current prop > default
  const currentColor = current || DEFAULT_COLOR;

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      {/* Current Selection Display */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
        <div className="w-8 h-8 rounded-full border border-gray-300" style={{ backgroundColor: currentColor || '#f3f4f6' }} />
        <div className="flex-1">
          <div className="font-medium">
            {currentColor ? currentColor : <span className="text-gray-400">No color selected</span>}
          </div>
          {getProfileColor() && currentColor === getProfileColor() && (
            <div className="text-xs text-green-600 mt-1">👤 From your profile</div>
          )}
        </div>
        {current && (
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={handleClearColor}
            className="ml-2"
            data-testid="clear-color-button"
            aria-label="Clear color selection"
          >
            Clear Color
          </Button>
        )}
      </div>
      {/* Choose Manually Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={openManual}
        className="flex items-center gap-2"
        disabled={disabled}
      >
        🎨 Choose Manually
      </Button>
      {/* Manual Selection Modal */}
      <Modal isOpen={isManualOpen} close={closeManual} size="medium">
        <Modal.Title>
          <Heading className="mb-2">🎨 Choose Your Color</Heading>
        </Modal.Title>
        <Modal.Body>
          <div className="flex flex-col gap-5">
            {/* Section: Pick a Color */}
            <div>
              <h3 className="text-base font-semibold mb-2">Pick a Color</h3>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="color-input"
                  className="cursor-pointer text-sm font-medium"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && document.getElementById('color-input')?.focus()}
                  title="Click to open color picker"
                  aria-label="Color picker label"
                >
                  <span>🎨</span> <span>Color Picker</span>
                </label>
                <input
                  id="color-input"
                  type="color"
                  value={selectedColor || current || DEFAULT_COLOR}
                  onChange={handleColorChange}
                  className="w-16 h-16 border-2 border-gray-300 rounded-lg shadow-md transition-all duration-150 focus:ring-2 focus:ring-blue-400 hover:scale-105 cursor-pointer"
                  title="Click to pick a color"
                  aria-label="Color picker"
                />
                <span className="text-xs text-gray-500 ml-2">Click to open</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  className={`border rounded px-2 py-1 text-sm w-32 ${hexError ? 'border-red-500' : ''}`}
                  placeholder="#AABBCC"
                  aria-label="Hex color input"
                  maxLength={7}
                />
                {hexError && <span className="text-xs text-red-500 ml-2">{hexError}</span>}
              </div>
            </div>
            <Divider />
            {/* Section: Preview */}
            <div>
              <h3 className="text-base font-semibold mb-2">Preview</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full border-2 border-gray-300 shadow"
                  style={{ backgroundColor: selectedColor || current || '#f3f4f6' }}
                  aria-label="Color preview swatch"
                />
                <span className="text-xs font-mono">{selectedColor || current || <span className="text-gray-400">No color</span>}</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 w-full mt-5">
            <Button variant="secondary" onClick={closeManual} className="flex-1">Cancel</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSelectedColor("");
                setHexInput("");
                handleManualSelection("");
                closeManual();
              }}
              className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              data-testid="no-color-button"
              aria-label="Remove color selection"
              title="Remove color selection"
            >
              🚫 No Color
            </Button>
            <Button
              onClick={() => {
                if (typeof selectedColor === 'string' && !hexError) {
                  handleManualSelection(selectedColor)
                  closeManual()
                }
              }}
              className="flex-1"
              aria-label="Confirm color selection"
              disabled={!!hexError}
            >
              ✅ Confirm Selection
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ColorPicker 