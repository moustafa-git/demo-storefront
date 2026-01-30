"use client"
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  Suspense,
  useCallback,
} from "react"
import { Canvas, useThree, extend, useFrame } from "@react-three/fiber"
import {
  useGLTF,
  OrbitControls,
  Environment,
  Bounds,
  PerformanceMonitor,
  // Stats removed as per request
} from "@react-three/drei"
import * as THREE from "three"
import { useInView } from "react-intersection-observer"
import type { MaterialValue } from "../../templates/product-page-client"
import { getSkinToneById } from "@lib/util/skin-tone-analyzer"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

// Error boundary for 3D content
interface ErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error) {
    console.error("3D Viewer Error:", error)
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

// Performance monitor to adjust quality based on device
function usePerformanceMonitor() {
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Reduce frame rate when tab is not visible
        document.body.style.setProperty("--fps", "30")
      } else {
        document.body.style.removeProperty("--fps")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  return { dpr }
}

interface AvatarViewerProps {
  avatarModelUrl: string
  productModelUrl: string
  materialValues: Record<string, MaterialValue>
  onMaterialsLoaded?: (materials: string[]) => void
  style?: React.CSSProperties
}

// Helper function to traverse scene and extract material names
const traverseScene = (
  scene: any,
  onMaterials: ((names: string[]) => void) | undefined,
  initialColorsRef: React.RefObject<Record<string, string>>
) => {
  const found: string[] = []
  scene.traverse((obj: any) => {
    if (obj.isMesh && obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat: any) => {
          if (mat?.name) {
            found.push(mat.name)
            if (
              mat.color &&
              typeof mat.color.getHexString === "function" &&
              initialColorsRef.current &&
              !(mat.name in initialColorsRef.current)
            ) {
              initialColorsRef.current[mat.name] =
                "#" + mat.color.getHexString()
            }
          }
        })
      } else if (obj.material.name) {
        found.push(obj.material.name)
        if (
          obj.material.color &&
          typeof obj.material.color.getHexString === "function" &&
          initialColorsRef.current &&
          !(obj.material.name in initialColorsRef.current)
        ) {
          initialColorsRef.current[obj.material.name] =
            "#" + obj.material.color.getHexString()
        }
      }
    }
  })
  if (onMaterials) onMaterials(Array.from(new Set(found)))
}

// Helper function to apply material customizations to avatar scene
// This applies skin tone and avatar-specific materials to the avatar model
const applyAvatarCustomizations = (
  scene: any,
  stableMaterialValues: Record<string, any> | undefined,
  initialColorsRef: React.RefObject<Record<string, string>>,
  getSkinToneColor: (skinToneId: string) => string
) => {
  scene.traverse((obj: any) => {
    if (obj.isMesh && obj.material && obj.material.name) {
      let color = undefined
      // For avatar, apply skin tone and avatar-specific materials
      if (
        stableMaterialValues &&
        obj.material.name in stableMaterialValues &&
        stableMaterialValues[obj.material.name]
      ) {
        const val = stableMaterialValues[obj.material.name]
        if (typeof val === "string") {
          color = val
        } else if (typeof val === "object" && val !== null) {
          if (val.type === "color" && typeof val.value === "string") {
            color = val.value
          } else if (val.type === "skinTone" && typeof val.value === "string") {
            color = getSkinToneColor(val.value)
          }
        }
      }
      // Fall back to initial color if no valid color is set
      else if (
        initialColorsRef.current &&
        initialColorsRef.current[obj.material.name]
      ) {
        color = initialColorsRef.current[obj.material.name]
      }

      if (color && obj.material.color) {
        obj.material.color.set(color)
        obj.material.needsUpdate = true
        if (process.env.NODE_ENV === "development") {
        }
      }
    }
  })
}

