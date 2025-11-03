# 🏗️ MediLens Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      REACT FRONTEND                             │
│                    (Vite Dev Server)                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Login     │  │  Dashboard   │  │   Router     │        │
│  │  Component   │  │  Component   │  │  (React      │        │
│  │              │  │              │  │   Router)    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐       │
│  │  Axios HTTP Client                                 │       │
│  │  - API calls                                       │       │
│  │  - File upload (FormData)                          │       │
│  └────────────────────────────────────────────────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ POST /api/analyze
                             │ (multipart/form-data)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FASTAPI BACKEND                            │
│                    http://localhost:8000                        │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐       │
│  │  FastAPI Routes                                    │       │
│  │  - GET  /                    (health check)        │       │
│  │  - POST /api/analyze         (main endpoint)       │       │
│  └────────────────────────────────────────────────────┘       │
│                             │                                   │
│                             ▼                                   │
│  ┌────────────────────────────────────────────────────┐       │
│  │  File Processing Layer                             │       │
│  │  - PDF text extraction (PyPDF2)                    │       │
│  │  - Image processing (Pillow)                       │       │
│  └────────────────────────────────────────────────────┘       │
│                             │                                   │
│                             ▼                                   │
│  ┌────────────────────────────────────────────────────┐       │
│  │  AI Analysis Layer                                 │       │
│  │  - Gemini API calls                                │       │
│  │  - Prompt engineering                              │       │
│  │  - Response parsing                                │       │
│  │  - Mock data fallback                              │       │
│  └────────────────────────────────────────────────────┘       │
│                             │                                   │
│                             ▼                                   │
│  ┌────────────────────────────────────────────────────┐       │
│  │  Response Formatter                                │       │
│  │  - JSON structure                                  │       │
│  │  - Metrics array                                   │       │
│  │  - Summary text                                    │       │
│  │  - Recommendations                                 │       │
│  └────────────────────────────────────────────────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ JSON Response
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐       │
│  │         Google Gemini API                          │       │
│  │         (generativeai-0.3.1)                       │       │
│  │                                                     │       │
│  │  - Text analysis                                   │       │
│  │  - Image analysis                                  │       │
│  │  - Multimodal understanding                        │       │
│  │  - Structured output generation                    │       │
│  └────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER ACTIONS                    SYSTEM PROCESSING                   OUTPUT
═══════════════════════════════════════════════════════════════════════════

1. Login
   ├─ Enter credentials ──────> Validate (admin/admin123) ────> Success
   └─────────────────────────> Store auth state ──────────────> Dashboard

2. Upload File
   ├─ Drag & Drop ────────────> Validate file type ───────────> File stored
   │  or Browse                 (PDF or Image)                   in memory
   └─────────────────────────> Show file name ────────────────> Ready to analyze

3. Analyze
   ├─ Click button ───────────> Create FormData ──────────────> POST request
   │                             with file + patient info
   │
   ├─ Backend receives ───────> Extract file content ────────> Text extracted
   │                             (PyPDF2 or image reading)
   │
   ├─ Send to Gemini API ─────> AI analyzes data ───────────> Structured JSON
   │                             (or use mock data)
   │
   └─ Return to frontend ─────> Parse and display ──────────> Results shown

4. View Results
   ├─ Metric Cards ───────────> 5 health metrics ────────────> Cards displayed
   │
   ├─ Bar Chart ──────────────> Chart.js renders ───────────> Visual bars
   │
   ├─ Doughnut Chart ─────────> Risk distribution ──────────> Pie chart
   │
   ├─ Summary Text ───────────> AI-generated text ──────────> Paragraph shown
   │
   └─ Recommendations ────────> Health advice ──────────────> Displayed

5. Export
   ├─ PDF ────────────────────> jsPDF generates ────────────> File downloaded
   │                             with all data
   │
   └─ Excel ──────────────────> xlsx generates ─────────────> File downloaded
                                 spreadsheet
```

---

## Component Hierarchy

```
App.jsx (Router)
│
├─── Login.jsx
│    │
│    ├── Username Input
│    ├── Password Input
│    └── Login Button
│
└─── Dashboard.jsx
     │
     ├── Header
     │   ├── Logo
     │   └── Logout Button
     │
     ├── Patient Info Section
     │   ├── Name Input
     │   ├── Age Input
     │   └── Gender Select
     │
     ├── File Upload Section
     │   ├── Drag & Drop Area
     │   ├── Browse Button
     │   └── Analyze Button
     │
     ├── Results Section (conditional)
     │   │
     │   ├── Metric Cards (x5)
     │   │   ├── Metric Name
     │   │   ├── Metric Value
     │   │   └── Status Badge
     │   │
     │   ├── Charts Section
     │   │   ├── Bar Chart (Chart.js)
     │   │   └── Doughnut Chart (Chart.js)
     │   │
     │   ├── Summary & Recommendations
     │   │   ├── Summary Card
     │   │   └── Recommendations Card
     │   │
     │   └── Export Section
     │       ├── Export PDF Button
     │       └── Export Excel Button
     │
     └── Loading Spinner (conditional)
```

---

## API Request/Response Flow

### Request Structure

```
POST http://localhost:8000/api/analyze
Content-Type: multipart/form-data

