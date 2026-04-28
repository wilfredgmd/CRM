import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Phone, Video, AlertTriangle } from 'lucide-react';

const TodaySchedule = ({ schedule }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
            <p className="text-sm text-gray-500">Upcoming calls and meetings</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Date Scroller */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {schedule?.dates?.map((date, index) => (
            <motion.button
              key={`${date.day}-${date.date}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                date.active
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-xs font-medium">{date.day}</span>
              <span className="text-lg font-bold">{date.date}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div className="p-5 space-y-3">
        {schedule?.events?.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {event.avatar}
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">{event.name}</h4>
              <p className="text-sm text-gray-500 truncate">{event.role} — {event.company}</p>
            </div>

            {/* Time Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full">
                {event.type === 'call' ? (
                  <Phone className="w-3 h-3 text-gray-500" />
                ) : (
                  <Video className="w-3 h-3 text-gray-500" />
                )}
                <span className="text-sm font-medium text-gray-700">{event.time}</span>
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Needed Card */}
      <div className="mx-5 mb-5 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-2">Action Needed</h4>
            <div className="flex flex-wrap gap-2">
              {schedule.actionNeeded?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {schedule.actionNeeded?.count ?? 0} items require attention
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodaySchedule;
