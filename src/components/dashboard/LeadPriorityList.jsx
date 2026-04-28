import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Phone, Mail, Eye, Flame, Thermometer, Snowflake } from 'lucide-react';

const LeadPriorityList = ({ leads }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'hot':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'warm':
        return <Thermometer className="w-4 h-4 text-yellow-500" />;
      case 'cold':
        return <Snowflake className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hot':
        return 'bg-orange-500';
      case 'warm':
        return 'bg-yellow-500';
      case 'cold':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Lead Priority List</h3>
            <p className="text-sm text-gray-500">Top prospects to follow up</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Lead List */}
      <div className="divide-y divide-gray-50">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`group p-4 hover:bg-blue-50/50 transition-all duration-200 ${
              lead.status === 'hot' ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`} />

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {lead.avatar}
              </div>

              {/* Lead Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800 truncate">{lead.name}</h4>
                  {getStatusIcon(lead.status)}
                </div>
                <p className="text-sm text-gray-500 truncate">{lead.company}</p>
                <p className="text-xs text-gray-400 mt-0.5">{lead.lastInteraction}</p>
              </div>

              {/* Lead Score */}
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-700">Score</div>
                <div className={`text-lg font-bold ${lead.score >= 75 ? 'text-green-600' : lead.score >= 50 ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {lead.score}
                </div>
              </div>

              {/* Quick Actions - Hidden by default, shown on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Call">
                  <Phone className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </button>
                <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Email">
                  <Mail className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </button>
                <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                  <Eye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LeadPriorityList;
