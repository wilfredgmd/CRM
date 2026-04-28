import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import useStore from '../store/useStore'
import Navbar from '../components/Navbar'

const dealStages = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

export default function Deals() {
  const { deals, contacts, addDeal, updateDeal, deleteDeal } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedDeal, setExpandedDeal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStageColor = (stage) => {
    const colors = {
      'Qualification': '#3B82F6',
      'Proposal': '#F59E0B',
      'Negotiation': '#8B5CF6',
      'Closed Won': '#10B981',
      'Closed Lost': '#EF4444',
    }
    return colors[stage] || '#6B7280'
  }

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)

  // Summary stats
  const summaryStats = [
    { label: 'Total Pipeline', value: `$${(totalValue / 1000).toFixed(0)}K`, explanation: 'All deal values combined', progress: 75, color: '#2563EB' },
    { label: 'Closed Won', value: `$${(deals.filter(d => d.stage === 'Closed Won').reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(0)}K`, explanation: 'Successfully closed', progress: 60, color: '#16A34A' },
    { label: 'In Progress', value: deals.filter(d => ['Qualification', 'Proposal', 'Negotiation'].includes(d.stage)).length, explanation: 'Active negotiations', progress: 45, color: '#D97706' },
    { label: 'Win Rate', value: `${deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'Closed Won').length / deals.length) * 100) : 0}%`, explanation: 'Conversion success', progress: 65, color: '#16A34A' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Deals</h1>
            <p className="page-subtitle">Track your sales opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
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

        {/* Deal Cards */}
        <div className="section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-5 cursor-pointer hover:shadow-md"
              onClick={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{deal.name}</h3>
                  <p className="text-sm text-gray-500">{deal.stage}</p>
                </div>
                {expandedDeal === deal.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>

              <div className="text-center py-4 mb-4">
                <p className="text-3xl font-bold text-gray-900">${deal.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{deal.probability}% probability</p>
              </div>

              <div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${deal.probability}%`, backgroundColor: getStageColor(deal.stage) }} 
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedDeal === deal.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 pt-4 mt-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Expected Close</span>
                        <span className="font-medium text-gray-900">{deal.expectedClose || 'Not set'}</span>
                      </div>
                      <button className="w-full btn-primary text-sm py-2">
                        Update Stage
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* AI Forecast Banner */}
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
              <h3 className="text-base font-semibold text-gray-900 mb-1">AI Forecast</h3>
              <p className="text-sm text-gray-600 mb-3">
                Based on historical data, your expected revenue for this quarter is ${(totalValue * 0.65).toLocaleString()} with 65% confidence.
              </p>
              <button className="btn-secondary text-sm py-2 px-4">
                View Detailed Forecast
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
