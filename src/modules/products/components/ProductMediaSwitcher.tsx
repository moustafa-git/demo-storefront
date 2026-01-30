"use client";
import { useSearchParams } from "next/navigation";
import ImageGallery from "@modules/products/components/image-gallery";
import { CustomizationOption } from "../../../types/global";
import Product3DViewClient from "@modules/products/components/three-d-viewer/Product3DViewClient";
import { useMemo } from "react";

interface ProductMediaSwitcherProps {
  modelUrl?: string;
  skinnedModelUrl?: string;
  customizationOptions?: CustomizationOption[];
  images: any[];
}

const ProductMediaSwitcher = ({ modelUrl, skinnedModelUrl, customizationOptions, images }: ProductMediaSwitcherProps) => {
  const searchParams = useSearchParams();
  const is3DView = searchParams.get("view3d") === "1";
  
  // Get selected options from URL parameters (if any)
  const memoizedCustomizationOptions = useMemo(() => customizationOptions, [customizationOptions]);
  const memoizedSelectedOptions = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('option_')) {
        const optionId = key.replace('option_', '');
        result[optionId] = value;
      }
    });
    return result;
  }, [searchParams]);


  if (is3DView && modelUrl) {
    return <Product3DViewClient 
      modelUrl={modelUrl} 
      skinnedModelUrl={skinnedModelUrl}
      customizationOptions={memoizedCustomizationOptions} 
      selectedOptions={memoizedSelectedOptions}
      selectedMaterial={null}
      setSelectedMaterial={() => {}}
      materialValues={{}}
      setMaterialValues={() => {}}
    />;
  }
  return <ImageGallery images={images} />;
};

export default ProductMediaSwitcher; 