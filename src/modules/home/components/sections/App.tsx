"use client"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { ScrollSmoother, ScrollTrigger } from "gsap/all"
import gsap from "gsap"
import HeroSection from "./HeroSection"
import MessageSection from "./MessageSection"
import ProductVarietySection from "./ProductVarietySection"
import PricingSection from "./PricingSection"
import BlogsSection from "./BlogsSection"
import PartnerSection from "./PartnerSection"
import TestimonialSection from "./TestimonialSection"
import HeadlineSection from "./HeadlineSection"
import HeadlinePartnerSection from "./HeadlinePartnerSection"
import FooterSection from "./FooterSection"
import ThreeDProductsSection from "./ThreeDProductsSection"
import Preloader from "../Preloader"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function ClientApp({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  const [smootherReady, setSmootherReady] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)

  useEffect(() => {
    // Initialize ScrollSmoother
    const smoother = ScrollSmoother.create({
      smooth: 3,
      effects: true,
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
    })

    const handleLoad = () => {
      const loader = document.getElementById("preloader")
      loader.classList.add("hidden")
      setIsPreloading(true)
    }

    window.addEventListener("load", handleLoad)

    setSmootherReady(true) // now GSAP animations can safely run

    return () => {
      smoother.kill()
      window.removeEventListener("load", handleLoad)
    }
  }, [])

  return (
    <main>
      {isPreloading && <Preloader setIsPreloading={setIsPreloading} />}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div id="hero">
            <HeroSection isPreloading={isPreloading} />
          </div>
          <div id="message">
            <MessageSection />
          </div>
          <div id="product-variety">
            <ProductVarietySection />
          </div>
          <div id="three-d-products">
            <ThreeDProductsSection collections={collections} region={region} />
          </div>
          <div id="pricing">
            <PricingSection />
          </div>
          <div id="blogs">
            <BlogsSection />
          </div>
          <div id="partners">
            <PartnerSection />
          </div>
          <div id="headline">
            <HeadlinePartnerSection />
          </div>
          <div id="testimonials">
            <TestimonialSection smootherReady={smootherReady} />
          </div>
          <div id="headline">
            <HeadlineSection />
          </div>
          <div id="footer">
            <FooterSection />
          </div>
        </div>
      </div>
    </main>
  )
}
