import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/all"
import DotGrid from "./../DotGrid/DotGrid"

const MessageSection = () => {
  useGSAP(() => {
    const firstMsgSplit = SplitText.create(".first-message", {
      type: "words",
    })
    const secMsgSplit = SplitText.create(".second-message", {
      type: "words",
    })
    const paragraphSplit = SplitText.create(".message-content p", {
      type: "words, lines",
      linesClass: "paragraph-line",
    })

    gsap.to(firstMsgSplit.words, {
      color: "#18181B",
      ease: "power1.in",
      stagger: 1,
      scrollTrigger: {
        trigger: ".message-content",
        start: "top center",
        end: "30% center",
        scrub: true,
      },
    })
    gsap.to(secMsgSplit.words, {
      color: "#18181B",
      ease: "power1.in",
      stagger: 1,
      scrollTrigger: {
        trigger: ".second-message",
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    })

    const revealTl = gsap.timeline({
      delay: 1,
      scrollTrigger: {
        trigger: ".msg-text-scroll",
        start: "top 60%",
      },
    })
    revealTl.to(".msg-text-scroll", {
      duration: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "circ.inOut",
    })

    const paragraphTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".message-content p",
        start: "top center",
      },
    })
    paragraphTl.from(paragraphSplit.words, {
      yPercent: 300,
      rotate: 3,
      ease: "power1.inOut",
      duration: 1,
      stagger: 0.01,
    })
  })

  return (
    <>
      <section className="message-content p-0 m-0 bg-[#FAFAFA] text-[#3F3F46] min-h-dvh overflow-hidden flex justify-center items-center relative z-20">
        <div style={{ width: "100%", height: "100%", position: "absolute" }}>
          <DotGrid
            dotSize={6}
            gap={10}
            baseColor="#D2D2D2"
            activeColor="#C10007"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        <div className="container mx-auto flex-center py-28 relative">
          <div className="w-full h-full">
            <div className="msg-wrapper 2xl:text-[8.5rem] md:text-8xl text-5xl font-bold uppercase leading-[9vw] tracking-[-.35vw] flex flex-col justify-center items-center md:gap-24 gap-14">
              <h1 className="first-message 2xl:max-w-4xl md:max-w-2xl max-w-xs text-center  text-[#bdbdcb] 2xsmall:leading-[50px]">
                From soap to serum, lip gloss to spray
              </h1>

              <div
                style={{
                  clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
                }}
                className="msg-text-scroll rotate-[3deg] 2xl:translate-y-5 -translate-y-5 absolute z-10 border-[.5vw] border-[#9ca3af] md:mt-28 mt-12"
              >
                <div className="bg-[rgba(232,226,208,1)] md:pb-5 pb-3 px-5 2xsmall:py-4">
                  <h2 className="text-red-700">All-in-One Care</h2>
                </div>
              </div>

              <h1 className="second-message mt-2.5 md:mt-10 2xl:max-w-7xl md:max-w-4xl max-w-xs text-center  text-[#bdbdcb] 2xsmall:leading-[50px]">
                that calms bites, clears acne, and soothes burns
              </h1>
            </div>

            {/* <div className="flex-center md:mt-20 mt-10">
            <div className="max-w-md px-10 flex-center overflow-hidden">
              <p>
                Rev up your rebel spirit and feed the adventure of life with
                SPYLT, where you’re one chug away from epic nostalgia and
                fearless fun.
              </p>
            </div>
          </div> */}
          </div>
        </div>
      </section>
    </>
  )
}

export default MessageSection
