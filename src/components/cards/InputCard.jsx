import { motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { useState } from 'react'

export default function InputCard({ placeholder = 'Type something...', onSubmit, onCancel, className = '' }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && onSubmit) {
      onSubmit(value)
      setValue('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -2 }}
      transition={{ duration: 0.3 }}
      className={`premium-card ${className}`}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-primary-black placeholder-gray-400 text-sm"
          />
          {value && onCancel && (
            <button
              type="button"
              onClick={() => {
                setValue('')
                onCancel()
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!value.trim()}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-accent-blue to-accent-blue-dark flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  )
}
