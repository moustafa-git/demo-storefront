"use client"
import React, { useState, useEffect } from "react"
import ProductDisplayShell from "./product-display-shell"
import ProductClientShell from "./product-client-shell"
import { HttpTypes } from "@medusajs/types"
import { CustomizationOption } from "../../../types/global"
import ProductInfo from "./product-info"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import { retrieveCustomer } from "@lib/data/customer"
import { useRouter, useSearchParams } from "next/navigation"
import ProductActions from "../components/product-actions"
import ThreeDViewer from "../components/three-d-viewer"
import { usePersistentCustomization } from "@lib/hooks/use-persistent-customization"
import { extractMaterialNamesFromGLTF } from "@lib/util/three-materials"

type ProductPageClientProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  modelUrl?: string
  customizationOptions?: CustomizationOption[]
}

// type for per-part value
export type MaterialValue = { type: "color" | "skinTone"; value: string }

const ProductPageClient: React.FC<ProductPageClientProps> = ({
  product,
  region,
  modelUrl,
  customizationOptions,
}) => {
  const [skinTone, setSkinTone] = useState<string | undefined>(undefined)
  const [show3D, setShow3D] = useState(false)
  // NEW: State for selected material/part and per-material values
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [materialValues, setMaterialValues] = useState<
    Record<string, MaterialValue>
  >({})
  // NEW: Track modelMaterials for 3D models
  const [modelMaterials, setModelMaterials] = useState<string[]>([])

  // Load material names for 3D products as soon as the product page loads
  useEffect(() => {
    let cancelled = false
    async function loadMaterials() {
      if (typeof modelUrl === "string" && modelUrl.length > 0) {
        try {
          const names = await extractMaterialNamesFromGLTF(modelUrl)
          if (!cancelled) {
            setModelMaterials((prev) => {
              // Only update if changed
              if (
                prev.length === names.length &&
                prev.every((v, i) => v === names[i])
              ) {
                return prev
              }
              return names
            })
          }
        } catch (err) {
          if (!cancelled) setModelMaterials([])
        }
      } else {
        setModelMaterials([])
      }
    }
    loadMaterials()
    return () => {
      cancelled = true
    }
  }, [modelUrl])

  // Memoize handlers and props
  const memoizedSetSelectedMaterial = React.useCallback(setSelectedMaterial, [])
  const setMaterialValuesWithLog = React.useCallback((val: any) => {
    setMaterialValues(val)
  }, [])
  const memoizedMaterialValues = React.useMemo(
    () => materialValues,
    [materialValues]
  )
  const router = useRouter()
  const searchParams = useSearchParams()

  // Persist and restore 3D customization per product

  useEffect(() => {}, [product?.id])
  usePersistentCustomization<Record<string, MaterialValue>>(
    product?.id,
    materialValues,
    setMaterialValues
  )

  // On mount, set show3D based on URL param
  useEffect(() => {
    setShow3D(searchParams.get("view3d") === "1")
  }, [searchParams])

  // Handlers to update URL when toggling 3D view
  const handleShow3D = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("view3d", "1")
    router.replace(`?${params.toString()}`, { scroll: false })
    setShow3D(true)
  }
  const handleHide3D = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("view3d")
    router.replace(`?${params.toString()}`, { scroll: false })
    setShow3D(false)
  }

  // Robustly restore skin tone from sessionStorage or profile whenever product.id changes
  useEffect(() => {
    // First, check for material-specific skin tones in URL
    const materialSkinTones: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith(`option_virtual_skin_tone_`)) {
        const materialName = key.replace("option_virtual_skin_tone_", "")
        materialSkinTones[materialName] = value
      }
    })

    // If we have material-specific skin tones, apply them
    if (Object.keys(materialSkinTones).length > 0) {
      setMaterialValues((prev) => {
        const newValues = { ...prev }
        Object.entries(materialSkinTones).forEach(([material, tone]) => {
          if (tone) {
            newValues[material] = { type: "skinTone", value: tone }
          }
        })
        return newValues
      })
    }

    // Then check for the default skin tone in session storage
    const sessionKey = `skin_tone_selection_virtual_skin_tone_${product.id}`
    let didSet = false
    try {
      const sessionData = sessionStorage.getItem(sessionKey)
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        if (typeof parsed.skinToneId === "string" && parsed.skinToneId) {
          setSkinTone(parsed.skinToneId)
          didSet = true
        }
      }
    } catch {}

    if (!didSet) {
      // Fallback to customer profile
      retrieveCustomer()
        .then((customer) => {
          const profileSkinTone = customer?.metadata?.skin_tone
          if (typeof profileSkinTone === "string" && profileSkinTone) {
            setSkinTone(profileSkinTone)
          } else {
            setSkinTone("")
          }
        })
        .catch(() => setSkinTone(""))
    }
  }, [product.id, searchParams])

  return (
    <div
      className="content-container flex flex-col small:flex-row small:items-start py-6 relative min-h-screen"
      data-testid="product-container-client"
    >
      {/* Left column: Product info and tabs */}
      <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
        <ProductInfo product={product} />
        <ProductTabs product={product} />
      </div>
      {/* Center column: Main product display */}
      <div className="w-full relative">
        <ProductDisplayShell
          product={product}
          modelUrl={modelUrl}
          skinnedModelUrl={product.metadata?.skinnedModelUrl as string}
          customizationOptions={customizationOptions}
          skinTone={skinTone}
          show3D={show3D}
          setShow3D={show3D ? handleHide3D : handleShow3D}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          materialValues={materialValues}
          setMaterialValues={setMaterialValues}
          onMaterialsLoaded={setModelMaterials}
        />
      </div>
      {/* Right column: Product actions, options, skin tone selector */}
      <div className="flex flex-col small:sticky small:top-0 small:max-w-[300px] w-full pt-0 pb-2 gap-y-12 min-h-screen">
        <ProductOnboardingCta />
        <ProductClientShell
          product={product}
          region={region}
          customizationOptions={customizationOptions}
          modelUrl={modelUrl}
          skinTone={skinTone}
          setSkinTone={setSkinTone}
          show3D={show3D}
          setShow3D={show3D ? handleHide3D : handleShow3D}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          materialValues={materialValues}
          setMaterialValues={setMaterialValues}
          modelMaterials={modelMaterials}
        />
      </div>
    </div>
  )
}

export default ProductPageClient
