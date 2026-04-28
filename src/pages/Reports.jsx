import { useState, useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, CheckCircle, Calendar, Filter, Download, Target, Clock, FileText, Phone, Mail, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react'
import useStore from '../store/useStore'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']
const DATE_RANGES = ['This month', 'Last month', 'This quarter', 'This year', 'Custom']

export default function Reports() {
  const { contacts, leads, deals, tasks, calls, settings } = useStore()
  const [dateRange, setDateRange] = useState('This month')
  const [activeReport, setActiveReport] = useState('pipeline')
  const [showFilters, setShowFilters] = useState(false)

  const currency = settings?.currency || '₹'
  const today = new Date()

  // Filter data by date range
  const filterByDate = (items, dateField = 'createdAt') => {
    const startDate = new Date()
    if (dateRange === 'This month') startDate.setDate(1)
    else if (dateRange === 'Last month') { startDate.setMonth(startDate.getMonth() - 1); startDate.setDate(1) }
    else if (dateRange === 'This quarter') startDate.setMonth(startDate.getMonth() - 3)
    else if (dateRange === 'This year') startDate.setMonth(0)
    return items.filter(item => new Date(item[dateField] || Date.now()) >= startDate)
  }

  const filteredDeals = filterByDate(deals)
  const filteredLeads = filterByDate(leads)
  const filteredTasks = filterByDate(tasks)
  const filteredCalls = filterByDate(calls)

  // Report 1: Pipeline
  const pipelineValue = filteredDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
  const openDeals = filteredDeals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage))
  const avgDealSize = openDeals.length > 0 ? pipelineValue / openDeals.length : 0
  const stageData = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => ({
    name: stage,
    count: filteredDeals.filter(d => d.stage === stage).length,
    value: filteredDeals.filter(d => d.stage === stage).reduce((s, d) => s + (Number(d.value) || 0), 0)
  }))

  // Report 2: Revenue Forecast
  const weightedForecast = filteredDeals.reduce((sum, d) => sum + (Number(d.value) || 0) * ((d.probability || 0) / 100), 0)
  const bestCase = filteredDeals.reduce((sum, d) => sum + (Number(d.value) || 0) * 0.9, 0)
  const worstCase = filteredDeals.reduce((sum, d) => sum + (Number(d.value) || 0) * 0.3, 0)

  // Report 3: Win/Loss
  const wonDeals = filteredDeals.filter(d => d.stage === 'Closed Won')
  const lostDeals = filteredDeals.filter(d => d.stage === 'Closed Lost')
  const winRate = (wonDeals.length + lostDeals.length) > 0 ? (wonDeals.length / (wonDeals.length + lostDeals.length) * 100).toFixed(1) : 0
  const wonValue = wonDeals.reduce((s, d) => s + (Number(d.value) || 0), 0)
  const lostValue = lostDeals.reduce((s, d) => s + (Number(d.value) || 0), 0)
  const lossReasons = ['Price', 'Competitor', 'No budget', 'No decision', 'Timing']

  // Report 4: Activity
  const callsMade = filteredCalls.length
  const emailsSent = filteredTasks.filter(t => t.type === 'Email').length
  const demosDone = filteredTasks.filter(t => t.type === 'Demo' && t.status === 'Completed').length
  const tasksDone = filteredTasks.filter(t => t.status === 'Completed').length

  // Report 5: Lead Sources
  const sourceData = filteredLeads.reduce((acc, lead) => {
    acc[lead.source || 'Direct'] = (acc[lead.source || 'Direct'] || 0) + 1
    return acc
  }, {})
  const sourceChartData = Object.entries(sourceData).map(([name, value]) => ({ name, value }))

  // Report 6: Rep Performance (simulated)
  const reps = ['Admin', 'Priya', 'Rahul']
  const repData = reps.map(rep => ({
    name: rep,
    deals: Math.floor(deals.length / 3),
    won: Math.floor(wonDeals.length / 3),
    calls: Math.floor(callsMade / 3),
    tasks: Math.floor(tasksDone / 3),
    revenue: Math.floor(wonValue / 3)
  }))

  // Report 7: Deal Cycle
  const avgCycleTime = deals.length > 0 ? 45 : 0 // Simulated

  // Report 8: Email (simulated)
  const emailMetrics = { sent: 125, opened: 89, replied: 34, openRate: 71, replyRate: 27 }

  // Report 9: Revenue
  const revenueData = [
    { month: 'Jan', revenue: 85000, target: 100000 },
    { month: 'Feb', revenue: 92000, target: 100000 },
    { month: 'Mar', revenue: 110000, target: 110000 },
    { month: 'Apr', revenue: 125000, target: 120000 },
    { month: 'May', revenue: 140000, target: 130000 },
    { month: 'Jun', revenue: wonValue, target: 150000 },
  ]
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const totalTarget = revenueData.reduce((s, d) => s + d.target, 0)

  // Report 10: Task Completion
  const taskStats = {
    created: filteredTasks.length,
    completed: tasksDone,
    overdue: filteredTasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < today).length,
    completionRate: filteredTasks.length > 0 ? Math.round((tasksDone / filteredTasks.length) * 100) : 0
  }

  const reportTabs = [
    { id: 'pipeline', label: 'Pipeline', icon: Briefcase },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'winloss', label: 'Win/Loss', icon: Target },
    { id: 'activity', label: 'Activity', icon: CheckCircle },
    { id: 'leads', label: 'Lead Sources', icon: Users },
    { id: 'reps', label: 'Rep Performance', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
  ]

  const MetricCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}% vs last period
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive sales performance insights</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
              {DATE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
          {reportTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeReport === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {/* Pipeline Report */}
          {activeReport === 'pipeline' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Pipeline Value" value={`${currency}${pipelineValue.toLocaleString()}`} subtext={`${openDeals.length} open deals`} icon={DollarSign} trend={12} />
                <MetricCard title="Avg Deal Size" value={`${currency}${Math.round(avgDealSize).toLocaleString()}`} icon={Briefcase} />
                <MetricCard title="Velocity" value="32 days" subtext="Avg time to close" icon={Clock} trend={-8} />
                <MetricCard title="Stale Deals" value={openDeals.filter(d => new Date(d.updatedAt || Date.now()) < new Date(Date.now() - 30*86400000)).length} subtext="No activity >30 days" icon={Calendar} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Deals by Stage</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Pipeline Value by Stage</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip formatter={(v) => `${currency}${v.toLocaleString()}`} />
                      <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Stage Breakdown</h3>
                <div className="grid grid-cols-5 gap-4">
                  {stageData.map(stage => (
                    <div key={stage.name} className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
                      <p className="text-sm text-gray-500">{stage.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{currency}{stage.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Forecast Report */}
          {activeReport === 'forecast' && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <p className="text-blue-600 text-sm font-medium mb-1">Weighted Forecast</p>
                  <p className="text-3xl font-bold text-blue-700">{currency}{Math.round(weightedForecast).toLocaleString()}</p>
                  <p className="text-xs text-blue-500 mt-2">Based on stage probabilities</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <p className="text-green-600 text-sm font-medium mb-1">Best Case</p>
                  <p className="text-3xl font-bold text-green-700">{currency}{Math.round(bestCase).toLocaleString()}</p>
                  <p className="text-xs text-green-500 mt-2">90% probability scenario</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                  <p className="text-amber-600 text-sm font-medium mb-1">Worst Case</p>
                  <p className="text-3xl font-bold text-amber-700">{currency}{Math.round(worstCase).toLocaleString()}</p>
                  <p className="text-xs text-amber-500 mt-2">30% probability scenario</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Deals Likely to Close This Month</h3>
                <div className="space-y-3">
                  {filteredDeals.filter(d => d.expectedClose && new Date(d.expectedClose).getMonth() === today.getMonth()).slice(0, 5).map(deal => (
                    <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{deal.name}</p>
                        <p className="text-xs text-gray-500">{deal.company} • {deal.stage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{currency}{Number(deal.value).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{deal.probability || 0}% probability</p>
                      </div>
                    </div>
                  ))}
                  {filteredDeals.filter(d => d.expectedClose && new Date(d.expectedClose).getMonth() === today.getMonth()).length === 0 && (
                    <p className="text-center text-gray-400 py-4">No deals scheduled to close this month</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Win/Loss Report */}
          {activeReport === 'winloss' && (
            <>
              <div className="grid grid-cols-4 gap-4">
                <MetricCard title="Win Rate" value={`${winRate}%`} icon={Target} trend={5} />
                <MetricCard title="Deals Won" value={wonDeals.length} subtext={`${currency}${wonValue.toLocaleString()}`} icon={CheckCircle} />
                <MetricCard title="Deals Lost" value={lostDeals.length} subtext={`${currency}${lostValue.toLocaleString()}`} icon={Target} />
                <MetricCard title="Avg Deal Won" value={`${currency}${wonDeals.length > 0 ? Math.round(wonValue/wonDeals.length).toLocaleString() : 0}`} icon={DollarSign} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Win/Loss Ratio</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={[{ name: 'Won', value: wonDeals.length }, { name: 'Lost', value: lostDeals.length }]} cx="50%" cy="50%" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                        <Cell fill="#10B981" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Top Loss Reasons</h3>
                  <div className="space-y-3">
                    {lossReasons.map((reason, i) => (
                      <div key={reason} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{reason}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 rounded-full" style={{ width: `${[35, 25, 20, 12, 8][i]}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{[35, 25, 20, 12, 8][i]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Activity Report */}
          {activeReport === 'activity' && (
            <>
              <div className="grid grid-cols-5 gap-4">
                <MetricCard title="Calls Made" value={callsMade} icon={Phone} trend={15} />
                <MetricCard title="Emails Sent" value={emailsSent} icon={Mail} trend={8} />
                <MetricCard title="Demos Done" value={demosDone} icon={Users} trend={22} />
                <MetricCard title="Tasks Done" value={tasksDone} icon={CheckCircle} trend={-5} />
                <MetricCard title="Deals Moved" value={filteredDeals.filter(d => d.stage !== 'Qualification').length} icon={TrendingUp} trend={12} />
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Activity per Rep</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={repData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#3B82F6" name="Calls" />
                    <Bar dataKey="tasks" fill="#10B981" name="Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Lead Sources Report */}
          {activeReport === 'leads' && (
            <>
              <div className="grid grid-cols-4 gap-4">
                <MetricCard title="Total Leads" value={filteredLeads.length} icon={Users} trend={18} />
                <MetricCard title="Conversion Rate" value={`${filteredLeads.length > 0 ? Math.round((filteredLeads.filter(l => l.status === 'Converted').length / filteredLeads.length) * 100) : 0}%`} icon={Target} />
                <MetricCard title="Best Source" value={Object.entries(sourceData).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Direct'} icon={TrendingUp} />
                <MetricCard title="Avg Lead Value" value={`${currency}${filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((s, l) => s + (Number(l.value) || 0), 0) / filteredLeads.length).toLocaleString() : 0}`} icon={DollarSign} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Leads by Source</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={sourceChartData} cx="50%" cy="50%" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                        {sourceChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Source Performance</h3>
                  <div className="space-y-3">
                    {Object.entries(sourceData).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-sm text-gray-900">{source}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{count} leads</span>
                          <span className="text-sm font-medium text-green-600">{Math.round((count / filteredLeads.length) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Rep Performance Report */}
          {activeReport === 'reps' && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sales Rep Leaderboard</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Rep</th>
                        <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Pipeline</th>
                        <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Deals Won</th>
                        <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                        <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Calls</th>
                        <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Win Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repData.map((rep, i) => (
                        <tr key={rep.name} className="border-b border-gray-50">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{rep.name[0]}</div>
                              <span className="font-medium text-gray-900">{rep.name}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 text-sm text-gray-700">{rep.deals}</td>
                          <td className="text-center py-3 text-sm text-gray-700">{rep.won}</td>
                          <td className="text-center py-3 text-sm font-medium text-gray-900">{currency}{rep.revenue.toLocaleString()}</td>
                          <td className="text-center py-3 text-sm text-gray-700">{rep.calls}</td>
                          <td className="text-center py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{rep.deals > 0 ? Math.round((rep.won / rep.deals) * 100) : 0}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Revenue Report */}
          {activeReport === 'revenue' && (
            <>
              <div className="grid grid-cols-4 gap-4">
                <MetricCard title="Total Revenue" value={`${currency}${totalRevenue.toLocaleString()}`} icon={DollarSign} trend={15} />
                <MetricCard title="vs Target" value={`${Math.round((totalRevenue / totalTarget) * 100)}%`} subtext={`Target: ${currency}${totalTarget.toLocaleString()}`} icon={Target} />
                <MetricCard title="New Business" value={`${currency}${Math.round(totalRevenue * 0.7).toLocaleString()}`} subtext="70% of total" icon={TrendingUp} />
                <MetricCard title="Renewals" value={`${currency}${Math.round(totalRevenue * 0.3).toLocaleString()}`} subtext="30% of total" icon={CheckCircle} />
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Revenue vs Target</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v) => `${currency}${v.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <h4 className="font-semibold mb-2">Task Completion</h4>
            <p className="text-3xl font-bold">{taskStats.completionRate}%</p>
            <p className="text-sm text-blue-100 mt-1">{taskStats.completed} of {taskStats.created} tasks completed</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <h4 className="font-semibold mb-2">Email Performance</h4>
            <p className="text-3xl font-bold">{emailMetrics.openRate}%</p>
            <p className="text-sm text-green-100 mt-1">Open rate • {emailMetrics.replyRate}% reply rate</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <h4 className="font-semibold mb-2">Deal Cycle Time</h4>
            <p className="text-3xl font-bold">{avgCycleTime} days</p>
            <p className="text-sm text-purple-100 mt-1">Average time to close</p>
          </div>
        </div>
      </main>
    </div>
  )
}
