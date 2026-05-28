'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { Coin } from '@/types/coin.types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProductDetailsModalProps {
  coin: Coin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (coin: Coin, quantity: number) => void
}

export default function ProductDetails({
  coin,
  open,
  onOpenChange,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!coin) return null

  const images = [
    `/coins/${coin.imageUrl}`,
    `/coins/${coin.imageUrl}`,
    `/coins/${coin.imageUrl}`,
  ]

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, coin.stock)))
  }

  const handleAddToCart = () => {
    onAddToCart(coin, quantity)
    setQuantity(1)
    onOpenChange(false)
  }

  const totalPrice = coin.finalPrice * quantity

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{coin.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Tabs value={selectedImage.toString()} onValueChange={(v) => setSelectedImage(Number(v))}>
              <TabsContent value={selectedImage.toString()} className="mt-0">
                <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={images[selectedImage]}
                    alt={coin.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </TabsContent>

              <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent h-auto p-0 mt-4">
                {images.map((img, idx) => (
                  <TabsTrigger
                    key={idx}
                    value={idx.toString()}
                    className="relative aspect-square overflow-hidden rounded-md border-2 data-[state=active]:border-primary p-0 h-auto"
                  >
                    <Image
                      src={img}
                      alt={`${coin.name} - تصویر ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="150px"
                    />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {coin.finalPrice.toLocaleString('fa-IR')}
                </span>
                <span className="text-muted-foreground">تومان</span>
              </div>
              
              <div className="flex items-center gap-2">
                {coin.stock > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {coin.stock} عدد موجود
                  </Badge>
                ) : (
                  <Badge variant="destructive">ناموجود</Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">مشخصات</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-muted">
                  <span className="text-muted-foreground">وزن:</span>
                  <span className="font-medium">{coin.weightInSoot} سوت</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-muted">
                  <span className="text-muted-foreground">عیار:</span>
                  <span className="font-medium">{coin.karat}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">تعداد</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= coin.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <span className="font-semibold">جمع کل:</span>
              <span className="text-2xl font-bold text-primary">
                {totalPrice.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <Button
              className="w-full h-12 text-base"
              size="lg"
              onClick={handleAddToCart}
              disabled={coin.stock === 0}
            >
              افزودن به سبد خرید
            </Button>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>توضیحات محصول</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  این سکه طلا با عیار {coin.karat} و وزن {coin.weightInSoot} سوت، یکی از محصولات
                  با کیفیت ما است که با دقت بالا تولید شده است.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger>ارسال و تحویل</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  ارسال رایگان برای سفارش‌های بالای 10 میلیون تومان. زمان تحویل 2 تا 5 روز کاری.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty">
                <AccordionTrigger>گارانتی و ضمانت</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  این محصول دارای گارانتی اصالت و ضمانت بازگشت 7 روزه می‌باشد.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
