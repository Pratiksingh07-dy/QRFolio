# 🚀 QRFolio - AI Powered Smart Portfolio & Resume Ecosystem

<p align="center">
AI-powered portfolio platform with QR sharing, ATS analysis, AI recruiter assistant, resume management, and analytics dashboard.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Python](https://img.shields.io/badge/Python-3.10-yellow)
![Ollama](https://img.shields.io/badge/Ollama-LLM-orange)
![Llama](https://img.shields.io/badge/Llama3.2-AI-red)

</p>

---

## 📖 Overview

QRFolio is a modern AI-powered digital portfolio platform that transforms traditional resumes into interactive recruiter-friendly experiences.

Instead of static resumes, users can create intelligent portfolios enhanced with:

- AI recruiter assistant
- Resume ATS analysis
- QR code portfolio sharing
- Resume upload system
- Portfolio analytics
- Dynamic project showcases

---

# ✨ Features

## 👤 Smart Portfolio System

- Dynamic portfolio generation
- Skills management
- Projects showcase
- Education section
- Work experience management
- Certifications section
- Public portfolio sharing

---

## 📄 Resume Upload System

- Upload PDF resumes
- Persistent storage
- Resume download support
- Resume linked to public profile

---

## 🔳 QR Portfolio Sharing

- Generate QR codes
- Download QR as PNG
- Instant portfolio sharing
- Dynamic QR updates

---

## 🤖 AI Portfolio Assistant

Uses:

- Ollama
- Llama 3.2

The assistant can answer:

- "What are this candidate's skills?"
- "Show machine learning projects"
- "Summarize work experience"
- "Is this candidate suitable for backend roles?"

---

## 📊 ATS Resume Analyzer

Features:

- ATS score generation
- Resume-job matching
- Missing keyword detection
- Matched skills extraction
- Resume suggestions
- Resume grading

---

## 📈 Analytics Dashboard

Tracks:

- Portfolio views
- QR scans
- Chat interactions
- User activity
- Dashboard statistics

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Lucide React Icons
- QRCode.js

## Backend

- FastAPI
- Python
- Uvicorn
- Pydantic

## Database

- MongoDB Atlas
- PyMongo

## AI / ML

- Ollama
- Llama 3.2
- Prompt Engineering

## Authentication

- JWT Authentication
- Passlib
- Password hashing

## File Processing

- PyMuPDF (fitz)
- FastAPI UploadFile

---

# 📂 Project Structure

```bash
qrfolio/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── profile.py
│   │   ├── qr.py
│   │   ├── chat.py
│   │   ├── ats.py
│   │   └── analytics.py
│   │
│   ├── schemas/
│   │   └── schemas.py
│   │
│   ├── utils/
│   │   ├── auth.py
│   │   └── database.py
│   │
│   └── uploads/
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── utils/
```

⚙️ Installation
Clone Repository
git clone https://github.com/yourusername/QRFolio.git
cd qrfolio


Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
Backend:           http://localhost:8000

API Docs:          http://localhost:8000/docs

Frontend Setup
cd frontend
npm install
npm run dev
Frontend:          http://localhost:5173

🤖 Ollama Setup
Install Ollama:    https://ollama.com/download
Run model:
ollama run llama3.2
Keep Ollama running while using AI assistant.

🔐 Environment Variables

Backend .env
MONGODB_URL=your_mongodb_connection
DATABASE_NAME=qrfolio
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=1440

APP_URL=http://localhost:5173

Frontend .env

VITE_API_URL=http://localhost:8000