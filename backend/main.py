from fastapi import FastAPI, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any
import google.generativeai as genai
from PIL import Image
import PyPDF2
import io
import os
from dotenv import load_dotenv
import re

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')

def clean_markdown(text):
    """Remove markdown formatting from text"""
    if not text:
        return ''
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)  # Remove bold
    text = re.sub(r'\*(.+?)\*', r'\1', text)  # Remove italic
    text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)  # Remove links
    text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)  # Remove headers
    text = re.sub(r'`(.+?)`', r'\1', text)  # Remove inline code
    return text.strip()

@app.get("/")
def read_root():
    return {"message": "MediLens API is running"}

@app.post("/api/analyze-vitals")
async def analyze_vitals(request: Dict[str, Any] = Body(...)):
    """Analyze patient vitals and medical history"""
    try:
        patient = request.get('patient', {})
        vitals = request.get('vitals', {})
        
        # Generate analysis based on vitals
        analysis_result = await analyze_vitals_data(patient, vitals)
        
        return JSONResponse(content=analysis_result)
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.post("/api/analyze")
async def analyze_report(
    file: UploadFile = File(...),
    name: str = Form(...),
    age: str = Form(...),
    gender: str = Form(...)
):
    try:
        # Read file content
        content = await file.read()
        file_type = file.content_type
        
        # Extract text from file
        extracted_text = ""
        if file_type == "application/pdf":
            extracted_text = extract_text_from_pdf(content)
        elif file_type.startswith("image/"):
            extracted_text = await analyze_image_with_gemini(content)
        
        # Analyze with Gemini
        analysis_result = await analyze_health_data(extracted_text, name, age, gender)
        
        return JSONResponse(content=analysis_result)
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

