# ApexCommerce | Advanced E-Commerce Platform

A production-grade, full-featured modern e-commerce web platform built with **Python (FastAPI)** and **TypeScript (React 18 + Vite + Tailwind CSS)**.

> **Privacy & Compliance Note:**  
> This platform runs in a 100% self-contained, synthetic test sandbox. It contains **zero real credentials**, API keys, tokens, secrets, or real personally identifiable information (PII). All products, customer reviews, promo codes, and addresses are purely fictional test fixtures. No Docker is required.

---

## ⚡ Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Backend** | **Python 3.10+ (FastAPI)** | High performance async REST API, auto-generated OpenAPI / Swagger docs, Pydantic data validation. |
| **Database** | **SQLite (Zero Config)** | Thread-safe, file-based relational storage with auto-migration and instant seeding on startup. |
| **Frontend** | **TypeScript + React 18** | Strongly typed component architecture with Context API state management (`Cart`, `Auth`, `Wishlist`). |
| **Build Tool** | **Vite 5** | Lightning-fast HMR and optimized production bundles. |
| **Styling** | **Tailwind CSS 3 + Lucide Icons** | Responsive, mobile-first design with smooth micro-interactions. |

---

## 🚀 Quick Start (No Docker Required)

### One-Click Launch
Run both the Python backend and Vite frontend simultaneously:
```bash
./start.sh
```

---

### Manual Launch (Separate Terminals)

#### 1. Backend (Python FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```
- **API Base**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

#### 2. Frontend (TypeScript + React)
```bash
cd frontend
npm install
npm run dev
```
- **Storefront URL**: `http://localhost:5173`

---

## 🔑 Demo Test Accounts

The platform comes with built-in instant one-click login buttons for testing customer and admin roles without typing:

| Role | Username | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `democustomer` | `demo1234` | Browse catalog, wishlist, apply coupons, simulate checkout & track orders. |
| **Store Admin** | `demoadmin` | `admin1234` | Live revenue metrics, stock inventory adjustments, order dispatch lifecycle. |

---

## 🎟️ Active Test Promo Codes

Enter these promo codes in the shopping cart drawer or checkout summary:
- `SAVE10` — 10% off any order over $50
- `TEST20` — 20% off any order over $100
- `FLAT50` — $50 flat discount on orders over $200
- `FREESHIP` — Free shipping waiver

---

## ✨ Key Platform Features

1. **Rich Catalog & Filtering**:
   - Multi-category navigation (Audio & Electronics, Computing & Gaming, Smart Living, Desk & Workstation, Apparel).
   - Real-time search with instant dropdown autocomplete.
   - Filters: Price range slider, In-stock only toggle, Category pills, and Multi-parameter sorting (Price, Rating, Newest).
   - Quick View modal preview with thumbnail gallery.

2. **Cart & Wishlist Engine**:
   - Persistent slide-over cart drawer with live subtotal, estimated taxes, and shipping fee calculations.
   - Dynamic coupon validator with instant discount feedback.
   - Wishlist toggle on all items with one-click "Move to Cart".

3. **Multi-Step Checkout & Simulated Payment**:
   - One-click "Fill Random Test Data" button for safe shipping addresses.
   - Delivery speed selection (Standard vs Expedited).
   - Sandbox payment options (Mock 4242 Credit Card, Mock Digital Wallet, Test COD).
   - Real-time stock decrement on purchase.

4. **Interactive Order Tracking**:
   - Visual 4-stage tracking timeline (`Order Placed` &rarr; `Payment Verified` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`).
   - "Advance State" simulator button to inspect fulfillment transitions in real-time.
   - Printable itemized receipt view.

5. **Customer Reviews & Ratings**:
   - Verified purchase badges and breakdown of star ratings.
   - Interactive review submission form that recalculates product ratings dynamically in SQLite.

6. **Administrative Operations Portal**:
   - Live revenue, order volume, and low-stock alert counters.
   - Product Inventory Table with inline stock increment/decrement and product removal.
   - Order Dispatcher with instant status updating dropdown.
   - Category distribution analysis.

---

## 🛡️ Synthetic Data & Privacy Safeguards

- **No live API keys, session secrets, or cloud credentials** are contained or required anywhere in this codebase.
- **No real human personal data (PII)**: All test accounts, customer names, addresses, and phone numbers are completely synthetic (`555-0199`, `example.com`).
- **No external payment connections**: The checkout processes safe mock data locally in SQLite.
