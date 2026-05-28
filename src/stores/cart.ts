import { create } from "zustand"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartState = {
  items: CartItem[]
  isOpen: boolean

  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  increase: (id: string) => void
  decrease: (id: string) => void

  openCart: () => void
  closeCart: () => void
}

export const useCart = create<CartState>((set) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      }

      return {
        items: [...state.items, item],
      }
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  increase: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0),
    })),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}))
