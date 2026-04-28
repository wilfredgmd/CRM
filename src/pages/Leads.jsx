import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Sparkles, Phone, Mail, X, Loader2,
  CheckCircle, XCircle, ChevronDown, Pencil, Trash2,
  ArrowRight, TrendingUp, UserCheck, UserX, MoreVertical,
  Upload, FileSpreadsheet, Download, UserPlus
} from 'lucide-react'
import useStore from '../store/useStore'

const leadStages = ['new', 'contacted', 'qualified', 'converted', 'lost']
const stageLabels = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', converted: 'Converted', lost: 'Lost' }
const stageColors = {
  new: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
  contacted: { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
  qualified: { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
  converted: { bg: '#F0FDF4', border: '#86EFAC', text: '#16A34A' },
  lost: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
}

const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Call', 'Trade Show', 'Social Media', 'Email Campaign', 'Other']

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '',
  company: '', title: '', source: '', customSource: '',
  value: '', status: 'new', notes: ''
}

export default function Leads() {
  const { leads, fetchLeads, addLead, updateLead, deleteLead, convertLead, settings } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [expandedLead, setExpandedLead] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)

  const currency = settings?.currency || '₹'

  useEffect(() => { fetchLeads() }, [])

  // Close context menu on outside click
  useEffect(() => {
    const handler = () => setOpenMenuId(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openAddModal = () => {
    setEditingLead(null)
    setFormData(emptyForm)
    setSubmitError('')
    setShowModal(true)
  }

  const openEditModal = (lead) => {
    setEditingLead(lead)
    setFormData({
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      title: lead.title || '',
      source: SOURCES.includes(lead.source) ? lead.source : (lead.source ? 'Other' : ''),
      customSource: SOURCES.includes(lead.source) ? '' : (lead.source || ''),
      value: lead.value?.toString() || '',
      status: lead.status || 'new',
      notes: lead.notes || '',
    })
    setSubmitError('')
    setShowModal(true)
  }

  const handleStatusChange = (leadId, newStatus) => {
    updateLead(leadId, { status: newStatus })
  }

  const handleDelete = (leadId) => {
    if (window.confirm('Delete this lead?')) deleteLead(leadId)
  }

  const handleMarkConverted = async (lead) => {
    try {
      await convertLead(lead.id)
      alert(`${lead.firstName} ${lead.lastName} has been converted to a contact and deal created!`)
    } catch (err) {
      console.error('Conversion failed:', err)
      // Fallback: just mark as converted
      updateLead(lead.id, { status: 'converted' })
    }
    setOpenMenuId(null)
  }

  // Excel Import Handler
  const handleExcelImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const rows = text.split('\n').filter(row => row.trim())
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase())
        
        let imported = 0
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(',').map(c => c.trim())
          if (cols.length >= 3) {
            const leadData = {
              firstName: cols[0] || '',
              lastName: cols[1] || '',
              email: cols[2] || '',
              phone: cols[3] || '',
              company: cols[4] || '',
              title: cols[5] || '',
              source: cols[6] || 'Excel Import',
              value: parseFloat(cols[7]) || 0,
              status: 'new',
              notes: cols[8] || ''
            }
            if (leadData.firstName && leadData.email) {
              addLead(leadData)
              imported++
            }
          }
        }
        alert(`Successfully imported ${imported} leads!`)
        fetchLeads()
      } catch (err) {
        console.error('Import failed:', err)
        alert('Import failed. Please check CSV format.')
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  const downloadTemplate = () => {
    const headers = 'First Name,Last Name,Email,Phone,Company,Title,Source,Value,Notes\n'
    const sample = 'Priya,Sharma,priya@techstart.in,+91 98765 43210,TechStart India,CEO,Website,500000,Hot lead\nRahul,Verma,rahul@innovate.co,+91 87654 32109,Innovate Corp,CTO,LinkedIn,1200000,Follow up'
    const blob = new Blob([headers + sample], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleMarkLost = (lead) => {
    updateLead(lead.id, { status: 'lost' })
    setOpenMenuId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const finalSource = formData.source === 'Other' ? (formData.customSource || 'Other') : formData.source
      const leadData = {
        ...formData,
        source: finalSource,
        value: parseFloat(formData.value) || 0,
      }
      delete leadData.customSource
      if (editingLead) {
        updateLead(editingLead.id, leadData)
      } else {
        addLead(leadData)
      }
      setShowModal(false)
      setFormData(emptyForm)
      setEditingLead(null)
    } catch (err) {
      setSubmitError(err.message || 'Failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 85) return { bg: '#DCFCE7', text: '#16A34A' }
    if (score >= 70) return { bg: '#FEF3C7', text: '#D97706' }
    return { bg: '#FEE2E2', text: '#DC2626' }
  }

  const getAvatarColor = (name) => {
    const colors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706']
    return colors[(name?.charCodeAt(0) || 0) % colors.length]
  }

  const summaryStats = [
    { label: 'Total Leads', value: leads.length, color: '#2563EB', progress: 100 },
    { label: 'New', value: leads.filter(l => l.status === 'new').length, color: '#3B82F6', progress: 60 },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: '#D97706', progress: 45 },
    { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, color: '#16A34A', progress: 85 },
  ]

  const InputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Leads</h1>
            <p className="page-subtitle">Track and manage your sales pipeline</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {leadStages.map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}
            </select>
            
            {/* Excel Import */}
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleExcelImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="lead-import"
              />
              <button 
                onClick={downloadTemplate}
                className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-200 flex items-center gap-2"
                title="Download CSV Template"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <label 
              htmlFor="lead-import"
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-100 flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Import
            </label>
            
            <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="section grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill" style={{ width: `${leads.length ? (s.value / leads.length) * 100 : 0}%`, backgroundColor: s.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {leadStages.map((stage, stageIdx) => {
            const stageLeads = filteredLeads.filter(l => l.status === stage)
            const colors = stageColors[stage]
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stageIdx * 0.08 }}
                className="kanban-column"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-sm font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {stageLabels[stage]}
                  </h3>
                  <span className="px-2 py-1 rounded-full bg-white text-gray-600 text-xs font-medium border border-gray-200">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageLeads.map(lead => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="card p-4 cursor-pointer hover:shadow-md relative group"
                    >
                      {/* Context Menu */}
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === lead.id ? null : lead.id) }}
                          className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        <AnimatePresence>
                          {openMenuId === lead.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 z-20"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                onClick={() => openEditModal(lead)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Edit Lead
                              </button>
                              {lead.status !== 'converted' && (
                                <button
                                  onClick={() => handleMarkConverted(lead)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                >
                                  <UserCheck className="w-3.5 h-3.5" /> Mark Converted
                                </button>
                              )}
                              {lead.status !== 'lost' && (
                                <button
                                  onClick={() => handleMarkLost(lead)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <UserX className="w-3.5 h-3.5" /> Mark as Lost
                                </button>
                              )}
                              <hr className="my-1 border-gray-100" />
                              <button
                                onClick={() => handleDelete(lead.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}>
                        <div className="flex items-start gap-3 mb-3 pr-6">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                            style={{ backgroundColor: getAvatarColor(lead.firstName) }}
                          >
                            {lead.firstName?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{lead.firstName} {lead.lastName}</h4>
                            <p className="text-xs text-gray-500">{lead.company}</p>
                            {lead.title && <p className="text-xs text-gray-400">{lead.title}</p>}
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-3 space-y-1.5">
                          {lead.email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${lead.email}`} className="truncate hover:text-blue-600" onClick={e => e.stopPropagation()}>{lead.email}</a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              <a href={`tel:${lead.phone}`} className="hover:text-blue-600" onClick={e => e.stopPropagation()}>{lead.phone}</a>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-semibold text-gray-800">{currency}{Number(lead.value || 0).toLocaleString('en-IN')}</span>
                            {lead.score && (
                              <span
                                className="px-1.5 py-0.5 rounded text-xs font-semibold"
                                style={{ backgroundColor: getScoreColor(lead.score).bg, color: getScoreColor(lead.score).text }}
                              >
                                {lead.score}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded: quick status change */}
                      <AnimatePresence>
                        {expandedLead === lead.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-2 font-medium">Move to stage:</p>
                              <div className="flex flex-wrap gap-1">
                                {leadStages.filter(s => s !== stage).map(s => (
                                  <button
                                    key={s}
                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(lead.id, s) }}
                                    className="text-xs px-2 py-1 rounded-full border font-medium transition-all hover:shadow-sm"
                                    style={{ backgroundColor: stageColors[s].bg, borderColor: stageColors[s].border, color: stageColors[s].text }}
                                  >
                                    {stageLabels[s]}
                                  </button>
                                ))}
                              </div>
                              {lead.source && <p className="text-xs text-gray-400 mt-2">Source: {lead.source}</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-xs">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* AI Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ai-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">AI Recommendation</h3>
              <p className="text-sm text-gray-600">
                {leads.filter(l => l.status === 'qualified').length > 0
                  ? `You have ${leads.filter(l => l.status === 'qualified').length} qualified leads ready to advance. Focus on high-score leads for best conversion rates.`
                  : 'Add more leads and qualify them to get AI-powered insights and conversion recommendations.'}
              </p>
            </div>
          </div>
        </motion.div>
      </main>

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
                <h2 className="text-xl font-bold text-gray-900">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{submitError}</div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input required type="text" value={formData.firstName} onChange={e => setFormData(d => ({ ...d, firstName: e.target.value }))} className={InputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input required type="text" value={formData.lastName} onChange={e => setFormData(d => ({ ...d, lastName: e.target.value }))} className={InputCls} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} className={InputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))} className={InputCls} placeholder="+91 98765 43210" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" value={formData.company} onChange={e => setFormData(d => ({ ...d, company: e.target.value }))} className={InputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData(d => ({ ...d, title: e.target.value }))} className={InputCls} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select value={formData.source} onChange={e => setFormData(d => ({ ...d, source: e.target.value, customSource: '' }))} className={InputCls}>
                    <option value="">Select source</option>
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Manual Source when "Other" is selected */}
                <AnimatePresence>
                  {formData.source === 'Other' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specify Source *</label>
                      <input
                        required={formData.source === 'Other'}
                        type="text"
                        placeholder="e.g. YouTube Ad, Podcast, Event..."
                        value={formData.customSource}
                        onChange={e => setFormData(d => ({ ...d, customSource: e.target.value }))}
                        className={InputCls}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.value}
                    onChange={e => setFormData(d => ({ ...d, value: e.target.value }))}
                    className={InputCls}
                    placeholder="500000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData(d => ({ ...d, status: e.target.value }))} className={InputCls}>
                    {leadStages.map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))}
                    className={InputCls}
                    placeholder="Any additional notes..."
                  />
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
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : (editingLead ? 'Update Lead' : 'Add Lead')}
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
