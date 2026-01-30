"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import CollectionFilter from "./collection-filter"
import { Spinner } from "@modules/common/components/spinner"
import { listCollections } from "@lib/data/collections"
import { HttpTypes } from "@medusajs/types"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  collectionId?: string
  collections?: HttpTypes.StoreCollection[]
  'data-testid'?: string
}

const RefinementList = ({ 
  sortBy, 
  collectionId,
  collections,
  'data-testid': dataTestId 
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    startTransition(() => {
      router.push(`${pathname}?${query}`)
    })
  }

  return (
    <div
      className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem] relative"
      aria-busy={isPending}
    >
      {isPending && (
        <div className="absolute -top-2 left-0 flex items-center gap-2 text-ui-fg-subtle">
          <Spinner size="sm" />
          <span className="txt-compact-small">Loading…</span>
        </div>
      )}
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      {collections && collections.length > 0 && (
        <CollectionFilter 
          collections={collections} 
          selectedCollectionId={collectionId}
          setQueryParams={setQueryParams} 
          data-testid={dataTestId} 
        />
      )}
    </div>
  )
}

export default RefinementList
