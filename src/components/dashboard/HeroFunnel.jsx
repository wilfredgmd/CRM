import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const HeroFunnel = ({ pipelineHealth }) => {
  const chartData = pipelineHealth.sparkline.map((v, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    value: v
  }));

  const stageData = pipelineHealth.stages.map(stage => ({
    name: stage.name,
    value: stage.value,
    color: stage.color
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Pipeline Health</h2>
          <p className="text-sm text-gray-500">{pipelineHealth.explanation}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-blue-600">{pipelineHealth.health}%</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <TrendingUp className="w-4 h-4" />
            <span>+3% this week</span>
          </div>
        </div>
      </div>

      {/* Pipeline Trend Chart */}
      <div className="h-48 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
              domain={[60, 80]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#2563EB', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pipeline Stage Distribution */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Pipeline Stage Distribution</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {stageData.map((entry, index) => (
                  <motion.rect
                    key={`bar-${index}`}
                    fill={entry.color}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroFunnel;
