"use client"
import ThreeDViewer from "./index"
import { CustomizationOption } from "../../../../types/global"
import { useEffect, useState } from "react"
import type { MaterialValue } from "../../templates/product-page-client"

interface Product3DViewClientProps {
  modelUrl: string | undefined
  skinnedModelUrl?: string
  customizationOptions?: CustomizationOption[]
  selectedOptions?: Record<string, string>
  skinTone?: string
  productId?: string
  selectedMaterial: string | null
  setSelectedMaterial: (val: string | null) => void
  materialValues: Record<
    string,
    import("../../templates/product-page-client").MaterialValue
  >
  setMaterialValues: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        import("../../templates/product-page-client").MaterialValue
      >
    >
  >
  onMaterialsLoaded?: (materials: string[]) => void
}

const Product3DViewClient = ({
  modelUrl,
  skinnedModelUrl,
  customizationOptions,
  selectedOptions,
  skinTone,
  productId,
  selectedMaterial,
  setSelectedMaterial,
  materialValues,
  setMaterialValues,
  onMaterialsLoaded,
}: Product3DViewClientProps) => {
  if (!modelUrl) {
    return (
      <div style={{ background: "#fdd", color: "#900", padding: 20 }}>
        No 3D model URL provided
      </div>
    )
  }
  // Wrap setMaterialValues to log all state changes
  const setMaterialValuesWithLog = (val: any) => {
    setMaterialValues(val)
  }
  return (
    <ThreeDViewer
      modelUrl={modelUrl}
      skinnedModelUrl={skinnedModelUrl}
      customizationOptions={customizationOptions}
      selectedOptions={selectedOptions}
      selectedSkinTone={skinTone}
      onBack={() => {}}
      selectedMaterial={selectedMaterial}
      setSelectedMaterial={setSelectedMaterial}
      materialValues={materialValues}
      setMaterialValues={setMaterialValuesWithLog}
      onMaterialsLoaded={onMaterialsLoaded}
    />
  )
}

export default Product3DViewClient
