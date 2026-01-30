import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollStackItem } from "./../ScrollStack/ScrollStack"
import SpotlightCard from "./../SpotlightCard/SpotlightCard"
import { useMediaQuery } from "react-responsive"

import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

function PartnerSection() {
  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  })

  //   useGSAP(() => {
  //     if (!isTablet) {
  //       const sections = gsap.utils.toArray(".item")
  //       const wrapper = document.querySelector(".scroll-wrapper")

  //       gsap.set(wrapper, { display: "flex" })
  //       gsap.set(sections, { flex: "0 0 100%", width: "100%" })

  //       gsap
  //         .timeline({
  //           defaults: { ease: "none" },
  //           scrollTrigger: {
  //             trigger: ".product-info",
  //             start: "top top",
  //             end: () => `+=${(sections.length - 1) * window.innerHeight}`,
  //             scrub: 1,
  //             pin: true,
  //             snap: 1 / (sections.length - 1), // snap to panels
  //           },
  //         })
  //         .to(wrapper, {
  //           x: () => -(wrapper.scrollWidth - window.innerWidth),
  //           ease: "none",
  //         })
  //     }
  //   })

  useGSAP(() => {
    if (!isTablet) {
      const wrapper = document.querySelector(".scroll-wrapper")
      const items = gsap.utils.toArray(".item")

      if (!wrapper || items.length < 2) return

      // Make wrapper horizontal
      gsap.set(wrapper, { display: "flex" })
      gsap.set(items, { flex: "0 0 100%", width: "100%" })

      gsap.to(wrapper, {
        x: () => -(wrapper.scrollWidth - window.innerWidth), // scroll full width
        ease: "none",
        scrollTrigger: {
          trigger: ".product-info",
          start: "top top",
          end: () => `+=${(items.length - 1) * window.innerWidth}`,
          scrub: 1,
          pin: true,
          snap: 1 / (items.length - 1), // snap exactly to the next panel
        },
      })
    }
  })

  return (
    <section className="product-info bg-[#fafafa] border-t border-[#e4e4e7] overflow-hidden">
      {/* Wrapper for horizontal panels */}
      <div className="scroll-wrapper">
        <ScrollStackItem itemNumber={1}>
          <h2 className=" text-[#212121] text-4xl text-center my-3 font-bold mb-5">
            Want to be a distributor or a reseller?
          </h2>
          <div className="flex justify-between flex-wrap items-stretch ">
            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure>
                    <img src="/images/vending.png" className="block w-full" />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2">
                      VENDING MACHINE
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Boost sales with impulse buys</li>
                      <li>Convenient access encourages instant purchases.</li>
                      <li>Compact size fits vending setups easily.</li>
                      <li>
                        Increases revenue with high- demand self-care items.
                      </li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>
            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure>
                    <img
                      src="/images/supermarket.png"
                      className="block w-full"
                    />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2 uppercase">
                      supermarket
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Drive repeat purchases effortlessly</li>
                      <li>
                        Essential self-care items attract loyal customers.
                      </li>
                      <li>
                        Easy integration into existing product categories.
                      </li>
                      <li>High turnover due to daily shopper traffic.</li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>

            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure>
                    <img src="/images/salon.png" className="block w-full" />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2 uppercase">
                      salons
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Enhance client care experience</li>
                      <li>Perfect upsell for post- treatment recovery.</li>
                      <li>Builds salon reputation with premium after-care.</li>
                      <li>Encourages repeat visits for maintenance.</li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>
            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure>
                    <img src="/images/personal.png" className="block w-full" />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2 uppercase">
                      PERSONAL
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Stock up for daily care</li>
                      <li>Always have essentials when needed.</li>
                      <li>Saves time with convenient at- home use.</li>
                      <li>Ensures long-term skin and hygiene health.</li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemNumber={2}>
          <h2 className=" text-[#212121] text-4xl text-center my-3 font-bold mb-5">
            Want to be a distributor or a reseller?
          </h2>
          <div className="flex justify-between flex-wrap items-stretch ">
            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure>
                    <img src="/images/gym.png" className="block w-full" />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2 uppercase">
                      gym
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Improve post-workout hygiene</li>
                      <li>Helps prevent skin irritation after exercise.</li>
                      <li>Encourages proper self-care among members.</li>
                      <li>Strengthens gym brand with thoughtful amenities.</li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>
            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure>
                    <img src="/images/outlets.png" className="block w-full" />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2 uppercase">
                      outlets
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Increase foot traffic & sales</li>
                      <li>Attractive add-on to specialty retail.</li>
                      <li>Enhances customer shopping experience.</li>
                      <li>
                        Drives impulse purchases with strategic placement.
                      </li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>

            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure className="w-full md:h-[152px] h-[220px]">
                    <img
                      src="/images/mall.png"
                      className="block w-full h-full object-cover"
                    />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2 uppercase">
                      malls
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Capitalize on self-care trends</li>
                      <li>Fits modern consumer wellness habits.</li>
                      <li>
                        Appeals to beauty, fashion, and lifestyle shoppers.
                      </li>
                      <li>Great for kiosk, pop-up, or store integration.</li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>
            <div className="md:w-3/12 w-full p-5 flex">
              <SpotlightCard spotlightColor="rgba(193, 0, 7,0.2)">
                <div className="flex flex-wrap flex-col items-center text-center">
                  <figure className="w-full md:h-[152px] h-[220px]">
                    <img
                      src="/images/cinema.png"
                      className="block w-full h-full object-cover"
                    />
                  </figure>
                  <figcaption>
                    <h3 className="font-semibold text-[#212121] text-2xl mt-2 tracking-wide border-b-1 p-2 uppercase">
                      cinema
                    </h3>
                    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500 leading-relaxed text-left py-3 tracking-wide">
                      <li>Offer quick self-care solutions</li>
                      <li>Ideal for on-the-go hygiene fixes.</li>
                      <li>Enhances concession stand profitability.</li>
                      <li>Perfect for last-minute grooming needs.</li>
                    </ul>
                  </figcaption>
                </div>
              </SpotlightCard>
            </div>
          </div>
          {/* <div className="w-full text-center mt-12">
            <a 
              href="/distributor-partner" 
              className="inline-block bg-[#212121] text-white font-medium py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Become a Distributor/Partner
            </a>
          </div> */}
        </ScrollStackItem>
      </div>
    </section>
  )
}

export default PartnerSection
