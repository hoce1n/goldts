'use client'

import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from "@/stores/cart"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function ShoppingCart() {
  const items = useCart((s) => s.items)
  const isOpen = useCart((s) => s.isOpen)
  const closeCart = useCart((s) => s.closeCart)

  const increase = useCart((s) => s.increase)
  const decrease = useCart((s) => s.decrease)
  const removeItem = useCart((s) => s.removeItem)

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="bottom" className="">

        <SheetHeader>
          <SheetTitle>
            سبد خرید
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">

          {items.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">
              سبد خرید شما خالی است
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex gap-4">

              <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={`/coins/${item.image}` || ""}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">

                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium leading-none">
                    {item.name}
                  </h4>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="text-sm text-muted-foreground">
                  {item.price.toLocaleString('fa-IR')} تومان
                </div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => decrease(item.id)}
                    >
                      <Minus size={14} />
                    </Button>

                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => increase(item.id)}
                    >
                      <Plus size={14} />
                    </Button>

                  </div>

                  <div className="text-sm font-semibold">
                    {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>

        <Separator />

        <div className="space-y-4 pt-4">

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              جمع کل
            </span>

            <span className="font-semibold">
              {subtotal.toLocaleString('fa-IR')} تومان
            </span>
          </div>

          <Button
            className="w-full h-11"
            disabled={!items.length}
          >
            ادامه خرید
          </Button>

        </div>

      </SheetContent>
    </Sheet>
  )
}