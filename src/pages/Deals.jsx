import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, ChevronDown, ChevronUp, Sparkles, Pencil, Trash2, X, Loader2, MoreVertical, Phone, Mail, Eye, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const dealStages = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
const emptyForm = { name: '', contactName: '', company: '', value: '', stage: 'Qualification', probability: 10, expectedClose: '', notes: '' }

export default function Deals() {
  const navigate = useNavigate()
  const { deals, contacts, addDeal, updateDeal, deleteDeal, settings, fetchDeals } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedDeal, setExpandedDeal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [editingDeal, setEditingDeal] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)

  const currency = settings?.currency || '₹'

  useEffect(() => { fetchDeals() }, [])

  useEffect(() => {
    const handler = () => setOpenMenuId(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = filterStage === 'all' || deal.stage === filterStage
    return matchesSearch && matchesStage
  })

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

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)

  // Summary stats
  const summaryStats = [
    { label: 'Total Pipeline', value: `${currency}${(totalValue / 100000).toFixed(1)}L`, explanation: 'All deal values combined', progress: 75, color: '#2563EB' },
    { label: 'Closed Won', value: `${currency}${(deals.filter(d => d.stage === 'Closed Won').reduce((sum, d) => sum + (d.value || 0), 0) / 100000).toFixed(1)}L`, explanation: 'Successfully closed', progress: 60, color: '#16A34A' },
    { label: 'In Progress', value: deals.filter(d => ['Qualification', 'Proposal', 'Negotiation'].includes(d.stage)).length, explanation: 'Active negotiations', progress: 45, color: '#D97706' },
    { label: 'Win Rate', value: `${deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'Closed Won').length / deals.length) * 100) : 0}%`, explanation: 'Conversion success', progress: 65, color: '#16A34A' },
  ]

  const openAddModal = () => {
    setEditingDeal(null)
    setFormData(emptyForm)
    setShowModal(true)
  }

  const openEditModal = (deal) => {
    setEditingDeal(deal)
    setFormData({
      name: deal.name || '',
      contactName: deal.contactName || '',
      company: deal.company || '',
      value: deal.value?.toString() || '',
      stage: deal.stage || 'Qualification',
      probability: deal.probability || 10,
      expectedClose: deal.expectedClose || '',
      notes: deal.notes || '',
    })
    setShowModal(true)
  }

  const handleDelete = (dealId) => {
    if (window.confirm('Delete this deal?')) {
      deleteDeal(dealId)
      setOpenMenuId(null)
    }
  }

  const handleStageChange = (dealId, newStage) => {
    const probabilityMap = {
      'Qualification': 10,
      'Proposal': 40,
      'Negotiation': 70,
      'Closed Won': 100,
      'Closed Lost': 0,
    }
    updateDeal(dealId, { stage: newStage, probability: probabilityMap[newStage] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability) || 10,
      }
      if (editingDeal) {
        updateDeal(editingDeal.id, dealData)
      } else {
        addDeal(dealData)
      }
      setShowModal(false)
      setFormData(emptyForm)
      setEditingDeal(null)
    } catch (err) {
      console.error('Failed to save deal:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const InputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
              />
            </div>
            <select
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stages</option>
              {dealStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Deal
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
              className="card p-5 cursor-pointer hover:shadow-md relative group"
              onClick={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}
            >
              {/* Context Menu */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === deal.id ? null : deal.id) }}
                  className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
                <AnimatePresence>
                  {openMenuId === deal.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 z-20"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/deals/${deal.id}`)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                      <button
                        onClick={() => openEditModal(deal)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit Deal
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-start justify-between mb-4 pr-6">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{deal.name}</h3>
                  <p className="text-sm text-gray-500">{deal.contactName} • {deal.company}</p>
                </div>
                {expandedDeal === deal.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>

              <div className="text-center py-4 mb-4">
                <p className="text-3xl font-bold text-gray-900">{currency}{Number(deal.value || 0).toLocaleString('en-IN')}</p>
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
                      <div className="flex flex-wrap gap-2">
                        {dealStages.filter(s => s !== deal.stage).map(s => (
                          <button
                            key={s}
                            onClick={e => { e.stopPropagation(); handleStageChange(deal.id, s) }}
                            className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all hover:shadow-sm"
                            style={{ backgroundColor: getStageColor(s) + '20', borderColor: getStageColor(s), color: getStageColor(s) }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
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
                Based on historical data, your expected revenue for this quarter is {currency}{Math.round(totalValue * 0.65).toLocaleString('en-IN')} with 65% confidence.
              </p>
              <button className="btn-secondary text-sm py-2 px-4">
                View Detailed Forecast
              </button>
            </div>
          </div>
        </motion.div>

      {/* Add / Edit Modal */}
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
                <h2 className="text-xl font-bold text-gray-900">{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} className={InputCls} placeholder="e.g. Enterprise License" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input type="text" value={formData.contactName} onChange={e => setFormData(d => ({ ...d, contactName: e.target.value }))} className={InputCls} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" value={formData.company} onChange={e => setFormData(d => ({ ...d, company: e.target.value }))} className={InputCls} placeholder="Acme Corp" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value ({currency}) *</label>
                  <input required type="number" min="0" value={formData.value} onChange={e => setFormData(d => ({ ...d, value: e.target.value }))} className={InputCls} placeholder="500000" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                    <select value={formData.stage} onChange={e => setFormData(d => ({ ...d, stage: e.target.value }))} className={InputCls}>
                      {dealStages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                    <input type="number" min="0" max="100" value={formData.probability} onChange={e => setFormData(d => ({ ...d, probability: e.target.value }))} className={InputCls} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                  <input type="date" value={formData.expectedClose} onChange={e => setFormData(d => ({ ...d, expectedClose: e.target.value }))} className={InputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea rows={3} value={formData.notes} onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))} className={InputCls} placeholder="Additional notes..." />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : (editingDeal ? 'Update Deal' : 'Add Deal')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </main>
    </div>
  )
}
