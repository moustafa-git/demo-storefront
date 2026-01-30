"use client"
import React, { useState } from "react"
import ProductMediaSwitcher from "@modules/products/components/ProductMediaSwitcher"
import Product3DViewClient from "@modules/products/components/three-d-viewer/Product3DViewClient"
import { Button } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { CustomizationOption } from "../../../types/global"
import type { MaterialValue } from "./product-page-client"

type ProductDisplayShellProps = {
  product: HttpTypes.StoreProduct
  modelUrl?: string
  skinnedModelUrl?: string
  customizationOptions?: CustomizationOption[]
  skinTone?: string
  show3D: boolean
  setShow3D: (val: boolean) => void
  selectedMaterial: string | null
  setSelectedMaterial: (val: string | null) => void
  materialValues: Record<string, MaterialValue>
  setMaterialValues: React.Dispatch<React.SetStateAction<Record<string, MaterialValue>>>
  onMaterialsLoaded?: (materials: string[]) => void
}

const ProductDisplayShell: React.FC<ProductDisplayShellProps> = ({
  product,
  modelUrl,
  skinnedModelUrl,
  customizationOptions,
  skinTone,
  show3D,
  setShow3D,
  selectedMaterial,
  setSelectedMaterial,
  materialValues,
  setMaterialValues,
  onMaterialsLoaded,
}) => {

  return !show3D ? (
    <>
      <ProductMediaSwitcher modelUrl={modelUrl} skinnedModelUrl={skinnedModelUrl} customizationOptions={customizationOptions} images={product?.images || []} />
    </>
  ) : (
    <>
      <Product3DViewClient
        modelUrl={modelUrl}
        skinnedModelUrl={skinnedModelUrl}
        customizationOptions={customizationOptions}
        skinTone={skinTone}
        selectedMaterial={selectedMaterial}
        setSelectedMaterial={setSelectedMaterial}
        materialValues={materialValues}
        setMaterialValues={setMaterialValues}
        onMaterialsLoaded={onMaterialsLoaded}
      />
    </>
  )
}

export default ProductDisplayShell 