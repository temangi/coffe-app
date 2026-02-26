import { create } from 'zustand';
import type { CartItem, Product, Order } from '../types';

interface CartState {
  items: CartItem[];
  lastOrder?: Order;
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  createOrderMock: (payload: {
    paymentMethod: 'card' | 'cash';
    comment?: string;
  }) => Order;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    }),

  increaseQuantity: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  clearCart: () => set({ items: [] }),

  totalPrice: () => {
    const { items } = get();
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  },

  createOrderMock: ({ paymentMethod, comment }) => {
    const { items, totalPrice, clearCart } = get();
    const order: Order = {
      id: Date.now().toString(),
      items,
      total: totalPrice(),
      createdAt: new Date().toISOString(),
      paymentMethod,
      comment,
    };

    set({ lastOrder: order });
    clearCart();

    return order;
  },
}));

