from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
import json
import random
import string
from ..database import get_db
from ..models import OrderCreate, OrderOut, OrderStatusUpdate, CouponValidateRequest, CouponValidateResponse

router = APIRouter(prefix="/api", tags=["orders"])

def generate_order_number() -> str:
    suffix = ''.join(random.choices(string.digits, k=4))
    prefix = ''.join(random.choices(string.ascii_uppercase, k=3))
    return f"ORD-{prefix}-{suffix}"

def parse_order_row(row) -> dict:
    d = dict(row)
    d["shipping_address"] = json.loads(d["shipping_address"]) if d.get("shipping_address") else {}
    d["items"] = json.loads(d["items"]) if d.get("items") else []
    d["created_at"] = str(d.get("created_at", ""))
    return d

@router.post("/coupons/validate", response_model=CouponValidateResponse)
def validate_coupon(req: CouponValidateRequest):
    code = req.code.strip().upper()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM coupons WHERE code = ? AND is_active = 1", (code,))
        coupon = cursor.fetchone()
        if not coupon:
            return CouponValidateResponse(
                valid=False,
                code=code,
                discount_amount=0.0,
                message="Invalid or expired promo code"
            )

        c = dict(coupon)
        if req.cart_total < c["min_order"]:
            return CouponValidateResponse(
                valid=False,
                code=code,
                discount_amount=0.0,
                message=f"Minimum order of ${c['min_order']:.2f} required for this code"
            )

        if c["discount_type"] == "percent":
            discount = round(req.cart_total * (c["discount_value"] / 100.0), 2)
        else:
            discount = min(c["discount_value"], req.cart_total)

        return CouponValidateResponse(
            valid=True,
            code=code,
            discount_type=c["discount_type"],
            discount_value=c["discount_value"],
            discount_amount=discount,
            message=f"Success! {c['discount_value']}% off applied" if c["discount_type"] == "percent" else f"Success! ${c['discount_value']} discount applied"
        )

@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    with get_db() as conn:
        cursor = conn.cursor()

        # Calculate subtotal & verify stock
        subtotal = 0.0
        serialized_items = []

        for item in order_data.items:
            cursor.execute("SELECT id, name, price, stock, image_url FROM products WHERE id = ?", (item.product_id,))
            p = cursor.fetchone()
            if not p:
                raise HTTPException(status_code=400, detail=f"Product #{item.product_id} no longer exists")
            
            p_dict = dict(p)
            if p_dict["stock"] < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {p_dict['name']}. Available: {p_dict['stock']}"
                )

            item_subtotal = p_dict["price"] * item.quantity
            subtotal += item_subtotal

            # Decrement stock
            cursor.execute(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                (item.quantity, item.product_id)
            )

            serialized_items.append({
                "product_id": p_dict["id"],
                "name": p_dict["name"],
                "price": p_dict["price"],
                "quantity": item.quantity,
                "image_url": p_dict["image_url"],
                "selected_variant": item.selected_variant
            })

        # Calculate discount if coupon applied
        discount = 0.0
        if order_data.coupon_code:
            code = order_data.coupon_code.strip().upper()
            cursor.execute("SELECT * FROM coupons WHERE code = ? AND is_active = 1", (code,))
            coupon = cursor.fetchone()
            if coupon:
                c = dict(coupon)
                if subtotal >= c["min_order"]:
                    if c["discount_type"] == "percent":
                        discount = round(subtotal * (c["discount_value"] / 100.0), 2)
                    else:
                        discount = min(c["discount_value"], subtotal)

        # Shipping fee: free over $100, else $12.00
        shipping_fee = 0.0 if (subtotal - discount) >= 100.0 else 12.0
        # Estimated tax: 7%
        tax = round((subtotal - discount) * 0.07, 2)
        total = round(subtotal - discount + shipping_fee + tax, 2)

        order_number = generate_order_number()

        cursor.execute("""
            INSERT INTO orders (
                order_number, user_id, customer_name, customer_email,
                shipping_address, items, subtotal, discount, shipping_fee, tax,
                total, payment_method, payment_status, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            order_number,
            1, # default synthetic user
            order_data.customer_name,
            order_data.customer_email,
            json.dumps(order_data.shipping_address.dict()),
            json.dumps(serialized_items),
            round(subtotal, 2),
            round(discount, 2),
            round(shipping_fee, 2),
            tax,
            total,
            order_data.payment_method,
            "paid",
            "Processing"
        ))

        order_id = cursor.lastrowid
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        return parse_order_row(cursor.fetchone())

@router.get("/orders", response_model=List[OrderOut])
def get_orders(email: Optional[str] = None):
    with get_db() as conn:
        cursor = conn.cursor()
        if email:
            cursor.execute("SELECT * FROM orders WHERE customer_email = ? ORDER BY id DESC", (email,))
        else:
            cursor.execute("SELECT * FROM orders ORDER BY id DESC")
        rows = cursor.fetchall()
        return [parse_order_row(r) for r in rows]

@router.get("/orders/{order_number}", response_model=OrderOut)
def get_order(order_number: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE order_number = ?", (order_number,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Order not found")
        return parse_order_row(row)

@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, status_update: OrderStatusUpdate):
    valid_statuses = ["Processing", "Shipped", "Delivered", "Cancelled"]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM orders WHERE id = ?", (order_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Order not found")

        cursor.execute(
            "UPDATE orders SET status = ? WHERE id = ?",
            (status_update.status, order_id)
        )
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        return parse_order_row(cursor.fetchone())
