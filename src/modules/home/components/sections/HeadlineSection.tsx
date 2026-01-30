import { useGSAP } from "@gsap/react"
import GradientText from "./../GradientText/GradientText"
import gsap from "gsap"

function HeadlineSection() {
  useGSAP(() => {
    gsap.to(".headline-header", {
      x: "0",
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      scrollTrigger: {
        trigger: ".headline-section",
        start: "top bottom",
        toggleActions: "play complete complete pause",
      },
    })

    gsap.to(".headline-content", {
      x: "0",
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      scrollTrigger: {
        trigger: ".headline-section",
        start: "top bottom",
        toggleActions: "play complete complete pause",
      },
    })
  })
  return (
    <section className="headline-section flex md:flex-row flex-col flex-wrap md:px-16 items-center md:gap-3 pb-8 md:pb-0 2xsmall:overflow-hidden">
      <div className="headline-header opacity-0 blur-lg -translate-x-40">
        <GradientText
          animationSpeed={3} // faster
          showBorder={false}
        >
          Ready to take control of your breath recovery?
        </GradientText>
      </div>
      <div className="headline-content opacity-0 blur-lg translate-x-40 2xsmall:w-4/5">
        <p className="text-gray-500 font-semibold text-xl mb-5 2xsmall:text-center">
          Get the support you need with FibroPrecision now!
        </p>
        <button className="uppercase text-white md:w-1/2 w-full rounded-xl bg-[#212121] py-1.5 px-3 cursor-pointer hover:shadow-2xl transition-all duration-400 hover:scale-x-103 text-xl">
          start Now!
        </button>
      </div>
    </section>
  )
}

export default HeadlineSection
