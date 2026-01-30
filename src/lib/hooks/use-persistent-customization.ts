import { useCallback, useEffect, useRef } from "react"

/**
 * usePersistentCustomization
 *
 * Persists and restores a value (e.g., 3D material/color customizations) in sessionStorage scoped by a unique productId.
 *
 * @param productId - Unique ID for the product
 * @param value - The value to persist (e.g., materialValues)
 * @param setValue - Setter to restore the value
 * @param storageKeyPrefix - Optional prefix for the sessionStorage key
 *
 * Usage:
 *   usePersistentCustomization(productId, materialValues, setMaterialValues)
 */
export function usePersistentCustomization<T = any>(
  productId: string | undefined,
  value: T,
  setValue: (v: T) => void,
  storageKeyPrefix = "customization_values_"
) {
  const restoringRef = useRef(false)
  // Restore on mount
  useEffect(() => {
    if (!productId) return
    try {
      const sessionKey = `${storageKeyPrefix}${productId}`
      const sessionData = sessionStorage.getItem(sessionKey)
      if (sessionData) {
        const restored = JSON.parse(sessionData)
        // GUARD: Prevent restoring `{}` if value is non-empty
        if (
          typeof restored === "object" &&
          restored &&
          Object.keys(restored).length === 0 &&
          typeof value === "object" &&
          value &&
          Object.keys(value).length > 0
        ) {
          console.warn(
            "[PERSIST][GUARD] Prevented restoring empty customization over non-empty value for",
            sessionKey,
            { restored, current: value }
          )
          console.trace()
        } else if (!require("lodash").isEqual(restored, value)) {
          restoringRef.current = true
          setValue(restored)
        } else {
        }
      } else {
      }
    } catch {}
    // eslint-disable-next-line
  }, [productId, setValue, storageKeyPrefix])

  // Persist on change
  useEffect(() => {
    if (restoringRef.current) {
      restoringRef.current = false
      return
    }
    if (!productId) return
    try {
      const sessionKey = `${storageKeyPrefix}${productId}`
      // GUARD: Prevent saving `{}` if sessionStorage already has a non-empty value
      const prevData = sessionStorage.getItem(sessionKey)
      if (
        typeof value === "object" &&
        value &&
        Object.keys(value).length === 0 &&
        prevData
      ) {
        const prevParsed = JSON.parse(prevData)
        if (
          typeof prevParsed === "object" &&
          prevParsed &&
          Object.keys(prevParsed).length > 0
        ) {
          console.warn(
            "[PERSIST][GUARD] Prevented saving empty customization over non-empty stored value for",
            sessionKey,
            { value, prevParsed }
          )
          console.trace()
          return
        }
      }
      if (prevData) {
        const prevParsed = JSON.parse(prevData)
        if (!require("lodash").isEqual(prevParsed, value)) {
        }
      }
      sessionStorage.setItem(sessionKey, JSON.stringify(value))
      console.trace()
    } catch (e) {}
    // eslint-disable-next-line
  }, [productId, value, storageKeyPrefix])

  // Utility: clear customization for this product
  const clearCustomization = useCallback(() => {
    if (!productId) return
    try {
      const sessionKey = `${storageKeyPrefix}${productId}`
      sessionStorage.removeItem(sessionKey)
    } catch (e) {}
  }, [productId, storageKeyPrefix])

  return { clearCustomization }
}
