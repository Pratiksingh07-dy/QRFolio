from fastapi import APIRouter, HTTPException, Depends, Request
from utils.database import get_db
from utils.auth import get_current_user
from datetime import datetime, timedelta
from bson import ObjectId
from collections import defaultdict

router = APIRouter()

@router.post("/scan/{username}")
async def record_scan(username: str, request: Request, db=Depends(get_db)):
    """Called when someone scans the QR code."""
    user = await db.users.find_one({"username": username.lower()})
    if not user:
        raise HTTPException(404, "User not found")

    # Parse device from User-Agent
    ua = request.headers.get("user-agent", "").lower()
    if "mobile" in ua or "android" in ua or "iphone" in ua:
        device = "mobile"
    elif "tablet" in ua or "ipad" in ua:
        device = "tablet"
    else:
        device = "desktop"

    event = {
        "user_id": str(user["_id"]),
        "ip": request.client.host if request.client else "unknown",
        "device": device,
        "referrer": request.headers.get("referer", "direct"),
        "user_agent": request.headers.get("user-agent", ""),
        "scanned_at": datetime.utcnow(),
    }
    await db.analytics.insert_one(event)
    return {"recorded": True}

@router.get("/dashboard")
async def get_dashboard(current_user=Depends(get_current_user), db=Depends(get_db)):
    uid = str(current_user["_id"])
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=30)
    seven_days_ago = now - timedelta(days=7)

    # Total scans
    total_scans = await db.analytics.count_documents({"user_id": uid})
    scans_30d   = await db.analytics.count_documents({"user_id": uid, "scanned_at": {"$gte": thirty_days_ago}})
    scans_7d    = await db.analytics.count_documents({"user_id": uid, "scanned_at": {"$gte": seven_days_ago}})

    # AI chat sessions
    total_chats = await db.chat_logs.count_documents({"user_id": uid})
    chats_30d   = await db.chat_logs.count_documents({"user_id": uid, "timestamp": {"$gte": thirty_days_ago}})

    # ATS analyses
    total_ats = await db.ats_analyses.count_documents({"user_id": uid})

    # Daily scans for chart (last 14 days)
    daily_scans = defaultdict(int)
    cursor = db.analytics.find(
        {"user_id": uid, "scanned_at": {"$gte": now - timedelta(days=14)}},
        {"scanned_at": 1}
    )
    async for doc in cursor:
        day = doc["scanned_at"].strftime("%a")
        daily_scans[day] += 1

    # Device breakdown
    device_counts = defaultdict(int)
    cursor2 = db.analytics.find({"user_id": uid}, {"device": 1})
    async for doc in cursor2:
        device_counts[doc.get("device", "unknown")] += 1

    # Recent scans list
    recent_scans = []
    cursor3 = db.analytics.find({"user_id": uid}).sort("scanned_at", -1).limit(10)
    async for doc in cursor3:
        doc["_id"] = str(doc["_id"])
        recent_scans.append(doc)

    return {
        "summary": {
            "total_scans": total_scans,
            "scans_30d": scans_30d,
            "scans_7d": scans_7d,
            "total_chats": total_chats,
            "chats_30d": chats_30d,
            "total_ats_analyses": total_ats,
        },
        "daily_scans": dict(daily_scans),
        "device_breakdown": dict(device_counts),
        "recent_scans": recent_scans,
    }
