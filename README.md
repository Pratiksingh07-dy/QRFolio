<div align="center">

#  QRFolio

### AI-Powered Smart Portfolio, ATS Analyzer & RAG Resume Assistant

<p>AI-powered portfolio platform featuring QR sharing, ATS resume analysis, analytics tracking, and a Retrieval-Augmented Generation (RAG) assistant built with LangChain, ChromaDB, Sentence Transformers, Groq, and Llama 3.1.</p>

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=flat-square&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)
![Python](https://img.shields.io/badge/Python-3.10-yellow?style=flat-square&logo=python)
![LangChain](https://img.shields.io/badge/LangChain-RAG-orange?style=flat-square)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-purple?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-LLM-orange?style=flat-square)
![Llama](https://img.shields.io/badge/Llama_3.1-AI-red?style=flat-square)

</div>

---

##  Overview

QRFolio is a modern AI-powered digital portfolio platform that transforms traditional resumes into **interactive, recruiter-friendly experiences**.

Instead of static resumes, users can create intelligent portfolios enhanced with:

-  AI Recruiter Assistant
-  Resume ATS Analysis
-  QR Code Portfolio Sharing
-  Resume Upload System
-  Portfolio Analytics
-  Dynamic Project Showcases
-  Resume-Aware RAG Assistant

---

##  Features

###  Smart Portfolio System

- Dynamic Portfolio Generation
- Skills Management
- Project Showcase
- Education Section
- Experience Management
- Certifications Section
- Public Portfolio Sharing

---

###  Resume Upload System

- PDF Resume Upload & Storage
- Resume Download Support
- Resume Linked to Portfolio
- Automatic Resume Indexing for RAG

---

###  QR Portfolio Sharing

- Generate QR Codes for your portfolio
- Download QR as PNG
- Instant Portfolio Sharing
- Dynamic QR Updates
- QR Scan Tracking

---

###  AI Portfolio Assistant

Powered by **Groq + Llama 3.1**, the assistant can answer:

- *What skills does this candidate have?*
- *What projects has the candidate built?*
- *Summarize the candidate's experience*
- *Is the candidate suitable for AI/ML roles?*
- *What certifications does the candidate hold?*

---

###  Retrieval-Augmented Generation (RAG)

QRFolio includes a complete RAG pipeline that allows the AI assistant to retrieve information directly from uploaded resumes before generating responses.

```
Resume Upload
     → PDF Parsing
     → LangChain Chunking
     → Sentence Transformer Embeddings
     → ChromaDB Vector Storage
     → Semantic Retrieval
     → Groq Llama 3.1 Response Generation
```

**Benefits:**
- Resume-aware AI responses
- Reduced hallucinations
- Semantic search over resume content
- User-specific retrieval using metadata filtering

> The RAG pipeline uses Sentence Transformers for embeddings, ChromaDB for vector storage, LangChain for retrieval orchestration, and Groq-hosted Llama models for answer generation.

---

###  ATS Resume Analyzer

- ATS Score Generation
- Resume–Job Description Matching
- Missing Keyword Detection
- Matched Skills Extraction
- Resume Improvement Suggestions
- Resume Grading

---

###  Analytics Dashboard

Tracks:
- Portfolio Views
- QR Scans
- AI Chat Interactions
- User Activity
- Dashboard Statistics

---

##  Architecture

### High-Level Architecture

```
Frontend (React)
       │
       ▼
Backend (FastAPI)
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
MongoDB  ATS  AI
               │
               ▼
            Groq API
               │
               ▼
           Llama 3.1
```

###  RAG Architecture

```
Resume PDF
     │
     ▼
PDF Parsing (PyMuPDF)
     │
     ▼
LangChain Chunking
     │
     ▼
Sentence Transformers
     │
     ▼
ChromaDB
     │
     ▼
Retriever
     │
     ▼
Llama 3.1 (Groq)
     │
     ▼
AI Response
```

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, QRCode.js |
| **Backend** | FastAPI, Python, Uvicorn, Pydantic |
| **Database** | MongoDB Atlas, PyMongo |
| **Authentication** | JWT, Passlib, Password Hashing |
| **AI / ML** | Groq, Llama 3.1, LangChain, ChromaDB, Sentence Transformers, RAG, Prompt Engineering |
| **File Processing** | PyMuPDF (fitz), LangChain Text Splitters, FastAPI UploadFile |

---

##  Project Structure

```
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
│   ├── rag/
│   │   ├── pdf_loader.py
│   │   ├── chunker.py
│   │   ├── vector_store.py
│   │   ├── retriever.py
│   │   └── qa_chain.py
│   │
│   ├── uploads/
│   ├── vector_db/
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   ├── services/
    │   └── utils/
    ├── package.json
    └── vite.config.js
```

---

##  Authentication Flow

```
Register → Hash Password → Store in MongoDB

Login → Verify Password → Generate JWT → Access Protected Routes
```

---

##  API Documentation

Swagger UI available at: `http://localhost:8000/docs`

| Category | Endpoint |
|---|---|
| **Auth** | `POST /api/auth/register` |
| | `POST /api/auth/login` |
| | `GET /api/auth/me` |
| | `POST /api/auth/logout` |
| **Profile** | `GET /api/profile/public/{username}` |
| | `GET /api/profile/me` |
| | `PUT /api/profile/me` |
| | `POST /api/profile/me/avatar` |
| | `POST /api/profile/me/resume` |
| | `POST /api/profile/upload-resume` |
| **QR** | `POST /api/qr/generate` |
| | `GET /api/qr/download/{username}` |
| | `GET /api/qr/info/{username}` |
| **AI Chat** | `POST /api/chat` |
| **ATS** | `POST /api/ats/analyze` |
| | `POST /api/ats/upload-resume` |
| **Analytics** | `POST /api/analytics/scan/{username}` |
| | `GET /api/analytics/dashboard` |

---

##  Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/QRFolio.git
cd qrfolio
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload
```

> Backend running at: `http://localhost:8000`  
> API Docs at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

> Frontend running at: `http://localhost:5173`

### 4. Run the Full System

Open two terminals:

```bash
# Terminal 1 — Backend
uvicorn main:app --reload

# Terminal 2 — Frontend
npm run dev
```

---

##  Testing the RAG Pipeline

1. Upload your resume (PDF) via the dashboard
2. Verify chunks are stored in ChromaDB
3. Open the AI Chat
4. Ask questions like:

```
What programming languages does the candidate know?
What projects has the candidate built?
Summarize the candidate's experience.
What certifications does the candidate hold?
```

---

##  Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=qrfolio

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256

API_URL=http://localhost:8000
UPLOAD_DIR=uploads
GROQ_API_KEY=your_groq_api_key
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

---

##  Deployment Architecture

```
Frontend    →  Vercel
Backend     →  Render
Database    →  MongoDB Atlas
AI Provider →  Groq
LLM         →  Llama 3.1
```

---

##  Key Learnings

- Full-stack application development with React + FastAPI
- JWT Authentication & secure routes
- MongoDB integration with PyMongo
- Retrieval-Augmented Generation (RAG) pipeline
- Vector databases & semantic search with ChromaDB
- LLM integration using Groq API
- Resume-aware AI systems & Prompt Engineering

---

## 🔮 Future Scope

- [ ] Conversational Memory for AI Chat
- [ ] Multi-Document Retrieval
- [ ] Hybrid Search (BM25 + Dense)
- [ ] Re-ranking Models
- [ ] Recruiter Dashboard
- [ ] Custom Portfolio Themes
- [ ] Docker Deployment
- [ ] Kubernetes Deployment
- [ ] Redis Caching

---

##  Author

**Pratik Singh**  
Computer Science Engineering (AI & ML)  
DY Patil University, Navi Mumbai

---

<div align="center">

⭐ If you found this project interesting, consider giving it a star!

</div>
