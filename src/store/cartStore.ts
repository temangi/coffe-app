import { create } from 'zustand';
import type { CartItem, Order, PaymentMethod, PortionOption, Product } from '../types';

interface CartState {
  items: CartItem[];
  lastOrder?: Order;
  addToCart: (payload: { product: Product; option: PortionOption }) => void;
  increaseQuantity: (payload: { productId: string; optionId: string }) => void;
  decreaseQuantity: (payload: { productId: string; optionId: string }) => void;
  removeFromCart: (payload: { productId: string; optionId: string }) => void;
  clearCart: () => void;
  totalPrice: () => number;
  createOrderMock: (payload: {
    paymentMethod: PaymentMethod;
    comment?: string;
  }) => Order;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: ({ product, option }) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.option.id === option.id,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id && i.option.id === option.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { product, option, quantity: 1 }],
      };
    }),

  increaseQuantity: ({ productId, optionId }) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId && i.option.id === optionId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    })),

  decreaseQuantity: ({ productId, optionId }) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product.id === productId && i.option.id === optionId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })),

  removeFromCart: ({ productId, optionId }) =>
    set((state) => ({
      items: state.items.filter((i) => !(i.product.id === productId && i.option.id === optionId)),
    })),

  clearCart: () => set({ items: [] }),

  totalPrice: () => {
    const { items } = get();
    return items.reduce(
      (sum, item) => sum + item.option.price * item.quantity,
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

