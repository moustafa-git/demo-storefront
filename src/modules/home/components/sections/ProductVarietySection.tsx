import { useState } from "react"
import Folder from "./../Folder/Folder"
import { Card, CardContent } from "./../card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./../carousel"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const cardInfo = [
  [
    {
      title: "Tip to Toe Burn, Itch, & Heal",
      desc: "Soothe burns, irritation, and swelling instantly with a fast-acting formula. Designed for full-body care, it provides quick relief while promoting skin recovery.",
      imageSrc: "/images/tiptoe.png",
    },
    {
      title: "Bite & Nail Healing",
      desc: "Stop itching and heal nail wounds with a protective antimicrobial formula. It soothes irritation and helps prevent infection for healthier skin and nails.",
      imageSrc: "/images/bitenail.png",
    },
    {
      title: "Lips and Body Refresh",
      desc: "Hydrate and refresh your lips and body with a gentle nourishing formula. Perfect for daily use, it restores moisture and soothes sensitive skin.",
      imageSrc: "/images/lipsbody.png",
    },
  ],
  [
    {
      title: "Face Aesthetic follow-up",
      desc: "Even out skin tone and reduce irritation with a calming post- care formula. It supports skin recovery, leaving you with a smooth, refreshed complexion.",
      imageSrc: "/images/faceup.png",
    },
    {
      title: "pH Tracked Massage",
      desc: "Balance your skin’s pH while hydrating and soothing with every massage. This gentle formula keeps your skin refreshed, soft, and irritation-free.",
      imageSrc: "/images/phtrack.png",
    },
    {
      title: "Sprayed & Sensitive",
      desc: "Designed for fragile, reactive skin, this lightweight formula offers non-irritating protection. It absorbs quickly, providing comfort without heaviness.",
      imageSrc: "/images/spray.png",
    },
  ],
  [
    {
      title: "en Rouge",
      desc: "Bring out a natural, rosy glow while soothing and hydrating the skin. This elegant formula enhances beauty while providing instant relief.",
      imageSrc: "/images/rouge.png",
    },
    {
      title: "Buises Black and Blue",
      desc: "Reduce discoloration and tender skin with a fast-absorbing healing blend. Speeds up bruise recovery while calming inflammation.",
      imageSrc: "/images/buises.png",
    },
    {
      title: "Bites and Mites",
      desc: "Soothe itchy, inflamed skin and protect against irritation from bites and mites. Its anti-itch properties provide instant relief and lasting comfort.",
      imageSrc: "/images/mites.png",
    },
  ],
  [
    {
      title: "Dandruff Dye and Dry",
      desc: "Combat flakes, dryness, and scalp irritation with a soothing, scalp-friendly formula. Hydrates and balances to restore healthy, flake-free hair.",
      imageSrc: "/images/dandruff.png",
    },
    {
      title: "Beard Trouble",
      desc: "Hydrate coarse hair and calm irritated skin for a comfortable, itch-free beard. This nourishing formula prevents dryness and soothes sensitivity.",
      imageSrc: "/images/beard.png",
    },
    {
      title: "Scabs Black & Only",
      desc: "Brighten dark circles and speed up scab healing with targeted care. It softens delicate skin, reducing discoloration and rough texture.",
      imageSrc: "/images/mites.png",
    },
  ],
]

