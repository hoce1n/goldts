'use client'

import { useState, useMemo } from 'react'
import { useGetCoins } from '@/hooks/Coin/useGetCoins'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters, SortOption } from '@/components/ProductFilters'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

export default function ProductsPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 12

  const [searchQuery, setSearchQuery] = useState('')
  const [minWeight, setMinWeight] = useState('')
  const [maxWeight, setMaxWeight] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)

  const { data, isLoading, isError } = useGetCoins({
    isActive: true,
    pageNumber,
    pageSize,
  })

  const filteredAndSortedCoins = useMemo(() => {
    if (!data?.data) return []

    let result = [...data.data.coins]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((coin) => coin.name.toLowerCase().includes(query))
    }

    const minW = minWeight ? parseFloat(minWeight) : null
    const maxW = maxWeight ? parseFloat(maxWeight) : null
    if (minW !== null) {
      result = result.filter((coin) => coin.weightInSoot >= minW)
    }
    if (maxW !== null) {
      result = result.filter((coin) => coin.weightInSoot <= maxW)
    }

    const minP = minPrice ? parseFloat(minPrice) : null
    const maxP = maxPrice ? parseFloat(maxPrice) : null
    if (minP !== null) {
      result = result.filter((coin) => coin.finalPrice >= minP)
    }
    if (maxP !== null) {
      result = result.filter((coin) => coin.finalPrice <= maxP)
    }

    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        break
      case 'price-asc':
        result.sort((a, b) => a.finalPrice - b.finalPrice)
        break
      case 'price-desc':
        result.sort((a, b) => b.finalPrice - a.finalPrice)
        break
      case 'weight-asc':
        result.sort((a, b) => a.weightInSoot - b.weightInSoot)
        break
      case 'weight-desc':
        result.sort((a, b) => b.weightInSoot - a.weightInSoot)
        break
    }

    return result
  }, [
    data?.data,
    searchQuery,
    minWeight,
    maxWeight,
    minPrice,
    maxPrice,
    sortBy,
  ])

  const totalPages = data?.data.totalCount ?? 1
  const canGoPrevious = pageNumber > 1
  const canGoNext = pageNumber < totalPages

  const handlePreviousPage = () => {
    if (canGoPrevious) setPageNumber((prev) => prev - 1)
  }

  const handleNextPage = () => {
    if (canGoNext) setPageNumber((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold sr-only">فروشگاه محصولات</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[294px_1fr_1fr_1fr]">
        <aside className="lg:col-span-1">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            minWeight={minWeight}
            maxWeight={maxWeight}
            onMinWeightChange={setMinWeight}
            onMaxWeightChange={setMaxWeight}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </aside>

        <main className="lg:col-span-3">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="py-8 text-center text-destructive">
              خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.
            </div>
          )}

          {!isLoading && !isError && filteredAndSortedCoins.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              محصولی یافت نشد.
            </div>
          )}

          {!isLoading && !isError && filteredAndSortedCoins.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedCoins.map((coin) => (
                  <ProductCard
                    key={coin.id}
                    coin={coin}
                    onClick={() => setSelectedCoinId(coin.id)}
                  />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant='ghost'
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground">
                  صفحه {pageNumber} از {totalPages}
                </span>

                <Button
                  variant='ghost'
                  size="icon"
                  onClick={handleNextPage}
                  disabled={!canGoNext}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
