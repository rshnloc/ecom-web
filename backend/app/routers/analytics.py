from fastapi import APIRouter
from typing import List, Dict, Any
from ..database import get_db
from ..models import DashboardStats, OrderOut
from .orders import parse_order_row

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats():
    with get_db() as conn:
        cursor = conn.cursor()

        # Total revenue
        cursor.execute("SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid'")
        total_revenue = round(cursor.fetchone()[0], 2)

        # Total orders
        cursor.execute("SELECT COUNT(*) FROM orders")
        total_orders = cursor.fetchone()[0]

        # Total products
        cursor.execute("SELECT COUNT(*) FROM products")
        total_products = cursor.fetchone()[0]

        # Total customers
        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'customer'")
        total_customers = cursor.fetchone()[0]

        # Low stock count (<= 15)
        cursor.execute("SELECT COUNT(*) FROM products WHERE stock <= 15")
        low_stock_count = cursor.fetchone()[0]

        # Recent 5 orders
        cursor.execute("SELECT * FROM orders ORDER BY id DESC LIMIT 5")
        recent_orders_raw = cursor.fetchall()
        recent_orders = [parse_order_row(r) for r in recent_orders_raw]

        # Category distribution
        cursor.execute("""
            SELECT category, COUNT(id) as count, ROUND(AVG(price), 2) as avg_price
            FROM products
            GROUP BY category
        """)
        cat_rows = cursor.fetchall()
        category_distribution = [
            {"category": r["category"], "count": r["count"], "avg_price": r["avg_price"]}
            for r in cat_rows
        ]

        return DashboardStats(
            total_revenue=total_revenue,
            total_orders=total_orders,
            total_products=total_products,
            total_customers=total_customers,
            low_stock_count=low_stock_count,
            recent_orders=recent_orders,
            category_distribution=category_distribution
        )
