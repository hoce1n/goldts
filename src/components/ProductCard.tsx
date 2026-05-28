import { Coin } from "@/types/coin.types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import ProductDetails from "./ProductDetails";
import { useState } from "react";
import { useCart } from "@/stores/cart";

interface ProductCardProps {
  coin: Coin;
  onClick: () => void;
}

export function ProductCard({ coin, onClick }: ProductCardProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  const handleAddToCart = () => {
    addItem({
      id: coin.id,
      name: coin.name,
      price: coin.finalPrice,
      quantity: 1,
      image: coin.imageUrl
    });

    openCart();
  }

  const handleCardClick = (coin: Coin) => {
    setSelectedCoin(coin);
    setModalOpen(true);
    
  };

  return (
    <>
    <div 
      onClick={() => handleCardClick(coin)}
      className="group relative cursor-pointer"
    >
      <div className="h-96 w-full rounded-lg bg-muted object-cover group-hover:opacity-75 sm:aspect-square sm:h-auto flex items-center justify-center">
        {coin.imageUrl 
        ? 
        <Image
          src={`/coins/${coin.imageUrl}`}
          width={400}
          height={400}
          loading='eager'
          alt={coin.name}
        />
        : 
        <div className="text-center">
          <div className="text-6xl mb-2">💰</div>
          <p className="text-sm text-muted-foreground">{coin.name}</p>
        </div>
        }
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">
            <span className="absolute inset-0" />
            {coin.name}
          </h3>
          <Badge variant={coin.stock > 0 ? "default" : "secondary"}>
            {coin.stock > 0 ? `موجودی: ${coin.stock} عدد` : "ناموجود"}
          </Badge>
        </div>
        
        <div className="mt-2 space-y-1">
          <p className="text-sm text-muted-foreground">
            وزن: {coin.weightInSoot} سوت • عیار: {coin.karat}
          </p>
          <p className="text-left text-sm font-medium text-foreground">
            {formatPrice(coin.finalPrice)} تومان
          </p>
        </div>
      </div>
    </div>

    <ProductDetails 
      coin={selectedCoin}
      open={modalOpen}
      onOpenChange={setModalOpen}
      onAddToCart={handleAddToCart}
    />
    </>
  );
}
