import React, { useEffect, useState, useMemo, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import {
  useGLTF,
  OrbitControls,
  Html,
  useProgress,
  Environment,
  Bounds,
} from "@react-three/drei"
import { useInView } from "react-intersection-observer"

interface R3FModelViewerProps {
  url: string
  onMaterials?: (names: string[]) => void
  style?: React.CSSProperties
  materialValues?: Record<string, string>
  getSkinToneColor?: (skinToneId: string) => string
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div
        style={{
          background: "#222",
          color: "#fff",
          padding: 16,
          borderRadius: 8,
          minWidth: 120,
          textAlign: "center",
          boxShadow: "0 2px 16px #0002",
        }}
      >
        Loading... {progress.toFixed(0)}%
        <div
          style={{
            background: "#444",
            height: 4,
            borderRadius: 2,
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: 4,
              background: "#4f8cff",
              borderRadius: 2,
              transition: "width 0.2s",
            }}
          />
        </div>
      </div>
    </Html>
  )
}

// Normalize materials so each mesh has a uniquely named, non-shared material when
// the source model provides unnamed or "None" materials. This enables per-part coloring.
const normalizeMaterials = (scene: any) => {
  // First pass: count how many meshes reference each material UUID
  const matUsageCount = new Map<string, number>()
  scene.traverse((obj: any) => {
    if (!obj.isMesh || !obj.material) return
    const handleMat = (mat: any) => {
      if (!mat) return
      const id = mat.uuid
      matUsageCount.set(id, (matUsageCount.get(id) || 0) + 1)
    }
    if (Array.isArray(obj.material)) obj.material.forEach(handleMat)
    else handleMat(obj.material)
  })

  // Second pass: for any material that is unnamed/"None" or shared across meshes,
  // clone it per mesh and assign a stable, human-friendly name derived from the mesh.
  scene.traverse((obj: any) => {
    if (!obj.isMesh || !obj.material) return

    const deriveName = (base: string | undefined) => {
      const meshBase = base && base !== "" ? base : obj.name || "Mesh"
      return `${meshBase}_Material`
    }

    const maybeCloneAndName = (mat: any) => {
      if (!mat) return mat
      const isUnnamed = !mat.name || mat.name === "None"
      const isShared = (matUsageCount.get(mat.uuid) || 0) > 1
      if (isUnnamed || isShared) {
        const cloned = mat.clone()
        cloned.name = deriveName(obj.name)
        cloned.needsUpdate = true
        return cloned
      }
      return mat
    }

    if (Array.isArray(obj.material)) {
      const newMats = obj.material.map(maybeCloneAndName)
      // Only assign if changed to avoid unnecessary updates
      for (let i = 0; i < newMats.length; i++) {
        if (newMats[i] !== obj.material[i]) {
          obj.material[i] = newMats[i]
        }
      }
    } else {
      const newMat = maybeCloneAndName(obj.material)
      if (newMat !== obj.material) {
        obj.material = newMat
      }
    }
  })

  if (process.env.NODE_ENV === "development") {
    try {
      console.groupCollapsed("[R3F] normalizeMaterials applied")
      console.log("shared material uuids:", Array.from(matUsageCount.entries()).filter(([, c]) => c > 1).map(([id]) => id))
      console.groupEnd()
    } catch {}
  }
}

const traverseScene = (
  scene: any,
  onMaterials: ((names: string[]) => void) | undefined,
  initialColorsRef: React.RefObject<Record<string, string>>
) => {
  const found: string[] = []
  let meshCount = 0
  let materialCount = 0

  scene.traverse((obj: any) => {
    if (obj.isMesh) {
      meshCount++
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat: any) => {
            materialCount++
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
          materialCount++
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
    }
  })

  try {
    const uniqueNames = Array.from(new Set(found))
    console.group("[R3F] Model materials | meshes:", meshCount, "materials:", materialCount)
    console.log("names (unique)", uniqueNames)
    if (uniqueNames.length === 0) {
      console.warn("[R3F] No material names found. Materials may be unnamed or merged.")
    }
    // Print plainly too (outside of group UI) for visibility in minimal consoles
    console.log("[R3F] materialNames:", uniqueNames)
    console.groupEnd()
  } catch (e) {
    // Ignore logging errors
  }

  if (onMaterials) onMaterials(Array.from(new Set(found)))
}

