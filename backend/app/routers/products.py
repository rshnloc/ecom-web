from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
import json
import re
from ..database import get_db
from ..models import ProductOut, ProductCreate, ProductUpdate, CategoryOut, ReviewOut, ReviewCreate

router = APIRouter(prefix="/api", tags=["products"])

def parse_product_row(row) -> dict:
    d = dict(row)
    d["gallery"] = json.loads(d["gallery"]) if d.get("gallery") else []
    d["features"] = json.loads(d["features"]) if d.get("features") else []
    d["specs"] = json.loads(d["specs"]) if d.get("specs") else {}
    d["is_featured"] = bool(d.get("is_featured", 0))
    d["is_new"] = bool(d.get("is_new", 0))
    d["created_at"] = str(d.get("created_at", ""))
    return d

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

@router.get("/categories", response_model=List[CategoryOut])
def get_categories():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories ORDER BY name ASC")
        rows = cursor.fetchall()
        return [dict(r) for r in rows]

@router.get("/products", response_model=List[ProductOut])
def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: Optional[bool] = False,
    featured: Optional[bool] = None,
    is_new: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query(None, description="price_asc, price_desc, rating, newest, popular")
):
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM products WHERE 1=1"
        params = []

        if category and category != "all":
            query += " AND (category = ? OR category = (SELECT name FROM categories WHERE slug = ?))"
            params.extend([category, category])

        if brand:
            query += " AND brand = ?"
            params.append(brand)

        if min_price is not None:
            query += " AND price >= ?"
            params.append(min_price)

        if max_price is not None:
            query += " AND price <= ?"
            params.append(max_price)

        if in_stock_only:
            query += " AND stock > 0"

        if featured is not None:
            query += " AND is_featured = ?"
            params.append(1 if featured else 0)

        if is_new is not None:
            query += " AND is_new = ?"
            params.append(1 if is_new else 0)

        if search:
            query += " AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)"
            term = f"%{search.strip()}%"
            params.extend([term, term, term])

        # Sorting
        if sort_by == "price_asc":
            query += " ORDER BY price ASC"
        elif sort_by == "price_desc":
            query += " ORDER BY price DESC"
        elif sort_by == "rating":
            query += " ORDER BY rating DESC, review_count DESC"
        elif sort_by == "newest":
            query += " ORDER BY id DESC"
        else:
            query += " ORDER BY is_featured DESC, id DESC"

        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [parse_product_row(r) for r in rows]

@router.get("/products/{identifier}", response_model=ProductOut)
def get_product(identifier: str):
    with get_db() as conn:
        cursor = conn.cursor()
        if identifier.isdigit():
            cursor.execute("SELECT * FROM products WHERE id = ?", (int(identifier),))
        else:
            cursor.execute("SELECT * FROM products WHERE slug = ?", (identifier,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        return parse_product_row(row)

@router.get("/products/{product_id}/reviews", response_model=List[ReviewOut])
def get_product_reviews(product_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC",
            (product_id,)
        )
        rows = cursor.fetchall()
        result = []
        for r in rows:
            d = dict(r)
            d["verified_purchase"] = bool(d.get("verified_purchase", 1))
            d["created_at"] = str(d.get("created_at", ""))
            result.append(d)
        return result

@router.post("/products/{product_id}/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def add_product_review(product_id: int, review: ReviewCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        # Ensure product exists
        cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Product not found")

        cursor.execute("""
            INSERT INTO reviews (product_id, user_name, rating, comment, verified_purchase)
            VALUES (?, ?, ?, ?, 1)
        """, (product_id, review.user_name, review.rating, review.comment))
        review_id = cursor.lastrowid

        # Recalculate average rating
        cursor.execute("""
            SELECT AVG(rating), COUNT(id) FROM reviews WHERE product_id = ?
        """, (product_id,))
        avg_rating, count = cursor.fetchone()
        avg_rating = round(avg_rating or 5.0, 1)

        cursor.execute("""
            UPDATE products SET rating = ?, review_count = ? WHERE id = ?
        """, (avg_rating, count, product_id))

        cursor.execute("SELECT * FROM reviews WHERE id = ?", (review_id,))
        row = cursor.fetchone()
        d = dict(row)
        d["verified_purchase"] = bool(d.get("verified_purchase", 1))
        d["created_at"] = str(d.get("created_at", ""))
        return d

@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        base_slug = slugify(product.name)
        slug = base_slug
        count = 1
        while True:
            cursor.execute("SELECT id FROM products WHERE slug = ?", (slug,))
            if not cursor.fetchone():
                break
            slug = f"{base_slug}-{count}"
            count += 1

        cursor.execute("""
            INSERT INTO products (
                name, slug, category, brand, price, original_price, stock,
                rating, review_count, description, long_description,
                image_url, gallery, features, specs, is_featured, is_new
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product.name, slug, product.category, product.brand, product.price,
            product.original_price, product.stock, 5.0, 0,
            product.description, product.long_description or product.description,
            product.image_url, json.dumps(product.gallery or []),
            json.dumps(product.features or []), json.dumps(product.specs or {}),
            1 if product.is_featured else 0, 1 if product.is_new else 0
        ))
        product_id = cursor.lastrowid

        # Update category item count
        cursor.execute("""
            UPDATE categories
            SET item_count = (SELECT COUNT(*) FROM products WHERE products.category = categories.name)
        """)

        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        return parse_product_row(cursor.fetchone())

@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, update: ProductUpdate):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")

        current = dict(row)
        updates = {}
        if update.name is not None:
            updates["name"] = update.name
        if update.category is not None:
            updates["category"] = update.category
        if update.brand is not None:
            updates["brand"] = update.brand
        if update.price is not None:
            updates["price"] = update.price
        if update.original_price is not None:
            updates["original_price"] = update.original_price
        if update.stock is not None:
            updates["stock"] = update.stock
        if update.description is not None:
            updates["description"] = update.description
        if update.long_description is not None:
            updates["long_description"] = update.long_description
        if update.image_url is not None:
            updates["image_url"] = update.image_url
        if update.gallery is not None:
            updates["gallery"] = json.dumps(update.gallery)
        if update.features is not None:
            updates["features"] = json.dumps(update.features)
        if update.specs is not None:
            updates["specs"] = json.dumps(update.specs)
        if update.is_featured is not None:
            updates["is_featured"] = 1 if update.is_featured else 0
        if update.is_new is not None:
            updates["is_new"] = 1 if update.is_new else 0

        if updates:
            set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
            params = list(updates.values()) + [product_id]
            cursor.execute(f"UPDATE products SET {set_clause} WHERE id = ?", params)

        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        return parse_product_row(cursor.fetchone())

@router.delete("/products/{product_id}")
def delete_product(product_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Product not found")
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        return {"success": True, "message": "Product removed successfully"}
