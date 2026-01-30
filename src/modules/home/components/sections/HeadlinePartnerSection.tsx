import { useGSAP } from "@gsap/react"
import GradientText from "./../GradientText/GradientText"
import gsap from "gsap"

function HeadlinePartnerSection() {
  useGSAP(() => {
    gsap.to(".headline2-header", {
      x: "0",
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      scrollTrigger: {
        trigger: ".headline2-section",
        start: "top bottom",
        toggleActions: "play complete complete pause",
      },
    })

    gsap.to(".headline2-content", {
      x: "0",
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      scrollTrigger: {
        trigger: ".headline2-section",
        start: "top bottom",
        toggleActions: "play complete complete pause",
      },
    })
  })
  return (
    <section className="headline2-section flex md:flex-row flex-col flex-wrap md:px-16 items-center md:gap-3 pb-8 md:pb-0 2xsmall:overflow-hidden justify-center ">
      <div className="headline2-header opacity-0 blur-lg -translate-x-40">
        <GradientText
          animationSpeed={3} // faster
          showBorder={false}
        >
          Become a Distributor/Partner
        </GradientText>
      </div>
      <div className="headline2-content opacity-0 blur-lg translate-x-40 w-[50%]">
        <div className="w-full text-center">
          <a
            href="/distributor-partner"
            className="inline-block bg-[#212121] text-white font-medium py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors uppercase w-full"
          >
            Start Now!
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeadlinePartnerSection
