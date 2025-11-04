import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

const CollapsibleSection = ({ 
  title, 
  completed = false, 
  collapsed = false, 
  onToggle, 
  children,
  badge = null 
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {completed && <CheckCircle className="h-5 w-5 text-green-600" />}
          {badge && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {collapsed ? 
          <ChevronDown className="h-5 w-5 text-gray-400" /> : 
          <ChevronUp className="h-5 w-5 text-gray-400" />
        }
      </div>
      {!collapsed && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-6">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollapsibleSection
