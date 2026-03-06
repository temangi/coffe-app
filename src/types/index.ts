export type Category = 'Coffee' | 'Tea' | 'Desserts';

export type PaymentMethod = 'apple_pay' | 'google_pay' | 'card' | 'cash';

export interface PortionOption {
  id: string;
  grams: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /**
   * Kept for backwards compatibility. Prefer `options`.
   */
  price: number;
  options?: PortionOption[];
  imageUrl?: string;
  image?: any;
  category: Category;
}

export interface CartItem {
  product: Product;
  option: PortionOption;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  paymentMethod: PaymentMethod;
  comment?: string;
}

