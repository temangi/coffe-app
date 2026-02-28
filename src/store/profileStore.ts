import { create } from 'zustand';
import type { Order } from '../types';

interface ProfileState {
  name: string;
  phone: string;
  email: string;
  avatarUri?: string;
  notificationsEnabled: boolean;
  orders: Order[];
  setProfile: (payload: {
    name?: string;
    phone?: string;
    email?: string;
    avatarUri?: string | null;
  }) => void;
  addOrderToHistory: (order: Order) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  logout: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  name: 'Гость',
  phone: '',
  email: '',
  avatarUri: undefined,
  notificationsEnabled: true,
  orders: [],

  setProfile: (payload) =>
    set((state) => ({
      ...state,
      ...payload,
      avatarUri:
        payload.avatarUri === null ? undefined : payload.avatarUri ?? state.avatarUri,
    })),

  addOrderToHistory: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  setNotificationsEnabled: (enabled) =>
    set({
      notificationsEnabled: enabled,
    }),

  logout: () =>
    set({
      name: 'Гость',
      phone: '',
      email: '',
      avatarUri: undefined,
      notificationsEnabled: true,
      orders: [],
    }),
}));

