import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Calendar, User, Building2, DollarSign, Percent, Clock, 
  FileText, CheckCircle, Phone, Mail, MoreVertical, Plus, Edit2,
  Paperclip, Send, Users, Target, TrendingUp, AlertCircle, MessageSquare,
  ChevronRight, ChevronDown, Link2, Tag, Trash2, X, Save
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

// Deal Detail Page - Comprehensive view as requested
export default function DealDetail() {
  const { dealId } = useParams()
  const navigate = useNavigate()
  const { deals, contacts, tasks, fetchDeals, fetchContacts, fetchTasks, updateDeal, settings } = useStore()
  
  const [deal, setDeal] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [newNote, setNewNote] = useState('')
  const [newTask, setNewTask] = useState({ title: '', dueDate: '' })
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    fetchDeals()
    fetchContacts()
    fetchTasks()
  }, [])

  useEffect(() => {
    const found = deals.find(d => d.id === dealId)
    if (found) {
      setDeal(found)
      setEditForm(found)
    }
  }, [dealId, deals])

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal not found</h2>
          <button onClick={() => navigate('/deals')} className="btn-primary">Back to Deals</button>
        </div>
      </div>
    )
  }

  const currency = settings?.currency || '₹'
  const dealAge = Math.floor((Date.now() - new Date(deal.createdAt || Date.now())) / (1000 * 60 * 60 * 24))
  
  // Filter related data
  const relatedContact = contacts.find(c => c.id === deal.contactId || c.name === deal.contactName)
  const dealTasks = tasks.filter(t => t.relatedId === dealId || t.title?.includes(deal.company))
  
  const dealStages = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
  const currentStageIndex = dealStages.indexOf(deal.stage)

  const stageColors = {
    'Qualification': 'bg-blue-500',
    'Proposal': 'bg-amber-500',
    'Negotiation': 'bg-purple-500',
    'Closed Won': 'bg-green-500',
    'Closed Lost': 'bg-red-500'
  }

  const handleSave = () => {
    updateDeal(deal.id, editForm)
    setIsEditing(false)
  }

  const handleStageChange = (newStage) => {
    const probabilityMap = { 'Qualification': 10, 'Proposal': 40, 'Negotiation': 70, 'Closed Won': 100, 'Closed Lost': 0 }
    updateDeal(deal.id, { stage: newStage, probability: probabilityMap[newStage] })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'activity', label: 'Activity Timeline', icon: Clock },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="p-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/deals')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${stageColors[deal.stage]}`}>
                  {deal.stage}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ID: {deal.id?.slice(-8)} • Created {dealAge} days ago • Owner: {settings?.userName || 'Admin'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Proposal
              </button>
            </div>
          </div>

          {/* Pipeline Stage Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {dealStages.map((stage, idx) => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  className={`flex-1 text-center py-2 text-xs font-medium transition-all ${
                    idx <= currentStageIndex ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
              {dealStages.map((stage, idx) => (
                <div
                  key={stage}
                  className={`flex-1 h-full transition-all ${
                    idx <= currentStageIndex ? stageColors[stage] : 'bg-gray-100'
                  } ${idx < currentStageIndex ? '' : idx === currentStageIndex ? 'rounded-r-full' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <DollarSign className="w-4 h-4" /> Deal Value
            </div>
            <p className="text-2xl font-bold text-gray-900">{currency}{Number(deal.value || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Percent className="w-4 h-4" /> Win Probability
            </div>
            <p className="text-2xl font-bold text-gray-900">{deal.probability}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Calendar className="w-4 h-4" /> Expected Close
            </div>
            <p className="text-lg font-semibold text-gray-900">{deal.expectedClose || 'Not set'}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Clock className="w-4 h-4" /> Deal Age
            </div>
            <p className="text-lg font-semibold text-gray-900">{dealAge} days</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Deal Details */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Deal Name</label>
                      {isEditing ? (
                        <input 
                          value={editForm.name || ''} 
                          onChange={e => setEditForm({...editForm, name: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{deal.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Company</label>
                      {isEditing ? (
                        <input 
                          value={editForm.company || ''} 
                          onChange={e => setEditForm({...editForm, company: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{deal.company || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Contact Person</label>
                      {isEditing ? (
                        <input 
                          value={editForm.contactName || ''} 
                          onChange={e => setEditForm({...editForm, contactName: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{deal.contactName || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Source</label>
                      <p className="font-medium text-gray-900">{deal.source || 'Direct'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Expected Close</label>
                      {isEditing ? (
                        <input 
                          type="date"
                          value={editForm.expectedClose || ''} 
                          onChange={e => setEditForm({...editForm, expectedClose: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{deal.expectedClose || 'Not set'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Currency</label>
                      <p className="font-medium text-gray-900">{currency} ({settings?.currencyCode || 'INR'})</p>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                      <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Notes & Intelligence</h3>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editForm.notes || ''}
                      onChange={e => setEditForm({...editForm, notes: e.target.value})}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Add strategic intelligence about competitors, blockers, decision makers..."
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {deal.notes || 'No notes added yet. Add intelligence about competitors, decision makers, and blockers here.'}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Activity Timeline */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Deal created</p>
                      <p className="text-xs text-gray-500">{new Date(deal.createdAt || Date.now()).toLocaleString()}</p>
                    </div>
                  </div>
                  {deal.stage !== 'Qualification' && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Moved to {deal.stage}</p>
                        <p className="text-xs text-gray-500">Stage updated</p>
                      </div>
                    </div>
                  )}
                  {relatedContact && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Contact added</p>
                        <p className="text-xs text-gray-500">{relatedContact.name} from {relatedContact.company}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tasks for this Deal</h3>
                  <button 
                    onClick={() => setShowTaskForm(!showTaskForm)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </div>
                
                {showTaskForm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <input
                      type="text"
                      placeholder="Task title..."
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {dealTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No tasks yet. Add tasks to track follow-ups.</p>
                  ) : (
                    dealTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <button className={`w-5 h-5 rounded border-2 flex items-center justify-center ${task.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                          {task.status === 'Completed' && <CheckCircle className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                          <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{task.priority}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacts on this Deal</h3>
                {relatedContact ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {relatedContact.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{relatedContact.name}</h4>
                            <p className="text-sm text-gray-500">{relatedContact.title} • {relatedContact.company}</p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Decision Maker</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <a href={`mailto:${relatedContact.email}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                            <Mail className="w-4 h-4" /> {relatedContact.email}
                          </a>
                          <a href={`tel:${relatedContact.phone}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                            <Phone className="w-4 h-4" /> {relatedContact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No contacts linked to this deal.</p>
                )}
                <button className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Another Contact
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">
                  <Mail className="w-4 h-4" /> Send Email
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">
                  <Phone className="w-4 h-4" /> Log Call
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100">
                  <Calendar className="w-4 h-4" /> Schedule Meeting
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">
                  <Paperclip className="w-4 h-4" /> Attach Document
                </button>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{deal.company || 'Unknown Company'}</p>
                  <p className="text-xs text-gray-500">Industry: Technology</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Size</span>
                  <span className="text-gray-900">50-200 employees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900">Mumbai, India</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Website</span>
                  <a href="#" className="text-blue-600 hover:underline">{deal.company?.toLowerCase().replace(/\s/g, '')}.com</a>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Documents</h3>
                <button className="text-blue-600 text-xs font-medium hover:underline">+ Add</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Proposal_v1.pdf</p>
                    <p className="text-xs text-gray-500">Sent 2 days ago</p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Sent</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <FileText className="w-8 h-8 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Contract_Template.docx</p>
                    <p className="text-xs text-gray-500">Draft</p>
                  </div>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Draft</span>
                </div>
              </div>
            </div>

            {/* Competitors */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Competitors</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700">Competitor A</span>
                  <span className="text-xs text-red-600 font-medium">Higher price</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                  <span className="text-sm text-gray-700">Competitor B</span>
                  <span className="text-xs text-amber-600 font-medium">Less features</span>
                </div>
              </div>
              <button className="mt-3 w-full py-2 text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-lg">
                + Add Competitor
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
