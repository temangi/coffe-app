import { create } from 'zustand';
import { apiFetch } from '../api/client';
import { MENU_CATEGORIES as FALLBACK_CATEGORIES, MENU_ITEMS as FALLBACK_ITEMS } from '../menu';
import type { Category, Product } from '../types';

type MenuApiProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  prepTimeMin?: number;
  options: { id: string; grams: number; price: number }[];
};

type MenuResponse = {
  menuVersion: string;
  updatedAt: string;
  categories: string[];
  products: MenuApiProduct[];
};

function mapApiProduct(p: MenuApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.price,
    imageUrl: p.imageUrl,
    prepTimeMin: p.prepTimeMin,
    options: p.options,
  };
}

interface MenuState {
  categories: Category[];
  products: Product[];
  menuVersion: string | null;
  updatedAt: string | null;
  loading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
  categories: FALLBACK_CATEGORIES,
  products: FALLBACK_ITEMS,
  menuVersion: null,
  updatedAt: null,
  loading: false,
  error: null,

  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiFetch('menu', { jsonBody: false });
      if (!res.ok) {
        throw new Error(`Меню: HTTP ${res.status}`);
      }
      const data = (await res.json()) as MenuResponse;
      const categories =
        data.categories?.length > 0
          ? data.categories
          : [...new Set(data.products.map((p) => p.category))];
      set({
        categories,
        products: data.products.map(mapApiProduct),
        menuVersion: data.menuVersion,
        updatedAt: data.updatedAt,
        loading: false,
        error: null,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Не удалось загрузить меню';
      set({
        loading: false,
        error: message,
        categories: FALLBACK_CATEGORIES,
        products: FALLBACK_ITEMS,
      });
    }
  },
}));
