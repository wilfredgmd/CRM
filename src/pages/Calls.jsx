import { motion } from 'framer-motion'
import { Phone, Calendar, Clock, Video, PhoneCall } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Calls() {
  const scheduledCalls = [
    { id: 1, name: 'John Smith', company: 'Tech Corp', time: '10:00 AM', type: 'phone', duration: '30 min' },
    { id: 2, name: 'Sarah Johnson', company: 'Design Studio', time: '2:00 PM', type: 'video', duration: '45 min' },
    { id: 3, name: 'Mike Wilson', company: 'Marketing Pro', time: '4:30 PM', type: 'phone', duration: '20 min' },
  ]

  const recentCalls = [
    { id: 1, name: 'Alice Brown', company: 'Startup Inc', time: 'Yesterday', duration: '25 min', outcome: 'Successful' },
    { id: 2, name: 'Bob Davis', company: 'Enterprise Co', time: '2 days ago', duration: '40 min', outcome: 'Follow-up needed' },
  ]

  // Summary stats
  const summaryStats = [
    { label: 'Scheduled Today', value: scheduledCalls.length, explanation: 'Calls on calendar', progress: 60, color: '#2563EB' },
    { label: 'Completed', value: recentCalls.length, explanation: 'Finished calls', progress: 80, color: '#16A34A' },
    { label: 'Avg Duration', value: '32 min', explanation: 'Average call length', progress: 45, color: '#D97706' },
    { label: 'Success Rate', value: '85%', explanation: 'Positive outcomes', progress: 85, color: '#16A34A' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Calls & Meetings</h1>
            <p className="page-subtitle">Manage your scheduled communications</p>
          </div>
          <button className="btn-primary flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Schedule Call
          </button>
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

        {/* Scheduled and Recent Calls */}
        <div className="section grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Scheduled Calls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-5"
          >
            <h3 className="text-base font-semibold text-gray-900 mb-4">Scheduled Today</h3>
            <div className="space-y-3">
              {scheduledCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      call.type === 'video' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {call.type === 'video' ? <Video className="w-5 h-5 text-purple-600" /> : <Phone className="w-5 h-5 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.name}</p>
                      <p className="text-sm text-gray-500">{call.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{call.time}</p>
                    <p className="text-sm text-gray-500">{call.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Calls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-5"
          >
            <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Calls</h3>
            <div className="space-y-3">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.name}</p>
                      <p className="text-sm text-gray-500">{call.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{call.time}</p>
                    <p className={`text-sm font-medium ${call.outcome === 'Successful' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {call.outcome}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="stat-card text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <p className="stat-value">24</p>
            <p className="stat-label">Calls This Week</p>
          </div>
          <div className="stat-card text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="stat-value">3.5h</p>
            <p className="stat-label">Avg. Call Duration</p>
          </div>
          <div className="stat-card text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="stat-value">85%</p>
            <p className="stat-label">Show Rate</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
