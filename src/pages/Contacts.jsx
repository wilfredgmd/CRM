import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Phone, Mail, Sparkles, X, Pencil, Trash2, Building2, MapPin, User, MoreVertical, CheckCircle, XCircle, Loader2, FileText, Star, UserCheck, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'

const emptyForm = { name: '', email: '', phone: '', company: '', title: '', status: 'Active', address: '', notes: '' }
const ICls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

export default function Contacts() {
  const { contacts, fetchContacts, addContact, updateContact, deleteContact } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [menuId, setMenuId] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => { fetchContacts() }, [])
  useEffect(() => {
    const h = () => setMenuId(null)
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [])

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    return (c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q)) &&
      (filterStatus === 'all' || c.status === filterStatus)
  })

  // Separate newly converted contacts (converted in last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const newContacts = contacts.filter(c => 
    c.isNewlyConverted || (c.convertedAt && c.convertedAt > sevenDaysAgo)
  )
  const existingContacts = filtered.filter(c => 
    !c.isNewlyConverted && (!c.convertedAt || c.convertedAt <= sevenDaysAgo)
  )

  const handleViewLeadSource = (contact) => {
    if (contact.originalLeadId) {
      window.location.href = `/leads?highlight=${contact.originalLeadId}`
    }
  }

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name||'', email: c.email||'', phone: c.phone||'', company: c.company||'', title: c.title||'', status: c.status||'Active', address: c.address||'', notes: c.notes||'' }); setShowModal(true); setMenuId(null) }
  const handleDelete = (id) => { if (window.confirm('Delete contact?')) { deleteContact(id); setMenuId(null) } }
  const handleToggle = (c) => { updateContact(c.id, { status: c.status === 'Active' ? 'Inactive' : 'Active' }); setMenuId(null) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try { editing ? updateContact(editing.id, form) : addContact(form); setShowModal(false); setForm(emptyForm); setEditing(null) }
    finally { setSaving(false) }
  }

  const avatarColor = (n) => ['#2563EB','#7C3AED','#059669','#DC2626','#D97706','#0891B2','#BE185D'][(n?.charCodeAt(0)||0)%7]

  const stats = [
    { label: 'Total', value: contacts.length, color: '#2563EB' },
    { label: 'Active', value: contacts.filter(c=>c.status==='Active').length, color: '#16A34A' },
    { label: 'Inactive', value: contacts.filter(c=>c.status==='Inactive').length, color: '#DC2626' },
    { label: 'Companies', value: [...new Set(contacts.map(c=>c.company).filter(Boolean))].length, color: '#7C3AED' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 max-w-[1600px] mx-auto">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><h1 className="page-title">Contacts</h1><p className="page-subtitle">Manage your customer relationships</p></div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" /></div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="all">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['grid','list'].map(m=><button key={m} onClick={()=>setViewMode(m)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${viewMode===m?'bg-white shadow text-gray-900':'text-gray-500'}`}>{m}</button>)}
            </div>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4"/>Add Contact</button>
          </div>
        </div>

        <div className="section grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s,i)=><div key={i} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="progress-bar mt-3"><div className="progress-bar-fill" style={{width:`${contacts.length?(s.value/contacts.length)*100:0}%`,backgroundColor:s.color}}/></div></div>)}
        </div>

        {/* New Contacts Section - Recently Converted from Leads */}
        {newContacts.length > 0 && filterStatus === 'all' && (
          <div className="section">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">New Contacts</h3>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{newContacts.length} converted from leads</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newContacts.map((c,i)=> (
                <motion.div key={c.id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.05}} className="card p-5 bg-gradient-to-br from-amber-50 to-white border-amber-200 relative">
                  <div className="absolute top-3 right-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1"><UserCheck className="w-3 h-3" /> New</span></div>
                  <div className="flex items-start gap-4 mb-4 pr-20">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-500">{c.name?.charAt(0)?.toUpperCase()}</div>
                    <div className="flex-1 min-w-0"><h3 className="font-semibold text-gray-900 truncate">{c.name}</h3>{c.title&&<p className="text-xs text-gray-500">{c.title}</p>}{c.company&&<div className="flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3 text-gray-400"/><p className="text-xs text-gray-500 truncate">{c.company}</p></div>}</div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {c.email&&<a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"><Mail className="w-4 h-4 text-gray-400"/><span className="truncate">{c.email}</span></a>}
                    {c.phone&&<a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"><Phone className="w-4 h-4 text-gray-400"/><span>{c.phone}</span></a>}
                  </div>
                  {c.originalLeadId && (
                    <button onClick={() => handleViewLeadSource(c)} className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">View lead source <ArrowRight className="w-3 h-3" /></button>
                  )}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-100">
                    <button onClick={()=>openEdit(c)} className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50">Edit</button>
                    <button onClick={()=>handleToggle(c)} className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50">{c.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filtered.length===0 && newContacts.length === 0 ? (
          <div className="section flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
            <User className="w-12 h-12 text-gray-300 mb-3"/><p className="text-gray-500 font-medium">No contacts found</p>
            <button onClick={openAdd} className="mt-4 btn-primary flex items-center gap-2"><Plus className="w-4 h-4"/>Add Contact</button>
          </div>
        ) : viewMode==='grid' ? (
          <div className="section">
            {newContacts.length > 0 && <h3 className="text-lg font-semibold text-gray-900 mb-4">All Contacts</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingContacts.map((c,i)=>(
                <motion.div key={c.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="card p-5 cursor-pointer hover:shadow-md relative group" onClick={()=>setExpanded(expanded===c.id?null:c.id)}>
                  <div className="absolute top-4 right-4 z-10" onClick={e=>e.stopPropagation()}>
                    <button onClick={e=>{e.stopPropagation();setMenuId(menuId===c.id?null:c.id)}} className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4 text-gray-500"/></button>
                    <AnimatePresence>{menuId===c.id&&(<motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 z-20" onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>openEdit(c)} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Pencil className="w-3.5 h-3.5"/>Edit</button>
                      <button onClick={()=>handleToggle(c)} className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 ${c.status==='Active'?'text-amber-600':'text-green-600'}`}>{c.status==='Active'?<XCircle className="w-3.5 h-3.5"/>:<CheckCircle className="w-3.5 h-3.5"/>}Mark {c.status==='Active'?'Inactive':'Active'}</button>
                      <a href={`tel:${c.phone}`} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"><Phone className="w-3.5 h-3.5"/>Call Now</a>
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"><Mail className="w-3.5 h-3.5"/>Send Email</a>
                      <hr className="my-1 border-gray-100"/>
                      <button onClick={()=>handleDelete(c.id)} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5"/>Delete</button>
                    </motion.div>)}</AnimatePresence>
                  </div>
                  <div className="flex items-start gap-4 mb-4 pr-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{backgroundColor:avatarColor(c.name)}}>{c.name?.charAt(0)?.toUpperCase()}</div>
                    <div className="flex-1 min-w-0"><h3 className="font-semibold text-gray-900 truncate">{c.name}</h3>{c.title&&<p className="text-xs text-gray-500">{c.title}</p>}{c.company&&<div className="flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3 text-gray-400"/><p className="text-xs text-gray-500 truncate">{c.company}</p></div>}</div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {c.email&&<a href={`mailto:${c.email}`} onClick={e=>e.stopPropagation()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"><Mail className="w-4 h-4 text-gray-400"/><span className="truncate">{c.email}</span></a>}
                    {c.phone&&<a href={`tel:${c.phone}`} onClick={e=>e.stopPropagation()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"><Phone className="w-4 h-4 text-gray-400"/><span>{c.phone}</span></a>}
                    {c.address&&<div className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4 text-gray-400"/><span className="truncate">{c.address}</span></div>}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.status==='Active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                    <span className="text-xs text-gray-400">{c.createdAt?new Date(c.createdAt).toLocaleDateString('en-IN'):''}</span>
                  </div>
                  <AnimatePresence>{expanded===c.id&&c.notes&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2"><FileText className="w-4 h-4 text-gray-400 mt-0.5"/><p className="text-sm text-gray-600">{c.notes}</p></div></motion.div>)}</AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="section bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>{filtered.map((c,i)=>(
                <motion.tr key={c.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0" style={{backgroundColor:avatarColor(c.name)}}>{c.name?.charAt(0)?.toUpperCase()}</div><div><p className="font-medium text-gray-900 text-sm">{c.name}</p>{c.title&&<p className="text-xs text-gray-500">{c.title}</p>}</div></div></td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">{c.company}</td>
                  <td className="px-4 py-3 hidden lg:table-cell"><a href={`mailto:${c.email}`} className="text-sm text-blue-600 hover:underline">{c.email}</a></td>
                  <td className="px-4 py-3"><a href={`tel:${c.phone}`} className="text-sm text-gray-600 hover:text-blue-600">{c.phone}</a></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status==='Active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={()=>openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600"><Pencil className="w-3.5 h-3.5"/></button>
                    <a href={`tel:${c.phone}`} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600"><Phone className="w-3.5 h-3.5"/></a>
                    <button onClick={()=>handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div></td>
                </motion.tr>
              ))}</tbody>
            </table>
          </div>
        )}

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="ai-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0"><Sparkles className="w-5 h-5 text-white"/></div>
            <div><h3 className="text-base font-semibold text-gray-900 mb-1">AI Insight</h3>
              <p className="text-sm text-gray-600">{contacts.filter(c=>c.status==='Inactive').length>0?`${contacts.filter(c=>c.status==='Inactive').length} contacts are inactive — consider a re-engagement campaign.`:`All ${contacts.length} contacts are active. Great engagement!`}</p>
            </div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>{showModal&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">{editing?'Edit Contact':'Add Contact'}</h2>
              <button onClick={()=>setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input required type="text" value={form.name} onChange={e=>setForm(d=>({...d,name:e.target.value}))} className={ICls} placeholder="Priya Sharma"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input required type="email" value={form.email} onChange={e=>setForm(d=>({...d,email:e.target.value}))} className={ICls}/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={form.phone} onChange={e=>setForm(d=>({...d,phone:e.target.value}))} className={ICls} placeholder="+91 98765 43210"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Company</label><input type="text" value={form.company} onChange={e=>setForm(d=>({...d,company:e.target.value}))} className={ICls}/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={form.title} onChange={e=>setForm(d=>({...d,title:e.target.value}))} className={ICls}/></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" value={form.address} onChange={e=>setForm(d=>({...d,address:e.target.value}))} className={ICls} placeholder="Mumbai, MH"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={form.status} onChange={e=>setForm(d=>({...d,status:e.target.value}))} className={ICls}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={3} value={form.notes} onChange={e=>setForm(d=>({...d,notes:e.target.value}))} className={ICls} placeholder="Additional notes..."/></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
                  {saving?<><Loader2 className="w-4 h-4 animate-spin"/>Saving...</>:(editing?'Update':'Add Contact')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </div>
  )
}
