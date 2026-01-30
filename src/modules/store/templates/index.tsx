import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { listCollections, retrieveCollection } from "@lib/data/collections"

export default async function StoreTemplate({
  sortBy,
  page,
  countryCode,
  collectionId,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  collectionId?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch collections for the filter
  const { collections } = await listCollections()
  
  // Get the selected collection for the title
  let selectedCollection = null
  if (collectionId) {
    try {
      selectedCollection = await retrieveCollection(collectionId)
    } catch (error) {
      // If collection not found, continue without it
      console.error("Collection not found:", error)
    }
  }

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList 
        sortBy={sort} 
        collectionId={collectionId} 
        collections={collections}
      />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{selectedCollection ? selectedCollection.title : "All Products"}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid numberOfProducts={8} />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collectionId}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
