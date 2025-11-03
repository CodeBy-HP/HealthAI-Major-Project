# 🏥 MediLens - AI Healthcare Data Analyzer

**MediLens** is an AI-powered healthcare data analyzer designed for demonstration purposes. It analyzes patient lab reports and medical data using Google's Gemini AI to provide insights on cardiovascular health.

## ✨ Features

- 🔐 **Simple Admin Authentication** - Quick login for demo purposes
- 📤 **File Upload** - Drag & drop or browse PDF/image lab reports
- 🤖 **AI Analysis** - Powered by Google Gemini API
- 📊 **Data Visualization** - Interactive charts showing health metrics
- 📥 **Export Reports** - Download analysis as PDF or Excel
- 🎨 **Clean UI** - Modern, responsive design with Tailwind CSS
- ⚡ **Fast & Local** - Runs entirely on your machine

## 🏗️ Project Structure

```
Minor-Project/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx       # Login page
│   │   │   └── Dashboard.jsx   # Main dashboard
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/               # FastAPI backend
    ├── main.py           # API server with Gemini integration
    ├── requirements.txt
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Google Gemini API Key** (free at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

#### 1. Clone or Navigate to Project

```bash
cd c:\Users\asus\Desktop\Minor-Project
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

#### 3. Backend Setup

```bash
cd ../backend
pip install -r requirements.txt
```

#### 4. Configure API Key

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   **Note:** If you don't have an API key, the app will work with mock data.

## 🎮 Running the Application

You need to run both frontend and backend simultaneously.

### Terminal 1 - Backend

```bash
cd backend
python main.py
```

The backend will start at `http://localhost:8000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:3000`

## 🔑 Login Credentials

```
Username: admin
Password: admin123
```

## 📖 How to Use

1. **Login** with the credentials above
2. **Enter Patient Information** (name, age, gender)
3. **Upload a Lab Report** (PDF or image file)
   - You can use any medical lab report image for testing
   - Sample reports can be found online or use screenshots of lab results
4. **Click "Analyze Report"** - The AI will process the data
5. **View Results** - See metrics, charts, and recommendations
6. **Export Report** - Download as PDF or Excel

## 🎯 Key Health Metrics Analyzed

The system focuses on cardiovascular health indicators:

- **Blood Pressure** - Systolic/Diastolic readings
- **Cholesterol Levels** - Total cholesterol, HDL, LDL
- **Heart Rate** - Beats per minute
- **Blood Sugar** - Glucose levels
- **Triglycerides** - Fat levels in blood
- **BMI** - Body Mass Index

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **jsPDF & xlsx** - Export functionality
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **Google Generative AI (Gemini)** - AI analysis
- **Pillow** - Image processing
- **PyPDF2** - PDF text extraction
- **Uvicorn** - ASGI server

## 🧪 Testing Without Real Reports

The system includes mock data generation. Even without uploading real lab reports, you can:
1. Upload any PDF or image file
2. The system will generate realistic sample analysis
3. Perfect for demonstration and testing

## 📦 API Endpoints

### POST `/api/analyze`
Analyzes uploaded lab report

**Request:**
- `file`: PDF or image file
- `name`: Patient name
- `age`: Patient age
- `gender`: Patient gender

**Response:**
```json
{
  "metrics": [
    {"name": "Blood Pressure", "value": "120/80", "status": "Normal"},
    ...
  ],
  "summary": "Analysis summary text...",
  "recommendations": "Health recommendations..."
}
```

## 🎨 UI Screenshots

- **Login Page**: Clean authentication screen with MediLens branding
- **Dashboard**: Patient info form + drag-and-drop upload area
- **Results**: Metric cards, bar charts, doughnut chart for risk assessment
- **Export**: PDF and Excel download buttons

## 🔧 Customization

### Adding More Metrics

Edit `backend/main.py` and modify the `generate_mock_analysis()` function to add more health metrics.

### Changing Theme

Edit `frontend/tailwind.config.js` to customize colors:
```js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### AI Prompt Tuning

Modify the prompt in `backend/main.py` > `analyze_health_data()` function to focus on different health areas.

## ⚠️ Important Notes

- This is a **demonstration project** - not for actual medical diagnosis
- Always consult healthcare professionals for medical advice
- Mock data is used when Gemini API is not configured
- No patient data is stored or persisted

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend errors
```bash
cd backend
pip install -r requirements.txt --upgrade
python main.py
```

### CORS issues
Make sure backend is running on port 8000 and frontend on port 3000.

### Gemini API errors
- Check your API key in `.env`
- Ensure you have API quota available
- The app works with mock data if API fails

## 📝 License

This project is for educational purposes. Feel free to use and modify.

## 👨‍💻 Development

Built as a minor project demonstration focusing on:
- Clean, minimal code structure
- AI integration for healthcare
- Modern web development practices
- User-friendly interface design

---

**Made with ❤️ for healthcare innovation**
