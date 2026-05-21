from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from utils.database import get_db
from utils.auth import hash_password, verify_password, create_access_token, get_current_user
from schemas.schemas import RegisterRequest, LoginRequest, TokenResponse

router = APIRouter()

def serialize_user(user: dict) -> dict:
    user["id"] = str(user["_id"])
    del user["_id"]
    user.pop("password", None)
    return user

@router.post("/register", response_model=TokenResponse)
async def register(data: RegisterRequest, db=Depends(get_db)):
    # Check duplicates
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(400, "Email already registered")
    if await db.users.find_one({"username": data.username}):
        raise HTTPException(400, "Username already taken")

    user_doc = {
        "name": data.name,
        "email": data.email,
        "username": data.username.lower(),
        "password": hash_password(data.password),
        "title": "",
        "bio": "",
        "location": "",
        "github_url": "",
        "linkedin_url": "",
        "website_url": "",
        "phone": "",
        "avatar_url": "",
        "resume_url": "",
        "skills": [],
        "projects": [],
        "experience": [],
        "education": [],
        "certifications": [],
        "theme": "dark",
        "open_to_work": True,
        "qr_code_url": "",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token({"sub": str(result.inserted_id)})
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user_doc)}

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db=Depends(get_db)):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")

    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user)}

@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return serialize_user(current_user)

@router.post("/logout")
async def logout():
    # JWT is stateless; client removes token
    return {"message": "Logged out successfully"}
