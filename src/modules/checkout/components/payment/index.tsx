"use client"

import { isStripe as isStripeFunc, isManual, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx, RadioGroup, Label } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripePaymentElementChangeEvent } from "@stripe/stripe-js"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )
  const stripeReady = useContext(StripeContext)

  const [isLoading, setIsLoading] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stripeComplete, setStripeComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [selectedProviderId, setSelectedProviderId] = useState<string>("pp_stripe_stripe")

  const stripe = stripeReady ? useStripe() : null
  const elements = stripeReady ? useElements() : null

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // Check if COD is available
  const hasCodOption = availablePaymentMethods?.some(
    (method: any) => method.id === "pp_system_default"
  )
  const hasStripeOption = availablePaymentMethods?.some(
    (method: any) => isStripeFunc(method.id)
  )

  const isCodSelected = selectedProviderId === "pp_system_default"
  const isStripeSelected = isStripeFunc(selectedProviderId)

  // Debug: Log available payment methods
  console.log("Available payment methods:", availablePaymentMethods)
  console.log("Has COD option:", hasCodOption)
  console.log("Has Stripe option:", hasStripeOption)

  const handlePaymentElementChange = async (
    event: StripePaymentElementChangeEvent
  ) => {
    if (event.value.type) {
      setSelectedPaymentMethod(event.value.type)
    }
    setStripeComplete(event.complete)
    if (event.complete) {
      setError(null)
    }
  }

  const handleProviderChange = async (providerId: string) => {
    setError(null)
    setSelectedProviderId(providerId)
    setIsLoading(true)
    
    try {
      await initiatePaymentSession(cart, { provider_id: providerId })
      if (isManual(providerId)) {
        setSelectedPaymentMethod("cod")
      }
    } catch (err: any) {
      console.error("Failed to switch payment method:", err)
      setError("Failed to switch payment method. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // For COD, we just proceed directly
      if (isCodSelected) {
        router.push(pathname + "?" + createQueryString("step", "review"), {
          scroll: false,
        })
        return
      }

      // For Stripe, validate elements
      if (!stripe || !elements) {
        setError("Payment processing not ready. Please try again.")
        return
      }

      await elements.submit().catch((err) => {
        console.error(err)
        setError(err.message || "An error occurred with the payment")
        return
      })

      router.push(pathname + "?" + createQueryString("step", "review"), {
        scroll: false,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const initPayment = async () => {
    try {
      // Default to Stripe if available, otherwise use first available method
      const defaultProvider = hasStripeOption 
        ? "pp_stripe_stripe" 
        : availablePaymentMethods?.[0]?.id || "pp_stripe_stripe"
      
      setSelectedProviderId(defaultProvider)
      await initiatePaymentSession(cart, {
        provider_id: defaultProvider,
      })
    } catch (err) {
      console.error("Failed to initialize payment session:", err)
      // If Stripe fails but COD is available, try COD instead
      if (hasCodOption) {
        console.log("Stripe failed, falling back to COD")
        setSelectedProviderId("pp_system_default")
        try {
          await initiatePaymentSession(cart, {
            provider_id: "pp_system_default",
          })
        } catch (codErr) {
          console.error("Failed to initialize COD session:", codErr)
          setError("Failed to initialize payment. Please try again.")
        }
      } else {
        setError("Failed to initialize payment. Please try again.")
      }
      // Unblock the loading spinner even on error
      setLoadingPayment(false)
    }
  }

  useEffect(() => {
    if (!activeSession && isOpen) {
      initPayment()
    }
  }, [cart, isOpen, activeSession])

  useEffect(() => {
    setError(null)
  }, [isOpen])

  // show spinner until session is ready or there's an error
  // For COD, we don't need stripeReady
  useEffect(() => {
    if (activeSession || paidByGiftcard) {
      // If COD is selected, don't wait for Stripe
      if (isCodSelected || !isStripeSelected) {
        setLoadingPayment(false)
      } else if (stripeReady) {
        setLoadingPayment(false)
      }
    }
    // Also unblock if we have payment methods but no session yet (allows selection)
    if (isOpen && availablePaymentMethods?.length && !loadingPayment) {
      // Already unblocked
    }
  }, [activeSession, paidByGiftcard, stripeReady, isCodSelected, isStripeSelected, availablePaymentMethods, isOpen])

  // Determine if we can proceed
  const canProceed = () => {
    if (paidByGiftcard) return true
    if (isCodSelected && activeSession) return true
    if (isStripeSelected && stripeComplete && stripe && elements) return true
    return false
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {loadingPayment ? (
            <div className="flex justify-center items-center py-10">
              <Spinner className="w-6 h-6 text-ui-fg-subtle" />
              <span className="ml-2 text-ui-fg-subtle">Loading payment...</span>
            </div>
          ) : (
            <>
              {!paidByGiftcard && (hasCodOption || hasStripeOption) && (
                <div className="space-y-4">
                  {/* Payment Method Selection */}
                  {hasCodOption && hasStripeOption && (
                    <div className="mb-6">
                      <Text className="txt-medium-plus text-ui-fg-base mb-3">
                        Select payment method
                      </Text>
                      <div className="flex flex-col gap-3">
                        {/* Stripe Option */}
                        <label
                          className={clx(
                            "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all",
                            isStripeSelected
                              ? "border-[#C10007] bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <input
                            type="radio"
                            name="payment-provider"
                            value="pp_stripe_stripe"
                            checked={isStripeSelected}
                            onChange={() => handleProviderChange("pp_stripe_stripe")}
                            className="w-4 h-4 text-[#C10007]"
                          />
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            <span className="font-medium">Credit / Debit Card</span>
                          </div>
                        </label>

                        {/* COD Option */}
                        <label
                          className={clx(
                            "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all",
                            isCodSelected
                              ? "border-[#C10007] bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <input
                            type="radio"
                            name="payment-provider"
                            value="pp_system_default"
                            checked={isCodSelected}
                            onChange={() => handleProviderChange("pp_system_default")}
                            className="w-4 h-4 text-[#C10007]"
                          />
                          <div className="flex items-center gap-2">
                            <svg 
                              className="w-5 h-5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
                              />
                            </svg>
                            <span className="font-medium">Cash on Delivery</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Stripe Payment Element */}
                  {isStripeSelected && stripeReady && (
                    <div className="mt-5 transition-all duration-150 ease-in-out">
                      <PaymentElement
                        onChange={handlePaymentElementChange}
                        options={{ layout: "accordion" }}
                      />
                    </div>
                  )}

                  {/* COD Info */}
                  {isCodSelected && (
                    <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <svg 
                          className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <div>
                          <Text className="txt-medium-plus text-ui-fg-base mb-1">
                            Pay when you receive your order
                          </Text>
                          <Text className="txt-small text-ui-fg-subtle">
                            You will pay the delivery person when your order arrives. 
                            Please have the exact amount ready.
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paidByGiftcard && (
                <div className="flex flex-col w-1/3">
                  <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    Payment method
                  </Text>
                  <Text
                    className="txt-medium text-ui-fg-subtle"
                    data-testid="payment-method-summary"
                  >
                    Gift card
                  </Text>
                </div>
              )}

              <ErrorMessage
                error={error}
                data-testid="payment-method-error-message"
              />

              <Button
                size="large"
                className="mt-6"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!canProceed()}
                data-testid="submit-payment-button"
              >
                Continue to review
              </Button>
            </>
          )}
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[activeSession?.provider_id]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isManual(activeSession?.provider_id) 
                      ? "Pay on delivery" 
                      : "Another step may appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
