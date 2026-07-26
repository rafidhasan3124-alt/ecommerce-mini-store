import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem, Product } from '@/types/product';

// Helper function to calculate cart totals
const calculateTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  subtotal: items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ),
});

interface CartStore extends CartState {
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === product.id
        );

        const newItems = existingItem
          ? items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...items, { productId: product.id, quantity, product }];

        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },

      removeItem: (productId: string) => {
        const newItems = get().items.filter(
          (item) => item.productId !== productId
        );

        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const newItems = get().items.map((item) =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );

        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
        });
      },

      getItemCount: () => calculateTotals(get().items).totalItems,

      getSubtotal: () => calculateTotals(get().items).subtotal,
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal,
      }),
    }
  )
);