import { motion } from 'framer-motion'

export default function BaseCard({ children, className = '', onClick = null }) {
  return (
    <motion.div
      whileHover={{ translateY: -2 }}
      transition={{ duration: 0.3 }}
      className={`premium-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
