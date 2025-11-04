import { useState } from 'react'
import { Stethoscope, Upload, Sparkles, Loader2, X } from 'lucide-react'

const DoctorWorkspace = ({ 
  symptoms = [], 
  medicines = [],
  onAddSymptom,
  onAddMedicine,
  onRemoveSymptom,
  onRemoveMedicine,
  onUploadLab,
  onComprehensiveAnalysis,
  loading = {}
}) => {
  const [symptomInput, setSymptomInput] = useState('')
  const [medicineInput, setMedicineInput] = useState('')

  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      onAddSymptom(symptomInput.trim())
      setSymptomInput('')
    }
  }

  const handleAddMedicine = () => {
    if (medicineInput.trim()) {
      onAddMedicine(medicineInput.trim())
      setMedicineInput('')
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Stethoscope className="h-6 w-6 mr-2 text-purple-600" />
        Doctor's Workspace
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Symptoms Entry */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Symptoms
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., chest pain"
            />
            <button
              onClick={handleAddSymptom}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Add
            </button>
          </div>
          {symptoms.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {symptoms.map((symptom, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-blue-50 px-2 py-1.5 rounded group">
                  <span className="flex-1">{symptom}</span>
                  <button
                    onClick={() => onRemoveSymptom(idx)}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3 w-3 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicine Suggestions */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggest Medicine
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={medicineInput}
              onChange={(e) => setMedicineInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMedicine()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., Aspirin 75mg"
            />
            <button
              onClick={handleAddMedicine}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              Add
            </button>
          </div>
          {medicines.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {medicines.map((medicine, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-green-50 px-2 py-1.5 rounded group">
                  <span className="flex-1">{medicine}</span>
                  <button
                    onClick={() => onRemoveMedicine(idx)}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3 w-3 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lab Report Upload */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Lab Report
          </label>
          <input
            type="file"
            id="doctor-lab-upload"
            accept=".pdf,image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUploadLab(e.target.files[0])
                e.target.value = '' // Reset input
              }
            }}
            className="hidden"
          />
          <label
            htmlFor="doctor-lab-upload"
            className="flex items-center justify-center w-full bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition text-sm font-medium"
          >
            {loading.lab ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center">
            PDF or Image
          </p>
        </div>

        {/* Comprehensive Analysis */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Prediction
          </label>
          <button
            onClick={onComprehensiveAnalysis}
            disabled={loading.prediction}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 text-sm font-medium flex items-center justify-center"
          >
            {loading.prediction ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze All
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Comprehensive AI Analysis
          </p>
        </div>
      </div>
    </div>
  )
}

export default DoctorWorkspace
