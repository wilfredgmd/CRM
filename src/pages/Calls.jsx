import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Calendar, Clock, Plus, X, Pencil, Trash2, CheckCircle, XCircle, Filter, Search, ChevronDown, ChevronUp, TrendingUp, PhoneMissed } from 'lucide-react'
import useStore from '../store/useStore'

const CALL_TYPES = ['Outbound', 'Inbound', 'Missed', 'Scheduled']
const OUTCOMES = ['Interested', 'Callback', 'Not interested', 'Voicemail', 'No answer']

export default function Calls() {
  const { calls, addCall, updateCall, deleteCall, fetchCalls, contacts, deals } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedCall, setExpandedCall] = useState(null)
  const [editingCall, setEditingCall] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [formData, setFormData] = useState({ contactName: '', phone: '', company: '', type: 'Outbound', outcome: '', duration: '', date: new Date().toISOString().split('T')[0], notes: '', rep: 'Admin', relatedTo: '', relatedId: '' })

  useEffect(() => { fetchCalls() }, [])

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) || call.company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'All' || call.type === filterType
    return matchesSearch && matchesType
  })

  const today = new Date().toISOString().split('T')[0]
  const callsToday = calls.filter(c => c.date === today).length
  const callsThisWeek = calls.filter(c => new Date(c.date || Date.now()) >= new Date(Date.now() - 7 * 86400000)).length
  const avgDuration = calls.length > 0 ? Math.round(calls.reduce((sum, c) => sum + (parseInt(c.duration) || 0), 0) / calls.length) : 0
  const missedCount = calls.filter(c => c.type === 'Missed' || c.outcome === 'No answer').length
  const connectRate = calls.length > 0 ? Math.round((calls.filter(c => ['Interested', 'Callback'].includes(c.outcome)).length / calls.length) * 100) : 0

  const scheduledCalls = filteredCalls.filter(c => c.type === 'Scheduled').sort((a, b) => new Date(a.date) - new Date(b.date))
  const recentCalls = filteredCalls.filter(c => c.type !== 'Scheduled' && c.type !== 'Missed')
  const missedCalls = filteredCalls.filter(c => c.type === 'Missed' || c.outcome === 'No answer')

  const getRelatedName = (call) => {
    if (!call.relatedTo || !call.relatedId) return null
    if (call.relatedTo === 'contact') return contacts.find(c => c.id === call.relatedId)?.name
    if (call.relatedTo === 'deal') return deals.find(d => d.id === call.relatedId)?.name
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCall) updateCall(editingCall.id, formData)
    else addCall({ ...formData, createdAt: new Date().toISOString() })
    setShowModal(false)
    setEditingCall(null)
    setFormData({ contactName: '', phone: '', company: '', type: 'Outbound', outcome: '', duration: '', date: today, notes: '', rep: 'Admin', relatedTo: '', relatedId: '' })
  }

  const CallRow = ({ call }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${call.type === 'Outbound' ? 'bg-blue-100 text-blue-700' : call.type === 'Inbound' ? 'bg-green-100 text-green-700' : call.type === 'Missed' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>
        {call.type[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900">{call.contactName}</p>
        <p className="text-xs text-gray-500">{call.company} {getRelatedName(call) && `• ${getRelatedName(call)}`}</p>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${call.outcome === 'Interested' ? 'bg-green-100 text-green-700' : call.outcome === 'Callback' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
        {call.outcome || 'No outcome'}
      </span>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">{call.rep?.charAt(0)}</div>
        <span className="hidden sm:inline">{call.rep}</span>
      </div>
      <div className="text-right text-xs">
        <p className="text-gray-500">{call.date}</p>
        {call.duration && <p className="font-medium text-gray-700">{call.duration}m</p>}
      </div>
      <button onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)} className="p-1 hover:bg-gray-100 rounded">
        {expandedCall === call.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
        <button onClick={() => { setEditingCall(call); setFormData({...call}); setShowModal(true) }} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => deleteCall(call.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calls</h1>
            <p className="text-sm text-gray-500 mt-1">Track calls, meetings, and communications</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-48" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              <option value="All">All Types</option>
              {CALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4" /> Log Call</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100"><div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Phone className="w-4 h-4" /> Today</div><p className="text-2xl font-bold text-gray-900">{callsToday}</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100"><div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><TrendingUp className="w-4 h-4" /> This Week</div><p className="text-2xl font-bold text-gray-900">{callsThisWeek}</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100"><div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Clock className="w-4 h-4" /> Avg Duration</div><p className="text-2xl font-bold text-gray-900">{avgDuration}m</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100"><div className="flex items-center gap-2 text-purple-500 text-sm mb-1"><Calendar className="w-4 h-4" /> Next 48h</div><p className="text-2xl font-bold text-purple-600">{scheduledCalls.filter(c => new Date(c.date) <= new Date(Date.now() + 48*60*60*1000)).length}</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100"><div className="flex items-center gap-2 text-red-500 text-sm mb-1"><PhoneMissed className="w-4 h-4" /> Missed</div><p className="text-2xl font-bold text-red-600">{missedCount}</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100"><div className="flex items-center gap-2 text-green-500 text-sm mb-1"><CheckCircle className="w-4 h-4" /> Connect Rate</div><p className="text-2xl font-bold text-green-600">{connectRate}%</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-purple-100 text-purple-700"><Calendar className="w-4 h-4" /><h3 className="font-semibold text-sm">Scheduled Calls</h3><span className="ml-auto px-2 py-0.5 bg-white/50 rounded-full text-xs">{scheduledCalls.length}</span></div>
            <div className="space-y-2">{scheduledCalls.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">No scheduled calls</p> : scheduledCalls.map(call => <CallRow key={call.id} call={call} />)}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-blue-100 text-blue-700"><Phone className="w-4 h-4" /><h3 className="font-semibold text-sm">Recent Calls</h3><span className="ml-auto px-2 py-0.5 bg-white/50 rounded-full text-xs">{recentCalls.length}</span></div>
            <div className="space-y-2">{recentCalls.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">No recent calls</p> : recentCalls.map(call => <CallRow key={call.id} call={call} />)}</div>
          </div>
        </div>

        {missedCalls.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-red-100 text-red-700"><PhoneMissed className="w-4 h-4" /><h3 className="font-semibold text-sm">Missed Calls</h3><span className="ml-auto px-2 py-0.5 bg-white/50 rounded-full text-xs">{missedCalls.length}</span></div>
            <div className="space-y-2">{missedCalls.map(call => <CallRow key={call.id} call={call} />)}</div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">{editingCall ? 'Edit Call' : 'Log New Call'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label><input required type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Company</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Call Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">{CALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label><select value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Select</option>{OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label><input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="15" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">{editingCall ? 'Update' : 'Log Call'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
