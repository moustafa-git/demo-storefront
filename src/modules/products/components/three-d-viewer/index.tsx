"use client"
import { useEffect, useState, useRef, useMemo } from "react"
import { CustomizationOption } from "../../../../types/global"
import { Button } from "@medusajs/ui"
import { Spinner } from "../../../common/components/spinner"
import { getSkinToneById } from "@lib/util/skin-tone-analyzer"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import React from "react"
import type { MaterialValue } from "../../templates/product-page-client"
import R3FModelViewer from "./R3FModelViewer"
import AvatarModal from "../avatar-viewer/AvatarModal"

interface ThreeDViewerProps {
  modelUrl: string
  skinnedModelUrl?: string // NEW: URL for the skinned model used in avatar view
  customizationOptions?: CustomizationOption[]
  onBack: () => void
  selectedOptions?: Record<string, string> // Product options (including skin tone)
  selectedSkinTone?: string // Direct skin tone from selector
  selectedMaterial: string | null
  setSelectedMaterial: (val: string | null) => void
  materialValues: Record<string, MaterialValue>
  setMaterialValues: React.Dispatch<
    React.SetStateAction<Record<string, MaterialValue>>
  >
  onMaterialsLoaded?: (materials: string[]) => void // NEW PROP
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string
        alt?: string
        "auto-rotate"?: string
        "camera-controls"?: string
        "shadow-intensity"?: string
        exposure?: string
        style?: React.CSSProperties
        onLoad?: () => void
        onError?: () => void
      }
    }
  }
}

// Skin tone mapping from product options to 3D model colors
// SKIN_TONE_MAPPING now maps both IDs and names to their hex color.
import { SKIN_TONE_OPTIONS } from "@lib/util/skin-tone-analyzer"

const SKIN_TONE_MAPPING: Record<string, string> = (() => {
  const mapping: Record<string, string> = {}
  // Map IDs and names from SKIN_TONE_OPTIONS
  for (const tone of SKIN_TONE_OPTIONS) {
    mapping[tone.id] = tone.color
    mapping[tone.name] = tone.color
  }
  // Fallback/legacy mappings for common names
  Object.assign(mapping, {
    Fair: "#F2C49B",
    Medium: "#E1B07E",
    Dark: "#8D5524",
    Light: "#F9D7B5",
    Olive: "#D1A38A",
    Warm: "#E0A878",
    "Custom Skin Tone": "#D4A67C",
  })
  return mapping
})()

