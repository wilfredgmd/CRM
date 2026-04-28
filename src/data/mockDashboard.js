export const mockDashboardData = {
  greeting: {
    timeOfDay: 'Morning',
    userName: 'Alex',
    followUpsCount: 8
  },
  
  pipelineHealth: {
    health: 78,
    explanation: 'Pipeline is healthy at 78% — 2 deals need attention',
    stages: [
      { name: 'New Leads', value: 45, color: '#2563EB' },
      { name: 'In Progress', value: 32, color: '#10B981' },
      { name: 'Closed Won', value: 23, color: '#8B5CF6' }
    ],
    sparkline: [65, 68, 72, 70, 75, 78, 76]
  },

  stats: [
    {
      id: 1,
      label: 'New Leads This Week',
      value: 24,
      explanation: '8 more than last week — you\'re on track',
      goal: 30,
      goalLabel: '80% of monthly goal',
      trend: '+12%',
      trendUp: true,
      sparkline: [12, 18, 15, 22, 20, 24, 24]
    },
    {
      id: 2,
      label: 'Deals Closing Soon',
      value: 7,
      explanation: 'Follow up before end of week',
      goal: 10,
      goalLabel: '70% of target',
      trend: '-5%',
      trendUp: false,
      sparkline: [8, 6, 9, 7, 5, 7, 7]
    },
    {
      id: 3,
      label: 'Tasks Overdue',
      value: 3,
      explanation: 'Review your task list now',
      goal: 0,
      goalLabel: 'Need attention',
      trend: '-25%',
      trendUp: true,
      sparkline: [2, 4, 3, 5, 4, 3, 3]
    },
    {
      id: 4,
      label: 'Revenue This Month',
      value: 45000,
      explanation: '$12K ahead of last month',
      goal: 50000,
      goalLabel: '90% of target',
      trend: '+36%',
      trendUp: true,
      sparkline: [28000, 32000, 35000, 38000, 42000, 45000, 45000]
    }
  ],

  recentActivity: [
    {
      id: 1,
      type: 'lead_added',
      message: 'New lead added: Michael Chen from Global Solutions',
      time: '2 hours ago',
      icon: 'UserPlus'
    },
    {
      id: 2,
      type: 'deal_updated',
      message: 'Deal "Enterprise License" moved to negotiation stage',
      time: '4 hours ago',
      icon: 'TrendingUp'
    },
    {
      id: 3,
      type: 'call_completed',
      message: 'Call completed with Sarah Lee — positive response',
      time: '5 hours ago',
      icon: 'Phone'
    },
    {
      id: 4,
      type: 'task_completed',
      message: 'Task "Send proposal" marked as complete',
      time: '6 hours ago',
      icon: 'CheckCircle'
    },
    {
      id: 5,
      type: 'email_sent',
      message: 'Follow-up email sent to David Park',
      time: '1 day ago',
      icon: 'Mail'
    }
  ],

  leadPriorities: [
    {
      id: 1,
      name: 'Alice Johnson',
      company: 'TechCorp Inc.',
      lastInteraction: '2 hours ago',
      status: 'hot',
      score: 85,
      avatar: 'AJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'Global Solutions',
      lastInteraction: '5 hours ago',
      status: 'warm',
      score: 72,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      company: 'Innovate LLC',
      lastInteraction: '1 day ago',
      status: 'hot',
      score: 78,
      avatar: 'SW'
    },
    {
      id: 4,
      name: 'David Park',
      company: 'StartUp Hub',
      lastInteraction: '2 days ago',
      status: 'cold',
      score: 45,
      avatar: 'DP'
    },
    {
      id: 5,
      name: 'Emma Rodriguez',
      company: 'Enterprise Co',
      lastInteraction: '3 days ago',
      status: 'warm',
      score: 65,
      avatar: 'ER'
    }
  ],

  schedule: {
    dates: [
      { day: 'Mon', date: 15, active: false },
      { day: 'Tue', date: 16, active: false },
      { day: 'Wed', date: 17, active: true },
      { day: 'Thu', date: 18, active: false },
      { day: 'Fri', date: 19, active: false },
      { day: 'Sat', date: 20, active: false },
      { day: 'Sun', date: 21, active: false }
    ],
    events: [
      {
        id: 1,
        name: 'Sarah Lee',
        role: 'Head of Procurement',
        company: 'Fortune 500 Corp',
        time: '10:00 AM',
        type: 'call',
        avatar: 'SL'
      },
      {
        id: 2,
        name: 'James Wilson',
        role: 'CTO',
        company: 'TechStart Inc',
        time: '2:00 PM',
        type: 'meeting',
        avatar: 'JW'
      },
      {
        id: 3,
        name: 'Lisa Anderson',
        role: 'VP Sales',
        company: 'Growth Partners',
        time: '4:30 PM',
        type: 'call',
        avatar: 'LA'
      }
    ],
    actionNeeded: {
      tags: ['Follow Up Overdue', 'Proposal Sent'],
      count: 3
    }
  },

  quickActions: [
    {
      id: 1,
      title: 'Add New Lead',
      description: 'Capture and qualify new prospects',
      icon: 'UserPlus',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Schedule Call',
      description: 'Book meetings with prospects',
      icon: 'Phone',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'Create Deal',
      description: 'Track opportunities in pipeline',
      icon: 'TrendingUp',
      gradient: 'from-purple-500 to-purple-600'
    }
  ],

  aiInsight: {
    title: 'AI Alert: High-Value Lead',
    message: "Alice Johnson's lead score increased by 15%. Best opportunity to close today.",
    urgency: 'high',
    leadName: 'Alice Johnson',
    leadScore: 85
  }
};
