from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "qrfolio"
    secret_key: str = "changethis"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    anthropic_api_key: str = ""
    app_url: str = "http://localhost:3000"
    api_url: str = "http://localhost:8000"
    upload_dir: str = "uploads"
    groq_api_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_db():
    try:
        print(f"🔄 Connecting to MongoDB...")
        db_instance.client = AsyncIOMotorClient(
            settings.mongodb_url,
            serverSelectionTimeoutMS=5000,  # 5 second timeout instead of hanging forever
            connectTimeoutMS=5000
        )
        db_instance.db = db_instance.client[settings.database_name]
        # Ping to verify connection actually works
        await db_instance.client.admin.command("ping")
        print(f"✅ Connected to MongoDB: {settings.database_name}")
        # Create indexes
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.users.create_index("username", unique=True)
        await db_instance.db.analytics.create_index("user_id")
        await db_instance.db.analytics.create_index("scanned_at")
        print("✅ Indexes created")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        # Don't crash the app - let it start and fail gracefully on requests
        raise

async def close_db():
    if db_instance.client:
        db_instance.client.close()
        print("MongoDB connection closed")

def get_db():
    return db_instance.db