function ProductVarietySection() {
  const [showCarousel, setShowCarousel] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeFolder, setActiveFolder] = useState(null)

  useGSAP(() => {
    gsap.to(".product-variety-header", {
      y: "0",
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      scrollTrigger: {
        trigger: ".partner-section",
        start: "top center",
        toggleActions: "play complete complete complete",
      },
    })

    gsap.to(".folder", {
      y: "0",
      opacity: 1,
      duration: 1.2,
      stagger: 0.5,
      scrollTrigger: {
        trigger: ".partner-section",
        start: "top center",
        toggleActions: "play complete complete pause",
      },
    })
  })

  return (
    <section className="partner-section min-h-[80dvh] relative bg-[#F3F4F6]">
      <header className="product-variety-header opacity-0 -translate-y-[120px] blur-xl">
        <h2 className="text-center pt-[60px] font-bold text-4xl text-[#212121]">
          Total Care Collection{" "}
        </h2>
        <p className="text-gray-500 font-semibold text-xl text-center pt-8">
          Post-care, beauty boosts, and relief remedies—all in one place.
        </p>
      </header>
      {/* Background blur overlay (click to close) */}
      {showCarousel && (
        <div
          className="absolute inset-0 backdrop-blur-sm bg-gray-50/70 z-40"
          onClick={() => setShowCarousel(false)}
        />
      )}

      {/* Carousel */}
      {showCarousel && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          onClick={(e) => e.stopPropagation()} // prevent backdrop click
        >
          {/* X button */}
          <button
            onClick={() => setShowCarousel(false)}
            className="absolute -top-12 -right-12 flex items-center justify-center w-10 h-10 rounded-full hover:scale-110 transition-transform duration-300 hover:text-[#C10007] cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Carousel itself */}
          <Carousel
            className="w-full max-w-xs bg-[#fafafa]"
            opts={{ startIndex: activeIndex }}
          >
            <CarouselContent>
              {cardInfo[activeFolder].map((item, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col">
                        <span className="text-4xl font-semibold">
                          {
                            <div>
                              <img
                                src={`${item.imageSrc}`}
                                alt="tiptoe"
                                className="w-full block border border-[#e4e4e7] bg-[#F5F5F5] rounded-lg"
                              />
                              <figcaption>
                                <h3 className="text-[#212121] font-semibold text-2xl text-center my-3">
                                  {item.title}
                                </h3>
                                <p className="text-gray-500 font-semibold text-lg text-center leading-7 tracking-wide">
                                  {item.desc}
                                </p>
                              </figcaption>
                            </div>
                          }
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Other content (Folder opens carousel) */}
      <div
        className="md:w-9/12 mx-auto md:absolute md:top-2/3 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:z-20 border border-[#e4e4e7] bg-[#fafafa] p-16 rounded-lg
      w-9/12 md:mt-0 mt-8"
      >
        <ul className="flex flex-wrap md:justify-between md:flex-row flex-col md:gap-0 gap-8">
          <li
            className="folder opacity-0 translate-y-[120px] flex flex-col justify-center items-center"
            onClick={() => setActiveFolder(0)}
          >
            <Folder
              size={1}
              color="#C10007"
              className="custom-folder cursor-pointer"
              setShowCarousel={setShowCarousel}
              setActiveIndex={setActiveIndex}
              activeFolder={activeFolder}
            />
            <h3 className="text-[#212121] font-semibold text-lg md:text-xl mt-3">
              What kind of care can I acces?
            </h3>
          </li>
          <li
            className="folder opacity-0 translate-y-[120px] flex flex-col justify-center items-center"
            onClick={() => setActiveFolder(1)}
          >
            <Folder
              size={1}
              color="#C10007"
              className="custom-folder cursor-pointer"
              setShowCarousel={setShowCarousel}
              setActiveIndex={setActiveIndex}
              activeFolder={activeFolder}
            />
            <h3 className="text-[#212121] font-semibold  md:text-xl text-lg mt-3">
              What about my after up-keep?
            </h3>
          </li>
          <li
            className="folder opacity-0 translate-y-[120px] flex flex-col justify-center items-center"
            onClick={() => setActiveFolder(2)}
          >
            <Folder
              size={1}
              color="#C10007"
              className="custom-folder cursor-pointer"
              setShowCarousel={setShowCarousel}
              setActiveIndex={setActiveIndex}
              activeFolder={activeFolder}
            />
            <h3 className="text-[#212121] font-semibold  md:text-xl text-lg mt-3">
              What about makeup and occasions?
            </h3>
          </li>
          <li
            className="folder opacity-0 translate-y-[120px] flex flex-col justify-center items-center"
            onClick={() => setActiveFolder(3)}
          >
            <Folder
              size={1}
              color="#C10007"
              className="custom-folder cursor-pointer"
              setShowCarousel={setShowCarousel}
              setActiveIndex={setActiveIndex}
              activeFolder={activeFolder}
            />
            <h3 className="text-[#212121] font-semibold  md:text-xl text-lg mt-3">
              and much much more...
            </h3>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default ProductVarietySection
