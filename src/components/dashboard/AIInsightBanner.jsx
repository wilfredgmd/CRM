import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, X } from 'lucide-react';

const AIInsightBanner = ({ insight }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
          className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-xl p-6 shadow-lg shadow-blue-200/50"
        >
          <div className="flex items-start gap-6">
            {/* Left: Icon + Title */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Middle: Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                {insight.urgency === 'high' && (
                  <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
                    High Priority
                  </span>
                )}
              </div>
              <p className="text-blue-50 text-base leading-relaxed">{insight.message}</p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Now
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIInsightBanner;
