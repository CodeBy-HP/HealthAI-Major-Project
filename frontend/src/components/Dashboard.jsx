import { useState } from 'react'
import { Activity, Upload, LogOut, FileText, Download, Loader2 } from 'lucide-react'
import axios from 'axios'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import VitalsForm from './VitalsForm'
import VitalsAnalysisDisplay from './VitalsAnalysisDisplay'
import CollapsibleSection from './CollapsibleSection'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = ({ onLogout }) => {
  const [file, setFile] = useState(null)
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: 'male',
  })
  // Change to array to keep history of all analyses
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  // New states for progressive dashboard
  const [vitals, setVitals] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    heartDisease: false,
    diabetes: false,
    hypertension: false,
    asthma: false,
    otherConditions: '',
    allergies: ''
  })
  const [vitalsAnalysis, setVitalsAnalysis] = useState(null)
  const [loadingVitals, setLoadingVitals] = useState(false)
  
  // Section collapse states
  const [patientInfoCollapsed, setPatientInfoCollapsed] = useState(false)
  const [vitalsCollapsed, setVitalsCollapsed] = useState(false)
  
  // Floating action menu state
  const [showFloatingMenu, setShowFloatingMenu] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/')) {
        setFile(droppedFile)
      } else {
        alert('Please upload only PDF or image files')
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile)
      } else {
        alert('Please upload only PDF or image files')
      }
    }
  }

  const handleAnalyzeVitals = async () => {
    if (!patientData.name || !patientData.age) {
      alert('Please fill in patient details first')
      return
    }

    setLoadingVitals(true)
    try {
      const response = await axios.post('/api/analyze-vitals', {
        patient: patientData,
        vitals: vitals
      })
      setVitalsAnalysis(response.data)
      setVitalsCollapsed(true) // Collapse vitals form after analysis
    } catch (error) {
      console.error('Vitals analysis error:', error)
      alert('Error analyzing vitals. Please try again.')
    } finally {
      setLoadingVitals(false)
    }
  }

  const handleAnalyze = async () => {
    if (!file || !patientData.name || !patientData.age) {
      alert('Please fill in all patient details and upload a file')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', patientData.name)
    formData.append('age', patientData.age)
    formData.append('gender', patientData.gender)

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      // Add to history instead of replacing
      const newAnalysis = {
        id: Date.now(),
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
        data: response.data,
        patientInfo: { ...patientData }
      }
      
      setAnalysisHistory(prev => [...prev, newAnalysis])
      setFile(null) // Clear file for next upload
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Error analyzing data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    if (analysisHistory.length === 0) return

    const doc = new jsPDF()
    let yPosition = 20
    
    // Title
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text('MediLens - Health Analysis Report', 14, yPosition)
    yPosition += 10
    
    // Patient Info
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(`Patient: ${patientData.name}`, 14, yPosition)
    yPosition += 7
    doc.text(`Age: ${patientData.age} | Gender: ${patientData.gender}`, 14, yPosition)
    yPosition += 7
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, yPosition)
    yPosition += 15
    
    // Vitals Analysis if available
    if (vitalsAnalysis) {
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Vitals Analysis', 14, yPosition)
      yPosition += 10
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(`Health Score: ${vitalsAnalysis.overallScore}/100`, 14, yPosition)
      yPosition += 10
      
      doc.setFont(undefined, 'normal')
      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Value', 'Status']],
        body: vitalsAnalysis.metrics.map(m => [m.name, m.value, m.status]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })
      
      yPosition = doc.lastAutoTable.finalY + 10
      
      if (vitalsAnalysis.riskFactors && vitalsAnalysis.riskFactors.length > 0) {
        doc.setFont(undefined, 'bold')
        doc.text('Risk Factors:', 14, yPosition)
        yPosition += 7
        doc.setFont(undefined, 'normal')
        vitalsAnalysis.riskFactors.forEach(risk => {
          const lines = doc.splitTextToSize(`• ${risk}`, 180)
          doc.text(lines, 14, yPosition)
          yPosition += lines.length * 5
        })
        yPosition += 5
      }
      
      doc.setFont(undefined, 'bold')
      doc.text('Summary:', 14, yPosition)
      yPosition += 7
      doc.setFont(undefined, 'normal')
      const summaryLines = doc.splitTextToSize(cleanMarkdown(vitalsAnalysis.summary), 180)
      doc.text(summaryLines, 14, yPosition)
      yPosition += summaryLines.length * 5 + 10
      
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
    }
    
    // Each Lab Analysis
    analysisHistory.forEach((analysis, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text(`Lab Report ${index + 1}: ${analysis.fileName}`, 14, yPosition)
      yPosition += 7
      doc.setFontSize(10)
      doc.setFont(undefined, 'italic')
      doc.text(analysis.timestamp, 14, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Value', 'Status']],
        body: analysis.data.metrics.map(m => [m.name, m.value, m.status]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })

      yPosition = doc.lastAutoTable.finalY + 10
      
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFont(undefined, 'bold')
      doc.text('Analysis Summary:', 14, yPosition)
      yPosition += 7
      doc.setFont(undefined, 'normal')
      const summary = doc.splitTextToSize(cleanMarkdown(analysis.data.summary), 180)
      doc.text(summary, 14, yPosition)
      yPosition += summary.length * 5 + 10

      if (analysis.data.recommendations) {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFont(undefined, 'bold')
        doc.text('Recommendations:', 14, yPosition)
        yPosition += 7
        doc.setFont(undefined, 'normal')
        const recs = doc.splitTextToSize(cleanMarkdown(analysis.data.recommendations), 180)
        doc.text(recs, 14, yPosition)
        yPosition += recs.length * 5 + 15
      }
    })

    doc.save(`MediLens_Report_${patientData.name}_${new Date().toISOString().split('T')[0]}.pdf`)
  }
  
  // Helper function to clean markdown formatting
  const cleanMarkdown = (text) => {
    if (!text) return ''
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold **text**
      .replace(/\*(.+?)\*/g, '$1') // Remove italic *text*
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links [text](url)
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      .trim()
  }

  const exportToExcel = () => {
    if (analysisHistory.length === 0) return

    const data = [
      ['MediLens - Health Analysis Report'],
      [],
      ['Patient Information'],
      ['Name', patientData.name],
      ['Age', patientData.age],
      ['Gender', patientData.gender],
      ['Date', new Date().toLocaleDateString()],
      []
    ]
    
    // Add vitals analysis
    if (vitalsAnalysis) {
      data.push(['=== VITALS ANALYSIS ==='])
      data.push(['Health Score', `${vitalsAnalysis.overallScore}/100`])
      data.push([])
      data.push(['Vital Metrics'])
      data.push(['Metric', 'Value', 'Status'])
      vitalsAnalysis.metrics.forEach(m => {
        data.push([m.name, m.value, m.status])
      })
      data.push([])
      
      if (vitalsAnalysis.riskFactors && vitalsAnalysis.riskFactors.length > 0) {
        data.push(['Risk Factors'])
        vitalsAnalysis.riskFactors.forEach(risk => {
          data.push([cleanMarkdown(risk)])
        })
        data.push([])
      }
      
      data.push(['Summary'])
      data.push([cleanMarkdown(vitalsAnalysis.summary)])
      data.push([])
      data.push(['Recommendations'])
      data.push([cleanMarkdown(vitalsAnalysis.recommendations)])
      data.push([])
      data.push([])
    }
    
    // Add each lab analysis
    analysisHistory.forEach((analysis, index) => {
      data.push([`=== LAB REPORT ${index + 1}: ${analysis.fileName} ===`])
      data.push(['Timestamp', analysis.timestamp])
      data.push([])
      data.push(['Health Metrics'])
      data.push(['Metric', 'Value', 'Status'])
      analysis.data.metrics.forEach(m => {
        data.push([m.name, m.value, m.status])
      })
      data.push([])
      data.push(['Summary'])
      data.push([cleanMarkdown(analysis.data.summary)])
      data.push([])
      data.push(['Recommendations'])
      data.push([cleanMarkdown(analysis.data.recommendations || 'N/A')])
      data.push([])
      data.push([])
    })

    const ws = XLSX.utils.aoa_to_sheet(data)
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 },
      { wch: 50 },
      { wch: 15 }
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Analysis Report')
    XLSX.writeFile(wb, `MediLens_Report_${patientData.name}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Chart data - show latest analysis
  const getChartData = () => {
    if (analysisHistory.length === 0) return null
    
    const latestAnalysis = analysisHistory[analysisHistory.length - 1].data

    const metricsData = {
      labels: latestAnalysis.metrics.map(m => m.name),
      datasets: [{
        label: 'Health Metrics',
        data: latestAnalysis.metrics.map(m => parseFloat(m.value) || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(251, 146, 60, 0.6)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 2
      }]
    }

    const riskData = {
      labels: ['Normal', 'At Risk', 'Critical'],
      datasets: [{
        data: [
          latestAnalysis.metrics.filter(m => m.status === 'Normal').length,
          latestAnalysis.metrics.filter(m => m.status === 'Warning').length,
          latestAnalysis.metrics.filter(m => m.status === 'Critical').length,
        ],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
      }]
    }

    return { metricsData, riskData }
  }

  const chartData = getChartData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">MediLens Dashboard</h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center text-gray-600 hover:text-gray-800 transition"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Details & Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter patient name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={patientData.gender}
                    onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Lab Report</h2>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {file ? file.name : 'Drag & drop your file here, or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mb-4">Supports PDF and image files</p>
              <input
                type="file"
                id="file-upload"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
              >
                Browse Files
              </label>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Analyze Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Vitals Entry Section */}
        {patientData.name && patientData.age && (
          <div className="mb-6">
            <CollapsibleSection
              title="Patient Vitals & Medical History"
              completed={vitalsAnalysis !== null}
              collapsed={vitalsCollapsed}
              onToggle={() => setVitalsCollapsed(!vitalsCollapsed)}
            >
              <VitalsForm
                vitals={vitals}
                onChange={setVitals}
                onSubmit={handleAnalyzeVitals}
                disabled={loadingVitals}
              />
            </CollapsibleSection>
          </div>
        )}

        {/* Vitals Analysis Display */}
        {vitalsAnalysis && (
          <div className="mb-6">
            <VitalsAnalysisDisplay analysis={vitalsAnalysis} />
          </div>
        )}

        {/* Analysis History - Show all analyses */}
        {analysisHistory.length > 0 && analysisHistory.map((analysis, index) => (
          <div key={analysis.id} className="mb-6">
            {/* Analysis Header with File Name */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Analysis #{index + 1}: {analysis.fileName}
                  </h3>
                  <p className="text-sm text-blue-100 mt-1">{analysis.timestamp}</p>
                </div>
                <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Lab Report
                </span>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="bg-white rounded-b-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {analysis.data.metrics.map((metric, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                    <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      metric.status === 'Normal' ? 'bg-green-100 text-green-800' :
                      metric.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary & Recommendations for this analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Analysis Summary</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{cleanMarkdown(analysis.data.summary)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {cleanMarkdown(analysis.data.recommendations) || 'No specific recommendations at this time.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Charts - Show latest analysis */}
        {chartData && analysisHistory.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Latest Health Metrics Overview</h2>
              <Bar
                data={chartData.metricsData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false }
                  }
                }}
              />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment</h2>
              <Doughnut
                data={chartData.riskData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {(analysisHistory.length > 0 || vitalsAnalysis) && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Complete Report</h2>
            <div className="flex gap-4">
              <button
                onClick={exportToPDF}
                className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                <Download className="h-5 w-5 mr-2" />
                Export as PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                <Download className="h-5 w-5 mr-2" />
                Export as Excel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Menu for Doctors */}
      {(vitalsAnalysis || analysisHistory.length > 0) && (
        <div className="fixed bottom-8 right-8 z-50">
          {showFloatingMenu && (
            <div className="mb-4 space-y-2 animate-fadeIn">
              <button
                className="w-full bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-between group"
                onClick={() => alert('Prescription suggestion feature - Coming soon!')}
              >
                <span className="font-medium">📝 Suggest Prescription</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded group-hover:bg-blue-200">AI</span>
              </button>
              <button
                className="w-full bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-between group"
                onClick={() => alert('Lab tests suggestion feature - Coming soon!')}
              >
                <span className="font-medium">🔬 Suggest Lab Tests</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded group-hover:bg-purple-200">AI</span>
              </button>
              <button
                className="w-full bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-between group"
                onClick={() => alert('Follow-up plan feature - Coming soon!')}
              >
                <span className="font-medium">📅 Generate Follow-up Plan</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded group-hover:bg-green-200">AI</span>
              </button>
              <button
                className="w-full bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-between group"
                onClick={() => alert('Referral letter feature - Coming soon!')}
              >
                <span className="font-medium">🏥 Draft Referral Letter</span>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded group-hover:bg-orange-200">AI</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110"
          >
            {showFloatingMenu ? (
              <span className="text-2xl">✕</span>
            ) : (
              <Activity className="h-6 w-6" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard
