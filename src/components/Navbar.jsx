import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, Sparkles, Layout, Users, DollarSign, CheckSquare, Phone, BarChart3, Brain, Settings, ChevronDown } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Layout },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Deals', href: '/deals', icon: DollarSign },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Calls', href: '/calls', icon: Phone },
];

const moreNavigation = [
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'AI Insights', href: '/ai-insights', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Navbar = () => {
  const location = useLocation();
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const tabRefs = useRef({});
  const moreRef = useRef(null);

  useEffect(() => {
    const activeIndex = navigation.findIndex(item => location.pathname === item.href);
    if (activeIndex !== -1 && tabRefs.current[activeIndex]) {
      const { offsetLeft, offsetWidth } = tabRefs.current[activeIndex];
      setPillStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    }
  }, [location.pathname]);

  const handleTabClick = (index, tabRef) => {
    const { offsetLeft, offsetWidth } = tabRef.current;
    setPillStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
  };

  return (
    <header className="bg-[#F8FAFC] border-b border-gray-200 h-[68px] sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CRM</span>
        </div>

        {/* Center: Neumorphic Pill Container */}
        <div className="flex-1 flex justify-center px-8">
          <div className="relative" style={{ background: '#EAEDF0', borderRadius: '50px', padding: '6px', boxShadow: '6px 6px 14px rgba(0,0,0,0.12), -4px -4px 10px rgba(255,255,255,0.85)' }}>
            {/* Sliding Light Gray Pill */}
            <motion.div
              className="absolute top-[6px] h-[calc(100%-12px)] rounded-[44px]"
              style={{
                background: '#D1D5DB',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.1), 2px 2px 5px rgba(0,0,0,0.15)',
                zIndex: 0,
              }}
              animate={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
              }}
              transition={{
                left: { type: 'spring', stiffness: 400, damping: 30 },
                width: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.2 },
              }}
            />

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1 relative z-10">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    ref={(el) => tabRefs.current[index] = el}
                    onClick={() => handleTabClick(index, tabRefs.current[index])}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[44px] text-sm font-medium transition-all duration-300 ${
                      isActive ? 'text-gray-900' : 'text-gray-500 hover:bg-black/5 hover:text-gray-900'
                    }`}
                    style={{ padding: '10px 18px' }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[44px] text-sm font-medium transition-all duration-300 ${
                    moreNavigation.some(item => location.pathname === item.href) ? 'text-gray-900' : 'text-gray-500 hover:bg-black/5 hover:text-gray-900'
                  }`}
                  style={{ padding: '10px 18px' }}
                >
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                    {moreNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                          location.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
            AL
          </div>

          {/* AI Active Badge */}
          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            AI Active
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
