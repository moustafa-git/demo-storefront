"use client"
import Spinner from "@modules/common/icons/spinner"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"
import { ScrollTrigger } from "gsap/all"
import ProfileCard from "./ProfileCard/ProfileCard"
import imagesLoaded from "imagesloaded"
import { listProducts } from "@lib/data/products" // Adjust import based on your project structure
import Particles from "./Particles/Particles"

gsap.registerPlugin(ScrollTrigger)

const FlavorSlider = ({ collections, region }) => {
  const sliderRef = useRef()
  const wrapperRef = useRef()

  const [isCollections, setIsCollections] = useState(false)
  const [productsByCollection, setProductsByCollection] = useState({}) // Store products for each collection

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  })

  // Fetch products for each collection
  useEffect(() => {
    if (!collections || !region || collections.length === 0) return

    const fetchProducts = async () => {
      const productsMap = {}
      try {
        for (const collection of collections) {
          const {
            response: { products: pricedProducts },
          } = await listProducts({
            regionId: region.id,
            queryParams: {
              collection_id: collection.id,
              fields: "*variants.calculated_price",
              limit: 5,
            },
          })

          if (pricedProducts) {
            productsMap[collection.id] = pricedProducts
          }
        }
        setProductsByCollection(productsMap)
        setIsCollections(true)
      } catch (error) {
        console.error("Error fetching products:", error)
        setIsCollections(true) // Proceed even if some fetches fail
      }
    }

    fetchProducts()
  }, [collections, region])

  useGSAP(() => {
    const wrapperFlavor = wrapperRef.current
    if (isTablet) return
    if (!wrapperFlavor || !isCollections) return

    const scrollAmount = wrapperFlavor.scrollWidth - window.innerWidth + 1300

    gsap.to(".flavor-section", {
      x: -scrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: `+=${scrollAmount}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    })

    // Title animations
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top 40%",
        end: "bottom 80%",
        scrub: true,
      },
    })

    titleTl
      .to(".first-text-split", {
        xPercent: -30,
        ease: "power1.inOut",
      })
      .to(
        ".flavor-text-scroll",
        {
          xPercent: -22,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(
        ".second-text-split",
        {
          xPercent: -10,
          ease: "power1.inOut",
        },
        "<"
      )

    // Refresh after images load
    const imgLoad = imagesLoaded(wrapperFlavor)
    imgLoad.on("done", () => {
      ScrollTrigger.refresh()
    })
  }, [isCollections, isTablet])

  useEffect(() => {
    if (isCollections) {
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
    }
  }, [isCollections])

  return (
    <div
      ref={sliderRef}
      className="slider-wrapper lg:h-dvh min-h-dvh md:min-h-fit w-full mt-0 md:mt-20 xl:mt-0 2xsmall:overflow-hidden"
    >
      <div ref={wrapperRef} className="flavor-wrapper flex">
        <div className="flavors h-full w-full">
          <Particles
            particleColors={["#C10007", "#212121"]}
            particleCount={isTablet ? 90 : 500}
            particleSpread={5}
            speed={0.1}
            particleBaseSize={90}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
            width={isTablet ? "100%" : "5500px"} // Use 100vw for mobile
          />
          <ul className="flex md:flex-row flex-col items-center 2xl:gap-72 lg:gap-52 md:gap-24 gap-7 flex-nowrap 2xsmall:flex-wrap">
            {!isCollections && (
              <>
                <p>LOADING COLLECTIONS...</p>
                <Spinner size={36} />
              </>
            )}
            {isCollections &&
              collections.map((collection) => (
                <li key={collection.id}>
                  <Link href={`/collections/${collection.handle}`}>
                    <ProfileCard
                      name={collection.title}
                      showUserInfo={false}
                      enableTilt={true}
                      enableMobileTilt={false}
                      rotation="6deg"
                      products={productsByCollection[collection.id] || []} // Pass products to ProfileCard
                    />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FlavorSlider