// Helper function to apply material customizations to product scene (skinned product)
// This applies product material customizations to the skinned product model
const applyProductCustomizations = (
  scene: any,
  stableMaterialValues: Record<string, any> | undefined,
  initialColorsRef: React.RefObject<Record<string, string>>,
  getSkinToneColor: (skinToneId: string) => string
) => {
  scene.traverse((obj: any) => {
    if (obj.isMesh && obj.material && obj.material.name) {
      let color = undefined
      // For skinned product, apply product material customizations (colors, etc.)
      if (
        stableMaterialValues &&
        obj.material.name in stableMaterialValues &&
        stableMaterialValues[obj.material.name]
      ) {
        const val = stableMaterialValues[obj.material.name]
        if (typeof val === "string") {
          color = val
        } else if (typeof val === "object" && val !== null) {
          if (val.type === "color" && typeof val.value === "string") {
            color = val.value
          } else if (val.type === "skinTone" && typeof val.value === "string") {
            color = getSkinToneColor(val.value)
          }
        }
      }
      // Fall back to initial color if no valid color is set
      else if (
        initialColorsRef.current &&
        initialColorsRef.current[obj.material.name]
      ) {
        color = initialColorsRef.current[obj.material.name]
      }

      if (color && obj.material.color) {
        obj.material.color.set(color)
        obj.material.needsUpdate = true
        if (process.env.NODE_ENV === "development") {
        }
      }
    }
  })
}

// Avatar Model Component
const AvatarModel = React.memo(function AvatarModel({
  avatarUrl,
  productUrl,
  onMaterials,
  materialValues,
  getSkinToneColor,
}: {
  avatarUrl: string
  productUrl: string
  onMaterials?: (names: string[]) => void
  materialValues?: Record<string, string>
  getSkinToneColor: (skinToneId: string) => string
}) {
  const { scene: avatarScene } = useGLTF(avatarUrl)
  const { scene: productScene } = useGLTF(productUrl)
  const initialColorsRef = useRef<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Handle material loading and processing
  useEffect(() => {
    if (!avatarScene || !productScene || isLoaded) return

    const avatarMaterials: string[] = []
    const productMaterials: string[] = []

    // Process avatar scene
    avatarScene.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat: any) => {
            if (mat?.name) {
              avatarMaterials.push(mat.name)
              if (
                mat.color &&
                typeof mat.color.getHexString === "function" &&
                initialColorsRef.current &&
                !(mat.name in initialColorsRef.current)
              ) {
                initialColorsRef.current[mat.name] =
                  "#" + mat.color.getHexString()
              }
            }
          })
        } else if (obj.material.name) {
          avatarMaterials.push(obj.material.name)
          if (
            obj.material.color &&
            typeof obj.material.color.getHexString === "function" &&
            initialColorsRef.current &&
            !(obj.material.name in initialColorsRef.current)
          ) {
            initialColorsRef.current[obj.material.name] =
              "#" + obj.material.color.getHexString()
          }
        }
      }
    })

    // Process product scene (skinned product)
    productScene.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat: any) => {
            if (mat?.name) {
              productMaterials.push(mat.name)
              if (
                mat.color &&
                typeof mat.color.getHexString === "function" &&
                initialColorsRef.current &&
                !(mat.name in initialColorsRef.current)
              ) {
                initialColorsRef.current[mat.name] =
                  "#" + mat.color.getHexString()
              }
            }
          })
        } else if (obj.material.name) {
          productMaterials.push(obj.material.name)
          if (
            obj.material.color &&
            typeof obj.material.color.getHexString === "function" &&
            initialColorsRef.current &&
            !(obj.material.name in initialColorsRef.current)
          ) {
            initialColorsRef.current[obj.material.name] =
              "#" + obj.material.color.getHexString()
          }
        }
      }
    })

    // Apply material customizations
    applyAvatarCustomizations(
      avatarScene,
      materialValues,
      initialColorsRef,
      getSkinToneColor
    )
    applyProductCustomizations(
      productScene,
      materialValues,
      initialColorsRef,
      getSkinToneColor
    )

    // Notify parent about loaded materials
    if (onMaterials) {
      const allMaterials = Array.from(
        new Set([...avatarMaterials, ...productMaterials])
      )
      onMaterials(allMaterials)
    }

    setIsLoaded(true)

    // Cleanup function
    return () => {
      const cleanupScene = (scene: any) => {
        scene.traverse((obj: any) => {
          if (obj.isMesh) {
            obj.geometry?.dispose?.()
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat: any) => mat?.dispose?.())
            } else {
              obj.material?.dispose?.()
            }
          }
        })
      }

      cleanupScene(avatarScene)
      cleanupScene(productScene)
    }
  }, [avatarScene, productScene, materialValues, onMaterials, isLoaded])

  return (
    <group>
      {avatarScene && <primitive object={avatarScene} />}
      {productScene && <primitive object={productScene} />}
    </group>
  )
})

