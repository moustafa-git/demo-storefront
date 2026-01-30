import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/all"
import { useEffect, useRef } from "react"
import { useMediaQuery } from "react-responsive"
import Particles from "../HeroParticles/Particles"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HeroSection = ({ isPreloading }) => {
  const videoRef = useRef(null) // 👈 ref for video
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  })

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  })

  // useGSAP(() => {
  //   const titleSplit = SplitText.create(".hero-title", {
  //     type: "chars",
  //   })

  //   const paragraphSplit = SplitText.create(".hero-paragraph", {
  //     type: "words,chars",
  //   })

  //   const tl = gsap.timeline({
  //     delay: isPreloading ? 4.9 : 0,
  //   })

  //   tl.to(".hero-content", {
  //     opacity: 1,
  //     y: 0,
  //     ease: "power1.inOut",
  //   })
  //     .to(
  //       ".hero-text-scroll",
  //       {
  //         duration: 1,
  //         clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  //         ease: "circ.out",
  //       },
  //       "-=0.5"
  //     )
  //     .from(
  //       titleSplit.chars,
  //       {
  //         yPercent: 200,
  //         stagger: 0.02,
  //         ease: "power2.out",
  //       },
  //       "-=0.5"
  //     )
  //     .from(paragraphSplit.chars, {
  //       x: 150,
  //       opacity: 0,
  //       duration: 0.7,
  //       ease: "power4.out",
  //       stagger: 0.001,
  //     })

  //   const heroTl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: ".hero-container",
  //       start: "1% top",
  //       end: "bottom top",
  //       scrub: true,
  //     },
  //   })
  //   heroTl.to(".hero-container", {
  //     rotate: 7,
  //     scale: 0.9,
  //     yPercent: 30,
  //     ease: "power1.inOut",
  //   })
  // })

  // 2️⃣ Play video after a delay (or after preloader)
  // useEffect(() => {
  //   if (videoRef.current) {
  //     // Delay start by 2 seconds, adjust as needed
  //     const timeout = setTimeout(
  //       () => {
  //         videoRef.current.play().catch((err) => {
  //           console.warn("Video play failed:", err)
  //         })
  //       },
  //       isPreloading ? 3600 : 20
  //     )

  //     return () => clearTimeout(timeout)
  //   }
  // }, [isTablet])

  return (
    <section className="bg-main-bg overflow-hidden">
      <div className="hero-container relative w-screen h-dvh overflow-hidden bg-transparent">
        <Particles
          particleColors={["#C10007", "#212121"]}
          particleCount={200}
          particleSpread={10}
          speed={0.4}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
        <div className=" absolute inset-0 text-[#212121] z-0 ">
          <div className="md:mt-40 flex flex-col 2xl:justify-center items-center 2xl:pt-0 md:pt-32 pt-24 2xsmall:pt-0">
            <h1 className="text-dark-brown  md:text-[6.5rem] text-[3.3rem] font-bold uppercase md:leading-[9vw] tracking-[-.35vw] 2xl:mb-0 mb-5 text-[#212121] text-center 2xsmall:text-[40px] 2xsmall:pt-0">
              Innovative <span className="text-red-700">rapid relief</span>
            </h1>
            <div
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
              className="hero-text-scroll rotate-[-3deg] mb-8 border-[.5vw] border-white"
            >
              <div className="hero-subtitle bg-[rgba(232,226,208,0.5)] shadow-lg">
                <h1 className="uppercase  md:text-[6.5rem] text-[3.3rem] font-bold text-[#212121] md:leading-[9vw] tracking-[-.35vw] 2xl:px-[1.2vw] px-3 2xl:pb-[1vw] pb-5 2xl:py-0 py-3 2xsmall:text-[40px]">
                  <span className="text-red-700">healing</span>{" "}
                  <span className="">skin care!</span>
                </h1>
              </div>
            </div>
            <p
              className="
    hero-paragraph md:text-[#52525B] text-[#212121] absolute bottom-[130px] font-paragraph text-center text-2xl max-w-3xl md:mt-15 leading-[115%] 2xsmall:bottom-40 2xsmall:text-[16px]"
            >
              <span className="text-red-700 font-extrabold">
                Mednauts Skin Rescue
              </span>{" "}
              is a revolutionary skincare solution designed for{" "}
              <span className="text-red-700 font-extrabold">
                rapid relief and healing.
              </span>
            </p>

            <div className="mt-30 md:mt-0 absolute md:bottom-12 flex md:flex-row flex-col gap-11 bottom-60 2xsmall:bottom-64 2xsmall:gap-2">
              <LocalizedClientLink href={"/store"}>
                <button className="cursor-pointer bg-[#212121] text-white py-3 px-5 rounded-b-2xl rounded-tr-2xl hover:bg-transparent hover:border-[#212121] hover:border transition-all duration-500 hover:text-[#212121] hover:scale-105">
                  <span className="text-2xl">Explore Our Products</span>
                </button>
              </LocalizedClientLink>
              <LocalizedClientLink href={"/pricing"}>
                <button className="cursor-pointer bg-red-700 text-white py-3 px-5 rounded-b-2xl rounded-tr-2xl hover:bg-transparent hover:border-red-700 hover:border transition-all duration-500 hover:text-red-700 hover:scale-105">
                  <span className="text-2xl">
                    Get Full Access <span>NOW!</span>
                  </span>
                </button>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
