"use client"

import { Table, Text, clx, Checkbox, Textarea, Button, Label } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import React, { useState, useRef, useEffect } from "react"
import { SKIN_TONE_OPTIONS } from "@lib/util/skin-tone-analyzer"
import { retrieveCustomer } from "@lib/data/customer"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [giftUpdating, setGiftUpdating] = useState(false)
  const [newGiftMessage, setNewGiftMessage] = useState(
    (item.metadata?.gift_message as string) || ""
  )
  const [isEditingGiftMessage, setIsEditingGiftMessage] = useState(false)

  const isGift = item.metadata?.is_gift === "true"
  const giftMessage = item.metadata?.gift_message as string

  // Fetch customer to resolve custom skin tone color in swatches
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const data = await retrieveCustomer()
        if (isMounted) setCustomer(data)
      } catch {
        if (isMounted) setCustomer(null)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const getSkinToneColor = (skinToneId: string): string => {
    if (skinToneId === "custom") {
      const custom = customer?.metadata?.custom_skin_color as string | undefined
      return custom || "#D4A67C"
    }
    return (
      SKIN_TONE_OPTIONS.find((opt) => opt.id === skinToneId)?.color || "#D4A67C"
    )
  }

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const handleGiftToggle = async (checked: boolean) => {
    setGiftUpdating(true)
    try {
      const newMetadata = {
        is_gift: checked.toString(),
        gift_message: checked ? newGiftMessage : "",
      }
      await updateLineItem({
        lineId: item.id,
        quantity: item.quantity,
        metadata: newMetadata,
      })
      if (!checked) {
        setIsEditingGiftMessage(false)
      }
    } catch (e) {
      console.error("Error updating gift status:", e)
    } finally {
      setGiftUpdating(false)
    }
  }

  const handleSaveGiftMessage = async () => {
    setGiftUpdating(true)
    try {
      const newMetadata = {
        is_gift: "true",
        gift_message: newGiftMessage,
      }
      await updateLineItem({
        lineId: item.id,
        quantity: item.quantity,
        metadata: newMetadata,
      })
      setIsEditingGiftMessage(false)
    } catch (e) {
      console.error("Error updating gift message:", e)
    } finally {
      setGiftUpdating(false)
    }
  }

  const handleStartEdit = () => {
    setIsEditingGiftMessage(true)
  }

  const handleCancelEdit = () => {
    setNewGiftMessage(giftMessage || "")
    setIsEditingGiftMessage(false)
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base mt-3"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
        {/* Display all material customizations */}
        {(() => {
          try {
            // Check if this is a new-style cart item
            const isNewCartItem = item.metadata?._cart_item_version === 'v2';
            
            // For new cart items, always show materials if they exist
            if (isNewCartItem && item.metadata?.materials) {
              const materials = typeof item.metadata.materials === 'string' 
                ? JSON.parse(item.metadata.materials) 
                : item.metadata.materials;
              
              if (materials && typeof materials === 'object' && Object.keys(materials).length > 0) {
                const materialEntries = Object.entries(materials);
                if (materialEntries.length > 0) {
                  return (
                    <div className="mt-2 flex flex-wrap gap-2 mb-2">
                      {materialEntries.map(([materialName, materialData]: [string, any]) => {
                        if (!materialData?.value) return null;
                        const value = materialData.value;
                        const isSkinTone = materialData.type === 'skinTone';
                        const displayName = materialName.replace(/([A-Z])/g, ' $1').trim();
                        const skinToneName = isSkinTone ? (SKIN_TONE_OPTIONS.find(opt => opt.id === value)?.name || value) : '';
                        const skinToneColor = isSkinTone ? getSkinToneColor(value) : '';
                        
                        return (
                          <div 
                            key={materialName}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200 text-xs font-medium text-gray-700"
                            title={`${displayName}: ${isSkinTone ? skinToneName : value}`}
                          >
                            <span className="truncate max-w-[100px]">{displayName}</span>
                            <span 
                              className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                              style={{ backgroundColor: isSkinTone ? skinToneColor : value }}
                              aria-hidden="true"
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              }
            }
            
            // Fallback to old metadata format for backward compatibility
            const elements = [];
            
            // Handle old skin tone format
            if (item.metadata?.virtual_skin_tone) {
              const skinTone = item.metadata.virtual_skin_tone;
              if (typeof skinTone === 'string' && skinTone.trim() && 
                  skinTone.toLowerCase() !== 'undefined' && 
                  skinTone.toLowerCase() !== 'null' &&
                  skinTone !== 'default') {
                elements.push(
                  <div key="skin-tone" className="flex items-center gap-2">
                    <span className="text-ui-fg-muted text-xs">Skin Tone:</span>
                    <span className="text-xs text-gray-700">
                      {SKIN_TONE_OPTIONS.find(opt => opt.id === skinTone)?.name || skinTone}
                    </span>
                  </div>
                );
              }
            }
            
            // Handle old color format
            if (item.metadata?.virtual_color && 
                typeof item.metadata.virtual_color === 'string' && 
                item.metadata.virtual_color.trim() !== '') {
              elements.push(
                <div key="color" className="flex items-center gap-2">
                  <span className="text-ui-fg-muted text-xs">Color:</span>
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-300 align-middle"
                    style={{ backgroundColor: item.metadata.virtual_color }}
                    title={item.metadata.virtual_color}
                    data-testid="cart-color-swatch"
                  />
                  <span className="text-xs font-mono text-gray-700" data-testid="cart-color-value">
                    {item.metadata.virtual_color}
                  </span>
                </div>
              );
            }
            
            return elements.length > 0 ? <div className="mt-2 space-y-2">{elements}</div> : null;
            
          } catch (error) {
            console.error('Error rendering material customizations:', error);
            return null;
          }
        })()}

        {/* Gift options */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isGift}
              onCheckedChange={(val) => handleGiftToggle(Boolean(val))}
              disabled={giftUpdating}
              id={`gift-${item.id}`}
            />
            <Label htmlFor={`gift-${item.id}`}>This is a gift</Label>
          </div>

          {isGift && !isEditingGiftMessage && (
            <div className="flex items-center gap-2">
              <Text className="text-ui-fg-subtle text-sm">
                {giftMessage ? `Gift Message: ${giftMessage}` : "No gift message provided"}
              </Text>
              <Button size="small" variant="secondary" onClick={handleStartEdit} disabled={giftUpdating}>
                Edit
              </Button>
            </div>
          )}

          {isGift && isEditingGiftMessage && (
            <div className="flex flex-col gap-2">
              <Textarea
                rows={3}
                placeholder="Add a gift message"
                value={newGiftMessage}
                onChange={(e) => setNewGiftMessage(e.target.value)}
                disabled={giftUpdating}
              />
              <div className="flex gap-2">
                <Button size="small" onClick={handleSaveGiftMessage} disabled={giftUpdating}>
                  Save
                </Button>
                <Button size="small" variant="secondary" onClick={handleCancelEdit} disabled={giftUpdating}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}

              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
