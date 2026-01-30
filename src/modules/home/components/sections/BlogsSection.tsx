import { useGSAP } from "@gsap/react"
import CardSwap, { Card } from "./../CardSwap/CardSwap"
import gsap from "gsap"
import { useMediaQuery } from "react-responsive"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function BlogsSection() {
  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  })
  useGSAP(() => {
    gsap.to(".blog-header", {
      x: "50%",
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      scrollTrigger: {
        trigger: ".blog-section",
        start: "top center",
        toggleActions: "play complete complete pause",
      },
    })
  })

  return (
    <section className="blog-section 2xsmall:w-screen 2xsmall:h-[115dvh] bg-[#F3F4F6] relative overflow-hidden 2xsmall:overflow-hidden">
      <header className="blog-header w-6/12 absolute md:top-1/2 md:-translate-y-1/2 left-0 -translate-x-[16.7%] opacity-0 blur-lg top-[16.7%] z-20">
        <h2 className="text-[#212121] font-bold text-4xl mb-3.5">
          Dont't forget to check our Blogs
        </h2>
        <p className="text-gray-500 font-semibold text-lg">Have a look!</p>
        <LocalizedClientLink
          href="/blog"
          className="uppercase text-white inline-block rounded-xl bg-[#212121] py-2 px-4 cursor-pointer hover:shadow-2xl transition-all duration-400 text-sm mt-4"
        >
          Explore the Blog
        </LocalizedClientLink>
      </header>
      <div
        style={{ height: isTablet ? "200px" : "600px", position: "relative" }}
      >
        <CardSwap
          cardDistance={60}
          verticalDistance={80}
          delay={3000}
          pauseOnHover={false}
          width={isTablet ? 200 : 500}
        >
          <Card>
            <div className="h-full shadow-sm">
              <div className="p-2 h-full rounded-xl">
                <h3 className="uppercase font-bold text-2xl p-3 text-[#212121] border-b-1 border-[#e4e4e7]">
                  doula soap
                </h3>
                <figure>
                  <img
                    src="/images/soap.png"
                    alt="soap"
                    className="w-8/12 block rounded-lg m-3"
                  />
                </figure>
                <p className="text-gray-500 font-semibold text-lg ms-3">
                  Gentle postpartum cleansing that supports...
                </p>
                <LocalizedClientLink
                  href="/blog"
                  className="uppercase text-white w-4/12 rounded-xl bg-[#212121] py-1.5 px-3 cursor-pointer hover:shadow-2xl transition-all duration-400 hover:scale-x-103 md:absolute md:top-74 md:left-5 text-sm ms-3 mt-4 md:ms-0 md:mt-0"
                >
                  Read Now!
                </LocalizedClientLink>
              </div>
            </div>
          </Card>
          <Card>
            <div className="h-full shadow-sm">
              <div className="p-2 h-full rounded-xl">
                <h3 className="uppercase font-bold text-2xl p-3 text-[#212121] border-b-1 border-[#e4e4e7]">
                  SPACEAIDS FIT
                </h3>
                <figure>
                  <img
                    src="/images/fit.png"
                    alt="soap"
                    className="w-8/12 block rounded-lg m-3"
                  />
                </figure>
                <p className="text-gray-500 font-semibold text-lg ms-3">
                  Designed to pair with skin- protective wearables...
                </p>
                <LocalizedClientLink
                  href="/blog"
                  className="uppercase text-white w-4/12 rounded-xl bg-[#212121] py-1.5 px-3 cursor-pointer hover:shadow-2xl transition-all duration-400 hover:scale-x-103 md:absolute md:top-74 md:left-5 text-sm ms-3 mt-4 md:ms-0 md:mt-0"
                >
                  Read Now!
                </LocalizedClientLink>
              </div>
            </div>
          </Card>
          <Card>
            <div className="h-full shadow-sm">
              <div className="p-2 h-full rounded-xl">
                <h3 className="uppercase font-bold text-2xl p-3 text-[#212121] border-b-1 border-[#e4e4e7]">
                  BITES & MIGHTs
                </h3>
                <figure>
                  <img
                    src="/images/bites.png"
                    alt="soap"
                    className="w-8/12 block rounded-lg m-3"
                  />
                </figure>
                <p className="text-gray-500 font-semibold text-lg ms-3">
                  Rapid relief from insect bites and skin...
                </p>
                <LocalizedClientLink
                  href="/blog"
                  className="uppercase text-white w-4/12 rounded-xl bg-[#212121] py-1.5 px-3 cursor-pointer hover:shadow-2xl transition-all duration-400 hover:scale-x-103 md:absolute md:top-74 md:left-5 text-sm ms-3 mt-4 md:ms-0 md:mt-0"
                >
                  Read Now!
                </LocalizedClientLink>
              </div>
            </div>
          </Card>
          <Card>
            <div className="h-full shadow-sm">
              <div className="p-2 h-full rounded-xl">
                <h3 className="uppercase font-bold text-2xl p-3 text-[#212121] border-b-1 border-[#e4e4e7]">
                  ECO-Friendly
                </h3>
                <figure>
                  <img
                    src="/images/eco.png"
                    alt="soap"
                    className="w-8/12 block rounded-lg m-3"
                  />
                </figure>
                <p className="text-gray-500 font-semibold text-lg ms-3">
                  Biodegradable formula with minimal waste...
                </p>
                <LocalizedClientLink
                  href="/blog"
                  className="uppercase text-white w-4/12 rounded-xl bg-[#212121] py-1.5 px-3 cursor-pointer hover:shadow-2xl transition-all duration-400 hover:scale-x-103 md:absolute md:top-74 md:left-5 text-sm ms-3 mt-4 md:ms-0 md:mt-0"
                >
                  Read Now!
                </LocalizedClientLink>
              </div>
            </div>
          </Card>
        </CardSwap>
      </div>
    </section>
  )
}

export default BlogsSection
