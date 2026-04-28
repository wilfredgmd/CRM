import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Lightbulb, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'suggestion',
      icon: Lightbulb,
      iconColor: 'text-yellow-500',
      title: 'Smart Suggestion',
      content: 'Based on recent activity, consider following up with Alice Brown. Her lead score increased by 15% this week.',
      action: 'Schedule Call',
    },
    {
      id: 2,
      type: 'insight',
      icon: TrendingUp,
      iconColor: 'text-green-500',
      title: 'Performance Insight',
      content: 'Your conversion rate improved by 8% this month. Focus on the Proposal stage for maximum impact.',
      action: 'View Details',
    },
    {
      id: 3,
      type: 'alert',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      title: 'Attention Needed',
      content: '3 high-priority tasks are overdue. Consider delegating or rescheduling.',
      action: 'View Tasks',
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const panelVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    closed: { 
      x: 400, 
      opacity: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
  }

  const messageVariants = {
    enter: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    center: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 20, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
  }

  const handleAction = (action) => {
    console.log('Action:', action)
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        type: 'user',
        content: inputValue,
      }])
      setInputValue('')
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed right-6 z-50 rounded-2xl shadow-glow flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bottom-6 w-14 h-14' : 'bottom-6 w-16 h-16'
        } ${isMinimized ? 'bottom-24' : 'bottom-6'} bg-gradient-to-br from-accent-blue to-accent-blue-dark text-white`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="sparkles"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="relative"
            >
              <Sparkles className="w-8 h-8" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-6 top-6 bottom-24 w-96 bg-white/90 backdrop-blur-xl rounded-3xl shadow-glass border border-gray-200/50 z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-dark flex items-center justify-center shadow-glow">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-black">AI Assistant</h3>
                    <p className="text-xs text-gray-500">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
                >
                  {isMinimized ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-xl bg-white/50">
                  <p className="text-lg font-bold text-accent-blue">12</p>
                  <p className="text-xs text-gray-500">Leads</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/50">
                  <p className="text-lg font-bold text-green-500">85%</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/50">
                  <p className="text-lg font-bold text-purple-500">3</p>
                  <p className="text-xs text-gray-500">Tasks</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <AnimatePresence mode="wait">
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className={`p-4 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-accent-blue text-white ml-8' 
                          : 'bg-gray-50 border border-gray-200/50'
                      }`}
                    >
                      {message.type !== 'user' && (
                        <div className="flex items-start space-x-3 mb-2">
                          <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                            <message.icon className={`w-4 h-4 ${message.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-primary-black">{message.title}</p>
                          </div>
                        </div>
                      )}
                      <p className={`text-sm ${message.type === 'user' ? 'text-white/90' : 'text-gray-600'}`}>
                        {message.content}
                      </p>
                      {message.action && (
                        <button
                          onClick={() => handleAction(message.action)}
                          className="mt-3 text-sm font-medium text-accent-blue hover:text-accent-blue-dark transition-colors"
                        >
                          {message.action} →
                        </button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <AnimatePresence mode="wait">
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-4 border-t border-gray-200/50"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask AI anything..."
                      className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-3 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-dark text-white shadow-glow hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
