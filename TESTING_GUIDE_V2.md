# MediLens V2 - Testing Guide 🧪

## Quick Start Testing

### Prerequisites
✅ Backend running on: http://localhost:8000
✅ Frontend running on: http://localhost:3000

---

## Test Scenario 1: Basic Vitals Analysis

1. **Login**
   - Username: `admin`
   - Password: `admin123`

2. **Enter Patient Info**
   - Name: John Doe
   - Age: 45
   - Gender: Male

3. **Fill Vitals**
   - Systolic: 138
   - Diastolic: 88
   - Heart Rate: 85
   - Temperature: 98.6
   - Respiratory Rate: 18
   - Oxygen Saturation: 96
   - Weight: 85 kg
   - Height: 175 cm
   - Check: Hypertension

4. **Click "Analyze Patient Vitals"**

**Expected Result:** ✅
- Health score displayed (around 75-80/100)
- 6 metric cards showing all vitals
- Warning status on Blood Pressure
- Risk factors mentioning hypertension
- Concise summary (2-3 sentences)
- Brief recommendations (2-3 sentences)

---

## Test Scenario 2: Multiple Lab Reports (NEW!)

1. **Upload First Lab Report**
   - Use any PDF or image file
   - Click "Analyze Report"

2. **Verify First Analysis**
   - Check: Blue-purple header with filename
   - Check: Timestamp displayed
   - Check: "Analysis #1:" label
   - Check: "Lab Report" badge visible
   - Check: Metrics cards displayed
   - Check: Summary and recommendations in colored boxes

3. **Upload Second Lab Report**
   - Upload different PDF/image
   - Click "Analyze Report"

4. **Verify Stacking**
   - Check: **First analysis still visible above**
   - Check: Second analysis appears below with "Analysis #2"
   - Check: Both have unique timestamps
   - Check: Can scroll to see both

5. **Upload Third Lab Report**
   - Repeat process

**Expected Result:** ✅
- All 3 analyses visible on page
- Each tagged with filename
- Chronological order maintained
- No data loss
- Smooth scrolling through all analyses

---

## Test Scenario 3: Floating Action Menu (NEW!)

1. **Prerequisites**
   - Have at least vitals analysis OR lab analysis visible

2. **Find Floating Button**
   - Look bottom-right corner
   - Blue-purple gradient circular button
   - Activity icon visible

3. **Click to Open**
   - Button should show "✕" when open
   - 4 action cards should appear above
   - Smooth animation

4. **Test Each Action**
   - 📝 Suggest Prescription (shows alert)
   - 🔬 Suggest Lab Tests (shows alert)
   - 📅 Generate Follow-up Plan (shows alert)
   - 🏥 Draft Referral Letter (shows alert)

5. **Close Menu**
   - Click button again
   - Cards should disappear

**Expected Result:** ✅
- Button visible after any analysis
- Opens/closes smoothly
- All 4 actions clickable
- Professional appearance

---

## Test Scenario 4: Export with History (NEW!)

### PDF Export Test

1. **Complete Multiple Analyses**
   - Vitals analysis done
   - 2-3 lab reports analyzed

2. **Click "Export as PDF"**

3. **Verify PDF Content**
   - Open generated PDF
   - Check: **No **bold** symbols** ✅
   - Check: Clean text formatting
   - Check: Vitals section included
   - Check: All lab reports included in order
   - Check: Each report has timestamp
   - Check: Tables are properly formatted
   - Check: Page breaks appropriate
   - Check: Summary/recommendations readable

**Expected:** Clean, professional PDF with all analyses

### Excel Export Test

1. **Click "Export as Excel"**

2. **Verify Excel Content**
   - Open generated .xlsx file
   - Check: No markdown formatting
   - Check: Clear section headers (===)
   - Check: Patient info at top
   - Check: Vitals analysis section
   - Check: Each lab report in order
   - Check: Proper column widths
   - Check: All text readable

**Expected:** Organized spreadsheet with clean data

---

## Test Scenario 5: Concise AI Responses

### Before Fix (DON'T Test - just know what it was)
```
"Based on the comprehensive analysis of John's lab 
reports (Age: 45, Gender: Male), the cardiovascular 
health indicators are within normal ranges. Blood 
pressure readings show healthy systolic and diastolic 
values. Cholesterol levels are optimal..."
[5-10 sentences total]
```

