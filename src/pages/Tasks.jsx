import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Clock, CheckCircle2, AlertCircle, Sparkles, Calendar } from 'lucide-react'
import useStore from '../store/useStore'
import Navbar from '../components/Navbar'

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityColor = (priority) => {
    const colors = {
      'High': { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
      'Medium': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
      'Low': { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' },
    }
    return colors[priority] || { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' }
  }

  const aiSuggestions = [
    { id: 1, title: 'Prioritize high-priority tasks', description: 'You have 3 high-priority tasks overdue' },
    { id: 2, title: 'Schedule follow-up calls', description: '5 leads need follow-up this week' },
  ]

  // Summary stats
  const summaryStats = [
    { label: 'Total Tasks', value: tasks.length, explanation: 'All tasks in system', progress: 75, color: '#2563EB' },
    { label: 'Due Today', value: tasks.filter(t => t.dueDate === 'Today').length, explanation: 'Tasks due today', progress: 50, color: '#D97706' },
    { label: 'Overdue', value: tasks.filter(t => t.status === 'Pending').length, explanation: 'Past due date', progress: 30, color: '#DC2626' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, explanation: 'Finished tasks', progress: 85, color: '#16A34A' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">Manage your activities and deadlines</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-explanation">{stat.explanation}</div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill" style={{ width: `${stat.progress}%`, backgroundColor: stat.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* AI Task Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ai-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-2">AI Task Suggestions</h3>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between p-3 rounded-xl bg-white/80">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{suggestion.title}</p>
                      <p className="text-xs text-gray-500">{suggestion.description}</p>
                    </div>
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Task Cards */}
        <div className="section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-5 ${task.status === 'Completed' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateTask(task.id, { status: task.status === 'Completed' ? 'Pending' : 'Completed' })}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'Completed' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ backgroundColor: getPriorityColor(task.priority).bg, color: getPriorityColor(task.priority).text, borderColor: getPriorityColor(task.priority).border }}
                  >
                    {task.priority}
                  </span>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>

              <h3 className={`text-base font-semibold mb-2 ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {task.title}
              </h3>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {task.dueDate || 'No due date'}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.status}
                </span>
                {task.priority === 'High' && task.status !== 'Completed' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
