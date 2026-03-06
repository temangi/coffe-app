import { create } from 'zustand';

type CartStep = 'cart' | 'payment';

interface CartUIState {
  isOpen: boolean;
  step: CartStep;
  openCart: () => void;
  closeCart: () => void;
  goToPayment: () => void;
  backToCart: () => void;
}

export const useCartUIStore = create<CartUIState>((set) => ({
  isOpen: false,
  step: 'cart',
  openCart: () => set({ isOpen: true, step: 'cart' }),
  closeCart: () => set({ isOpen: false, step: 'cart' }),
  goToPayment: () => set({ isOpen: true, step: 'payment' }),
  backToCart: () => set({ isOpen: true, step: 'cart' }),
}));

