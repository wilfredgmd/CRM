import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ stat, index }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = stat.value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [stat.value]);

  const formatValue = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  const chartData = stat.sparkline?.map((v, i) => ({ value: v })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      {/* Label */}
      <p className="text-sm text-gray-500 font-medium mb-2">{stat.label}</p>

      {/* Big Number */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-4xl font-bold text-gray-900">
          {formatValue(count)}
        </span>
        {/* Subtle Trend Indicator */}
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            stat.trendUp ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {stat.trendUp ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {stat.trend}
        </div>
      </div>

      {/* Explanation Text */}
      <p className="text-sm text-gray-600 mb-4">{stat.explanation}</p>

      {/* Progress Bar with Label */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{stat.goalLabel}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stat.value / stat.goal) * 100, 100)}%` }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
            className={`h-full rounded-full ${
              stat.trendUp ? 'bg-green-500' : 'bg-amber-500'
            }`}
          />
        </div>
      </div>

      {/* Optional Small Sparkline */}
      <div className="h-12 opacity-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={stat.trendUp ? '#10B981' : '#F59E0B'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subtle View Details Link */}
      <div className="pt-3 mt-3 border-t border-gray-50">
        <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View details →
        </span>
      </div>
    </motion.div>
  );
};

const StatsRow = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <StatCard key={stat.id ?? index} stat={stat} index={index} />
      ))}
    </div>
  );
};

export default StatsRow;
