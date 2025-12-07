"""
Authentication endpoints for testing and mock auth
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

# Mock test users (same as frontend)
TEST_USERS = [
    {"email": "sarah.chen@blackflag.hr", "password": "Admin123!", "role": "hr_admin", "name": "Sarah Chen"},
    {"email": "hr.manager@blackflag.hr", "password": "HRPass123!", "role": "hr_admin", "name": "HR Manager"},
    {"email": "marcus.johnson@blackflag.hr", "password": "Staff123!", "role": "employee", "name": "Marcus Johnson"},
    {"email": "emily.rodriguez@blackflag.hr", "password": "Staff123!", "role": "employee", "name": "Emily Rodriguez"},
    {"email": "david.kim@blackflag.hr", "password": "Staff123!", "role": "employee", "name": "David Kim"},
]


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    user: dict | None = None


@router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Mock authentication endpoint for testing.
    Validates credentials against test user list.
    In production, this would check against database with hashed passwords.
    """
    user = next(
        (u for u in TEST_USERS if u["email"].lower() == request.email.lower() and u["password"] == request.password),
        None
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    return LoginResponse(
        success=True,
        message=f"Welcome {user['name']}!",
        user={
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
        }
    )


@router.post("/auth/logout", response_model=dict)
async def logout():
    """Logout endpoint"""
    return {"success": True, "message": "Logged out successfully"}
