"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { retrieveCustomer } from "@lib/data/customer"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import SkinToneSelector from "./skin-tone-selector"
import { SKIN_TONE_OPTIONS, getSkinToneById } from "@lib/util/skin-tone-analyzer"
import ColorPicker from "./color-picker"
import type { MaterialValue } from "../../templates/product-page-client"
import React from "react"
import { isDemoMode } from "@lib/demo-config"
import DemoModal from "@modules/common/components/demo-modal"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  skinTone?: string
  setSkinTone?: (val: string) => void
  selectedMaterial: string | null
  setSelectedMaterial: (val: string | null) => void
  materialValues: Record<string, MaterialValue>
  setMaterialValues: React.Dispatch<React.SetStateAction<Record<string, MaterialValue>>>
  is3DView?: boolean
  modelMaterials?: string[] // NEW
  productId?: string // Add productId prop
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

// Utility to filter out virtual/3D-only keys from options
function filterRealMedusaOptions(options: Record<string, string | undefined>): Record<string, string | undefined> {
  const filtered: Record<string, string | undefined> = {};
  Object.entries(options).forEach(([key, value]) => {
    if (!key.startsWith('virtual_')) {
      filtered[key] = value;
    }
  });
  return filtered;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  disabled,
  skinTone,
  setSkinTone,
  selectedMaterial,
  setSelectedMaterial,
  materialValues,
  setMaterialValues,
  is3DView = false,
  modelMaterials, // NEW
}) => {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const countryCode = useParams().countryCode as string
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if this is a 3D product
  const is3DProduct = typeof product.metadata?.modelUrl === 'string' && product.metadata.modelUrl.length > 0;

  // --- VIRTUAL SKIN TONE OPTION ---
  const VIRTUAL_SKIN_TONE_OPTION_ID = "virtual_skin_tone"
  const VIRTUAL_SKIN_TONE_TITLE = "Skin Tone"
  // This is a fake option object to pass to SkinToneSelector
  const virtualSkinToneOption = is3DProduct ? {
    id: VIRTUAL_SKIN_TONE_OPTION_ID,
    title: VIRTUAL_SKIN_TONE_TITLE,
    values: [], // Not used by SkinToneSelector
    productId: product.id, // Pass productId for per-product session key
  } as any : null

  // If skinTone/setSkinTone are provided as props, use them; otherwise, manage local state (for fallback)
  const [localSkinTone, localSetSkinTone] = useState<string | undefined>(() => {
    // Initialize from URL if available
    const skinToneFromUrl = searchParams.get(`option_${VIRTUAL_SKIN_TONE_OPTION_ID}`);
    return skinToneFromUrl || undefined;
  })
  
  // Determine effective skin tone - prioritize material-specific skin tone if available
  const effectiveSkinTone = useMemo(() => {
    if (selectedMaterial && materialValues[selectedMaterial]?.type === 'skinTone') {
      return materialValues[selectedMaterial].value;
    }
    return skinTone !== undefined ? skinTone : localSkinTone;
  }, [selectedMaterial, materialValues, skinTone, localSkinTone]);
  
  const effectiveSetSkinTone = setSkinTone !== undefined ? setSkinTone : localSetSkinTone

  // --- VIRTUAL COLOR OPTION ---
  const VIRTUAL_COLOR_OPTION_ID = "virtual_color"
  const VIRTUAL_COLOR_TITLE = "Color"
  const virtualColorOption = is3DProduct ? {
    id: VIRTUAL_COLOR_OPTION_ID,
    title: VIRTUAL_COLOR_TITLE,
    values: [],
    productId: product.id,
  } as any : null

  // Local state for color
  const [localColor, localSetColor] = useState<string | undefined>(undefined)
  const effectiveColor = localColor
  const effectiveSetColor = localSetColor

  // Initialize options from URL parameters or default to single variant
  useEffect(() => {
    // Check if there are options in URL
    const urlOptions: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('option_')) {
        const optionId = key.replace('option_', '')
        urlOptions[optionId] = value
      }
    })
    // Also check for the virtual skin tone in URL
    if (searchParams.has(`option_${VIRTUAL_SKIN_TONE_OPTION_ID}`)) {
      urlOptions[VIRTUAL_SKIN_TONE_OPTION_ID] = searchParams.get(`option_${VIRTUAL_SKIN_TONE_OPTION_ID}`) || ""
    }
    // Also check for the virtual color in URL
    if (searchParams.has(`option_${VIRTUAL_COLOR_OPTION_ID}`)) {
      urlOptions[VIRTUAL_COLOR_OPTION_ID] = searchParams.get(`option_${VIRTUAL_COLOR_OPTION_ID}`) || ""
    }
    if (Object.keys(urlOptions).length > 0) {
      setOptions(urlOptions)
    } else if (product.variants?.length === 1) {
      // If there is only 1 variant, preselect the options
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants, searchParams])

  // Use filtered options for variant matching
  const filteredOptions = useMemo(() => filterRealMedusaOptions(options), [options]);

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, filteredOptions)
    })
  }, [product.variants, filteredOptions])

  // Memoize the setOptionValue function to prevent infinite loops
  const setOptionValue = useCallback((optionId: string, value: string) => {
    // Only update options state for real Medusa options
    if (optionId !== VIRTUAL_SKIN_TONE_OPTION_ID && optionId !== VIRTUAL_COLOR_OPTION_ID) {
      setOptions((prev) => ({
        ...prev,
        [optionId]: value,
      }))
      // Update URL parameters for 3D model sync and for real options
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set(`option_${optionId}`, value)
      const newUrl = `?${newSearchParams.toString()}`
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, router])

  // Handler for skin tone selection (per material)
  const handleSkinToneChange = useCallback((optionId: string, value: string) => {
    if (!selectedMaterial) return;
    
    
    // Update the material values with the new skin tone
    setMaterialValues((prev: Record<string, MaterialValue>) => {
      const newValues = { ...prev };
      
      // Only update the currently selected material
      if (value) {
        newValues[selectedMaterial] = { type: 'skinTone', value };
      } else {
        // If value is empty, remove the entry for this material
        delete newValues[selectedMaterial];
      }
      
      return newValues;
    });
    
    // Update session storage for this material
    if (product.id) {
      const sessionKey = `skin_tone_selection_virtual_skin_tone_${product.id}_${selectedMaterial}`;
      if (value) {
        const payload: any = { skinToneId: value, material: selectedMaterial };
        // If selecting custom, try to persist the custom color alongside per-material for later retrieval
        if (value === 'custom') {
          try {
            const genericKey = `skin_tone_selection_virtual_skin_tone_${product.id}`;
            const genericVal = sessionStorage.getItem(genericKey);
            if (genericVal) {
              const parsed = JSON.parse(genericVal);
              if (typeof parsed?.customColor === 'string' && parsed.customColor) {
                payload.customColor = parsed.customColor;
              }
            }
          } catch {}
        }
        sessionStorage.setItem(sessionKey, JSON.stringify(payload));
      } else {
        sessionStorage.removeItem(sessionKey);
      }
    }
    
    // Update URL with the new skin tone
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      // Include the material name in the URL parameter
      newSearchParams.set(`option_${VIRTUAL_SKIN_TONE_OPTION_ID}_${selectedMaterial}`, value);
    } else {
      newSearchParams.delete(`option_${VIRTUAL_SKIN_TONE_OPTION_ID}_${selectedMaterial}`);
    }
    
    const newUrl = `?${newSearchParams.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [selectedMaterial, setMaterialValues, searchParams, router, materialValues, modelMaterials, product]);

  // Handler for color selection (per material)
  const handleColorChange = useCallback((optionId: string, value: string) => {
    if (!selectedMaterial) return;
    setMaterialValues((prev: Record<string, MaterialValue>) => {
      const newValues = { ...prev };
      if (value === "") {
        // Remove the entry to revert to initial/default
        delete newValues[selectedMaterial];
      } else {
        newValues[selectedMaterial] = { type: 'color', value };
      }
      return newValues;
    });
  }, [selectedMaterial, setMaterialValues]);

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, filteredOptions)
    })
  }, [product.variants, filteredOptions])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (selectedVariant) {
    }
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  // --- ENFORCE ALL MATERIALS COLORED FOR 3D ---
  const allMaterialsColored = React.useMemo(() => {
    if (!is3DProduct || !modelMaterials || modelMaterials.length === 0) return true;
    return modelMaterials.every((mat) => {
      const val = materialValues[mat];
      return val && val.value && val.value.trim() !== '';
    });
  }, [is3DProduct, modelMaterials, materialValues]);

  // Log which materials are missing color assignments to debug gating
  useEffect(() => {
    if (!is3DProduct || !modelMaterials || modelMaterials.length === 0) return;

    const missing = modelMaterials.filter((mat) => {
      const val = materialValues[mat];
      return !val || !val.value || val.value.trim() === '';
    });

    try {
      console.group('[3D] Material completion check');
      console.log('required materials:', modelMaterials);
      console.log('provided keys:', Object.keys(materialValues || {}));
      console.log('missing materials:', missing);
      console.log('allMaterialsColored:', missing.length === 0);
      console.groupEnd();
      console.log('[3D] materials debug -> required:', modelMaterials, 'provided keys:', Object.keys(materialValues || {}), 'missing:', missing);
    } catch {}
  }, [is3DProduct, modelMaterials, materialValues]);

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
const handleAddToCart = async () => {
  // In demo mode, show demo modal instead of adding to cart
  if (isDemoMode) {
    setShowDemoModal(true)
    return null
  }

  if (!selectedVariant?.id) return null;

  setIsAdding(true);
  
  // Prepare metadata object
  const metadata: Record<string, any> = {};
  // Resolve current customer for custom color fallback
  let currentCustomer: any = null;
  try {
    currentCustomer = await retrieveCustomer();
  } catch {}
  
  // Track all material customizations
  const materialsMetadata: Record<string, {type: string, value: string, hex?: string}> = {};
  
  // Include all material values that have a value
  Object.entries(materialValues).forEach(([materialName, materialValue]) => {
    try {
      if (materialValue?.value?.trim()) {
        const trimmedValue = materialValue.value.trim();
        const entry: { type: string, value: string, hex?: string } = {
          type: materialValue.type,
          value: trimmedValue
        };
        // Add hex for colors and skin tones
        if (materialValue.type === 'color') {
          entry.hex = trimmedValue;
        } else if (materialValue.type === 'skinTone') {
          if (trimmedValue === 'custom') {
            // Resolve custom color from session or customer metadata
            let customHex: string | undefined;
            try {
              // First, check per-product selector session (written by SkinToneSelector)
              const genericKey = `skin_tone_selection_virtual_skin_tone_${product.id}`;
              const genericVal = sessionStorage.getItem(genericKey);
              if (genericVal) {
                const parsed = JSON.parse(genericVal);
                if (typeof parsed?.customColor === 'string' && parsed.customColor) {
                  customHex = parsed.customColor;
                }
              }
            } catch {}
            if (!customHex) {
              // Next, try a per-material session key written by our handler
              try {
                const perMaterialKey = `skin_tone_selection_virtual_skin_tone_${product.id}_${materialName}`;
                const perMaterialVal = sessionStorage.getItem(perMaterialKey);
                if (perMaterialVal) {
                  const parsed = JSON.parse(perMaterialVal);
                  if (typeof parsed?.customColor === 'string' && parsed.customColor) {
                    customHex = parsed.customColor;
                  }
                }
              } catch {}
            }
            if (!customHex) {
              // Finally, check a global exposed customer metadata hook if present
              try {
                const customerMeta = (window as any)?.__medusa_customer_metadata__ || null;
                if (customerMeta?.custom_skin_color) {
                  customHex = customerMeta.custom_skin_color as string;
                }
              } catch {}
            }
            if (!customHex && currentCustomer?.metadata?.custom_skin_color) {
              customHex = currentCustomer.metadata.custom_skin_color as string;
            }
            entry.hex = customHex || '#D4A67C';
          } else {
            const tone = getSkinToneById(trimmedValue);
            entry.hex = tone?.color || '#D4A67C';
          }
        }
        materialsMetadata[materialName] = entry;
      }
    } catch (error) {
      console.error('Error processing material value:', error);
    }
  });
  
  // Include materials metadata if we have any values
  if (Object.keys(materialsMetadata).length > 0) {
    metadata.materials = materialsMetadata;
  }
  
  // Include skin tone if it exists
  if (effectiveSkinTone && effectiveSkinTone.trim() !== '') {
    const skinToneId = effectiveSkinTone.trim();
    metadata.virtual_skin_tone = skinToneId;
    // Resolve hex, including custom color from customer profile if applicable
    let hex = '#D4A67C';
    if (skinToneId === 'custom') {
      try {
        // Try to derive current customer's custom color from session or local storage
        // Fallback to default if not present
        const customerMeta = (window as any)?.__medusa_customer_metadata__ || null;
        if (customerMeta?.custom_skin_color) {
          hex = customerMeta.custom_skin_color as string;
        } else {
          // As a fallback, attempt to read a recent selection payload in sessionStorage for this product/material
          // This is best-effort and safe if missing
          const productId = product?.id;
          if (productId) {
            const keyPrefix = `skin_tone_selection_virtual_skin_tone_${productId}`;
            for (let i = 0; i < sessionStorage.length; i++) {
              const k = sessionStorage.key(i);
              if (k && k.startsWith(keyPrefix)) {
                try {
                  const parsed = JSON.parse(sessionStorage.getItem(k) || 'null');
                  if (parsed && typeof parsed.customColor === 'string' && parsed.customColor) {
                    hex = parsed.customColor;
                    break;
                  }
                } catch {}
              }
            }
          }
        }
      } catch {}
    } else {
      const tone = getSkinToneById(skinToneId);
      hex = tone?.color || '#D4A67C';
    }
    metadata.virtual_skin_tone_hex = hex;
  }
  
  // Add a flag to indicate this is a new-style cart item
  metadata._cart_item_version = 'v2';
  
  
  try {
    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
  } finally {
    setIsAdding(false);
  }
};


  // Check if the product has a real skin tone option in the admin GUI
  const hasRealSkinToneOption = (product.options || []).some(
    (opt) => {
      if (!opt.title) return false;
      const title = opt.title.toLowerCase();
      return title.includes('skin') && title.includes('tone');
    }
  );

  const currentValue = selectedMaterial ? materialValues[selectedMaterial] : undefined;
  const isColorActive = currentValue?.type === 'color';
  const isSkinToneActive = currentValue?.type === 'skinTone';

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        {is3DProduct && !is3DView && (
          <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.598-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3 3 0 0115 14a3 3 0 01-2.5-1.25A3 3 0 0110 14a3 3 0 01-2.5 1.25A3 3 0 015 14a3 3 0 01-2.5-1.25A3 3 0 010 14a1 1 0 01-1-1 1 1 0 011-1 1 1 0 001-1 1 1 0 00-1-1 1 1 0 01-1-1V9a1 1 0 011-1h1.5a1 1 0 00.8-.4l1.4-1.866a1 1 0 01.8-.4h2.8a1 1 0 01.8.4l1.4 1.866a1 1 0 00.8.4H17a1 1 0 011 1v1a1 1 0 01-1 1 1 1 0 100 2 1 1 0 110 2 1 1 0 01-1 1 1 1 0 100 2 1 1 0 110 2 1 1 0 01-1-1h-1.5a1 1 0 00-1-1h-3a1 1 0 00-1 1H7a1 1 0 00-1 1z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">Try our 3D Customizer</h3>
                <div className="mt-1 text-sm text-indigo-700">
                  <p>See how this product looks with different colors and materials in our interactive 3D viewer.</p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-xs text-indigo-600">
                    <span>Click "View in 3D" above to get started</span>
                    <svg className="w-4 h-4 ml-1.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20" style={{transform: 'rotate(90deg)'}}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {is3DProduct && is3DView && (
          <div className="mb-2">
            {selectedMaterial ? (
              <div className="space-y-4">
                <span className="font-semibold text-sm text-blue-700">Customizing: {selectedMaterial}</span>
                
                {/* Show skin tone picker when material is selected */}
                {virtualSkinToneOption && (
                  <SkinToneSelector
                    option={virtualSkinToneOption}
                    current={effectiveSkinTone || ""}
                    updateOption={handleSkinToneChange}
                    title={VIRTUAL_SKIN_TONE_TITLE}
                    data-testid="skin-tone-selector"
                    productId={product.id}
                    disabled={!!disabled || isAdding}
                  />
                )}
                
                {/* Show color picker when material is selected */}
                {virtualColorOption && (
                  <ColorPicker
                    option={virtualColorOption}
                    current={materialValues[selectedMaterial]?.type === 'color' ? materialValues[selectedMaterial].value : ""}
                    updateColor={handleColorChange}
                    title={VIRTUAL_COLOR_TITLE}
                    data-testid="color-picker"
                    productId={product.id}
                    disabled={!!disabled || isAdding}
                  />
                )}
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Select a part to customize</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Click on any part of the 3D model to customize its appearance with different colors and materials.</p>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-blue-600">
                        <svg className="w-4 h-4 mr-1.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20" style={{transform: 'rotate(90deg)'}}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Click on any part of the 3D model to customize</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Product options */}
        {(product.options || []).map((option) => (
          <div key={option.id}>
            <OptionSelect
              option={option}
              current={options[option.id]}
              updateOption={setOptionValue}
              title={option.title ?? ""}
              data-testid="product-options"
              disabled={!!disabled || isAdding}
            />
          </div>
        ))}
        <Divider />

        <ProductPrice product={product} variant={selectedVariant} />

        {/* DEBUG LOG */}
        {(() => {
          return null;
        })()}
        {/* END DEBUG LOG */}

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant ||
            (is3DProduct && !allMaterialsColored) // ENFORCE EVERYWHERE
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : (is3DProduct && !allMaterialsColored)
            ? "Color all materials to add to cart"
            : "Add to cart"}
        </Button>
        {is3DProduct && !allMaterialsColored && (
          <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded bg-red-50 border border-red-200 text-xs shadow-sm animate-fade-in">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <span className="text-red-700">Color all 3D parts before adding to cart.</span>
          </div>
        )}
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>

      {/* Demo Mode Modal */}
      <DemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        type="cart"
      />
    </>
  )
}

export default React.memo(ProductActions);
