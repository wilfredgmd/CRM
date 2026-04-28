import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Sparkles, Phone, Mail } from 'lucide-react'
import useStore from '../store/useStore'
import Navbar from '../components/Navbar'

const leadStages = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost']

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedLead, setExpandedLead] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const leadsWithScores = leads.map(lead => ({
    ...lead,
    score: Math.floor(Math.random() * 30) + 70,
  }))

  const filteredLeads = leadsWithScores.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStatusChange = (leadId, newStatus) => {
    updateLead(leadId, { status: newStatus })
  }

  const getScoreColor = (score) => {
    if (score >= 85) return { bg: '#DCFCE7', text: '#16A34A' }
    if (score >= 70) return { bg: '#FEF3C7', text: '#D97706' }
    return { bg: '#FEE2E2', text: '#DC2626' }
  }

  const getAvatarColor = (name) => {
    const colors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706']
    return colors[name.charCodeAt(0) % colors.length]
  }

  // Summary stats
  const summaryStats = [
    { label: 'Total Leads', value: leads.length, explanation: 'All leads in pipeline', progress: 75, color: '#2563EB' },
    { label: 'New This Week', value: leads.filter(l => l.status === 'New').length, explanation: 'Recently added leads', progress: 60, color: '#16A34A' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length, explanation: 'Ready to advance', progress: 45, color: '#D97706' },
    { label: 'Converted', value: leads.filter(l => l.status === 'Converted').length, explanation: 'Successfully closed', progress: 85, color: '#16A34A' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Leads</h1>
            <p className="page-subtitle">Track and manage your sales pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
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

        {/* Kanban Board */}
        <div className="section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {leadStages.map((stage, stageIndex) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIndex * 0.1 }}
              className="kanban-column"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">{stage}</h3>
                <span className="px-2 py-1 rounded-full bg-white text-gray-600 text-xs font-medium border border-gray-200">
                  {filteredLeads.filter(l => l.status === stage).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {filteredLeads
                  .filter(lead => lead.status === stage)
                  .map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="card p-4 cursor-pointer hover:shadow-md"
                      onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                            style={{ backgroundColor: getAvatarColor(lead.name) }}
                          >
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-gray-900">{lead.name}</h4>
                            <p className="text-sm text-gray-500">{lead.company}</p>
                          </div>
                        </div>
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: getScoreColor(lead.score).bg, color: getScoreColor(lead.score).text }}
                        >
                          {lead.score}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{lead.email}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">${lead.value.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Recommendation Banner */}
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
              <h3 className="text-base font-semibold text-gray-900 mb-1">AI Recommendation</h3>
              <p className="text-sm text-gray-600 mb-3">
                Based on lead scoring patterns, leads in the "Qualified" stage with scores above 80% have a 65% higher conversion rate. Consider prioritizing follow-ups with these leads.
              </p>
              <button className="btn-secondary text-sm py-2 px-4">
                View High-Priority Leads
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
