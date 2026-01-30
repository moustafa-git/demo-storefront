"use client"

import React from "react"
import { isDemoMode, ENVATO_ITEM_URL, demoMessages } from "@lib/demo-config"
import { X, ShoppingBag, ExternalLink } from "lucide-react"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  type?: "cart" | "checkout" | "account" | "general"
}

const DemoModal: React.FC<DemoModalProps> = ({ 
  isOpen, 
  onClose, 
  type = "general" 
}) => {
  if (!isOpen || !isDemoMode) return null

  const getMessage = () => {
    switch (type) {
      case "cart":
        return demoMessages.addToCart
      case "checkout":
        return demoMessages.checkout
      case "account":
        return demoMessages.account
      default:
        return demoMessages.general
    }
  }

  const getIcon = () => {
    switch (type) {
      case "cart":
      case "checkout":
        return <ShoppingBag className="w-12 h-12 text-purple-500" />
      default:
        return <ShoppingBag className="w-12 h-12 text-purple-500" />
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-purple-100 rounded-full">
            {getIcon()}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Demo Mode Active
        </h3>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {getMessage()}
        </p>

        {/* CTA Button */}
        <a
          href={ENVATO_ITEM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
        >
          <span>Get Full Version on Envato</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Secondary action */}
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          Continue Exploring Demo
        </button>
      </div>
    </div>
  )
}

export default DemoModal
