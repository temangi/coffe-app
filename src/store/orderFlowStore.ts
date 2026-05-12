import { create } from 'zustand';
import type { DeliveryLocation, Order, PaymentMethod } from '../types';

interface OrderFlowState {
  deliveryLocation?: DeliveryLocation;
  paymentMethod: PaymentMethod;
  activeOrder?: Order;
  setDeliveryLocation: (location: DeliveryLocation) => void;
  clearDeliveryLocation: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setActiveOrder: (order?: Order) => void;
  resetCheckout: () => void;
}

export const useOrderFlowStore = create<OrderFlowState>((set) => ({
  deliveryLocation: undefined,
  paymentMethod: 'card',
  activeOrder: undefined,
  setDeliveryLocation: (deliveryLocation) => set({ deliveryLocation }),
  clearDeliveryLocation: () => set({ deliveryLocation: undefined }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setActiveOrder: (activeOrder) => set({ activeOrder }),
  resetCheckout: () =>
    set({
      deliveryLocation: undefined,
      paymentMethod: 'card',
      activeOrder: undefined,
    }),
}));