const AvatarViewer = React.memo(function AvatarViewer({
  avatarModelUrl,
  productModelUrl,
  materialValues,
  onMaterialsLoaded,
  style,
}: AvatarViewerProps) {
  const [delayPassed, setDelayPassed] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.1 })
  const [visible, setVisible] = useState(true)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)

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

  // Convert materialValues to color mapping - separate for avatar and product
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
          // Get skin tone color including custom colors
          colorMap[key] = getSkinToneColor(value.value)
        }
      }
    })

    if (process.env.NODE_ENV === "development") {
    }

    return colorMap
  }, [materialValues, customer?.metadata?.custom_skin_color])

  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", handler)
    return () => document.removeEventListener("visibilitychange", handler)
  }, [])

  useEffect(() => {
    setDelayPassed(false)
    const timeout = setTimeout(() => setDelayPassed(true), 500)
    return () => clearTimeout(timeout)
  }, [avatarModelUrl, productModelUrl])

  // Use performance monitor
  usePerformanceMonitor()

  // Memoize the canvas content to prevent unnecessary re-renders
  const canvasContent = useMemo(
    () => (
      <ErrorBoundary fallback={<Text>Failed to load 3D viewer</Text>}>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
          shadows={{ type: THREE.PCFSoftShadowMap }}
          gl={{
            antialias: true,
            alpha: true, // Enable alpha for transparency
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          frameloop={inView && visible ? "always" : "demand"}
          performance={{ min: 0.5 }}
          style={{
            background: "linear-gradient(135deg, #e0e7ef 0%, #f3f4f6 100%)",
            borderRadius: 16,
          }}
          onCreated={({ gl, scene }) => {
            // Set background color
            scene.background = new THREE.Color(0xf8f9fa)
            // Configure renderer
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
            gl.toneMapping = THREE.ACESFilmicToneMapping
            // Ensure proper transparency
            gl.setClearColor(0x000000, 0)
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.0} />
            <hemisphereLight args={[0xffffff, 0x444444, 0.5]} />
            <directionalLight
              position={[5, 10, 7]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />

            <Environment preset="city" background={false} />

            <Bounds fit clip margin={1.2}>
              <group position={[0, -1, 0]}>
                <AvatarModel
                  avatarUrl={avatarModelUrl}
                  productUrl={productModelUrl}
                  onMaterials={onMaterialsLoaded}
                  materialValues={materialColorMap}
                  getSkinToneColor={getSkinToneColor}
                />
              </group>
            </Bounds>

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              autoRotate={inView && visible}
              autoRotateSpeed={2.0} // Increased from 0.8 to 2.0 for faster rotation
              rotateSpeed={1.2} // Added for faster manual rotation
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
              enableDamping={true}
              dampingFactor={0.03} // Reduced from 0.05 for smoother motion
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    ),
    [
      inView,
      visible,
      avatarModelUrl,
      productModelUrl,
      onMaterialsLoaded,
      materialColorMap,
    ]
  )

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #e0e7ef 0%, #f3f4f6 100%)",
        ...style,
      }}
    >
      {canvasContent}
    </div>
  )
})

export default AvatarViewer