const applyCustomizations = (
  scene: any,
  stableMaterialValues: Record<string, string> | undefined,
  initialColorsRef: React.RefObject<Record<string, string>>
) => {
  scene.traverse((obj: any) => {
    if (obj.isMesh && obj.material && obj.material.name) {
      let color = undefined
      // Check if the material has a value in stableMaterialValues and it's a non-empty string
      if (
        stableMaterialValues &&
        obj.material.name in stableMaterialValues &&
        stableMaterialValues[obj.material.name] &&
        typeof stableMaterialValues[obj.material.name] === "string"
      ) {
        color = stableMaterialValues[obj.material.name]
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

const Model = React.memo(function Model({
  url,
  onMaterials,
  materialValues,
}: {
  url: string
  onMaterials?: (names: string[]) => void
  materialValues?: Record<string, string>
}) {
  const { scene } = useGLTF(url)
  const stableMaterialValues = useMemo(() => materialValues, [materialValues])

  // Store initial colors for each material
  const initialColorsRef = useRef<Record<string, string>>({})
  const hasCapturedInitialColors = useRef(false)
  const [initialColorsReady, setInitialColorsReady] = useState(false)

  // Capture initial colors only once per model load
  useEffect(() => {
    if (!hasCapturedInitialColors.current && scene) {
      if (process.env.NODE_ENV === "development") {
      }
      // Ensure materials are separable and named before traversing
      normalizeMaterials(scene)
      traverseScene(scene, onMaterials, initialColorsRef)
      hasCapturedInitialColors.current = true
      setInitialColorsReady(true)
    }
  }, [scene, onMaterials])

  // Only apply customizations after initial colors are captured
  useEffect(() => {
    if (initialColorsReady) {
      applyCustomizations(scene, stableMaterialValues, initialColorsRef)
    }
  }, [scene, stableMaterialValues, initialColorsReady])

  useEffect(() => {
    return () => {
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
  }, [scene])

  return <primitive object={scene} />
})

const R3FModelViewer = React.memo(function R3FModelViewer({
  url,
  onMaterials,
  style,
  materialValues,
}: R3FModelViewerProps) {
  const [delayPassed, setDelayPassed] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.1 })
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", handler)
    return () => document.removeEventListener("visibilitychange", handler)
  }, [])

  useEffect(() => {
    setDelayPassed(false)
    const timeout = setTimeout(() => setDelayPassed(true), 500)
    return () => clearTimeout(timeout)
  }, [url])
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: 500,
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #e0e7ef 0%, #f3f4f6 100%)",
        ...style,
      }}
    >
      {!delayPassed && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          Loading Canvas
        </div>
      )}
      {delayPassed && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          shadows
          dpr={window.devicePixelRatio > 1 ? 1.5 : 1}
          frameloop={inView ? "always" : "demand"}
        >
          <ambientLight intensity={1.5} />
          <hemisphereLight args={[0xffffff, 0x444444, 0.7]} />
          <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
          <Environment preset="city" />
          <React.Suspense fallback={<Loader />}>
            <Bounds fit clip>
              <Model
                url={url}
                onMaterials={onMaterials}
                materialValues={materialValues}
              />
            </Bounds>
          </React.Suspense>
          <OrbitControls
            autoRotate={inView}
            autoRotateSpeed={0.4} // Reduced from 0.7
            rotateSpeed={1.5} // Reduced from 2.0
            zoomSpeed={1.5}
            enablePan={false}
          />
        </Canvas>
      )}
    </div>
  )
})

export default R3FModelViewer
