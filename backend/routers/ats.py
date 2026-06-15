from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from utils.database import get_db, settings
from schemas.schemas import ATSRequest
from groq import Groq
import json
import re
import fitz
from datetime import datetime

router = APIRouter()

# Only technical skills we want ATS to recognize
TECH_SKILLS = {

    "python",
    "java",
    "javascript",
    "typescript",

    "react",
    "nextjs",
    "node",
    "express",

    "mongodb",
    "mysql",
    "postgresql",

    "tensorflow",
    "keras",
    "opencv",
    "huggingface",

    "machine learning",
    "deep learning",
    "computer vision",
    "nlp",

    "fastapi",
    "flask",
    "django",

    "docker",
    "kubernetes",

    "aws",
    "azure",

    "git",
    "github",

    "html",
    "css",
    "tailwind",

    "api",
    "apis",
    "rest api",

    "sql",
    "nosql",

    "data structures",
    "algorithms"
}


def extract_skills(text):

    text = text.lower()

    found = set()

    for skill in TECH_SKILLS:

        if skill in text:
            found.add(skill)

    return found


def build_ats_prompt(profile: dict, jd: str):

    skills = [
        s["name"]
        for s in profile.get(
            "skills",
            []
        )
    ]

    exp_text = " ".join([
        f"{e['role']} at {e['company']} : {e['description']}"
        for e in profile.get(
            "experience",
            []
        )
    ])

    proj_text = " ".join([
        f"{p['title']} : {p['description']}"
        for p in profile.get(
            "projects",
            []
        )
    ])

    return f"""
You are an ATS analyzer.

Skills:
{",".join(skills)}

Experience:
{exp_text}

Projects:
{proj_text}

Job Description:
{jd}

Return ONLY JSON:
{{
"score":0,
"grade":"",
"summary":"",
"found_keywords":[],
"missing_keywords":[]
}}
"""


@router.post("/analyze")
async def analyze_resume(
    request: ATSRequest,
    db=Depends(get_db)
):

    if not settings.groq_api_key:

        raise HTTPException(
            status_code=503,
            detail="AI unavailable"
        )

    user = await db.users.find_one({

        "username":
        request.username.lower()

    })

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    client = Groq(

        api_key=settings.groq_api_key

    )

    response = client.chat.completions.create(

        model="llama-3.1-8b-instant",

        max_tokens=1000,

        messages=[{

            "role": "user",

            "content":
            build_ats_prompt(
                user,
                request.job_description
            )

        }]
    )

    raw = response.choices[0].message.content.strip()

    raw = re.sub(
        r"```json|```",
        "",
        raw
    ).strip()

    try:

        result = json.loads(raw)

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Invalid AI response"
        )

    await db.ats_analyses.insert_one({

        "user_id":
        str(user["_id"]),

        "score":
        result.get("score"),

        "grade":
        result.get("grade"),

        "created_at":
        datetime.utcnow()

    })

    return result


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    try:

        pdf_bytes = await file.read()

        doc = fitz.open(
            stream=pdf_bytes,
            filetype="pdf"
        )

        resume_text = ""

        for page in doc:

            resume_text += page.get_text()

        resume_text = resume_text.lower()
        jd = job_description.lower()

        resume_keywords = extract_skills(
            resume_text
        )

        jd_keywords = extract_skills(
            jd
        )

        matched = list(
            jd_keywords.intersection(
                resume_keywords
            )
        )

        missing = list(
            jd_keywords -
            resume_keywords
        )

        score = int(
            (
                len(matched)
                /
                max(
                    len(jd_keywords),
                    1
                )
            ) * 100
        )

        if score >= 80:
            grade = "Excellent"

        elif score >= 60:
            grade = "Good"

        elif score >= 40:
            grade = "Fair"

        else:
            grade = "Poor"

        return {

            "score": score,

            "grade": grade,

            "matched_keywords":
            matched,

            "missing_keywords":
            missing,

            "summary":
            f"{len(matched)} matching skills found"

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )