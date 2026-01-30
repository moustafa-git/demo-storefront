"use client"
import React, { useState } from "react"
import Product3DViewClient from "@modules/products/components/three-d-viewer/Product3DViewClient"
import ProductActions from "@modules/products/components/product-actions"
import { HttpTypes } from "@medusajs/types"
import { CustomizationOption } from "../../../types/global"
import { useSearchParams } from "next/navigation"
import Modal from "@modules/common/components/modal"
import View3DButtonClient from "@modules/products/components/product-preview/View3DButtonClient"
import ProductMediaSwitcher from "@modules/products/components/ProductMediaSwitcher"
import { Button } from "@medusajs/ui"

type ProductClientShellProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  customizationOptions?: CustomizationOption[]
  modelUrl?: string
  skinTone?: string
  setSkinTone?: (val: string) => void
  show3D: boolean
  setShow3D: (val: boolean) => void
  selectedMaterial: string | null
  setSelectedMaterial: (val: string | null) => void
  materialValues: Record<string, import("./product-page-client").MaterialValue>
  setMaterialValues: React.Dispatch<React.SetStateAction<Record<string, import("./product-page-client").MaterialValue>>>
  // All setMaterialValues calls should be wrapped with logging in the parent (product-page-client)
  modelMaterials?: string[]
}

const ProductClientShell: React.FC<ProductClientShellProps> = ({
  product,
  region,
  customizationOptions,
  modelUrl,
  skinTone,
  setSkinTone,
  show3D,
  setShow3D,
  selectedMaterial,
  setSelectedMaterial,
  materialValues,
  setMaterialValues,
  modelMaterials,
}) => {
  const handleToggle3DView = (show: boolean) => {
    setShow3D(show);
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div className="sticky top-20 z-10 bg-white w-full">
      {modelUrl && (
        <div className="mb-4">
          {!show3D ? (
            <Button
              variant="primary"
              size="small"
              onClick={() => handleToggle3DView(true)}
              aria-label="View in 3D"
              className="w-full"
            >
              View in 3D
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleToggle3DView(false)}
              aria-label="Back to Product"
              className="w-full"
            >
              Back to Product
            </Button>
          )}
        </div>
      )}
      <ProductActions
        product={product}
        region={region}
        skinTone={skinTone}
        setSkinTone={setSkinTone}
        selectedMaterial={selectedMaterial}
        setSelectedMaterial={setSelectedMaterial}
        materialValues={materialValues}
        setMaterialValues={setMaterialValues}
        is3DView={show3D}
        modelMaterials={modelMaterials}
        productId={product.id}
      />
    </div>
  )
}

export default ProductClientShell 