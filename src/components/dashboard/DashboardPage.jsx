import React from 'react';
import { motion } from 'framer-motion';
import { mockDashboardData } from '../../data/mockDashboard';
import Navbar from '../Navbar';
import HeroFunnel from './HeroFunnel';
import StatsRow from './StatsRow';
import LeadPriorityList from './LeadPriorityList';
import TodaySchedule from './TodaySchedule';
import RecentActivityFeed from './RecentActivityFeed';

const DashboardPage = () => {
  const data = mockDashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Row 1: Greeting + Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good {data.greeting.timeOfDay}, {data.greeting.userName}
            </h1>
            <p className="text-gray-500 mt-1">
              You have {data.greeting.followUpsCount} follow-ups today
            </p>
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
        </motion.div>

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
