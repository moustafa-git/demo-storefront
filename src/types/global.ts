import { StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'color' | 'toggle';
  defaultValue: string | boolean;
  values?: string[]; // For color options, this would be hex codes
}

export interface Product3DMetadata {
  modelUrl: string;
  customizationOptions?: CustomizationOption[];
}
