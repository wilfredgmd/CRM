import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import HeroFunnel from './HeroFunnel';
import StatsRow from './StatsRow';
import LeadPriorityList from './LeadPriorityList';
import TodaySchedule from './TodaySchedule';
import RecentActivityFeed from './RecentActivityFeed';
import useStore from '../../store/useStore';

const DashboardPage = () => {
  const { leads, contacts, deals, tasks, calls, notifications, settings, fetchLeads, fetchContacts, fetchDeals, fetchTasks, fetchCalls, fetchNotifications } = useStore();

  useEffect(() => {
    fetchLeads();
    fetchContacts();
    fetchDeals();
    fetchTasks();
    fetchCalls();
    fetchNotifications();
  }, []);

  const userName = settings?.userName || 'Admin';
  const currency = settings?.currency || '₹';

  // Calculate real stats
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.stage === 'Closed Won').length;
  const totalPipeline = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const wonPipeline = deals.filter(d => d.stage === 'Closed Won').reduce((sum, d) => sum + (d.value || 0), 0);
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const todayCalls = calls.filter(c => c.date === new Date().toISOString().split('T')[0] && c.status === 'scheduled').length;

  // Get greeting based on time
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  // Build stats
  const stats = [
    { label: 'Total Leads', value: totalLeads, change: '+12%', positive: true, icon: 'Users' },
    { label: 'Conversion Rate', value: totalLeads > 0 ? `${Math.round((convertedLeads / totalLeads) * 100)}%` : '0%', change: '+5%', positive: true, icon: 'TrendingUp' },
    { label: 'Pipeline Value', value: `${currency}${(totalPipeline / 100000).toFixed(1)}L`, change: '+18%', positive: true, icon: 'DollarSign' },
    { label: 'Active Deals', value: totalDeals, change: '+3', positive: true, icon: 'Briefcase' },
  ];

  // Pipeline health data
  const pipelineHealth = {
    total: totalPipeline,
    stages: [
      { name: 'Qualification', value: deals.filter(d => d.stage === 'Qualification').reduce((sum, d) => sum + (d.value || 0), 0), count: deals.filter(d => d.stage === 'Qualification').length },
      { name: 'Proposal', value: deals.filter(d => d.stage === 'Proposal').reduce((sum, d) => sum + (d.value || 0), 0), count: deals.filter(d => d.stage === 'Proposal').length },
      { name: 'Negotiation', value: deals.filter(d => d.stage === 'Negotiation').reduce((sum, d) => sum + (d.value || 0), 0), count: deals.filter(d => d.stage === 'Negotiation').length },
      { name: 'Closed Won', value: wonPipeline, count: wonDeals },
    ],
  };

  // Lead priorities (qualified leads)
  const leadPriorities = leads
    .filter(l => l.status === 'qualified' || l.status === 'contacted')
    .slice(0, 5)
    .map(l => ({
      id: l.id,
      name: `${l.firstName} ${l.lastName}`,
      company: l.company,
      score: l.score || 70,
      value: l.value || 0,
      status: l.status,
    }));

  // Today's schedule (tasks and calls)
  const schedule = {
    dates: [
      { day: 'Mon', date: 15, active: false },
      { day: 'Tue', date: 16, active: false },
      { day: 'Wed', date: 17, active: true },
      { day: 'Thu', date: 18, active: false },
      { day: 'Fri', date: 19, active: false },
      { day: 'Sat', date: 20, active: false },
      { day: 'Sun', date: 21, active: false },
    ],
    events: [
      ...tasks.filter(t => t.dueDate === 'Today' || t.dueDate === 'Tomorrow').slice(0, 3).map(t => ({
        id: t.id,
        type: 'call',
        name: t.title,
        role: 'Task',
        company: t.priority,
        time: t.dueDate,
        avatar: t.title.charAt(0),
      })),
      ...calls.filter(c => c.status === 'scheduled').slice(0, 3).map(c => ({
        id: c.id,
        type: 'call',
        name: c.contactName,
        role: 'Call',
        company: c.company || '',
        time: c.scheduledTime,
        avatar: c.contactName.charAt(0),
      })),
    ].slice(0, 5),
  };

  // Recent activity from notifications
  const recentActivity = notifications.slice(0, 5).map(n => ({
    id: n.id,
    type: n.type === 'lead_added' ? 'lead' : 'update',
    title: n.title,
    description: n.message,
    time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  const data = {
    greeting: {
      timeOfDay,
      userName,
      followUpsCount: pendingTasks + todayCalls,
    },
    stats,
    pipelineHealth,
    leadPriorities,
    schedule,
    recentActivity,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Row 1: Greeting + Date Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good {data.greeting.timeOfDay}, {data.greeting.userName}
            </h1>
            <p className="text-gray-500 mt-1">
              You have {data.greeting.followUpsCount} follow-ups today
            </p>
            {notifications.filter(n => !n.read).length > 0 && (
              <p className="text-blue-600 text-sm mt-1 font-medium">
                {notifications.filter(n => !n.read).length} new notification{notifications.filter(n => !n.read).length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Date Filter */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="px-4 py-2 bg-white rounded-md text-sm font-medium text-gray-900 shadow-sm">
                Today
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Weekly
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: KPI Summary Cards */}
        <div className="mb-8">
          <StatsRow stats={data.stats} />
        </div>

        {/* Row 3: Pipeline Health Chart + Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Pipeline Health Chart (wider, 2/3) */}
          <div className="lg:col-span-2">
            <HeroFunnel pipelineHealth={data.pipelineHealth} />
          </div>

          {/* Right: Recent Activity Feed (1/3) */}
          <div className="lg:col-span-1">
            <RecentActivityFeed activities={data.recentActivity} />
          </div>
        </div>

        {/* Row 4: Lead Priority List + Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Lead Priority List */}
          <LeadPriorityList leads={data.leadPriorities} />

          {/* Right Column: Today's Schedule */}
          <TodaySchedule schedule={data.schedule} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
