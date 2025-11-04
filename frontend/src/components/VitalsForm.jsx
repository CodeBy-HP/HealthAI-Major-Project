import { Heart, Activity } from 'lucide-react'

const VitalsForm = ({ vitals, onChange, onSubmit, disabled = false }) => {
  const handleChange = (field, value) => {
    onChange({ ...vitals, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Vital Signs */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Vital Signs
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Systolic BP *
            </label>
            <input
              type="number"
              value={vitals.systolic || ''}
              onChange={(e) => handleChange('systolic', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="120"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diastolic BP *
            </label>
            <input
              type="number"
              value={vitals.diastolic || ''}
              onChange={(e) => handleChange('diastolic', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="80"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heart Rate * (bpm)
            </label>
            <input
              type="number"
              value={vitals.heartRate || ''}
              onChange={(e) => handleChange('heartRate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="72"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              value={vitals.temperature || ''}
              onChange={(e) => handleChange('temperature', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="98.6"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resp. Rate (breaths/min)
            </label>
            <input
              type="number"
              value={vitals.respiratoryRate || ''}
              onChange={(e) => handleChange('respiratoryRate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="16"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SpO2 (%)
            </label>
            <input
              type="number"
              value={vitals.oxygenSaturation || ''}
              onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="98"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={vitals.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="70"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={vitals.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="175"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-500" />
          Medical History (Optional)
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vitals.heartDisease || false}
                onChange={(e) => handleChange('heartDisease', e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={disabled}
              />
              <span className="text-sm text-gray-700">Heart Disease</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vitals.diabetes || false}
                onChange={(e) => handleChange('diabetes', e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={disabled}
              />
              <span className="text-sm text-gray-700">Diabetes</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vitals.hypertension || false}
                onChange={(e) => handleChange('hypertension', e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={disabled}
              />
              <span className="text-sm text-gray-700">Hypertension</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vitals.asthma || false}
                onChange={(e) => handleChange('asthma', e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={disabled}
              />
              <span className="text-sm text-gray-700">Asthma</span>
            </label>
          </div>
          <input
            type="text"
            value={vitals.otherConditions || ''}
            onChange={(e) => handleChange('otherConditions', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Other conditions (comma separated)..."
            disabled={disabled}
          />
          <input
            type="text"
            value={vitals.allergies || ''}
            onChange={(e) => handleChange('allergies', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Allergies (if any)..."
            disabled={disabled}
          />
        </div>
      </div>

      {!disabled && onSubmit && (
        <button
          onClick={onSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
        >
          <Activity className="h-5 w-5 mr-2" />
          Analyze Patient Vitals
        </button>
      )}
    </div>
  )
}

export default VitalsForm
