import { Pill, TestTube, Calendar, Sparkles } from 'lucide-react'

const AISuggestionDisplay = ({ suggestion }) => {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'prescription':
        return <Pill className="h-5 w-5" />
      case 'lab-tests':
        return <TestTube className="h-5 w-5" />
      case 'followup':
        return <Calendar className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  const getTitle = () => {
    switch (suggestion.type) {
      case 'prescription':
        return 'AI-Suggested Prescription'
      case 'lab-tests':
        return 'AI-Recommended Lab Tests'
      case 'followup':
        return 'AI-Generated Follow-up Plan'
      default:
        return 'AI Suggestion'
    }
  }

  const getBadgeColor = () => {
    switch (suggestion.type) {
      case 'prescription':
        return 'bg-blue-100 text-blue-800'
      case 'lab-tests':
        return 'bg-purple-100 text-purple-800'
      case 'followup':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getGradient = () => {
    switch (suggestion.type) {
      case 'prescription':
        return 'from-blue-500 to-blue-600'
      case 'lab-tests':
        return 'from-purple-500 to-purple-600'
      case 'followup':
        return 'from-green-500 to-green-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getGradient()} text-white rounded-t-lg p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              {getIcon()}
              <span className="ml-2">{getTitle()}</span>
            </h3>
            <p className="text-sm text-blue-100 mt-1">{suggestion.timestamp}</p>
          </div>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Powered
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-lg shadow p-6">
        {/* Prescription Display */}
        {suggestion.type === 'prescription' && (
          <div className="space-y-6">
            {suggestion.data.medications && suggestion.data.medications.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Pill className="h-4 w-4 mr-2 text-blue-600" />
                  Recommended Medications
                </h4>
                <div className="space-y-3">
                  {suggestion.data.medications.map((med, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{med.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{med.dosage}</p>
                          <p className="text-sm text-gray-600">{med.frequency}</p>
                          <p className="text-sm text-gray-600">{med.duration}</p>
                        </div>
                        {med.priority && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            med.priority === 'High' ? 'bg-red-100 text-red-800' :
                            med.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {med.priority}
                          </span>
                        )}
                      </div>
                      {med.notes && (
                        <p className="text-sm text-gray-500 mt-2 italic">{med.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestion.data.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Important Notes</h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{suggestion.data.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Lab Tests Display */}
        {suggestion.type === 'lab-tests' && (
          <div className="space-y-6">
            {suggestion.data.tests && suggestion.data.tests.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <TestTube className="h-4 w-4 mr-2 text-purple-600" />
                  Recommended Tests
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestion.data.tests.map((test, idx) => (
                    <div key={idx} className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-800">{test.name}</p>
                        {test.urgency && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            test.urgency === 'Urgent' ? 'bg-red-100 text-red-800' :
                            test.urgency === 'Soon' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {test.urgency}
                          </span>
                        )}
                      </div>
                      {test.reason && (
                        <p className="text-sm text-gray-600">{test.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestion.data.instructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{suggestion.data.instructions}</p>
              </div>
            )}
          </div>
        )}

        {/* Follow-up Plan Display */}
        {suggestion.type === 'followup' && (
          <div className="space-y-6">
            {suggestion.data.schedule && suggestion.data.schedule.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-green-600" />
                  Follow-up Schedule
                </h4>
                <div className="space-y-3">
                  {suggestion.data.schedule.map((item, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.timeframe}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.action}</p>
                          {item.details && (
                            <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestion.data.monitoring && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Ongoing Monitoring</h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{suggestion.data.monitoring}</p>
              </div>
            )}

            {suggestion.data.goals && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Health Goals</h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{suggestion.data.goals}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AISuggestionDisplay
