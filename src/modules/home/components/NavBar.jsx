import { useEffect, useState } from "react"

const NavBar = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav className="fixed -top-2.5 left-0 z-50 p-4 flex items-center">
      <div
        className={`w-20 h-20 transition-transform duration-1000 ease-out ${
          isMounted ? "translate-x-0" : "-translate-x-24"
        } ${
          isScrolled ? "backdrop-blur-xs" : ""
        } cursor-pointer transition-all duration-300 hover:scale-110 rounded-full hover:border hover:border-red-700 hover:border-opacity-20`}
      >
        <svg viewBox="-50 -10 100 100" className="w-full h-full">
          <path
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
      </div>
    </nav>
  )
}

export default NavBar
