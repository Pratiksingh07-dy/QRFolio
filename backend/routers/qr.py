from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from PIL import Image, ImageDraw
import os, io
from bson import ObjectId
from datetime import datetime

from utils.database import get_db, settings
from utils.auth import get_current_user

router = APIRouter()

def generate_qr_image(url: str, username: str) -> str:
    """Generate a styled QR code and save to uploads/. Returns filename."""
    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=3,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer()
    ).convert("RGB")

    # Add subtle branded border
    bordered = Image.new("RGB", (img.width + 20, img.height + 20), "#7c6ff7")
    bordered.paste(img, (10, 10))

    os.makedirs(settings.upload_dir, exist_ok=True)
    filename = f"qr_{username}.png"
    path = os.path.join(settings.upload_dir, filename)
    bordered.save(path, "PNG", quality=95)
    return filename

@router.post("/generate")
async def generate_qr(
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    username = current_user["username"]
    portfolio_url = f"{settings.app_url}/p/{username}"

    filename = generate_qr_image(portfolio_url, username)
    qr_url = f"{settings.api_url}/uploads/{filename}"

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"qr_code_url": qr_url, "updated_at": datetime.utcnow()}}
    )
    return {
        "qr_code_url": qr_url,
        "portfolio_url": portfolio_url,
        "message": "QR code generated successfully"
    }

@router.get("/download/{username}")
async def download_qr(username: str, db=Depends(get_db)):
    user = await db.users.find_one({"username": username.lower()})
    if not user:
        raise HTTPException(404, "User not found")

    path = os.path.join(settings.upload_dir, f"qr_{username}.png")
    if not os.path.exists(path):
        # Auto-generate if missing
        portfolio_url = f"{settings.app_url}/p/{username}"
        generate_qr_image(portfolio_url, username)

    return FileResponse(
        path,
        media_type="image/png",
        filename=f"{username}_portfolio_qr.png"
    )

@router.get("/info/{username}")
async def get_qr_info(username: str, db=Depends(get_db)):
    user = await db.users.find_one({"username": username.lower()})
    if not user:
        raise HTTPException(404, "User not found")
    return {
        "portfolio_url": f"{settings.app_url}/p/{username}",
        "qr_code_url": user.get("qr_code_url", ""),
        "total_scans": await db.analytics.count_documents({"user_id": str(user["_id"])})
    }
