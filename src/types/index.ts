export type Category = string;

export type PaymentMethod = 'qr' | 'card' | 'cash' | 'apple_pay' | 'google_pay';

export type DeliveryMethod = 'gps' | 'map' | 'manual';

export type OrderStatus =
  | 'order_received'
  | 'being_prepared'
  | 'ready_or_out_for_delivery'
  | 'completed';

export interface PortionOption {
  id: string;
  grams: number;
  price: number;
}

export interface DrinkCustomization {
  size: 'S' | 'M' | 'L';
  milkType: 'Whole' | 'Oat' | 'Almond' | 'Soy' | 'No milk';
  sugar: '0' | '1' | '2' | 'custom';
  extras: string[];
  temperature: 'Hot' | 'Iced';
  notes?: string;
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
  prepTimeMin?: number;
}

export interface DeliveryLocation {
  method: DeliveryMethod;
  label: string;
  addressLine: string;
  latitude?: number;
  longitude?: number;
}

export interface CartItem {
  product: Product;
  option: PortionOption;
  quantity: number;
  customization?: DrinkCustomization;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  paymentMethod: PaymentMethod;
  comment?: string;
  status?: OrderStatus;
  estimatedPrepMinutes?: number;
  deliveryLocation?: DeliveryLocation;
}