FormData:
├── file: [Binary file data] (PDF or Image)
├── name: "John Smith"
├── age: "45"
└── gender: "male"
```

### Response Structure

```json
{
  "metrics": [
    {
      "name": "Blood Pressure",
      "value": "120/80",
      "status": "Normal"
    },
    {
      "name": "Cholesterol",
      "value": "185 mg/dL",
      "status": "Normal"
    },
    {
      "name": "Heart Rate",
      "value": "68 bpm",
      "status": "Normal"
    },
    {
      "name": "Blood Sugar",
      "value": "92 mg/dL",
      "status": "Normal"
    },
    {
      "name": "Triglycerides",
      "value": "145 mg/dL",
      "status": "Normal"
    }
  ],
  "summary": "Detailed analysis paragraph...",
  "recommendations": "Health recommendations..."
}
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│  - React Components (JSX)                               │
│  - Tailwind CSS (Styling)                               │
│  - Lucide Icons                                         │
│  - React Router (Navigation)                            │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  APPLICATION LAYER                      │
│  - React Hooks (useState, etc.)                         │
│  - Axios (HTTP Client)                                  │
│  - Chart.js (Visualization)                             │
│  - jsPDF (PDF Generation)                               │
│  - xlsx (Excel Generation)                              │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   NETWORK LAYER                         │
│  - REST API calls                                       │
│  - JSON data exchange                                   │
│  - FormData for file upload                             │
│  - CORS handling                                        │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   BACKEND LAYER                         │
│  - FastAPI (Web Framework)                              │
│  - Uvicorn (ASGI Server)                                │
│  - Python 3.9+                                          │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  PROCESSING LAYER                       │
│  - PyPDF2 (PDF parsing)                                 │
│  - Pillow (Image processing)                            │
│  - File I/O operations                                  │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                      AI LAYER                           │
│  - Google Generative AI SDK                             │
│  - Gemini 1.5 Flash Model                               │
│  - Prompt Engineering                                   │
│  - Response Parsing                                     │
└─────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
Frontend State:
├── isAuthenticated (boolean)
│   └── Controls route access
│
├── patientData (object)
│   ├── name (string)
│   ├── age (string)
│   └── gender (string)
│
├── file (File object | null)
│   └── Uploaded file reference
│
├── analysisResult (object | null)
│   ├── metrics (array)
│   ├── summary (string)
│   └── recommendations (string)
│
├── loading (boolean)
│   └── Shows/hides loading spinner
│
└── dragActive (boolean)
    └── Drag & drop visual feedback
```

---

## File Structure Diagram

```
Minor-Project/
│
├── frontend/                      [React Application]
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx         ← Authentication UI
│   │   │   └── Dashboard.jsx     ← Main application UI
│   │   ├── assets/               ← Images, fonts (if needed)
│   │   ├── App.jsx               ← Router setup
│   │   ├── main.jsx              ← React entry point
│   │   └── index.css             ← Global styles + Tailwind
│   │
│   ├── public/                   ← Static assets
│   ├── index.html                ← HTML template
│   ├── package.json              ← Node dependencies
│   ├── vite.config.js            ← Vite configuration
│   ├── tailwind.config.js        ← Tailwind settings
│   └── postcss.config.js         ← PostCSS config
│
├── backend/                       [Python API]
│   ├── main.py                   ← FastAPI server + logic
│   ├── requirements.txt          ← Python dependencies
│   ├── .env.example              ← Environment template
│   └── .env                      ← Your API key (create this)
│
└── [Documentation & Scripts]
    ├── README.md
    ├── QUICKSTART.md
    ├── INSTALLATION.md
    ├── PROJECT_INFO.md
    ├── FEATURES.md
    ├── SAMPLE_REPORTS.md
    ├── PRESENTATION.md
    ├── INDEX.md
    ├── START_HERE.md
    ├── start.bat / start.sh
    └── verify-setup.bat / verify-setup.sh
```

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                     │
│                     (Not Implemented)                   │
└─────────────────────────────────────────────────────────┘

Frontend:
  → Deployed to: Vercel / Netlify / AWS S3
  → CDN: CloudFlare
  → URL: https://medilens.app

Backend:
  → Deployed to: AWS EC2 / Google Cloud Run / Heroku
  → Database: PostgreSQL (for patient history)
  → File Storage: AWS S3
  → URL: https://api.medilens.app

AI Service:
  → Google Gemini API (same)
  → API Key: Environment variable
  → Rate limiting: Implemented

Additional:
  → SSL/TLS: Let's Encrypt
  → Monitoring: Sentry
  → Analytics: Google Analytics
  → Authentication: JWT tokens
  → Logging: CloudWatch / Stackdriver
```

---

## Security Layers (Current vs Production)

```
CURRENT (Demo):
├── Simple admin authentication
├── No database
├── Local-only access
├── No encryption
└── CORS for localhost

PRODUCTION (Would Need):
├── JWT-based authentication
├── Password hashing (bcrypt)
├── HTTPS everywhere
├── Rate limiting
├── Input sanitization
├── HIPAA compliance
├── Data encryption at rest
├── Audit logging
├── Role-based access control (RBAC)
└── Regular security audits
```

---

## Performance Characteristics

```
METRIC                  CURRENT         PRODUCTION TARGET
─────────────────────────────────────────────────────────
Initial Load Time       2-3s            < 2s
API Response Time       2-3s            < 1s
File Upload (5MB)       1-2s            < 1s
Chart Rendering         < 100ms         < 100ms
PDF Export              < 500ms         < 500ms
Excel Export            < 500ms         < 500ms
Concurrent Users        1-5             100+
Database Queries        N/A             < 100ms
Cache Hit Rate          N/A             > 80%
```

---

**This architecture is designed for:**
- ✅ Local development and demonstration
- ✅ Easy understanding and modification
- ✅ Clean separation of concerns
- ✅ Scalability potential
- ✅ Production-ready patterns

**To understand the architecture:**
1. Start with the System Architecture diagram
2. Follow the Data Flow
3. Review Component Hierarchy
4. Study the API structure
5. Check Technology Stack Layers
