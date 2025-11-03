# Quick Start Guide

## Setup in 3 Steps

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd ../backend
pip install -r requirements.txt
```

### Step 3: Configure API Key (Optional)
```bash
# In backend folder
cp .env.example .env
# Edit .env and add your Gemini API key
```

## Running the App

### Terminal 1 - Start Backend
```bash
cd backend
python main.py
```
✅ Backend running at http://localhost:8000

### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:3000

## Login & Test

1. Open http://localhost:3000
2. Login with: **admin / admin123**
3. Upload any lab report image or PDF
4. Click "Analyze Report"
5. View results and export!

## Getting Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into `.env` file

**Note:** App works with mock data even without API key!

## Common Issues

**Port already in use?**
- Frontend: Change port in `vite.config.js`
- Backend: Use `python main.py` with `--port 8001`

**Dependencies not installing?**
- Node: Try `npm install --legacy-peer-deps`
- Python: Try `pip install -r requirements.txt --upgrade`

---

Need help? Check the full README.md!
