from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any

class ReviewCreate(BaseModel):
    user_name: str
    rating: int = Field(ge=1, le=5)
    comment: str

class ReviewOut(BaseModel):
    id: int
    product_id: int
    user_name: str
    rating: int
    comment: str
    verified_purchase: bool
    created_at: str

class ProductBase(BaseModel):
    name: str
    category: str
    brand: str
    price: float
    original_price: Optional[float] = None
    stock: int
    description: str
    long_description: Optional[str] = None
    image_url: str
    gallery: Optional[List[str]] = []
    features: Optional[List[str]] = []
    specs: Optional[Dict[str, str]] = {}
    is_featured: Optional[bool] = False
    is_new: Optional[bool] = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[List[str]] = None
    features: Optional[List[str]] = None
    specs: Optional[Dict[str, str]] = None
    is_featured: Optional[bool] = None
    is_new: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    slug: str
    rating: float
    review_count: int
    created_at: str

class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    item_count: int

class CartItem(BaseModel):
    product_id: int
    name: str
    price: float
    image_url: str
    quantity: int
    selected_variant: Optional[str] = None

class ShippingAddress(BaseModel):
    full_name: str
    address_line: str
    city: str
    state: str
    postal_code: str
    country: str
    phone: str

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    shipping_address: ShippingAddress
    items: List[CartItem]
    coupon_code: Optional[str] = None
    payment_method: str = "mock_card" # mock_card, mock_wallet, mock_cod

class OrderStatusUpdate(BaseModel):
    status: str # 'Processing', 'Shipped', 'Delivered', 'Cancelled'

class OrderOut(BaseModel):
    id: int
    order_number: str
    user_id: Optional[int] = None
    customer_name: str
    customer_email: str
    shipping_address: Dict[str, Any]
    items: List[Dict[str, Any]]
    subtotal: float
    discount: float
    shipping_fee: float
    tax: float
    total: float
    payment_method: str
    payment_status: str
    status: str
    created_at: str

class CouponValidateRequest(BaseModel):
    code: str
    cart_total: float

class CouponValidateResponse(BaseModel):
    valid: bool
    code: str
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    discount_amount: float = 0.0
    message: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: str
    full_name: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    token: str

class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    total_customers: int
    low_stock_count: int
    recent_orders: List[OrderOut]
    category_distribution: List[Dict[str, Any]]
