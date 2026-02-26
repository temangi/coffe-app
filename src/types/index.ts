export type Category = 'Coffee' | 'Tea' | 'Desserts';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: any;
  category: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  paymentMethod: 'card' | 'cash';
  comment?: string;
}