function ThreeDViewer({
  modelUrl,
  skinnedModelUrl,
  customizationOptions = [],
  onBack,
  selectedOptions = {},
  selectedSkinTone,
  selectedMaterial,
  setSelectedMaterial,
  materialValues,
  setMaterialValues,
  onMaterialsLoaded, // NEW
}: ThreeDViewerProps) {
  if (typeof window !== "undefined") {
  } else {
  }
  const [error, setError] = useState<string | null>(null)
  const [customizations, setCustomizations] = useState<
    Record<string, string | boolean>
  >({})
  const [isLoading, setIsLoading] = useState(true)
  const viewerRef = useRef<any>(null)
  const [modelMaterials, setModelMaterials] = useState<string[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  // Store initial colors for each material
  const initialMaterialColors = useRef<Record<string, string>>({})

  // Fetch customer data for custom skin tone colors
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await retrieveCustomer()
        setCustomer(customerData)
      } catch (error) {
        console.error("Failed to fetch customer data:", error)
        setCustomer(null)
      }
    }
    fetchCustomer()
  }, [])

  // Helper function to get skin tone color including custom colors
  const getSkinToneColor = (skinToneId: string): string => {
    if (skinToneId === "custom") {
      // Get custom color from customer metadata
      const customColor = customer?.metadata?.custom_skin_color as
        | string
        | undefined
      return customColor || "#D4A67C" // fallback color
    }

    // Get color from predefined skin tones
    const skinTone = getSkinToneById(skinToneId)
    return skinTone?.color || "#D4A67C" // fallback color
  }

  // Attach the 'load' event to model-viewer using ref
  useEffect(() => {
    const modelViewer = viewerRef.current
    if (!modelViewer) return
    const handler = () => {
      let names: string[] = []
      if (modelViewer.model && modelViewer.model.scene) {
        // Always use three.js scene traversal to get all material names
        const materialNames = new Set<string>()
        const initialColors: Record<string, string> = {}
        modelViewer.model.scene.traverse((node: any) => {
          if (node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach((mat: any) => {
                if (mat?.name) {
                  materialNames.add(mat.name)
                  // Store initial color as hex
                  if (
                    mat.color &&
                    typeof mat.color.getHexString === "function"
                  ) {
                    initialColors[mat.name] = "#" + mat.color.getHexString()
                  }
                }
              })
            } else if (node.material.name) {
              materialNames.add(node.material.name)
              if (
                node.material.color &&
                typeof node.material.color.getHexString === "function"
              ) {
                initialColors[node.material.name] =
                  "#" + node.material.color.getHexString()
              }
            }
          }
        })
        names = Array.from(materialNames)

        setModelMaterials(names)
        if (onMaterialsLoaded) {
          onMaterialsLoaded(names)
        }
        initialMaterialColors.current = initialColors
      }
      setIsLoading(false)
    }
    modelViewer.addEventListener("load", handler)
    return () => modelViewer.removeEventListener("load", handler)
  }, [])

  // Only initialize customizations once on mount to avoid infinite loops
  useEffect(() => {
    const initialCustomizations = customizationOptions.reduce(
      (acc, option) => ({
        ...acc,
        [option.id]: option.defaultValue,
      }),
      {}
    )
    setCustomizations(initialCustomizations)
  }, [])

  // Update 3D model color based on selected skin tone
  useEffect(() => {
    let skinToneValue: string | undefined = undefined
    if (selectedSkinTone) {
      // Map ID to name for color lookup
      const tone = getSkinToneById(selectedSkinTone)
      skinToneValue = tone?.name || selectedSkinTone
    } else {
      // Fallback to selectedOptions
      const found = Object.entries(selectedOptions).find(([key, value]) => {
        const valueLower = value.toLowerCase()
        return (
          valueLower.includes("fair") ||
          valueLower.includes("medium") ||
          valueLower.includes("dark") ||
          valueLower.includes("light") ||
          valueLower.includes("olive") ||
          valueLower.includes("warm") ||
          valueLower.includes("cool") ||
          valueLower.includes("neutral") ||
          valueLower.includes("skin") ||
          valueLower.includes("tone")
        )
      })
      if (found) skinToneValue = found[1]
    }
    if (skinToneValue && viewerRef.current) {
      const color = SKIN_TONE_MAPPING[skinToneValue] || "#D4A67C"

      const modelViewer = viewerRef.current
      const updateColor = () => {
        // Try multiple approaches to update the model color
        try {
          // Approach 1: Direct material access
          const materials = modelViewer.model?.materials

          if (Array.isArray(materials)) {
            materials.forEach((material: any, index: number) => {
              if (material && material.pbrMetallicRoughness) {
                const rgb = [
                  parseInt(color.slice(1, 3), 16) / 255,
                  parseInt(color.slice(3, 5), 16) / 255,
                  parseInt(color.slice(5, 7), 16) / 255,
                  1,
                ]
                material.pbrMetallicRoughness.setBaseColorFactor(rgb)
              } else {
              }
            })
          }

          // --- DEBUG HOOK: Log when color-application effect runs, and log model/materials ---
          useEffect(() => {
            if (!viewerRef.current) {
              return
            }
            const modelViewer = viewerRef.current
            if (!modelViewer.model) {
              return
            }
            const scene = modelViewer.model
            const foundNames = new Set<string>()
            if (scene && scene.traverse) {
              scene.traverse((child: any) => {
                if (child.isMesh && child.material && child.material.name) {
                  foundNames.add(child.material.name)
                  if (materialValues[child.material.name]) {
                    const color = materialValues[child.material.name]
                    if (typeof color === "string" && child.material.color) {
                      child.material.color.set(color)
                      child.material.needsUpdate = true
                    } else {
                    }
                  } else {
                  }
                }
              })
            }
          }, [materialValues, viewerRef.current?.model])
          // --- END DEBUG HOOK ---

          // Approach 3: Force model reload with new color
          modelViewer.requestUpdate()
        } catch (error) {
          console.error("🎨 Error updating 3D model color:", error)
        }
      }

      // If model is loaded, update immediately
      if (modelViewer.model?.materials?.length) {
        updateColor()
      } else {
        // Otherwise, wait for the model to load
        modelViewer.addEventListener(
          "load",
          () => {
            updateColor()
          },
          { once: true }
        )
      }
    } else {
    }
  }, [selectedOptions, selectedSkinTone])

  // Live update 3D model materials based on materialValues
  useEffect(() => {
    const modelViewer = viewerRef.current
    if (!modelViewer || !modelViewer.model) return
    try {
      const materials = modelViewer.model.materials
      if (Array.isArray(materials)) {
        materials.forEach((material: any) => {
          // Find the part name by material name (assume material.name matches part name)
          const partName = material.name
          const val = materialValues?.[partName]
          let color = undefined
          if (val && val.type === "color") {
            color = val.value
          } else if (val && val.type === "skinTone") {
            color = getSkinToneById(val.value)?.color
          } else {
            // No value: use initial color if available
            color = initialMaterialColors.current[partName]
          }
          if (color && material.pbrMetallicRoughness) {
            const rgb = [
              parseInt(color.slice(1, 3), 16) / 255,
              parseInt(color.slice(3, 5), 16) / 255,
              parseInt(color.slice(5, 7), 16) / 255,
              1,
            ]
            material.pbrMetallicRoughness.setBaseColorFactor(rgb)
          }
        })
        modelViewer.requestUpdate && modelViewer.requestUpdate()
      }
    } catch (err) {
      // If model-viewer API is limited, add a TODO for future improvement
      // TODO: Use a more flexible 3D engine for advanced per-material updates if needed
      // console.error('Error updating 3D model materials:', err);
    }
  }, [materialValues])

  const handleCustomizationChange = (
    optionId: string,
    value: string | boolean
  ) => {
    setCustomizations((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // Use real material names from the loaded model
  const customizableParts =
    modelMaterials.length > 0 ? modelMaterials.map((name) => ({ name })) : []

  // Debug: log the raw materialValues prop

  // Convert materialValues to a mapping of color strings
  const materialColorMap = useMemo(() => {
    const colorMap: Record<string, string> = {}
    Object.entries(materialValues || {}).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        if (value.type === "color" && typeof value.value === "string") {
          colorMap[key] = value.value
        } else if (
          value.type === "skinTone" &&
          typeof value.value === "string"
        ) {
          colorMap[key] = getSkinToneColor(value.value)
        }
      }
    })
    return colorMap
  }, [materialValues, customer?.metadata?.custom_skin_color])

  // Debug: log the color mapping actually being sent to R3FModelViewer

  // Main return block
  return (
    <div className="flex flex-row justify-center items-start w-full">
      {/* 3D Viewer full width with responsive material selector overlay */}
      <div className="relative w-full mx-6">
        <R3FModelViewer
          url={modelUrl}
          onMaterials={(materials) => {
            setModelMaterials(materials)
          }}
          materialValues={materialColorMap}
          getSkinToneColor={getSkinToneColor}
        />

        {/* Avatar Try Me Button - Floating on canvas */}
        {skinnedModelUrl && (
          <div className="absolute top-4 right-4 z-20">
            <Button
              variant="primary"
              size="small"
              className="transition-opacity gap-x-2"
              onClick={() => setShowAvatarModal(true)}
              aria-label="Try on Avatar"
            >
              <span>👤</span>
              <span>Avatar Try Me</span>
            </Button>
          </div>
        )}

        {/* Desktop: vertical glassy bubbles on left */}
        {modelMaterials.length > 0 && (
          <>
            {/* Desktop vertical list (hidden on mobile) */}
            <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col gap-3 z-20">
              {modelMaterials.map((name) => {
                const val = materialValues?.[name]
                return (
                  <button
                    key={name}
                    className={`backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg px-4 py-2 rounded-2xl flex items-center gap-2 font-semibold text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${
                        selectedMaterial === name
                          ? "bg-blue-600/40 text-white scale-105 border-blue-400"
                          : "text-gray-900 hover:bg-white/30"
                      }
                    `}
                    style={{
                      cursor: "pointer",
                      minWidth: 90,
                      borderWidth: selectedMaterial === name ? 2 : 1,
                      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                    }}
                    onClick={() => setSelectedMaterial(name)}
                    tabIndex={0}
                    aria-label={`Select ${name}`}
                  >
                    <span>{name}</span>
                    {val && val.type === "color" && val.value && (
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-gray-300"
                        style={{ background: val.value }}
                        aria-label={`Current color for ${name}`}
                      />
                    )}
                    {val && val.type === "skinTone" && val.value && (
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-gray-300"
                        style={{
                          background: getSkinToneColor(val.value),
                        }}
                        aria-label={`Current skin tone for ${name}`}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            {/* Mobile: 3-dots button and vertical overlay menu */}
            <div className="md:hidden">
              {/* 3-dots floating button */}
              {!mobileMenuOpen && (
                <button
                  className="absolute left-4 bottom-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Show material list"
                >
                  <span className="w-1 h-1 bg-gray-700 rounded-full mx-0.5" />
                  <span className="w-1 h-1 bg-gray-700 rounded-full mx-0.5" />
                  <span className="w-1 h-1 bg-gray-700 rounded-full mx-0.5" />
                </button>
              )}
              {/* Vertical glassy material list overlay */}
              {mobileMenuOpen && (
                <div className="absolute left-4 bottom-20 flex flex-col gap-3 z-30 p-2 rounded-2xl backdrop-blur-xl bg-white/30 border border-white/30 shadow-xl animate-fade-in">
                  {modelMaterials.map((name) => {
                    const val = materialValues?.[name]
                    return (
                      <button
                        key={name}
                        className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-semibold text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400
                          ${
                            selectedMaterial === name
                              ? "bg-blue-600/40 text-white scale-105 border-blue-400"
                              : "text-gray-900 hover:bg-white/40"
                          }
                        `}
                        style={{
                          cursor: "pointer",
                          minWidth: 90,
                          borderWidth: selectedMaterial === name ? 2 : 1,
                          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                        }}
                        onClick={() => {
                          setSelectedMaterial(name)
                          setMobileMenuOpen(false)
                        }}
                        tabIndex={0}
                        aria-label={`Select ${name}`}
                      >
                        <span>{name}</span>
                        {val && val.type === "color" && val.value && (
                          <span
                            className="inline-block w-3 h-3 rounded-full border border-gray-300"
                            style={{ background: val.value }}
                            aria-label={`Current color for ${name}`}
                          />
                        )}
                        {val && val.type === "skinTone" && val.value && (
                          <span
                            className="inline-block w-3 h-3 rounded-full border border-gray-300"
                            style={{
                              background:
                                getSkinToneColor(val.value),
                            }}
                            aria-label={`Current skin tone for ${name}`}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Avatar Modal */}
        <AvatarModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          materialValues={materialValues}
          onMaterialsLoaded={() => {}} // Don't affect main 3D viewer materials
          skinnedModelUrl={skinnedModelUrl}
        />
      </div>
    </div>
  )
}

export default React.memo(ThreeDViewer)
