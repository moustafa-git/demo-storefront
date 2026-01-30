/**
 * Demo Mode Configuration
 * 
 * This file controls demo-specific behavior for Envato preview.
 * When NEXT_PUBLIC_DEMO_MODE is true, cart/checkout features are disabled
 * but all product browsing and 3D customization features remain fully functional.
 */

// Check if demo mode is enabled
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

// Envato item URL - update this with your actual Envato item URL
export const ENVATO_ITEM_URL = "https://codecanyon.net/user/sokomoto"

// Demo restriction messages
export const demoMessages = {
  addToCart: "This is a demo version. Purchase the full version on Envato to enable cart functionality.",
  checkout: "Checkout is disabled in demo mode. Get the full version on Envato to enable purchases.",
  cart: "Cart functionality is disabled in the demo. The full version includes complete e-commerce features.",
  account: "Account features are limited in demo mode.",
  general: "You're viewing a demo of SpaceAids Storefront. All 3D customization features are fully functional!",
}

// Features disabled in demo mode
export const demoRestrictions = {
  cart: true,       // Disable add-to-cart functionality
  checkout: true,   // Disable checkout process
  payment: true,    // Disable payment processing
  orders: true,     // Disable order history/management
  wishlist: false,  // Keep wishlist for demo purposes
  account: false,   // Keep account features (optional)
}

// Demo banner configuration
export const demoBannerConfig = {
  enabled: true,
  position: "bottom" as const, // "top" | "bottom"
  dismissible: true,
  showPurchaseButton: true,
  purchaseButtonText: "Get Full Version",
  message: "🎨 Demo Mode: Explore all 3D customization features! Cart & checkout are disabled.",
}
