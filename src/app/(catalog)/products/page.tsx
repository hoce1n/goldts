// src/app/products/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useGetCoins } from "@/hooks/Coin/useGetCoins";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters, SortOption } from "@/components/ProductFilters";
import { CoinDetailsModal } from "@/components/CoinDetailsModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Coin } from "@/types/coin.types";

export default function ProductsPage() {
  // State مدیریت صفحه‌بندی
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12;

  // State فیلترها
  const [searchQuery, setSearchQuery] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // State مودال
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  // دریافت داده‌ها
  const { data, isLoading, isError } = useGetCoins({
    isActive: true,
    pageNumber,
    pageSize,
  });

  // اعمال فیلتر و سورت Client-side
  const filteredAndSortedCoins = useMemo(() => {
    if (!data?.data) return [];

    let result = [...data.data.coins];

    // فیلتر جستجو
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((coin) =>
        coin.name.toLowerCase().includes(query)
      );
    }

    // فیلتر وزن
    const minW = minWeight ? parseFloat(minWeight) : null;
    const maxW = maxWeight ? parseFloat(maxWeight) : null;
    if (minW !== null) {
      result = result.filter((coin) => coin.weightInSoot >= minW);
    }
    if (maxW !== null) {
      result = result.filter((coin) => coin.weightInSoot <= maxW);
    }

    // فیلتر قیمت
    const minP = minPrice ? parseFloat(minPrice) : null;
    const maxP = maxPrice ? parseFloat(maxPrice) : null;
    if (minP !== null) {
      result = result.filter((coin) => coin.finalPrice >= minP);
    }
    if (maxP !== null) {
      result = result.filter((coin) => coin.finalPrice <= maxP);
    }

    // مرتب‌سازی
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      case "weight-asc":
        result.sort((a, b) => a.weightInSoot - b.weightInSoot);
        break;
      case "weight-desc":
        result.sort((a, b) => b.weightInSoot - a.weightInSoot);
        break;
    }

    return result;
  }, [data?.data, searchQuery, minWeight, maxWeight, minPrice, maxPrice, sortBy]);

  // هندلرهای صفحه‌بندی
  const totalPages = data?.totalPages ?? 1;
  const canGoPrevious = pageNumber > 1;
  const canGoNext = pageNumber < totalPages;

  const handlePreviousPage = () => {
    if (canGoPrevious) setPageNumber((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (canGoNext) setPageNumber((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">فروشگاه محصولات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ستون فیلترها */}
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

        {/* ستون محصولات */}
        <main className="lg:col-span-3">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="text-center text-destructive py-8">
              خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.
            </div>
          )}

          {!isLoading && !isError && filteredAndSortedCoins.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              محصولی یافت نشد.
            </div>
          )}

          {!isLoading && !isError && filteredAndSortedCoins.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedCoins.map((coin) => (
                  <ProductCard
                    key={coin.id}
                    coin={coin}
                    onViewDetails={() => setSelectedCoinId(coin.id)}
                  />
                ))}
              </div>

              {/* صفحه‌بندی */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
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
                  variant="outline"
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

      {/* مودال جزئیات */}
      {selectedCoinId && (
        <CoinDetailsModal
          coinId={selectedCoinId}
          isOpen={!!selectedCoinId}
          onClose={() => setSelectedCoinId(null)}
        />
      )}
    </div>
  );
}
