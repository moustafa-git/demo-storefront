import { Metadata } from "next"
import "styles/globals.css"
import { retrieveCustomer } from "@lib/data/customer"
import { Antonio } from "next/font/google"
import { getBaseURL } from "@lib/util/env"
import DemoBanner from "@modules/common/components/demo-banner"

const antonio = Antonio({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"], // full range
  variable: "--font-antonio",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: "/mednauts.ico",
  },
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <html lang="en" className={`${antonio.variable}`}>
      <head>
        {/* Preloader styles inline so they apply instantly */}
        <style>{`
          #preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fafafa;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            font-weight: bold;
            color: #212121;
            z-index: 9999;
            transition: opacity 0.8s ease, visibility 0.8s ease;
          }

          #preloader.hidden {
            opacity: 0;
            visibility: hidden;
            display: none;
          }

          #preloader span {
            display: inline-block;
            animation: pulse 1.2s infinite ease-in-out;
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.6;
            }
          }
        `}</style>
      </head>
      <body>
        {/* Preloader (before Next.js hydrates) */}
        <div id="preloader">
          <span>Loading...</span>
        </div>

        {/* Next.js app */}
        <main className="relative" id="root">
          {children}
        </main>

        {/* Demo Mode Banner */}
        <DemoBanner />


        {/* Script to hide preloader */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("load", () => {
                const preloader = document.getElementById("preloader");
                if (preloader) {
                  preloader.classList.add("hidden");
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
