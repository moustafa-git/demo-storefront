import { Heading, Text, Container, Button } from "@medusajs/ui"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

const blogs = [
  { 
    title: "Quick Effects", 
    href: "https://tinyurl.com/mednauts-quickeffects",
    description: [
      "Starts working within seconds of application",
      "Targets swelling, irritation, and dryness fast",
      "Long-lasting relief with minimal reapplication"
    ],
    image: "/images/Blog Images/Quick Effects.png"
  },
  { 
    title: "Talk About It", 
    href: "https://tinyurl.com/mednauts-talkaboutit",
    description: [
      "Share real experiences with skin recovery",
      "Join discussions on healing and self-care",
      "Educate others on dermatological health"
    ],
    image: "/images/Blog Images/talk about.png"
  },
  { 
    title: "Customer Help", 
    href: "https://tinyurl.com/mednauts-CustomerHelp",
    description: [
      "Personalized support for different skin needs",
      "Bulk orders and refill options for convenience",
      "Customizable formulas based on skin type"
    ],
    image: "/images/Blog Images/customer help.png"
  },
  { 
    title: "En Rouge", 
    href: "https://tinyurl.com/mednauts-EnRouge",
    description: [
      "Adds natural tone and subtle radiance",
      "Lightweight formula with a rosy, sheer scent",
      "Enhances skin's natural beauty and hydration"
    ],
    image: "/images/Blog Images/en rouge.png"
  },
  { 
    title: "Dentistry Paralysis", 
    href: "https://tinyurl.com/mednauts-DentistryParalysis",
    description: [
      "Helps reduce swelling in oral tissues",
      "Stimulates nerve activation for recovery",
      "Safe for gums, lips, and post-surgical care"
    ],
    image: "/images/Blog Images/Dentistry.png"
  },
  { 
    title: "Aging Pause", 
    href: "https://tinyurl.com/mednauts-AgingPause",
    description: [
      "Supports skin elasticity and hydration",
      "Reduces fine lines and irritation",
      "Enhances natural skin barrier function"
    ],
    image: "/images/Blog Images/Aging Pause.png"
  },
  { 
    title: "Birthing Regimen", 
    href: "https://tinyurl.com/mednauts-BirthingRegimen",
    description: [
      "Essential care for mothers before and after birth",
      "Supports delicate newborn and maternal skin",
      "Safe for use during pregnancy and postpartum"
    ],
    image: "/images/Blog Images/birthing regimen.png"
  },
  { 
    title: "Clinic Hygiene", 
    href: "https://tinyurl.com/mednauts-ClinicHygiene",
    description: [
      "Antiseptic properties for professional use",
      "Prevents bacterial and fungal growth",
      "Ideal for hospitals, clinics, and care centers"
    ],
    image: "/images/Blog Images/clinic hygeine.png"
  },
  { 
    title: "Quiet Plain", 
    href: "https://tinyurl.com/mednauts-QuickPlain",
    description: [
      "Fragrance-free for ultra-sensitive skin",
      "Minimalist formula with maximum effect",
      "Designed for allergy-prone individuals"
    ],
    image: "/images/Blog Images/quick plain.png"
  },
  { 
    title: "Child Safe", 
    href: "https://tinyurl.com/mednauts-ChildSafe",
    description: [
      "Gentle on delicate, young skin",
      "Free from harsh chemicals and allergens",
      "Helps soothe irritation from rashes and bites"
    ],
    image: "/images/Blog Images/child safe.png"
  },
  { 
    title: "Illness Fights", 
    href: "https://tinyurl.com/mednauts-IllnessFights",
    description: [
      "Supports compromised immune skin defense",
      "Helps prevent infection and irritation",
      "Suitable for cancer care and chronic conditions"
    ],
    image: "/images/Blog Images/illness fights.png"
  },
  { 
    title: "Sports Odor", 
    href: "https://tinyurl.com/mednauts-SportsOdor",
    description: [
      "Fights bacteria that cause body odor",
      "Ideal for active lifestyles and athletes",
      "Refreshing and naturally scented skin-friendly formula"
    ],
    image: "/images/Blog Images/sports odor.png"
  },
  { 
    title: "Cracked Or Chapped", 
    href: "https://tinyurl.com/mednauts-CrackedOrChapped",
    description: [
      "Deep hydration for cracked, dry skin",
      "Forms a protective barrier for healing",
      "Great for lips, heels, and knuckles"
    ],
    image: "/images/Blog Images/cracked or chapped.png"
  },
  { 
    title: "Hydro Ready", 
    href: "https://tinyurl.com/mednauts-HydroReady",
    description: [
      "Water-reactivated formula for lasting protection",
      "Locks in moisture for deep hydration",
      "Perfect for swimmers and outdoor exposure"
    ],
    image: "/images/Blog Images/hydro ready.png"
  },
  { 
    title: "Dental Upkeep", 
    href: "https://tinyurl.com/mednauts-DentalUpkeep",
    description: [
      "Soothes inflammation and discomfort",
      "Aids in skin repair and moisture balance",
      "Gentle and safe for sensitive areas"
    ],
    image: "/images/Blog Images/dental upkeep.png"
  },
  { 
    title: "Surgeon Shield", 
    href: "https://tinyurl.com/mednauts-SurgeonShield",
    description: [
      "Supports post-surgical skin recovery",
      "Provides antimicrobial protection",
      "Ideal for healthcare professionals"
    ],
    image: "/images/Blog Images/surgeon sheild.png"
  },
]

export default async function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section>
        <div className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Text className="text-ui-fg-muted text-md font-medium mb-3">BLOG</Text>
            <Heading level="h1" className="text-3xl md:text-6xl font-bold mb-4 py-4">
              Insights and Stories
            </Heading>
            <Text className="text-ui-fg-subtle text-lg">
              Explore helpful reads from mednauts. Click a card to open the article.
            </Text>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-6 md:py-10 bg-ui-bg-base">
        <Container className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {blogs.map((b) => (
              <div
                key={b.href}
                className="group rounded-xl border-2 border-red-600 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Image */}
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                {/* Title */}
                <Heading level="h3" className="text-lg font-bold text-blue-900 mb-3">
                  {b.title}
                </Heading>
                
                {/* Description */}
                <ul className="text-sm text-gray-700 mb-4 space-y-1">
                  {b.description.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Read Now Button */}
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Read Now!
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button variant="secondary" disabled>
              More coming soon
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}


