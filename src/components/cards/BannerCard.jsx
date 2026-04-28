import { motion } from 'framer-motion'
import { X, Info, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react'

export default function BannerCard({ type = 'info', title, message, actionText, onAction, onDismiss, className = '' }) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    insight: Sparkles,
  }

  const colors = {
    info: 'from-blue-500 to-blue-600',
    warning: 'from-yellow-500 to-yellow-600',
    success: 'from-green-500 to-green-600',
    insight: 'from-accent-blue to-accent-blue-dark',
  }

  const bgColors = {
    info: 'bg-blue-50',
    warning: 'bg-yellow-50',
    success: 'bg-green-50',
    insight: 'bg-blue-50',
  }

  const Icon = icons[type] || Info

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`${bgColors[type]} rounded-2xl border border-gray-200/50 ${className}`}
    >
      <div className="p-6 flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[type]} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary-black mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{message}</p>
          <div className="flex items-center space-x-3">
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="btn-primary text-sm py-2 px-4"
              >
                {actionText}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
