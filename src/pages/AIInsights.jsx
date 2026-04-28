import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, Target, AlertTriangle, CheckCircle, ArrowRight, X, Loader2, Brain, Lightbulb, Zap, BarChart3, Users, DollarSign } from 'lucide-react'
import useStore from '../store/useStore'

export default function AIInsights() {
  const insights = [
    { id: 1, type: 'opportunity', title: 'High-value lead detected', description: 'Alice Brown from Startup Inc shows 85% conversion probability', icon: Target, color: 'text-green-500' },
    { id: 2, type: 'trend', title: 'Conversion rate improving', description: 'Your lead-to-deal conversion increased by 12% this month', icon: TrendingUp, color: 'text-blue-500' },
    { id: 3, type: 'suggestion', title: 'Optimize follow-up timing', description: 'Best response time for your industry is 2 hours. Current avg: 4.5 hours', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 4, type: 'alert', title: 'Risk detected', description: '3 deals in Negotiation stage haven been updated in 7 days', icon: AlertTriangle, color: 'text-red-500' },
  ]

  // Summary stats
  const summaryStats = [
    { label: 'Active Insights', value: insights.length, explanation: 'AI recommendations available', progress: 75, color: '#2563EB' },
    { label: 'Opportunities', value: insights.filter(i => i.type === 'opportunity').length, explanation: 'Growth opportunities', progress: 60, color: '#16A34A' },
    { label: 'Alerts', value: insights.filter(i => i.type === 'alert').length, explanation: 'Action needed', progress: 30, color: '#DC2626' },
    { label: 'Trends', value: insights.filter(i => i.type === 'trend').length, explanation: 'Performance trends', progress: 50, color: '#D97706' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">AI Insights</h1>
          <p className="page-subtitle">Intelligent analysis and recommendations</p>
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

        {/* Insight Cards */}
        <div className="section grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="ai-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                  <insight.icon className={`w-6 h-6 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Performance Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="section card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">AI Performance Score</h3>
              <p className="text-sm text-gray-500">Based on your activity patterns</p>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-6xl font-bold text-blue-600 mb-2">87</p>
            <p className="text-gray-500">out of 100</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
