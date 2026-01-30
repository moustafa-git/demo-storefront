import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

// 👇 import the client wrapper
import SectionsWrapper from "./../../../modules/home/components/sections/SectionsWrapper"

import App from "../../../modules/home/components/sections/App"

export const metadata: Metadata = {
  title: "MEDNAUTS",
  description:
    "Mednauts Skin Rescue is a revolutionary skincare solution designed for rapid relief and healing This versatile product works as a soap, serum, lip gloss, and sprey, targeting insect bites, acne, and burns with proven results.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <App collections={collections} region={region} />
    </>
  )
}
