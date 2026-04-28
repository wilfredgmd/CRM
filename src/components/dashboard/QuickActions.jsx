import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Phone, TrendingUp, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

const QuickActions = ({ actions }) => {
  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 text-left group"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {getIcon(action.icon)}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{action.description}</p>
          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
            Get started
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
