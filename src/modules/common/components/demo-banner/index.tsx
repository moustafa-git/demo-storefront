"use client"

import React, { useState, useEffect } from "react"
import { isDemoMode, demoBannerConfig, ENVATO_ITEM_URL } from "@lib/demo-config"
import { X } from "lucide-react"

const DemoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Only show banner in demo mode
    if (!isDemoMode || !demoBannerConfig.enabled) {
      return
    }

    // Check if banner was previously dismissed in this session
    const dismissed = sessionStorage.getItem("demo_banner_dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
      return
    }

    // Show banner after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    if (demoBannerConfig.dismissible) {
      sessionStorage.setItem("demo_banner_dismissed", "true")
    }
  }

  if (!isDemoMode || !demoBannerConfig.enabled || isDismissed || !isVisible) {
    return null
  }

  const positionClasses = demoBannerConfig.position === "top" 
    ? "top-0" 
    : "bottom-0"

  return (
    <div
      className={`fixed ${positionClasses} left-0 right-0 z-[9999] transform transition-transform duration-500 ease-out`}
      style={{
        transform: isVisible ? "translateY(0)" : demoBannerConfig.position === "top" ? "translateY(-100%)" : "translateY(100%)",
      }}
    >
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Message */}
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm md:text-base font-medium">
                {demoBannerConfig.message}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {demoBannerConfig.showPurchaseButton && (
                <a
                  href={ENVATO_ITEM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-purple-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all hover:scale-105 shadow-md"
                >
                  {demoBannerConfig.purchaseButtonText}
                </a>
              )}

              {demoBannerConfig.dismissible && (
                <button
                  onClick={handleDismiss}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoBanner
