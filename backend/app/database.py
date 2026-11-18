import sqlite3
import json
import os
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ecommerce.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_db():
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Products table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                category TEXT NOT NULL,
                brand TEXT NOT NULL,
                price REAL NOT NULL,
                original_price REAL,
                stock INTEGER NOT NULL DEFAULT 10,
                rating REAL DEFAULT 4.5,
                review_count INTEGER DEFAULT 0,
                description TEXT NOT NULL,
                long_description TEXT,
                image_url TEXT NOT NULL,
                gallery TEXT, -- JSON array of URLs
                features TEXT, -- JSON array of strings
                specs TEXT, -- JSON key-value
                is_featured INTEGER DEFAULT 0,
                is_new INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Categories table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                description TEXT,
                icon TEXT,
                item_count INTEGER DEFAULT 0
            )
        """)

        # Reviews table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                user_name TEXT NOT NULL,
                rating INTEGER NOT NULL,
                comment TEXT NOT NULL,
                verified_purchase INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        """)

        # Users table (strictly test users, no external PII or real credentials)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'customer', -- 'customer' or 'admin'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Coupons table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS coupons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                discount_type TEXT NOT NULL, -- 'percent' or 'fixed'
                discount_value REAL NOT NULL,
                min_order REAL DEFAULT 0,
                is_active INTEGER DEFAULT 1
            )
        """)

        # Orders table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number TEXT UNIQUE NOT NULL,
                user_id INTEGER,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                shipping_address TEXT NOT NULL, -- JSON string
                items TEXT NOT NULL, -- JSON string of cart items
                subtotal REAL NOT NULL,
                discount REAL NOT NULL DEFAULT 0,
                shipping_fee REAL NOT NULL DEFAULT 0,
                tax REAL NOT NULL DEFAULT 0,
                total REAL NOT NULL,
                payment_method TEXT NOT NULL,
                payment_status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'pending'
                status TEXT NOT NULL DEFAULT 'Processing', -- 'Processing', 'Shipped', 'Delivered', 'Cancelled'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
