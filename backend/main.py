from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import auth, profile, qr, chat, ats, analytics
from utils.database import connect_db, close_db


app = FastAPI(
    title="QRFolio API",
    description="AI-Powered QR Resume & Smart Portfolio System",
    version="1.0.0"
)


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        os.getenv("APP_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create uploads folder
os.makedirs(
    "uploads",
    exist_ok=True
)


# Serve uploaded files
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# Routers
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Auth"]
)

app.include_router(
    profile.router,
    prefix="/api/profile",
    tags=["Profile"]
)

app.include_router(
    qr.router,
    prefix="/api/qr",
    tags=["QR"]
)

app.include_router(
    chat.router,          # ← this was missing!
    prefix="/api/chat",
    tags=["AI Chat"]
)

app.include_router(
    ats.router,
    prefix="/api/ats",
    tags=["ATS Analyzer"]
)

app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"]
)


# Database lifecycle
@app.on_event("startup")
async def startup():
    try:
        await connect_db()
    except Exception as e:
        import traceback
        print("❌ STARTUP ERROR:", e)
        traceback.print_exc()

app.add_event_handler(
    "shutdown",
    close_db
)


@app.get("/")
async def root():

    return {
        "message": "QRFolio API is running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():

    return {
        "status": "ok"
    }