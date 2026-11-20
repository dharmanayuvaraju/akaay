export type Category = 'Sarees' | 'Kurta Sets' | 'Dresses' | 'Co-ord Sets' | 'Lehengas' | 'Tops';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  mrp: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: Record<string, number>; // Size to stock count mapping e.g. { 'Free Size': 6 } or { 'S': 4, 'M': 5 }
  rating: number;
  reviewCount: number;
  description: string;
  fabric: string;
  care: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  size: string;
  color: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  streetAddress: string;
}

export interface Order {
  id: string; // e.g. "AKY-2417"
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: ShippingAddress;
  paymentMethod: 'UPI' | 'Card' | 'COD';
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
  customerPhone: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface CustomerUser {
  phone: string;
  name?: string;
  isLoggedIn: boolean;
}

export type StaffRole = 'owner' | 'manager' | 'sales';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: 'manager' | 'sales';
  createdAt: string;
}

export interface OwnerUser {
  phone: string;
  name: string;
  role: StaffRole;
  isLoggedIn: boolean;
}

export interface StoreSettings {
  announcementText: string;
  heroOfferText: string;
  productDiscountOverrides: Record<string, number>; // productId -> override discount %
}
