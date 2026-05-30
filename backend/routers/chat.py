from fastapi import APIRouter, HTTPException, Depends
from utils.database import get_db
from schemas.schemas import ChatRequest
from datetime import datetime
from rag.qa_chain import ask_resume

router = APIRouter()


def build_system_prompt(user: dict) -> str:

    skills = ", ".join([
        f"{s['name']} ({s['level']}%)"
        for s in user.get("skills", [])
    ])

    projects = "\n".join([
        f"- {p['title']}: {p['description']} | Tech: {', '.join(p.get('tech_stack', []))}"
        for p in user.get("projects", [])
    ])

    experience = "\n".join([
        f"- {e['role']} at {e['company']} ({e['duration']}): {e['description']}"
        for e in user.get("experience", [])
    ])

    education = "\n".join([
        f"- {e['degree']} from {e['institution']} ({e['year']})"
        for e in user.get("education", [])
    ])

    certs = ", ".join([
        f"{c['name']} by {c['issuer']} ({c['year']})"
        for c in user.get("certifications", [])
    ])

    return f"""
You are an intelligent AI assistant embedded in {user['name']}'s professional portfolio on QRFolio.

Your role is to answer recruiter and visitor questions accurately and professionally.

RULES:
- Only use information from the profile below
- If information does not exist say:
  "That information isn't available in the profile."
- Keep answers under 150 words
- Highlight strengths positively
- Be concise and professional

====== PROFILE ======

Name:
{user.get('name','Not provided')}

Title:
{user.get('title','Software Developer')}

Location:
{user.get('location','Not specified')}

Bio:
{user.get('bio','Not provided')}

Open to Work:
{'Yes' if user.get('open_to_work') else 'No'}

GitHub:
{user.get('github_url','Not provided')}

LinkedIn:
{user.get('linkedin_url','Not provided')}

Skills:
{skills or 'Not specified'}

Projects:
{projects or 'No projects listed'}

Experience:
{experience or 'No experience listed'}

Education:
{education or 'Not specified'}

Certifications:
{certs or 'None listed'}

=====================
"""


@router.post("/")
async def chat(request: ChatRequest, db=Depends(get_db)):

    user = await db.users.find_one({
        "username": request.portfolio_username.lower()
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Portfolio not found"
        )

    try:
        reply = ask_resume(
            request.message,
            request.portfolio_username.lower()
        )

        await db.chat_logs.insert_one({
            "user_id": str(user["_id"]),
            "question": request.message,
            "answer": reply,
            "model": "rag-llama3.2",
            "timestamp": datetime.utcnow()
        })

        return {
            "reply": reply,
            "model": "rag-llama3.2"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"RAG error: {str(e)}"
        )