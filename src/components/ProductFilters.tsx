"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export type SortOption = 
  "newest" | 
  "price-asc" | 
  "price-desc" | 
  "weight-asc" | 
  "weight-desc";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  minWeight: string;
  maxWeight: string;
  onMinWeightChange: (value: string) => void;
  onMaxWeightChange: (value: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  minWeight,
  maxWeight,
  onMinWeightChange,
  onMaxWeightChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sortBy,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="search">جستجو</Label>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="نام محصول..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-weight">حداقل وزن (گرم)</Label>
          <Input
            id="min-weight"
            type="number"
            placeholder="0"
            value={minWeight}
            onChange={(e) => onMinWeightChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-weight">حداکثر وزن (گرم)</Label>
          <Input
            id="max-weight"
            type="number"
            placeholder="∞"
            value={maxWeight}
            onChange={(e) => onMaxWeightChange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-price">حداقل قیمت (تومان)</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-price">حداکثر قیمت (تومان)</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort">مرتب‌سازی</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">جدیدترین</SelectItem>
            <SelectItem value="price-asc">قیمت: کم به زیاد</SelectItem>
            <SelectItem value="price-desc">قیمت: زیاد به کم</SelectItem>
            <SelectItem value="weight-asc">وزن: کم به زیاد</SelectItem>
            <SelectItem value="weight-desc">وزن: زیاد به کم</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
