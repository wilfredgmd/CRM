import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Globe, CreditCard } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Settings() {
  const settingsSections = [
    { id: 1, title: 'Profile', description: 'Manage your account information', icon: User },
    { id: 2, title: 'Notifications', description: 'Configure alert preferences', icon: Bell },
    { id: 3, title: 'Security', description: 'Password and authentication', icon: Shield },
    { id: 4, title: 'Appearance', description: 'Theme and display settings', icon: Palette },
    { id: 5, title: 'Integrations', description: 'Connected apps and services', icon: Globe },
    { id: 6, title: 'Billing', description: 'Subscription and payment', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your workspace preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-5 cursor-pointer hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm mb-4">
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{section.title}</h3>
              <p className="text-sm text-gray-500">{section.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="section card p-5"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary">Export Data</button>
            <button className="btn-secondary">Sync Calendar</button>
            <button className="btn-secondary">Clear Cache</button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
