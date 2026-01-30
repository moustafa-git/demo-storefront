"use client"

import dynamic from "next/dynamic"

// Import your heavy section dynamically, CSR-only
const HeroSection = dynamic(
  () => import("@modules/home/components/sections/HeroSection"),
  { ssr: false }
)

export default function SectionsWrapper() {
  return <HeroSection />
}
