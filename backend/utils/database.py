from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "qrfolio")
    secret_key: str = os.getenv("SECRET_KEY", "changethis")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    app_url: str = os.getenv("APP_URL", "http://localhost:3000")
    api_url: str = os.getenv("API_URL", "http://localhost:8000")
    upload_dir: str = os.getenv("UPLOAD_DIR", "uploads")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")

    class Config:
        env_file = ".env"

settings = Settings()

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_db():
    db_instance.client = AsyncIOMotorClient(settings.mongodb_url)
    db_instance.db = db_instance.client[settings.database_name]
    # Create indexes
    await db_instance.db.users.create_index("email", unique=True)
    await db_instance.db.users.create_index("username", unique=True)
    await db_instance.db.analytics.create_index("user_id")
    await db_instance.db.analytics.create_index("scanned_at")
    print(f"✅ Connected to MongoDB: {settings.database_name}")

async def close_db():
    if db_instance.client:
        db_instance.client.close()
        print("MongoDB connection closed")

def get_db():
    return db_instance.db
