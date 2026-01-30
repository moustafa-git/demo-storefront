import { useEffect, useRef } from "react"
import gsap from "gsap"

const Preloader = ({ setIsPreloading }) => {
  const loaderRef = useRef()
  const pathRef = useRef()
  const textRef = useRef()

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const pathLength = 1000 // match your dasharray
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "auto"
        setIsPreloading(false) // update App state
      },
    })

    gsap.set(pathRef.current, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    })

    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.inOut",
    })
      .fromTo(
        textRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        "1"
      )
      .to(loaderRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        delay: 0.3,
      })
  }, [setIsPreloading])

  return (
    <div
      ref={loaderRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "#FAFAFA",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="-50 -10 100 100"
        style={{ width: "200px", height: "160px", zIndex: 2 }}
      >
        <path
          ref={pathRef}
          d="M 0 0 q -12 18 0 33 
             m 0 -39 q -21 24 0 45 
             m 0 -45 q 21 24 0 45 
             m 0 -39 q 12 18 0 33 
             m -15 15 v 0 c 9 -6 21 -6 30 0 
             m -15 18 c -6 -3 -6 -6 -6 -9 
             m 6 9 c 6 -3 6 -6 6 -9 
             m -12 0 c 0 -3 6 -3 6 -9 
             m 6 9 c 0 -3 -6 -3 -6 -9 
             M -3 57 C -3 54 0 57 0 54 
             M 3 57 C 3 54 0 57 0 54 
             M 0 60 C -3 60 -3 57 -3 57 
             M 0 60 C 3 60 3 57 3 57 
             M 8 63 C 10 58 11 56 9 53 
             M 9 53 C 8 51 4 50 6 45 
             M -8 63 C -10 59 -11 56 -9 53 
             M -9 53 C -7 51 -4 50 -5 45 
             M 6 43 C 16 10 45 28 26 52 
             M -5 43 C -16 10 -49 26 -26 52 
             M 26 52 C 27 49 27 46 25 44 
             M -26 52 C -27 49 -27 46 -26 44"
          stroke="#C10007"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div
        ref={textRef}
        style={{
          position: "relative",
          zIndex: 3,
          marginTop: "20px",
          fontSize: "32px",
          color: "#212121",
          letterSpacing: "2px",
          fontWeight: "bold",
          opacity: 0,
        }}
      >
        MEDNAUTS
      </div>
    </div>
  )
}

export default Preloader
