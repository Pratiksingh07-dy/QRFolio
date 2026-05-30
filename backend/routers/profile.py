from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from bson import ObjectId
from datetime import datetime
import aiofiles, os, uuid

from uuid import uuid4

from utils.database import get_db, settings
from utils.auth import get_current_user
from schemas.schemas import ProfileUpdateRequest

from rag.pdf_loader import load_pdf_text
from rag.chunker import split_text
from rag.vector_store import store_chunks

router = APIRouter()

def serialize_user(user: dict) -> dict:
    user["id"] = str(user["_id"])
    del user["_id"]
    user.pop("password", None)
    return user

# ── Public portfolio (no auth needed) ────────────────────────────────────────

@router.get("/public/{username}")
async def get_public_profile(username: str, db=Depends(get_db)):
    user = await db.users.find_one({"username": username.lower()})
    if not user:
        raise HTTPException(404, "Portfolio not found")
    return serialize_user(user)

# ── Authenticated routes ──────────────────────────────────────────────────────

@router.get("/me")
async def get_my_profile(current_user=Depends(get_current_user)):
    return serialize_user(current_user)

@router.put("/me")
async def update_profile(
    data: ProfileUpdateRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    update_fields = {k: v for k, v in data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.utcnow()

    # Convert Pydantic models to dicts
    for key in ["skills", "projects", "experience", "education", "certifications"]:
        if key in update_fields and update_fields[key]:
            update_fields[key] = [
                item.model_dump() if hasattr(item, "model_dump") else item
                for item in update_fields[key]
            ]

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": update_fields}
    )
    updated = await db.users.find_one({"_id": current_user["_id"]})
    return serialize_user(updated)

@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(400, "Only JPEG/PNG/WEBP images allowed")
    ext = file.filename.split(".")[-1]
    filename = f"avatar_{current_user['_id']}_{uuid.uuid4().hex[:8]}.{ext}"
    path = os.path.join(settings.upload_dir, filename)
    async with aiofiles.open(path, "wb") as f:
        content = await file.read()
        await f.write(content)
    url = f"{settings.api_url}/uploads/{filename}"
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"avatar_url": url, "updated_at": datetime.utcnow()}}
    )
    return {"avatar_url": url}

@router.post("/me/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    if file.content_type not in ["application/pdf"]:
        raise HTTPException(400, "Only PDF files allowed")

    content = await file.read()

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 10MB)")

    filename = f"resume_{current_user['_id']}_{uuid.uuid4().hex[:8]}.pdf"
    path = os.path.join(settings.upload_dir, filename)

    async with aiofiles.open(path, "wb") as f:
        await f.write(content)

    url = f"{settings.api_url}/uploads/{filename}"

    # ==========================
    # RAG PROCESSING
    # ==========================

    text = load_pdf_text(path)
    print("PDF loaded")
    print("Text length:", len(text))

    chunks = split_text(text)
    print("Chunks created:", len(chunks))

    stored = store_chunks(chunks, current_user["username"])
    print("Stored:", stored)

    # ==========================
    # UPDATE DATABASE
    # ==========================

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "resume_url": url,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "resume_url": url,
        "chunks_stored": len(chunks)
    }


@router.post("/upload-resume")
async def upload_resume_legacy(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    return await upload_resume(
        file=file,
        current_user=current_user,
        db=db
    )