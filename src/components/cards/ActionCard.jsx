import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function ActionCard({ icon: Icon, title, description, onClick, className = '' }) {
  return (
    <motion.div
      whileHover={{ translateY: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`premium-card cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="p-6">
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-dark flex items-center justify-center mb-4 shadow-glow">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <h3 className="font-semibold text-primary-black mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-accent-blue font-medium text-sm">
          <span>Get started</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </motion.div>
  )
}
