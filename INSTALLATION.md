# 🚀 Complete Installation Guide

## Prerequisites Check

Before starting, ensure you have:
- [ ] Windows/Mac/Linux computer
- [ ] Internet connection
- [ ] Administrator/sudo access
- [ ] 1GB free disk space

## Step-by-Step Installation

### 1️⃣ Install Node.js

**Windows:**
1. Download from: https://nodejs.org/en/download/
2. Choose "LTS" version (recommended)
3. Run the installer (.msi file)
4. Follow the wizard (use default settings)
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Mac:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2️⃣ Install Python

**Windows:**
1. Download from: https://www.python.org/downloads/
2. Choose Python 3.9 or higher
3. Run installer
4. ✅ **IMPORTANT:** Check "Add Python to PATH"
5. Click "Install Now"
6. Verify:
   ```bash
   python --version
   pip --version
   ```

**Mac:**
```bash
# Using Homebrew
brew install python3
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip
```

### 3️⃣ Navigate to Project

```bash
cd c:\Users\asus\Desktop\Minor-Project
```

Or use File Explorer to open the folder, then right-click → "Open in Terminal"

### 4️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

**What this does:** Downloads React, Vite, Chart.js, and all frontend libraries

**Expected output:** 
- Progress bar showing package downloads
- Should complete in 2-5 minutes
- Creates `node_modules` folder

**If errors occur:**
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or clear cache
npm cache clean --force
npm install
```

### 5️⃣ Install Backend Dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

**What this does:** Installs FastAPI, Gemini API, and Python libraries

**If errors occur:**
```bash
# Try with upgrade flag
pip install -r requirements.txt --upgrade

# Or use pip3
pip3 install -r requirements.txt

# Windows: Use python -m pip
python -m pip install -r requirements.txt
```

### 6️⃣ Configure Gemini API (Optional)

1. **Get API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key

2. **Create .env file:**
   ```bash
   # In backend folder
   cp .env.example .env
   ```
   
   **Windows:**
   ```bash
   copy .env.example .env
   ```

3. **Edit .env file:**
   - Open `.env` in any text editor
   - Replace `your_gemini_api_key_here` with your actual key
   - Save and close

   ```
   GEMINI_API_KEY=AIzaSyC...your_actual_key_here
   ```

**Note:** If you skip this step, the app will use mock data (perfectly fine for demo!)

### 7️⃣ Verify Setup

```bash
# Return to project root
cd ..

# Run verification script
# Windows:
verify-setup.bat

# Mac/Linux:
bash verify-setup.sh
```

This checks if everything is installed correctly.

## 🎮 Running the Application

### Method 1: Automated Start (Easiest)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
bash start.sh
```

This will open two terminal windows and start both servers automatically.

### Method 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

Wait for message: `INFO: Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Wait for message: `Local: http://localhost:3000/`

### 8️⃣ Access the Application

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the MediLens login page

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

## ✅ Success Checklist

After installation, you should have:
- [ ] Node.js and npm installed
- [ ] Python and pip installed
- [ ] `frontend/node_modules/` folder exists
- [ ] Backend Python packages installed
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login with admin credentials

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

Or change the port in `vite.config.js`:
```js
server: {
  port: 3001, // Change to 3001 or any other port
}
```

### Module Not Found Errors

**Error:** `Cannot find module 'react'` or similar

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Python Module Not Found

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt --upgrade
```

### Gemini API Errors

**Error:** `Invalid API key`

**Solution:**
1. Check your API key in `.env`
2. Ensure no extra spaces or quotes
3. Generate a new key if needed
4. Or just don't use `.env` - mock data works fine!

### CORS Errors

**Error:** `CORS policy blocked`

**Solution:**
- Ensure backend is running on port 8000
- Ensure frontend is running on port 3000
- Both must be running simultaneously

### Build Errors

**Error:** `Build failed` or `Compilation error`

**Solution:**
```bash
cd frontend
npm run dev
# Check the error message in terminal
# Usually it's a syntax error in code
```

## 📞 Still Having Issues?

1. **Check Prerequisites:**
   - Run `node --version` (should be v18+)
   - Run `python --version` (should be 3.9+)

2. **Check Project Structure:**
   - Ensure you're in the `Minor-Project` folder
   - Verify all files are present

3. **Start Fresh:**
   ```bash
   # Delete everything and reinstall
   cd frontend
   rm -rf node_modules
   npm install
   
   cd ../backend
   pip uninstall -r requirements.txt -y
   pip install -r requirements.txt
   ```

4. **Check Logs:**
   - Backend: Look at terminal running `python main.py`
   - Frontend: Look at terminal running `npm run dev`
   - Browser: Open DevTools (F12) → Console tab

## 🎓 Understanding the Setup

**What did we install?**

**Frontend (node_modules):**
- React - UI framework
- Vite - Fast build tool
- Tailwind - CSS styling
- Chart.js - Data visualization
- Axios - API calls
- 50+ supporting packages

**Backend (Python packages):**
- FastAPI - Web framework
- Uvicorn - ASGI server
- Google AI - Gemini API client
- Pillow - Image processing
- PyPDF2 - PDF text extraction

**Total install size:** ~500MB

## 🎯 Next Steps After Installation

1. ✅ Successfully logged in
2. 📝 Read `SAMPLE_REPORTS.md` for test data
3. 📤 Upload a sample lab report
4. 🔬 Analyze the report
5. 📊 View charts and metrics
6. 💾 Export as PDF/Excel
7. 🎓 Review `PROJECT_INFO.md` to understand architecture

## 💡 Pro Tips

1. **Keep terminals open:** Don't close the backend/frontend terminals while using the app

2. **Refresh if stuck:** Press `Ctrl+R` in browser if UI doesn't update

3. **Check both servers:** If something doesn't work, ensure both frontend AND backend are running

4. **Use mock data:** Don't stress about Gemini API - mock data is perfect for demos

5. **Test with any file:** Upload ANY image or PDF - the system will analyze it

## 📚 Additional Resources

- **React Tutorial:** https://react.dev/learn
- **FastAPI Guide:** https://fastapi.tiangolo.com/tutorial/
- **Gemini API Docs:** https://ai.google.dev/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

**Installation Complete! 🎉**

You're ready to use MediLens. Run `start.bat` (Windows) or `bash start.sh` (Mac/Linux) to begin!