def extract_text_from_pdf(content):
    """Extract text from PDF"""
    try:
        pdf_file = io.BytesIO(content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"

async def analyze_image_with_gemini(content):
    """Analyze image using Gemini Vision API"""
    try:
        if not GEMINI_API_KEY:
            return "Mock image analysis: Lab report detected"
        
        image = Image.open(io.BytesIO(content))
        
        prompt = """Analyze this medical lab report image and extract all visible health metrics, values, and any test results.
        Focus on cardiovascular health indicators if present (blood pressure, cholesterol, heart rate, etc.).
        Return the information in a structured format."""
        
        response = model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        return f"Error analyzing image: {str(e)}"

async def analyze_vitals_data(patient: dict, vitals: dict):
    """Analyze patient vitals and medical history"""
    
    # If Gemini API is not configured, return mock data
    if not GEMINI_API_KEY:
        return generate_mock_vitals_analysis(patient, vitals)
    
    try:
        # Build medical history string
        medical_history = []
        if vitals.get('heartDisease'):
            medical_history.append("Heart Disease")
        if vitals.get('diabetes'):
            medical_history.append("Diabetes")
        if vitals.get('hypertension'):
            medical_history.append("Hypertension")
        if vitals.get('asthma'):
            medical_history.append("Asthma")
        if vitals.get('otherConditions'):
            medical_history.append(vitals.get('otherConditions'))
        
        history_str = ", ".join(medical_history) if medical_history else "None reported"
        allergies_str = vitals.get('allergies', 'None reported')
        
        prompt = f"""You are a medical AI assistant. Analyze these vital signs and provide CONCISE, structured response.

Patient: {patient.get('name')}, Age: {patient.get('age')}, Gender: {patient.get('gender')}

Vitals:
- BP: {vitals.get('systolic')}/{vitals.get('diastolic')} mmHg
- HR: {vitals.get('heartRate')} bpm | Temp: {vitals.get('temperature')}°F
- RR: {vitals.get('respiratoryRate')}/min | SpO2: {vitals.get('oxygenSaturation')}%
- Weight: {vitals.get('weight')} kg | Height: {vitals.get('height')} cm

Medical History: {history_str}
Allergies: {allergies_str}

IMPORTANT: Keep summary and recommendations BRIEF (2-3 sentences each). NO markdown formatting.

{{
    "overallScore": 85,
    "metrics": [
        {{"name": "Blood Pressure", "value": "120/80 mmHg", "status": "Normal"}},
        {{"name": "Heart Rate", "value": "72 bpm", "status": "Normal"}},
        {{"name": "Temperature", "value": "98.6°F", "status": "Normal"}},
        {{"name": "Oxygen Level", "value": "98%", "status": "Normal"}},
        {{"name": "Respiratory Rate", "value": "16/min", "status": "Normal"}},
        {{"name": "BMI", "value": "24.5", "status": "Normal"}}
    ],
    "riskFactors": ["Brief risk factors if any, or 'No immediate concerns'"],
    "summary": "Brief 2-3 sentence analysis. Plain text only.",
    "recommendations": "Brief 2-3 sentence advice. Plain text only."
}}

Rules: Status is "Normal", "Warning", or "Critical". Score 0-100. Include BMI. NO bold/italic text.
"""

        response = model.generate_content(prompt)
        response_text = response.text
        
        # Extract JSON from response
        import json
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            # Clean any markdown
            result['summary'] = clean_markdown(result.get('summary', ''))
            result['recommendations'] = clean_markdown(result.get('recommendations', ''))
            return result
        else:
            return generate_mock_vitals_analysis(patient, vitals)
            
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return generate_mock_vitals_analysis(patient, vitals)

async def analyze_health_data(extracted_text: str, name: str, age: str, gender: str):
    """Analyze health data using Gemini AI"""
    
    # If Gemini API is not configured, return mock data
    if not GEMINI_API_KEY:
        return generate_mock_analysis(name, age, gender)
    
    try:
        prompt = f"""You are a medical AI assistant. Analyze this lab report and provide a concise, structured response.

Patient: {name}, Age: {age}, Gender: {gender}

Lab Report Data:
{extracted_text}

IMPORTANT: Provide a CONCISE response in EXACT JSON format. Keep summary and recommendations brief (2-3 sentences each).

{{
    "metrics": [
        {{"name": "Blood Pressure", "value": "120/80 mmHg", "status": "Normal"}},
        {{"name": "Cholesterol", "value": "190 mg/dL", "status": "Normal"}},
        {{"name": "Heart Rate", "value": "72 bpm", "status": "Normal"}},
        {{"name": "Blood Sugar", "value": "95 mg/dL", "status": "Normal"}},
        {{"name": "BMI", "value": "24.5", "status": "Normal"}}
    ],
    "summary": "Brief 2-3 sentence analysis. Patient's cardiovascular health indicators are within normal ranges. No immediate concerns noted.",
    "recommendations": "Brief 2-3 sentence advice. Continue healthy lifestyle. Schedule annual checkup. Monitor blood pressure regularly."
}}

Rules:
- Status: "Normal", "Warning", or "Critical"
- Summary: Max 3 sentences, plain text, no formatting
- Recommendations: Max 3 sentences, plain text, no formatting
- DO NOT use markdown formatting (**bold**, *italic*, etc)
- Focus on key cardiovascular metrics
"""

        response = model.generate_content(prompt)
        response_text = response.text
        
        # Extract JSON from response
        import json
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            # Clean any remaining markdown
            result['summary'] = clean_markdown(result.get('summary', ''))
            result['recommendations'] = clean_markdown(result.get('recommendations', ''))
            return result
        else:
            return generate_mock_analysis(name, age, gender)
            
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return generate_mock_analysis(name, age, gender)

def generate_mock_vitals_analysis(patient: dict, vitals: dict):
    """Generate mock vitals analysis data for demonstration"""
    
    # Calculate BMI if height and weight are provided
    bmi = "N/A"
    bmi_status = "Normal"
    try:
        if vitals.get('height') and vitals.get('weight'):
            height_m = float(vitals['height']) / 100  # Convert cm to m
            weight_kg = float(vitals['weight'])
            bmi_value = weight_kg / (height_m ** 2)
            bmi = f"{bmi_value:.1f}"
            if bmi_value < 18.5:
                bmi_status = "Warning"
            elif bmi_value > 25:
                bmi_status = "Warning"
    except:
        pass
    
    # Assess vitals
    bp_status = "Normal"
    hr_status = "Normal"
    temp_status = "Normal"
    spo2_status = "Normal"
    rr_status = "Normal"
    
    risk_factors = []
    
    # Check blood pressure
    try:
        systolic = int(vitals.get('systolic', 120))
        diastolic = int(vitals.get('diastolic', 80))
        if systolic > 140 or diastolic > 90:
            bp_status = "Critical"
            risk_factors.append("Elevated blood pressure - requires immediate attention")
        elif systolic > 130 or diastolic > 85:
            bp_status = "Warning"
            risk_factors.append("Slightly elevated blood pressure - monitor closely")
    except:
        pass
    
    # Check heart rate
    try:
        hr = int(vitals.get('heartRate', 72))
        if hr > 100 or hr < 60:
            hr_status = "Warning"
            if hr > 100:
                risk_factors.append("Elevated heart rate - may indicate stress or cardiovascular strain")
    except:
        pass
    
    # Check SpO2
    try:
        spo2 = int(vitals.get('oxygenSaturation', 98))
        if spo2 < 95:
            spo2_status = "Warning"
            risk_factors.append("Low oxygen saturation - respiratory assessment recommended")
        if spo2 < 90:
            spo2_status = "Critical"
    except:
        pass
    
    # Add medical history risk factors
    if vitals.get('heartDisease'):
        risk_factors.append("Pre-existing heart disease - requires ongoing monitoring")
    if vitals.get('diabetes'):
        risk_factors.append("Diabetes - blood sugar control is essential")
    if vitals.get('hypertension'):
        risk_factors.append("History of hypertension - blood pressure monitoring critical")
    
    # Calculate overall score
    score = 100
    if bp_status == "Warning": score -= 10
    if bp_status == "Critical": score -= 20
    if hr_status == "Warning": score -= 5
    if spo2_status == "Warning": score -= 10
    if spo2_status == "Critical": score -= 20
    if bmi_status == "Warning": score -= 5
    if vitals.get('heartDisease'): score -= 10
    if vitals.get('diabetes'): score -= 5
    if vitals.get('hypertension'): score -= 5
    
    score = max(score, 50)  # Minimum score of 50
    
    return {
        "overallScore": score,
        "metrics": [
            {"name": "Blood Pressure", "value": f"{vitals.get('systolic', 'N/A')}/{vitals.get('diastolic', 'N/A')} mmHg", "status": bp_status},
            {"name": "Heart Rate", "value": f"{vitals.get('heartRate', 'N/A')} bpm", "status": hr_status},
            {"name": "Temperature", "value": f"{vitals.get('temperature', 'N/A')} °F", "status": temp_status},
            {"name": "Oxygen Level", "value": f"{vitals.get('oxygenSaturation', 'N/A')}%", "status": spo2_status},
            {"name": "Respiratory Rate", "value": f"{vitals.get('respiratoryRate', 'N/A')}/min", "status": rr_status},
            {"name": "BMI", "value": bmi, "status": bmi_status}
        ],
        "riskFactors": risk_factors if risk_factors else ["No immediate risk factors identified"],
        "summary": f"Patient {patient.get('name')} presents with health score of {score}/100. Vital signs are {'within normal ranges' if score > 80 else 'showing some concerns' if score > 70 else 'requiring attention'}. {'All parameters stable' if score > 85 else 'Monitoring recommended' if score > 70 else 'Medical consultation needed'}.",
        "recommendations": f"{'Continue healthy lifestyle with regular exercise and balanced diet' if score > 85 else 'Increase monitoring frequency and consider lifestyle modifications' if score > 70 else 'Seek immediate medical attention for evaluation'}. {'Schedule annual checkup' if score > 70 else 'Follow up within one week'}."
    }

def generate_mock_analysis(name: str, age: str, gender: str):
    """Generate mock analysis data for demonstration"""
    return {
        "metrics": [
            {"name": "Blood Pressure", "value": "118/78 mmHg", "status": "Normal"},
            {"name": "Cholesterol", "value": "185 mg/dL", "status": "Normal"},
            {"name": "Heart Rate", "value": "68 bpm", "status": "Normal"},
            {"name": "Blood Sugar", "value": "92 mg/dL", "status": "Normal"},
            {"name": "Triglycerides", "value": "145 mg/dL", "status": "Normal"}
        ],
        "summary": f"Patient {name}'s cardiovascular health indicators are within normal ranges for age {age}. Blood pressure and heart rate show healthy values. No immediate concerns detected based on lab results.",
        "recommendations": "Continue maintaining a balanced diet and regular exercise routine. Monitor blood pressure monthly. Schedule annual cardiovascular checkup for preventive care."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
