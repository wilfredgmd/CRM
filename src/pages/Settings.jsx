import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, User, Mail, Phone, Globe, MapPin, CreditCard,
  Calendar, Globe2, Bell, Shield, Palette, Download, Upload,
  Save, X, Loader2, CheckCircle, ChevronRight, DollarSign,
  RefreshCw, Info
} from 'lucide-react'
import useStore from '../store/useStore'
import { CURRENCY_OPTIONS } from '../services/localStorage'

const SectionCard = ({ title, description, icon: Icon, color, children, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const InputField = ({ label, value, onChange, type = 'text', placeholder, helper }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
    {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
  </div>
)

const Toggle = ({ label, value, onChange, description }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`}
      />
    </button>
  </div>
)

export default function Settings() {
  const { settings, updateSettings, fetchSettings } = useStore()
  const [saved, setSaved] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const patch = (key, value) => setLocalSettings(s => ({ ...s, [key]: value }))
  const patchNested = (parent, key, value) =>
    setLocalSettings(s => ({ ...s, [parent]: { ...s[parent], [key]: value } }))

  const handleSave = () => {
    updateSettings(localSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      const defaults = {
        companyName: 'My CRM',
        userName: 'Admin',
        userEmail: 'admin@mycrm.com',
        currency: '₹',
        currencyCode: 'INR',
        dateFormat: 'DD/MM/YYYY',
        notifications: { newLeads: true, dealUpdates: true, taskReminders: true, emailAlerts: true },
      }
      setLocalSettings(s => ({ ...s, ...defaults }))
    }
  }

  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === localSettings.currencyCode) || CURRENCY_OPTIONS[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Configure your workspace preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Company Settings */}
          <SectionCard
            title="Company"
            description="Your business name shown throughout the app"
            icon={Building2}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            defaultOpen
          >
            <div className="space-y-4">
              <InputField
                label="Company Name"
                value={localSettings.companyName || ''}
                onChange={v => patch('companyName', v)}
                placeholder="e.g. Acme Corp"
                helper="This appears in the top navbar and reports"
              />
              <InputField
                label="Company Website"
                value={localSettings.companyWebsite || ''}
                onChange={v => patch('companyWebsite', v)}
                placeholder="https://example.com"
              />
              <InputField
                label="Company Address"
                value={localSettings.companyAddress || ''}
                onChange={v => patch('companyAddress', v)}
                placeholder="123, MG Road, Bangalore"
              />
            </div>
          </SectionCard>

          {/* Profile Settings */}
          <SectionCard
            title="Profile"
            description="Manage your personal account information"
            icon={User}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            defaultOpen
          >
            <div className="space-y-4">
              <InputField
                label="Your Name"
                value={localSettings.userName || ''}
                onChange={v => patch('userName', v)}
                placeholder="Your full name"
              />
              <InputField
                label="Email Address"
                type="email"
                value={localSettings.userEmail || ''}
                onChange={v => patch('userEmail', v)}
                placeholder="you@example.com"
              />
              <InputField
                label="Role / Title"
                value={localSettings.userTitle || ''}
                onChange={v => patch('userTitle', v)}
                placeholder="Sales Manager"
              />
              <InputField
                label="Phone"
                type="tel"
                value={localSettings.userPhone || ''}
                onChange={v => patch('userPhone', v)}
                placeholder="+91 98765 43210"
              />
            </div>
          </SectionCard>

          {/* Currency Settings */}
          <SectionCard
            title="Currency & Localization"
            description="Set your preferred currency and date format"
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
            defaultOpen
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CURRENCY_OPTIONS.map(cur => (
                    <button
                      key={cur.code}
                      onClick={() => {
                        patch('currency', cur.symbol)
                        patch('currencyCode', cur.code)
                      }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                        localSettings.currencyCode === cur.code
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="text-base font-bold">{cur.symbol}</span>
                      <span>{cur.code}</span>
                      {localSettings.currencyCode === cur.code && (
                        <CheckCircle className="w-3.5 h-3.5 ml-auto text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Currently: {selectedCurrency.symbol} — {selectedCurrency.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                <select
                  value={localSettings.dateFormat || 'DD/MM/YYYY'}
                  onChange={e => patch('dateFormat', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (28/04/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (04/28/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2026-04-28)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={localSettings.language || 'en'}
                  onChange={e => patch('language', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Notification Settings */}
          <SectionCard
            title="Notifications"
            description="Control what alerts you receive"
            icon={Bell}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          >
            <div>
              <Toggle
                label="New Lead Alerts"
                description="Notify when a new lead is added"
                value={localSettings.notifications?.newLeads ?? true}
                onChange={v => patchNested('notifications', 'newLeads', v)}
              />
              <Toggle
                label="Deal Updates"
                description="Notify when a deal stage changes"
                value={localSettings.notifications?.dealUpdates ?? true}
                onChange={v => patchNested('notifications', 'dealUpdates', v)}
              />
              <Toggle
                label="Task Reminders"
                description="Remind for upcoming task deadlines"
                value={localSettings.notifications?.taskReminders ?? true}
                onChange={v => patchNested('notifications', 'taskReminders', v)}
              />
              <Toggle
                label="Email Alerts"
                description="Send email notifications for important events"
                value={localSettings.notifications?.emailAlerts ?? false}
                onChange={v => patchNested('notifications', 'emailAlerts', v)}
              />
            </div>
          </SectionCard>

          {/* Security */}
          <SectionCard
            title="Security"
            description="Password and authentication settings"
            icon={Shield}
            color="bg-gradient-to-br from-red-500 to-red-600"
          >
            <div className="space-y-4">
              <InputField
                label="Current Password"
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Enter current password"
              />
              <InputField
                label="New Password"
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Enter new password"
              />
              <InputField
                label="Confirm New Password"
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Confirm new password"
              />
              <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                Update Password
              </button>
            </div>
          </SectionCard>

          {/* Appearance */}
          <SectionCard
            title="Appearance"
            description="Theme and display preferences"
            icon={Palette}
            color="bg-gradient-to-br from-indigo-500 to-violet-600"
          >
            <div className="space-y-3">
              <p className="text-sm text-gray-700 font-medium mb-2">Theme</p>
              {['light', 'dark', 'auto'].map(t => (
                <label key={t} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={t}
                    checked={(localSettings.theme || 'light') === t}
                    onChange={() => patch('theme', t)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm capitalize text-gray-700">{t === 'auto' ? 'Auto (System)' : t}</span>
                </label>
              ))}
            </div>
          </SectionCard>

          {/* About */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">CRM System v1.0.0</p>
                <p className="text-xs text-blue-600 mt-1">All data is stored locally in your browser. Export your data regularly for backup.</p>
                <button
                  onClick={() => {
                    const data = {
                      leads: JSON.parse(localStorage.getItem('crm_leads') || '[]'),
                      contacts: JSON.parse(localStorage.getItem('crm_contacts') || '[]'),
                      deals: JSON.parse(localStorage.getItem('crm_deals') || '[]'),
                      tasks: JSON.parse(localStorage.getItem('crm_tasks') || '[]'),
                      calls: JSON.parse(localStorage.getItem('crm_calls') || '[]'),
                      settings: JSON.parse(localStorage.getItem('crm_settings') || '{}'),
                      exportedAt: new Date().toISOString(),
                    }
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a'); a.href = url; a.download = 'crm-export.json'; a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="mt-2 text-xs text-blue-700 font-medium underline hover:no-underline"
                >
                  Export All Data →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
