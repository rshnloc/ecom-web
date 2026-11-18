export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  original_price?: number;
  stock: number;
  rating: number;
  review_count: number;
  description: string;
  long_description?: string;
  image_url: string;
  gallery: string[];
  features: string[];
  specs: Record<string, string>;
  is_featured: boolean;
  is_new: boolean;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  item_count: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  selected_variant?: string;
  stock?: number;
}

export interface ShippingAddress {
  full_name: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  token: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  low_stock_count: number;
  recent_orders: Order[];
  category_distribution: { category: string; count: number; avg_price: number }[];
}

export interface CouponValidation {
  valid: boolean;
  code: string;
  discount_type?: 'percent' | 'fixed';
  discount_value?: number;
  discount_amount: number;
  message: string;
}
