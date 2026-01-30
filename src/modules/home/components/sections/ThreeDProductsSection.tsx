import FlavorTitle from "./../FlavorTitle"
import FlavorSlider from "./../FlavorSlider"
import Particles from "../Particles/Particles"

const ThreeDProductsSection = ({ collections, region }) => {
  return (
    <section className="flavor-section min-h-dvh 2xsmall:overflow-hidden">
      <div>
        <div className="h-full flex lg:flex-row flex-col items-center relative">
          <Particles
            particleColors={["#C10007", "#212121"]}
            particleCount={500}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
          <div className="lg:w-[57%] flex-none h-80 lg:h-full md:mt-20 xl:mt-0">
            <FlavorTitle />
          </div>
          <div className="h-full">
            <FlavorSlider collections={collections} region={region} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ThreeDProductsSection
