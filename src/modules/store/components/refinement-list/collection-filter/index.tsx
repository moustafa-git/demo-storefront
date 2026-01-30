"use client"

import { HttpTypes } from "@medusajs/types"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

type CollectionFilterProps = {
  collections: HttpTypes.StoreCollection[]
  selectedCollectionId?: string
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const CollectionFilter = ({
  collections,
  selectedCollectionId,
  setQueryParams,
  "data-testid": dataTestId,
}: CollectionFilterProps) => {
  const collectionOptions = [
    {
      value: "",
      label: "All Collections",
    },
    ...collections.map((collection) => ({
      value: collection.id,
      label: collection.title,
    })),
  ]

  const handleChange = (value: string) => {
    setQueryParams("collection", value)
  }

  return (
    <FilterRadioGroup
      title="Collections"
      items={collectionOptions}
      value={selectedCollectionId || ""}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default CollectionFilter

