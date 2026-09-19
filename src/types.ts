export type ProductCategory =
  | 'Mens'
  | 'Womens'
  | 'Automatic'
  | 'Chronograph'
  | 'Luxury';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpecifications {
  caseDiameter: string;
  caseThickness: string;
  glass: string;
  movement: string;
  waterResistance: string;
  strapMaterial: string;
  caseMaterial: string;
  warranty: string;
}

export interface Review {
  id: string;
  userName: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number; // in PKR
  discountPrice?: number; // in PKR
  description: string;
  shortDescription: string;
  images: string[];
  colors: ProductColor[];
  quantity: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating: number;
  reviewCount: number;
  specifications: ProductSpecifications;
  features: string[];
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export type PaymentMethod = 'cod' | 'easypaisa' | 'jazzcash' | 'bank_transfer';

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Unpaid (COD)'
  | 'Pending Verification'
  | 'Verified & Paid'
  | 'Refunded';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  orderNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  color: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shippingCharges: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  paymentProofNote?: string;
  orderStatus: OrderStatus;
  estimatedDelivery: string;
  trackingNumber: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}

export interface Address {
  id: string;
  isDefault: boolean;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}

export interface StoreSettings {
  shippingFee: number;
  freeShippingThreshold: number;
  codAvailable: boolean;
  easypaisaAccount: {
    title: string;
    number: string;
  };
  jazzcashAccount: {
    title: string;
    number: string;
  };
  bankAccount: {
    bankName: string;
    title: string;
    iban: string;
    accountNumber: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  date: string;
  image: string;
  category: string;
}
