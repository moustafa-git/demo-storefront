"use client"

import { testimonials } from "./../../constants"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useMediaQuery } from "react-responsive"

gsap.registerPlugin(ScrollTrigger)

const TestimonialSection = ({ smootherReady }) => {
  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  })
  useGSAP(() => {
    if (isTablet) return

    if (!smootherReady) return // wait until ScrollSmoother is ready

    const section = document.querySelector(".testimonials-section")
    if (!section) return

    // Headings animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    })

    tl.to(".testimonials-section .first", { xPercent: 70 })
      .to(".testimonials-section .sec", { xPercent: 25 }, "<")
      .to(".testimonials-section .third", { xPercent: -50 }, "<")

    // Pinned cards animation
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "10% top",
        end: "200% top",
        scrub: 1,
        pin: true,
      },
    })

    pinTl.from(".vd-card", {
      yPercent: 200,
      stagger: 0.2,
      ease: "power1.inOut",
    })
  }, [smootherReady]) // re-run when smootherReady becomes true

  return (
    <section className="testimonials-section bg-[#F3F4F6] relative w-full h-[120dvh] 2xsmall:overflow-hidden 2xsmall:h-fit 2xsmall:py-5">
      <div className="absolute size-full flex flex-col items-center pt-[5vw] 2xsmall:static">
        <h1 className="text-black text-9xl first leading-[105%] tracking-[-.4vw] ml-[2vw] font-bold uppercase 2xsmall:text-[90px]">
          What's
        </h1>
        <h1 className="text-[#C10007] text-9xl sec leading-[105%] tracking-[-.4vw] ml-[2vw] font-bold uppercase 2xsmall:text-[90px]">
          Everyone
        </h1>
        <h1 className="text-black text-9xl third leading-[105%] tracking-[-.4vw] ml-[2vw] font-bold uppercase 2xsmall:text-[90px]">
          Talking
        </h1>
      </div>

      <div className="pin-box flex items-center justify-center w-full md:ps-40 ps-20 absolute md:bottom-[150px] bottom-[50vh] 2xsmall:flex-col 2xsmall:static 2xsmall:py-5">
        {testimonials.map((card, index) => (
          <div
            key={index}
            className={`vd-card md:w-96 w-80 2xsmall:w-52 flex-none md:rounded-[2vw] rounded-3xl -ms-15 overflow-hidden 2xl:relative absolute border 2xsmall:static bg-[#fafafa] border-[#e4e4e7] p-8`}
            style={{
              transform: `${card.rotation || ""} ${card.translation || ""} ${
                card.translationX
              }`,
            }}
          >
            <h4 className="text-[#212121] tracking-wide leading-6 mb-3 font-semibold text-lg">
              &quot;{card.quote}&quot;
            </h4>
            <h5 className="text-[#212121] tracking-wide leading-6 mb-3 text-md">
              {card.name}
            </h5>
            <h6 className="text-gray-500 tracking-wide">{card.role}</h6>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection
