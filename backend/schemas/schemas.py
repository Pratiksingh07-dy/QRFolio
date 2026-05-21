from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=30, pattern=r"^[a-z0-9_-]+$")
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# ── Profile ───────────────────────────────────────────────────────────────────

class Skill(BaseModel):
    name: str
    level: int = Field(..., ge=0, le=100)  # percentage

class Project(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    tech_stack: List[str] = []
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None

class Experience(BaseModel):
    company: str
    role: str
    duration: str
    description: str
    current: bool = False

class Education(BaseModel):
    institution: str
    degree: str
    year: str
    score: Optional[str] = None

class Certification(BaseModel):
    name: str
    issuer: str
    year: str
    url: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None

    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    resume_url: Optional[str] = None

    phone: Optional[str] = None

    skills: Optional[List[Skill]] = None
    projects: Optional[List[Project]] = None
    experience: Optional[List[Experience]] = None
    education: Optional[List[Education]] = None
    certifications: Optional[List[Certification]] = None

    theme: Optional[str] = "dark"
    open_to_work: Optional[bool] = True
# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    portfolio_username: str  # whose portfolio is being viewed

# ── ATS ───────────────────────────────────────────────────────────────────────

class ATSRequest(BaseModel):
    job_description: str
    username: str  # whose resume to analyze

# ── Analytics ────────────────────────────────────────────────────────────────

class ScanEvent(BaseModel):
    user_id: str
    ip: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    device: Optional[str] = None
    referrer: Optional[str] = None
    scanned_at: datetime = Field(default_factory=datetime.utcnow)
