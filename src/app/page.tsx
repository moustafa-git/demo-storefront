import { redirect } from "next/navigation"

export default function RootPage() {
  // When middleware is disabled, redirect to default region
  const defaultRegion = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  redirect(`/${defaultRegion}`)
}

