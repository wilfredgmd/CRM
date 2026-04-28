import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Phone, Mail, Sparkles } from 'lucide-react'
import useStore from '../store/useStore'
import Navbar from '../components/Navbar'

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedContact, setExpandedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAvatarColor = (name) => {
    const colors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706']
    return colors[name.charCodeAt(0) % colors.length]
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id)
    }
  }

  // Summary stats
  const summaryStats = [
    { label: 'Total Contacts', value: contacts.length, explanation: 'All contacts in database', progress: 80, color: '#2563EB' },
    { label: 'Active', value: contacts.filter(c => c.status === 'Active').length, explanation: 'Currently engaged', progress: 65, color: '#16A34A' },
    { label: 'New This Week', value: Math.floor(contacts.length * 0.2), explanation: 'Recently added', progress: 40, color: '#D97706' },
    { label: 'Inactive', value: contacts.filter(c => c.status === 'Inactive').length, explanation: 'Needs re-engagement', progress: 25, color: '#DC2626' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Contacts</h1>
            <p className="page-subtitle">Manage your customer relationships</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
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

        {/* Contact Cards Grid */}
        <div className="section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-5 cursor-pointer hover:shadow-md"
              onClick={() => setExpandedContact(expandedContact === contact.id ? null : contact.id)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                  style={{ backgroundColor: getAvatarColor(contact.name) }}
                >
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{contact.company}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{contact.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  contact.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {contact.status}
                </span>
                <span className="text-xs text-gray-400">{contact.createdAt}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insight Banner */}
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
              <h3 className="text-base font-semibold text-gray-900 mb-1">AI Insight</h3>
              <p className="text-sm text-gray-600 mb-3">
                You have {contacts.filter(c => c.status === 'Active').length} active contacts. Consider reaching out to inactive contacts to re-engage them.
              </p>
              <button className="btn-secondary text-sm py-2 px-4">
                View Inactive Contacts
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
