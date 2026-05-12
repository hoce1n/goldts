// src/components/products/ProductCard.tsx
"use client";

import { Coin } from "@/types/coin.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ProductCardProps {
  coin: Coin;
  onViewDetails: (coinId: string) => void;
}

export function ProductCard({ coin, onViewDetails }: ProductCardProps) {
  const isAvailable = coin.stock > 0;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails(coin.id)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{coin.name}</h3>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "موجود" : "ناموجود"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">وزن:</span>
          <span className="font-medium">{coin.weightInSoot} گرم</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">عیار:</span>
          <span className="font-medium">{coin.karat}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">اجرت:</span>
          <span className="font-medium">{coin.mintingFee.toLocaleString()} تومان</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-muted-foreground">قیمت نهایی:</span>
          <span className="font-bold text-lg text-primary">
            {coin.finalPrice.toLocaleString()} تومان
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" onClick={(e) => {
          e.stopPropagation();
          onViewDetails(coin.id);
        }}>
          <Eye className="ml-2 h-4 w-4" />
          مشاهده جزئیات
        </Button>
      </CardFooter>
    </Card>
  );
}
