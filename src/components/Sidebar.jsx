import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckSquare, 
  BarChart3,
  Phone,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: TrendingUp },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Deals', href: '/deals', icon: DollarSign },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Calls', href: '/calls', icon: Phone },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'AI Insights', href: '/ai-insights', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const sidebarVariants = {
    expanded: { width: 260, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    collapsed: { width: 80, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="expanded"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-50 shadow-glass lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200/50">
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-dark flex items-center justify-center shadow-glow">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-black to-primary-blue bg-clip-text text-transparent">
                    Nexus AI
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`relative group ${isActive ? 'sidebar-item-active' : 'sidebar-item'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center"
                  >
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-accent-blue text-white shadow-glow' : 'text-gray-500 group-hover:text-accent-blue'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.span
                          variants={itemVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className="ml-3 font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-blue rounded-r-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200/50">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-300 cursor-pointer ${!isExpanded ? 'justify-center' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-dark flex items-center justify-center text-white font-semibold shadow-glow">
                U
              </div>
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    variants={itemVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="ml-3"
                  >
                    <p className="font-medium text-sm text-primary-black">User</p>
                    <p className="text-xs text-gray-500">Pro Plan</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-dark text-white shadow-glow flex items-center justify-center z-50"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    </>
  )
}
