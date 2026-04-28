import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, TrendingUp, Phone, CheckCircle, Mail, MoreVertical } from 'lucide-react';
import * as Icons from 'lucide-react';

const RecentActivityFeed = ({ activities }) => {
  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'lead_added':
        return 'bg-blue-100 text-blue-600';
      case 'deal_updated':
        return 'bg-green-100 text-green-600';
      case 'call_completed':
        return 'bg-purple-100 text-purple-600';
      case 'task_completed':
        return 'bg-emerald-100 text-emerald-600';
      case 'email_sent':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500 mt-1">Latest updates from your pipeline</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-50">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${getIconColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                {getIcon(activity.icon)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <div className="p-4 border-t border-gray-50">
        <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
          View all activity →
        </button>
      </div>
    </motion.div>
  );
};

export default RecentActivityFeed;
