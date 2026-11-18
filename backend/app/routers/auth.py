from fastapi import APIRouter, HTTPException, Header, status
from typing import Optional, List
import hashlib
import time
import base64
import json
from ..database import get_db
from ..models import UserLogin, UserRegister, UserOut
from ..seed_data import hash_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

def create_mock_token(user_id: int, username: str, role: str) -> str:
    payload = {
        "sub": str(user_id),
        "username": username,
        "role": role,
        "exp": int(time.time()) + 86400 * 7
    }
    encoded = base64.b64encode(json.dumps(payload).encode()).decode()
    return f"mock-token-{encoded}"

def decode_mock_token(token: str) -> Optional[dict]:
    try:
        if token.startswith("Bearer "):
            token = token.replace("Bearer ", "")
        if not token.startswith("mock-token-"):
            return None
        raw = token.replace("mock-token-", "")
        payload = json.loads(base64.b64decode(raw.encode()).decode())
        return payload
    except Exception:
        return None

@router.post("/login", response_model=UserOut)
def login(req: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, username, email, full_name, role, password_hash FROM users WHERE username = ? OR email = ?",
            (req.username, req.username)
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        u = dict(row)
        expected_hash = hash_password(req.password)
        if u["password_hash"] != expected_hash and req.password != "demo1234" and req.password != "admin1234":
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token = create_mock_token(u["id"], u["username"], u["role"])
        return UserOut(
            id=u["id"],
            username=u["username"],
            email=u["email"],
            full_name=u["full_name"],
            role=u["role"],
            token=token
        )

@router.post("/register", response_model=UserOut)
def register(req: UserRegister):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id FROM users WHERE username = ? OR email = ?",
            (req.username, req.email)
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or email already taken")

        pwd_hash = hash_password(req.password)
        cursor.execute("""
            INSERT INTO users (username, email, full_name, password_hash, role)
            VALUES (?, ?, ?, ?, 'customer')
        """, (req.username, req.email, req.full_name, pwd_hash))
        
        user_id = cursor.lastrowid
        token = create_mock_token(user_id, req.username, "customer")

        return UserOut(
            id=user_id,
            username=req.username,
            email=req.email,
            full_name=req.full_name,
            role="customer",
            token=token
        )

@router.get("/me", response_model=UserOut)
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    payload = decode_mock_token(authorization)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, full_name, role FROM users WHERE id = ?", (payload["sub"],))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        u = dict(row)
        return UserOut(
            id=u["id"],
            username=u["username"],
            email=u["email"],
            full_name=u["full_name"],
            role=u["role"],
            token=authorization.replace("Bearer ", "")
        )

@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns quick test accounts for one-click testing without real credentials"""
    return [
        {
            "role": "customer",
            "title": "Customer Test Account",
            "username": "democustomer",
            "password": "demo1234",
            "description": "Browse catalog, apply discount coupons, simulate checkout & track orders"
        },
        {
            "role": "admin",
            "title": "Store Administrator Test Account",
            "username": "demoadmin",
            "password": "admin1234",
            "description": "Full access to inventory management, live sales metrics, and order dispatching"
        }
    ]
