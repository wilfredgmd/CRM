import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import useStore from '../store/useStore'
import { TrendingUp, DollarSign, Users, CheckCircle2, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Reports() {
  const { contacts, leads, deals, tasks } = useStore()

  // Calculate metrics
  const totalDealsValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const totalLeadsValue = leads.reduce((sum, lead) => sum + lead.value, 0)
  const wonDeals = deals.filter(d => d.stage === 'Closed Won')
  const wonDealsValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0)
  const conversionRate = leads.length > 0 ? ((leads.filter(l => l.status === 'Converted').length / leads.length) * 100).toFixed(1) : 0
  const winRate = deals.length > 0 ? ((wonDeals.length / deals.length) * 100).toFixed(1) : 0

  // Lead source data
  const leadSourceData = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1
    return acc
  }, {})

  const leadSourceChartData = Object.entries(leadSourceData).map(([source, count]) => ({
    name: source,
    value: count,
  }))

  // Deal stage data
  const dealStageData = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1
    return acc
  }, {})

  const dealStageChartData = Object.entries(dealStageData).map(([stage, count]) => ({
    name: stage,
    value: count,
  }))

  // Monthly deals trend (simulated data)
  const monthlyTrendData = [
    { month: 'Jan', deals: 12, value: 45000 },
    { month: 'Feb', deals: 15, value: 62000 },
    { month: 'Mar', deals: 18, value: 78000 },
    { month: 'Apr', deals: 22, value: 95000 },
    { month: 'May', deals: 20, value: 88000 },
    { month: 'Jun', deals: 25, value: 110000 },
  ]

  // Task completion data
  const taskCompletionData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
  ]

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const metrics = [
    { name: 'Total Revenue', value: `$${wonDealsValue.toLocaleString()}`, icon: DollarSign, change: '+12%', positive: true },
    { name: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, change: '+5%', positive: true },
    { name: 'Win Rate', value: `${winRate}%`, icon: CheckCircle2, change: '+8%', positive: true },
    { name: 'Active Contacts', value: contacts.length, icon: Users, change: '+10%', positive: true },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Track your sales performance and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="stat-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="stat-label">{metric.name}</div>
                  <div className="stat-value">{metric.value}</div>
                  <p className={`text-sm mt-2 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last month
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 ml-3">
                  <metric.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="section grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Deals Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Lead Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadSourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="section grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Deals by Stage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealStageChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Task Completion Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskCompletionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Analysis */}
        <div className="section card p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Pipeline Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="stat-label mb-2">Total Pipeline Value</p>
              <p className="stat-value">${totalDealsValue.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="stat-label mb-2">Weighted Pipeline</p>
              <p className="stat-value">${(totalDealsValue * 0.5).toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="stat-label mb-2">Average Deal Size</p>
              <p className="stat-value">${deals.length > 0 ? (totalDealsValue / deals.length).toLocaleString() : 0}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="stat-label mb-2">Total Leads Value</p>
              <p className="stat-value">${totalLeadsValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="section card p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">This Month</p>
                  <p className="text-sm text-gray-600">Deals closed: {wonDeals.length}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-600">${wonDealsValue.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">New Leads</p>
                  <p className="text-sm text-gray-600">Total new leads this month</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-600">{leads.length}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Tasks Completed</p>
                  <p className="text-sm text-gray-600">Productivity metric</p>
                </div>
              </div>
              <p className="text-xl font-bold text-purple-600">{tasks.filter(t => t.status === 'Completed').length}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
