export type Category = 
  | 'clubs' 
  | 'drivers' 
  | 'irons' 
  | 'putters' 
  | 'balls' 
  | 'bags' 
  | 'shoes' 
  | 'apparel' 
  | 'gloves' 
  | 'accessories' 
  | 'training' 
  | 'tech';

export type ConditionGrade = 'New' | '10/10 Mint' | '9/10 Excellent' | '8/10 Very Good' | '7/10 Good';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceModifier?: number;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  handicap?: string;
  golfClub?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  mrp: number;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestseller?: boolean;
  condition?: ConditionGrade;
  image: string;
  gallery: string[];
  description: string;
  specs: Record<string, string>;
  variants?: ProductVariant[];
  variantType?: 'size' | 'color' | 'pack' | 'loft' | 'shaft';
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  options?: Record<string, string>;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Processing'
  | 'Club Inspection Verified'
  | 'Preparing White-Glove Dispatch'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash on Delivery (COD)';

export interface DeliveryAssignment {
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  estimatedTime?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending (COD)' | 'Refunded';
  orderStatus: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    destinationType?: 'Residence' | 'Golf Club' | 'Corporate';
    notes?: string;
  };
  deliveryAssignment?: DeliveryAssignment;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minOrderValue: number;
  expiryDate: string;
  description: string;
}

export interface TradeInSubmission {
  id: string;
  refNumber: string;
  createdAt: string;
  status: 'Under Review' | 'Pickup Scheduled' | 'Inspected' | 'Credit Issued';
  brand: string;
  category: string;
  model: string;
  condition: ConditionGrade;
  shaftType?: string;
  estimatedValue: number;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  pickupSlot?: string;
  notes?: string;
}

export interface BrandPartner {
  name: string;
  tagline: string;
  logo: string;
  origin: string;
  tourPlayers: string[];
  productCount: number;
  description: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  message: string;
  orderNumber?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}
