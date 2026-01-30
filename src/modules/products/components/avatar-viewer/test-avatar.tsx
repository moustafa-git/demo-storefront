"use client"
import React from "react"
import AvatarViewer from "./index"
import type { MaterialValue } from "../../templates/product-page-client"

const TestAvatar = () => {
  // Test material values
  const testMaterialValues: Record<string, MaterialValue> = {
    bra_material: { type: "color", value: "#ff0000" },
    skin_tone: { type: "skinTone", value: "fitzpatrick-2b" }, // Using a valid skin tone ID
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Avatar Test</h2>
      <AvatarViewer
        avatarModelUrl="/avatar.glb"
        productModelUrl="/skinned_bra.glb"
        materialValues={testMaterialValues}
        onMaterialsLoaded={(materials) => {}}
      />
    </div>
  )
}

export default TestAvatar
