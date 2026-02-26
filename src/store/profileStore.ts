import { create } from 'zustand';
import type { Order } from '../types';

interface ProfileState {
  name: string;
  phone: string;
  orders: Order[];
  setProfile: (payload: { name: string; phone: string }) => void;
  addOrderToHistory: (order: Order) => void;
  logout: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  name: 'Гость',
  phone: '',
  orders: [],

  setProfile: ({ name, phone }) => set({ name, phone }),

  addOrderToHistory: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  logout: () =>
    set({
      name: 'Гость',
      phone: '',
      orders: [],
    }),
}));

