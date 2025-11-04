import { Doughnut } from 'react-chartjs-2'
import { TrendingUp, AlertCircle } from 'lucide-react'

const VitalsAnalysisDisplay = ({ analysis }) => {
  if (!analysis) return null

  const scoreData = {
    datasets: [{
      data: [analysis.overallScore, 100 - analysis.overallScore],
      backgroundColor: ['#3b82f6', '#e5e7eb'],
      borderWidth: 0
    }]
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
        Vitals Analysis Dashboard
      </h2>
      
      {/* Health Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Overall Health Score</p>
            <p className="text-4xl font-bold text-blue-600">
              {analysis.overallScore}/100
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on vital signs analysis
            </p>
          </div>
          <div className="w-24 h-24">
            <Doughnut
              data={scoreData}
              options={{
                cutout: '70%',
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                maintainAspectRatio: true
              }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {analysis.metrics && analysis.metrics.map((metric, idx) => (
          <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
            <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">{metric.value}</p>
            <span className={`inline-block text-xs px-2 py-1 rounded ${
              metric.status === 'Normal' ? 'bg-green-100 text-green-800' :
              metric.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {metric.status}
            </span>
          </div>
        ))}
      </div>

      {/* Risk Factors */}
      {analysis.riskFactors && analysis.riskFactors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
            Risk Factors Identified
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.riskFactors.map((risk, idx) => (
              <li key={idx} className="text-sm text-gray-700">{risk}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Analysis Summary</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{analysis.recommendations}</p>
        </div>
      </div>
    </div>
  )
}

export default VitalsAnalysisDisplay
