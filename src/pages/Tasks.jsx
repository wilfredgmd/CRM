import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, CheckCircle, Clock, Calendar, AlertCircle, X, Pencil, Trash2, 
  Loader2, MoreVertical, Flag, ChevronDown, ChevronUp, User, Phone, Mail, 
  Briefcase, Users, Filter, ArrowRight, Paperclip, MessageSquare
} from 'lucide-react'
import useStore from '../store/useStore'

const TASK_TYPES = ['Call', 'Email', 'Follow-up', 'Demo', 'Task', 'Meeting']
const PRIORITIES = ['High', 'Medium', 'Low']
const ASSIGNEES = ['All', 'Admin', 'Priya', 'Rahul', 'Meera']

export default function Tasks() {
  const { tasks, contacts, deals, addTask, updateTask, deleteTask, fetchTasks, settings } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedTask, setExpandedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAssignee, setFilterAssignee] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterDueDate, setFilterDueDate] = useState('All')
  const [filterLinked, setFilterLinked] = useState('All')

  // Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Task',
    priority: 'Medium',
    dueDate: '',
    assignee: 'Admin',
    relatedTo: '',
    relatedId: '',
    notes: ''
  })

  useEffect(() => { fetchTasks() }, [])

  // Parse due date for comparison
  const parseDueDate = (dueDate) => {
    if (!dueDate) return null
    if (dueDate === 'Today') return new Date()
    if (dueDate === 'Tomorrow') return new Date(Date.now() + 86400000)
    if (dueDate === 'This Week') return new Date(Date.now() + 3 * 86400000)
    return new Date(dueDate)
  }

  const isOverdue = (task) => {
    if (task.status === 'Completed') return false
    const due = parseDueDate(task.dueDate)
    if (!due) return false
    return due < new Date().setHours(0,0,0,0)
  }

  const isDueToday = (task) => {
    if (task.status === 'Completed') return false
    const due = parseDueDate(task.dueDate)
    if (!due) return false
    const today = new Date().setHours(0,0,0,0)
    return due >= today && due < today + 86400000
  }

  const isUpcoming = (task) => {
    if (task.status === 'Completed') return false
    const due = parseDueDate(task.dueDate)
    if (!due) return false
    const tomorrow = new Date().setHours(0,0,0,0) + 86400000
    return due >= tomorrow
  }

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getRelatedName(task)?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAssignee = filterAssignee === 'All' || task.assignee === filterAssignee
    const matchesType = filterType === 'All' || task.type === filterType
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority
    const matchesLinked = filterLinked === 'All' || task.relatedTo === filterLinked
    
    let matchesDueDate = true
    if (filterDueDate === 'Today') matchesDueDate = isDueToday(task)
    else if (filterDueDate === 'This week') matchesDueDate = isDueToday(task) || isUpcoming(task)
    else if (filterDueDate === 'Overdue') matchesDueDate = isOverdue(task)
    
    return matchesSearch && matchesAssignee && matchesType && matchesPriority && matchesLinked && matchesDueDate
  })

  const overdueTasks = filteredTasks.filter(t => isOverdue(t))
  const dueTodayTasks = filteredTasks.filter(t => isDueToday(t))
  const upcomingTasks = filteredTasks.filter(t => isUpcoming(t))
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed')

  // Metrics
  const today = new Date().toDateString()
  const tasksDueToday = tasks.filter(t => isDueToday(t)).length
  const overdueCount = tasks.filter(t => isOverdue(t)).length
  const completedThisWeek = tasks.filter(t => {
    if (t.status !== 'Completed') return false
    const completed = t.completedAt || t.updatedAt
    if (!completed) return false
    const weekAgo = Date.now() - 7 * 86400000
    return new Date(completed).getTime() > weekAgo
  }).length
  const totalOpen = tasks.filter(t => t.status !== 'Completed').length
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0

  const getPriorityColor = (priority) => {
    const colors = {
      'High': { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA', icon: 'text-red-500' },
      'Medium': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', icon: 'text-amber-500' },
      'Low': { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE', icon: 'text-blue-500' },
    }
    return colors[priority] || colors['Medium']
  }

  const getTypeIcon = (type) => {
    const icons = { Call: Phone, Email: Mail, Demo: Users, Meeting: Users, 'Follow-up': ArrowRight, Task: CheckCircle }
    return icons[type] || CheckCircle
  }

  const getTypeColor = (type) => {
    const colors = { Call: 'bg-purple-100 text-purple-700', Email: 'bg-blue-100 text-blue-700', Demo: 'bg-green-100 text-green-700', Meeting: 'bg-indigo-100 text-indigo-700', 'Follow-up': 'bg-amber-100 text-amber-700', Task: 'bg-gray-100 text-gray-700' }
    return colors[type] || colors.Task
  }

  const getRelatedName = (task) => {
    if (!task.relatedTo || !task.relatedId) return null
    if (task.relatedTo === 'contact') {
      const c = contacts.find(c => c.id === task.relatedId)
      return c ? c.name : null
    }
    if (task.relatedTo === 'deal') {
      const d = deals.find(d => d.id === task.relatedId)
      return d ? d.name : null
    }
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingTask) {
      updateTask(editingTask.id, formData)
    } else {
      addTask({ ...formData, status: 'Pending', createdAt: new Date().toISOString() })
    }
    setShowModal(false)
    setEditingTask(null)
    setFormData({ title: '', description: '', type: 'Task', priority: 'Medium', dueDate: '', assignee: 'Admin', relatedTo: '', relatedId: '', notes: '' })
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      type: task.type || 'Task',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || '',
      assignee: task.assignee || 'Admin',
      relatedTo: task.relatedTo || '',
      relatedId: task.relatedId || '',
      notes: task.notes || ''
    })
    setShowModal(true)
  }

  const handleComplete = (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed'
    updateTask(task.id, { 
      status: newStatus, 
      completedAt: newStatus === 'Completed' ? new Date().toISOString() : null 
    })
  }

  const TaskRow = ({ task, showDueDate = true }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex items-center gap-3 p-3 bg-white rounded-xl border ${isOverdue(task) ? 'border-red-200 bg-red-50/30' : 'border-gray-100'} hover:shadow-md transition-all`}
    >
      <button
        onClick={() => handleComplete(task)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          task.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        {task.status === 'Completed' && <CheckCircle className="w-3 h-3 text-white" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{task.description}</p>
      </div>

      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority).bg} ${getPriorityColor(task.priority).text}`}>
        {task.priority}
      </span>

      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(task.type)}`}>
        {(() => { const Icon = getTypeIcon(task.type); return <Icon className="w-3 h-3" /> })()}
        {task.type}
      </span>

      {getRelatedName(task) && (
        <span className="text-xs text-blue-600 truncate max-w-[120px]">
          {getRelatedName(task)}
        </span>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
          {task.assignee?.charAt(0) || 'A'}
        </div>
        <span className="hidden sm:inline">{task.assignee}</span>
      </div>

      {showDueDate && (
        <span className={`text-xs font-medium ${isOverdue(task) ? 'text-red-600' : isDueToday(task) ? 'text-amber-600' : 'text-green-600'}`}>
          {isOverdue(task) && <AlertCircle className="w-3 h-3 inline mr-1" />}
          {task.dueDate}
        </span>
      )}

      <button onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)} className="p-1 hover:bg-gray-100 rounded">
        {expandedTask === task.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <button onClick={() => openEdit(task)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => deleteTask(task.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </motion.div>
  )

  const TaskSection = ({ title, tasks, icon: Icon, color, emptyMessage }) => (
    <div className="mb-6">
      <div className={`flex items-center gap-2 mb-3 px-4 py-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto px-2 py-0.5 bg-white/50 rounded-full text-xs font-medium">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">{emptyMessage}</p>
        ) : (
          tasks.map(task => (
            <div key={task.id}>
              <TaskRow task={task} />
              <AnimatePresence>
                {expandedTask === task.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-8 mt-2 p-4 bg-gray-50 rounded-lg text-sm space-y-2">
                      <p><span className="text-gray-500">Full description:</span> {task.description || 'No description'}</p>
                      <p><span className="text-gray-500">Created by:</span> {task.assignee} on {new Date(task.createdAt || Date.now()).toLocaleDateString()}</p>
                      {task.notes && <p><span className="text-gray-500">Notes:</span> {task.notes}</p>}
                      {task.relatedTo && (
                        <p><span className="text-gray-500">Related to:</span> {task.relatedTo} - {getRelatedName(task)}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your activities and deadlines</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Calendar className="w-4 h-4" /> Due Today</div>
            <p className="text-2xl font-bold text-gray-900">{tasksDueToday}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-red-500 text-sm mb-1"><AlertCircle className="w-4 h-4" /> Overdue</div>
            <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Clock className="w-4 h-4" /> Open This Week</div>
            <p className="text-2xl font-bold text-gray-900">{totalOpen}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><CheckCircle className="w-4 h-4" /> Completed</div>
            <p className="text-2xl font-bold text-green-600">{completedThisWeek}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Flag className="w-4 h-4" /> Completion Rate</div>
            <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Assignee</label>
                  <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="All">All Types</option>
                    {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Priority</label>
                  <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="All">All Priorities</option>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
                  <select value={filterDueDate} onChange={e => setFilterDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="This week">This Week</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Linked To</label>
                  <select value={filterLinked} onChange={e => setFilterLinked(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="All">All</option>
                    <option value="contact">Contacts</option>
                    <option value="deal">Deals</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Sections */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <TaskSection 
            title="Overdue" 
            tasks={overdueTasks} 
            icon={AlertCircle} 
            color="bg-red-100 text-red-700"
            emptyMessage="No overdue tasks - great job!"
          />
          
          <TaskSection 
            title="Due Today" 
            tasks={dueTodayTasks} 
            icon={Clock} 
            color="bg-amber-100 text-amber-700"
            emptyMessage="No tasks due today"
          />
          
          <TaskSection 
            title="Upcoming" 
            tasks={upcomingTasks} 
            icon={Calendar} 
            color="bg-green-100 text-green-700"
            emptyMessage="No upcoming tasks"
          />
          
          <TaskSection 
            title="Completed" 
            tasks={completedTasks} 
            icon={CheckCircle} 
            color="bg-gray-100 text-gray-700"
            showDueDate={false}
            emptyMessage="No completed tasks yet"
          />
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Follow up with Priya"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={2}
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input 
                      type="date" 
                      value={formData.dueDate} 
                      onChange={e => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                    <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      {ASSIGNEES.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
                    <select 
                      value={formData.relatedTo} 
                      onChange={e => setFormData({...formData, relatedTo: e.target.value, relatedId: ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">None</option>
                      <option value="contact">Contact</option>
                      <option value="deal">Deal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select {formData.relatedTo || 'Item'}</label>
                    <select 
                      value={formData.relatedId} 
                      onChange={e => setFormData({...formData, relatedId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={!formData.relatedTo}
                    >
                      <option value="">Select...</option>
                      {formData.relatedTo === 'contact' && contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      {formData.relatedTo === 'deal' && deals.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    rows={3}
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Additional notes, reminders, attachments info..."
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
