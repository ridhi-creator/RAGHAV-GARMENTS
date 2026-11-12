export interface Product {
  id: string;
  name: string;
  category: 'pajamas' | 'pants' | 'jackets' | 'tracksuits';
  originalPrice: number;
  price: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL' | '28' | '30' | '32' | '34' | '36' | '38' | string)[];
  colors: { name: 'Black' | 'White' | 'Grey' | string; hex: string }[];
  colorImages?: Record<string, string>;
  images: string[];
  badge?: 'New Arrival' | 'Best Seller' | 'Trending' | 'Special Offer' | 'Originals' | string;
  description: string;
  features: string[];
  fabric: string;
  fit: string;
  care: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'Partially Refunded';

export type OrderStatus = 
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned'
  | 'Refunded'
  | 'Pending'
  | 'Confirmed';

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  location?: string;
  note?: string;
}

export interface NotificationEntry {
  type: string;
  channel: 'email' | 'sms' | 'whatsapp';
  timestamp: string;
  message: string;
  recipient: string;
}

export interface OrderDetails {
  orderId: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentGateway?: string;
  paidAt?: string;
  refundDetails?: {
    amount: number;
    reason: string;
    refundedAt: string;
    refundId: string;
  };
  status: OrderStatus | string;
  trackingNumber?: string;
  courierPartner?: string;
  orderDate: string;
  estimatedDelivery: string;
  lastStatusUpdate?: string;
  statusHistory?: StatusHistoryEntry[];
  notificationsSent?: NotificationEntry[];
}

export type ActiveTab = 'all' | 'pajamas' | 'pants' | 'jackets' | 'tracksuits' | 'new-arrivals' | 'sale';
export type PageView = 'shop' | 'about' | 'contact' | 'faq' | 'orders' | 'order-tracking' | 'admin-login' | 'admin-dashboard';

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalSales: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
}

export interface CategoryItem {
  id: string;
  key: 'pajamas' | 'pants' | 'jackets' | 'tracksuits';
  title: string;
  subtitle: string;
  image: string;
  itemCount: number;
  isActive: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  ordersCount: number;
  totalSpent: number;
  registeredDate: string;
}

export interface AdminOrder extends OrderDetails {}

export interface SiteSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  supportPhone: string;
  supportEmail: string;
  freeShippingThreshold: number;
  storeAddress: string;
}

