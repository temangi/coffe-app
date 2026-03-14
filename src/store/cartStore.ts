import { create } from 'zustand';
import type {
  CartItem,
  DeliveryLocation,
  DrinkCustomization,
  Order,
  PaymentMethod,
  PortionOption,
  Product,
} from '../types';

const customizationKey = (customization?: DrinkCustomization) =>
  customization
    ? [
        customization.size,
        customization.milkType,
        customization.sugar,
        customization.temperature,
        customization.extras.sort().join(','),
        customization.notes ?? '',
      ].join('|')
    : 'default';

interface CartState {
  items: CartItem[];
  lastOrder?: Order;
  addToCart: (payload: {
    product: Product;
    option: PortionOption;
    customization?: DrinkCustomization;
  }) => void;
  increaseQuantity: (payload: { productId: string; optionId: string; customization?: DrinkCustomization }) => void;
  decreaseQuantity: (payload: { productId: string; optionId: string; customization?: DrinkCustomization }) => void;
  removeFromCart: (payload: { productId: string; optionId: string; customization?: DrinkCustomization }) => void;
  clearCart: () => void;
  totalPrice: () => number;
  createOrderMock: (payload: {
    paymentMethod: PaymentMethod;
    comment?: string;
    deliveryLocation?: DeliveryLocation;
  }) => Order;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: ({ product, option, customization }) =>
    set((state) => {
      const incomingKey = customizationKey(customization);
      const existing = state.items.find(
        (i) =>
          i.product.id === product.id &&
          i.option.id === option.id &&
          customizationKey(i.customization) === incomingKey,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id &&
            i.option.id === option.id &&
            customizationKey(i.customization) === incomingKey
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { product, option, customization, quantity: 1 }],
      };
    }),

  increaseQuantity: ({ productId, optionId, customization }) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId &&
        i.option.id === optionId &&
        customizationKey(i.customization) === customizationKey(customization)
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    })),

  decreaseQuantity: ({ productId, optionId, customization }) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product.id === productId &&
          i.option.id === optionId &&
          customizationKey(i.customization) === customizationKey(customization)
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })),

  removeFromCart: ({ productId, optionId, customization }) =>
    set((state) => ({
      items: state.items.filter(
        (i) =>
          !(
            i.product.id === productId &&
            i.option.id === optionId &&
            customizationKey(i.customization) === customizationKey(customization)
          ),
      ),
    })),

  clearCart: () => set({ items: [] }),

  totalPrice: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.option.price * item.quantity, 0);
  },

  createOrderMock: ({ paymentMethod, comment, deliveryLocation }) => {
    const { items, totalPrice, clearCart } = get();
    const order: Order = {
      id: Date.now().toString(),
      items,
      total: totalPrice(),
      createdAt: new Date().toISOString(),
      paymentMethod,
      comment,
      deliveryLocation,
      status: 'order_received',
      estimatedPrepMinutes: 12,
    };

    set({ lastOrder: order });
    clearCart();

    return order;
  },
}));
