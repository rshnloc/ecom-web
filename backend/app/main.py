from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .seed_data import seed_database
from .routers import products, orders, auth, analytics

app = FastAPI(
    title="ApexCommerce API (Test & Synthetic Store)",
    description="Advanced E-Commerce Platform REST API with zero external credentials and synthetic test data.",
    version="1.0.0"
)

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(auth.router)
app.include_router(analytics.router)

@app.on_event("startup")
def on_startup():
    init_db()
    seed_database()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "ApexCommerce API",
        "mode": "Synthetic Test Environment (No real PII / No external credentials)",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "database": "sqlite_connected"}