### After Fix (What You Should See)
```
"Patient John's cardiovascular health indicators are 
within normal ranges for age 45. Blood pressure and 
heart rate show healthy values. No immediate concerns 
detected based on lab results."
[Exactly 2-3 sentences]
```

**Test:**
1. Perform any analysis
2. Read the summary section
3. Count sentences (should be 2-3)
4. Check recommendations (should be 2-3 sentences)
5. Verify NO **bold** or *italic* markdown

**Expected:** ✅ Concise, readable, professional text

---

## Test Scenario 6: Session Persistence

1. **Start Fresh Session**
   - Login
   - Enter patient: Jane Smith, 35, Female

2. **Perform Actions in Order**
   - Analyze vitals
   - Upload lab report #1
   - Upload lab report #2
   - Upload lab report #3

3. **Scroll Through Page**
   - All analyses visible?
   - Correct order?
   - Can identify each by filename?

4. **Export Complete Session**
   - PDF includes everything?
   - Excel includes everything?

5. **Verify File Upload Ready**
   - After each analysis, file input should be clear
   - Ready for next upload immediately

**Expected:** ✅ Complete session history maintained

---

## Edge Cases to Test

### Empty Values
- Try vitals without filling all fields
- Should still work with "N/A" for missing values

### Very Long Filenames
- Upload file with long name (e.g., "patient_lab_report_comprehensive_bloodwork_2025_11_04.pdf")
- Header should display properly

### Multiple Quick Uploads
- Upload 5 files rapidly
- All should process and display

### Mobile Responsive (if possible)
- Floating button should work on mobile
- Analyses should stack vertically
- Everything should be scrollable

---

## Known Working Features

✅ **Vitals Analysis**
- Endpoint: `POST /api/analyze-vitals`
- Status: Working (200 OK responses confirmed)

✅ **Lab Analysis**
- Endpoint: `POST /api/analyze`
- Status: Working (200 OK responses confirmed)

✅ **Frontend Rendering**
- React components loading correctly
- No console errors
- Smooth rendering

---

## Success Criteria

### Must Pass:
1. ✅ Multiple file uploads without data loss
2. ✅ Each analysis tagged with filename
3. ✅ Floating menu visible and functional
4. ✅ PDF exports clean (no markdown symbols)
5. ✅ Excel exports organized
6. ✅ AI responses concise (2-3 sentences)
7. ✅ No breaking of existing features

### Nice to Have:
1. ✅ Smooth animations
2. ✅ Professional appearance
3. ✅ Fast rendering
4. ✅ Responsive design

---

## Troubleshooting

### Issue: Backend not running
**Solution:**
```bash
cd backend
venv/Scripts/python.exe main.py
```

### Issue: Frontend not running
**Solution:**
```bash
cd frontend
npm run dev
```

### Issue: Floating menu not appearing
**Check:** Have you completed at least one analysis (vitals OR lab)?

### Issue: Export button not visible
**Check:** Is there any analysis data to export?

### Issue: Analyses overwriting (old behavior)
**Check:** Make sure you're using the updated Dashboard.jsx

---

## Performance Benchmarks

**Expected Load Times:**
- Vitals analysis: < 2 seconds
- Lab analysis: < 3 seconds
- PDF generation: < 2 seconds
- Excel generation: < 1 second
- Page render with 5 analyses: < 1 second

---

## Browser Compatibility

**Tested:**
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox

**Should Work:**
- Safari
- Opera
- Brave

---

## Demo Flow for Presentation

**Recommended sequence:**
1. Login → Show professional interface
2. Enter patient info → Natural workflow
3. Fill vitals → Show comprehensive form
4. Analyze vitals → **Wow moment #1** (health score gauge)
5. Upload first lab → **Wow moment #2** (tagged analysis)
6. Upload second lab → **Wow moment #3** (stacking, no data loss)
7. Click floating button → **Wow moment #4** (quick actions)
8. Export to PDF → **Wow moment #5** (clean formatting)
9. Show PDF → **Final wow** (professional report)

**Total demo time:** 5-7 minutes
**Impression:** Professional, feature-rich, ready for production

---

## Success! 🎉

If all tests pass, you have successfully upgraded MediLens to a professional medical consultation platform with:
- Session-based analysis history
- Floating doctor actions
- Clean export formatting
- Concise AI responses
- File tagging system
- Professional appearance

**Ready for production!** ✨
