import { useState } from 'react'
import { Activity, Upload, LogOut, FileText, Download, Loader2 } from 'lucide-react'
import axios from 'axios'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = ({ onLogout }) => {
  const [file, setFile] = useState(null)
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: 'male',
  })
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

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
      setAnalysisResult(response.data)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Error analyzing data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    if (!analysisResult) return

    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('MediLens - Health Analysis Report', 14, 20)
    
    doc.setFontSize(12)
    doc.text(`Patient: ${patientData.name}`, 14, 35)
    doc.text(`Age: ${patientData.age} | Gender: ${patientData.gender}`, 14, 42)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 49)
    
    doc.autoTable({
      startY: 60,
      head: [['Metric', 'Value', 'Status']],
      body: analysisResult.metrics.map(m => [m.name, m.value, m.status])
    })

    doc.text('Analysis Summary:', 14, doc.lastAutoTable.finalY + 15)
    const summary = doc.splitTextToSize(analysisResult.summary, 180)
    doc.text(summary, 14, doc.lastAutoTable.finalY + 22)

    if (analysisResult.recommendations) {
      doc.text('Recommendations:', 14, doc.lastAutoTable.finalY + 45)
      const recs = doc.splitTextToSize(analysisResult.recommendations, 180)
      doc.text(recs, 14, doc.lastAutoTable.finalY + 52)
    }

    doc.save(`MediLens_Report_${patientData.name}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const exportToExcel = () => {
    if (!analysisResult) return

    const data = [
      ['MediLens - Health Analysis Report'],
      [],
      ['Patient Information'],
      ['Name', patientData.name],
      ['Age', patientData.age],
      ['Gender', patientData.gender],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['Health Metrics'],
      ['Metric', 'Value', 'Status'],
      ...analysisResult.metrics.map(m => [m.name, m.value, m.status]),
      [],
      ['Summary'],
      [analysisResult.summary],
      [],
      ['Recommendations'],
      [analysisResult.recommendations || 'N/A']
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Analysis Report')
    XLSX.writeFile(wb, `MediLens_Report_${patientData.name}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Chart data
  const getChartData = () => {
    if (!analysisResult) return null

    const metricsData = {
      labels: analysisResult.metrics.map(m => m.name),
      datasets: [{
        label: 'Health Metrics',
        data: analysisResult.metrics.map(m => parseFloat(m.value) || 0),
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
          analysisResult.metrics.filter(m => m.status === 'Normal').length,
          analysisResult.metrics.filter(m => m.status === 'Warning').length,
          analysisResult.metrics.filter(m => m.status === 'Critical').length,
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

        {/* Analysis Results */}
        {analysisResult && (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {analysisResult.metrics.map((metric, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-4">
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

            {/* Charts */}
            {chartData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Health Metrics Overview</h2>
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

            {/* Summary & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Analysis Summary</h2>
                <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h2>
                <p className="text-gray-700 leading-relaxed">
                  {analysisResult.recommendations || 'No specific recommendations at this time.'}
                </p>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Report</h2>
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
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
