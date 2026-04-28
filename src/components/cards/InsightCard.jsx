import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export default function InsightCard({ type = 'suggestion', title, description, actionText, onAction, className = '' }) {
  const icons = {
    suggestion: Sparkles,
    positive: TrendingUp,
    warning: AlertTriangle,
    success: CheckCircle,
  }

  const colors = {
    suggestion: 'from-blue-500 to-blue-600',
    positive: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    success: 'from-emerald-500 to-emerald-600',
  }

  const Icon = icons[type] || Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -2 }}
      transition={{ duration: 0.3 }}
      className={`premium-card ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[type]} flex items-center justify-center shadow-glow flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary-black mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="text-accent-blue font-medium text-sm hover:text-accent-blue-dark transition-colors"
              >
                {actionText} →
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
