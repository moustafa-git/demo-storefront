import React, { useMemo } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Product3DViewClient from "@modules/products/components/three-d-viewer/Product3DViewClient"
import { CustomizationOption } from "../../../types/global"
import View3DButtonClient from "@modules/products/components/product-preview/View3DButtonClient"
import ProductMediaSwitcher from "@modules/products/components/ProductMediaSwitcher"
import ProductPageClient from "./product-page-client"
import { Button } from "@medusajs/ui"
import ProductClientShell from "./product-client-shell"
import ProductDisplayShell from "./product-display-shell"
import SkeletonProductPage from "@modules/skeletons/templates/skeleton-product-page";

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  searchParams = {},
}) => {
  const has3DModel = typeof product.metadata?.modelUrl === 'string' && product.metadata.modelUrl.length > 0;
  let customizationOptions: CustomizationOption[] | undefined = undefined;
  const rawOptions = product.metadata?.customizationOptions;
  customizationOptions = useMemo(() => {
    if (typeof rawOptions === "string") {
      try {
        return JSON.parse(rawOptions);
      } catch {
        return undefined;
      }
    } else if (Array.isArray(rawOptions)) {
      return rawOptions;
    }
    return undefined;
  }, [rawOptions]);
  const modelUrl = useMemo(() => (has3DModel && product.metadata ? String(product.metadata.modelUrl) : undefined), [has3DModel, product.metadata]);
  const view3d = searchParams["view3d"] === "1";

  if (!product || !product.id) {
    return notFound()
  }

  // Debug log for modelUrl

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <ProductPageClient
          product={product}
          region={region}
          modelUrl={modelUrl}
          customizationOptions={customizationOptions}
        />
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <RelatedProducts product={product} countryCode={countryCode} />
      </div>
    </>
  )
}

export default ProductTemplate
