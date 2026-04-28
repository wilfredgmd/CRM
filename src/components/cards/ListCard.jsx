import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function ListCard({ title, items, onItemClick, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -2 }}
      transition={{ duration: 0.3 }}
      className={`premium-card ${className}`}
    >
      <div className="p-6">
        {title && <h3 className="font-semibold text-primary-black mb-4">{title}</h3>}
        <div className="space-y-2">
          {items.map((item, index) => (
            <motion.button
              key={item.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onItemClick && onItemClick(item)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                {item.icon && (
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-primary-black">{item.label}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-accent-blue transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
