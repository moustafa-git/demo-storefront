"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import Modal from "@modules/common/components/modal"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

interface GentleSignupPromptProps {
  children: React.ReactNode
  customer?: HttpTypes.StoreCustomer | null
}

const GentleSignupPrompt: React.FC<GentleSignupPromptProps> = ({
  children,
  customer,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasShownOnThisPage, setHasShownOnThisPage] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Reset hasShownOnThisPage when pathname changes
  useEffect(() => {
    setHasShownOnThisPage(false)
  }, [pathname])

  // Don't show on account pages
  const isAccountPage = pathname?.includes("/account")
  const isAuthPage =
    pathname?.includes("/login") || pathname?.includes("/register")

  // Check if user is authenticated - use the customer prop from server
  const isAuthenticated = () => {
    return !!customer
  }

  useEffect(() => {
    // Skip if authenticated or on account pages
    if (
      isAuthenticated() ||
      isAccountPage ||
      isAuthPage ||
      hasShownOnThisPage
    ) {
      return
    }

    // Show modal after 3 seconds on first visit
    const timer = setTimeout(() => {
      setShowModal(true)
      setHasShownOnThisPage(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isAccountPage, isAuthPage, hasShownOnThisPage, pathname])

  const handleSignup = () => {
    setIsLoading(true)
    router.push("/account")
  }

  const handleLogin = () => {
    setIsLoading(true)
    router.push("/account")
  }

  const handleClose = () => {
    setShowModal(false)
  }

  // Don't render anything on account pages
  if (isAccountPage || isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      {children}

      {showModal && (
        <Modal isOpen={showModal} close={handleClose} size="medium">
          <div
            className="bg-white rounded-lg p-8 max-w-md mx-auto"
            style={{ zIndex: 9999 }}
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-gray-600 text-2xl">✨</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to Mednauts
                </h1>
                <p className="text-gray-600">
                  Create an account to get personalized skin tone
                  recommendations and save your favorite items.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Why Create an Account?
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Personalized skin tone matching</li>
                    <li>• Save your favorite items</li>
                    <li>• Track your orders</li>
                    <li>• Get personalized recommendations</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  {isLoading ? "Loading..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <span className="text-gray-500">
                    Already have an account?{" "}
                  </span>
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="text-black font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={handleClose}
                    className="text-gray-500 text-sm hover:text-gray-700"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default GentleSignupPrompt
