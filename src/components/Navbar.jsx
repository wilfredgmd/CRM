import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Sparkles, Layout, Users, DollarSign,
  CheckSquare, Phone, BarChart3, Brain, Settings,
  ChevronDown, X, CheckCircle, UserPlus, TrendingUp,
  LogOut, User
} from 'lucide-react';
import useStore from '../store/useStore';

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

const ICON_MAP = { UserPlus, TrendingUp, Phone, CheckCircle };

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, notifications, markNotificationRead, markAllNotificationsRead, logout, user } = useStore();

  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const tabRefs = useRef({});
  const moreRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const companyName = settings?.companyName || 'My CRM';
  const userName = user?.name || settings?.userName || 'Admin';
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const activeIndex = navigation.findIndex(item => location.pathname === item.href);
    if (activeIndex !== -1 && tabRefs.current[activeIndex]) {
      const { offsetLeft, offsetWidth } = tabRefs.current[activeIndex];
      setPillStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    }
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="bg-[#F8FAFC] border-b border-gray-200 h-[68px] sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Logo + Company Name */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 max-w-[160px] truncate">{companyName}</span>
        </Link>

        {/* Center: Nav Pills */}
        <div className="flex-1 flex justify-center px-6">
          <div
            className="relative"
            style={{ background: '#EAEDF0', borderRadius: '50px', padding: '6px', boxShadow: '6px 6px 14px rgba(0,0,0,0.12), -4px -4px 10px rgba(255,255,255,0.85)' }}
          >
            <motion.div
              className="absolute top-[6px] h-[calc(100%-12px)] rounded-[44px]"
              style={{ background: '#D1D5DB', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.1), 2px 2px 5px rgba(0,0,0,0.15)', zIndex: 0 }}
              animate={{ left: pillStyle.left, width: pillStyle.width, opacity: pillStyle.opacity }}
              transition={{ left: { type: 'spring', stiffness: 400, damping: 30 }, width: { duration: 0.3 }, opacity: { duration: 0.2 } }}
            />
            <nav className="flex items-center gap-1 relative z-10">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    ref={el => tabRefs.current[index] = el}
                    onClick={() => {
                      if (tabRefs.current[index]) {
                        const { offsetLeft, offsetWidth } = tabRefs.current[index];
                        setPillStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
                      }
                    }}
                    className={`flex items-center gap-2 rounded-[44px] text-sm font-medium transition-all duration-200 ${
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
                  onClick={() => setMoreDropdownOpen(o => !o)}
                  className={`flex items-center gap-2 rounded-[44px] text-sm font-medium transition-all duration-200 ${
                    moreNavigation.some(i => location.pathname === i.href) ? 'text-gray-900' : 'text-gray-500 hover:bg-black/5 hover:text-gray-900'
                  }`}
                  style={{ padding: '10px 18px' }}
                >
                  <span>More</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-50"
                    >
                      {moreNavigation.map(item => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            location.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">Notifications</p>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)}>
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 20).map(notif => {
                        const Icon = ICON_MAP[notif.icon] || Bell;
                        return (
                          <button
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!notif.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              notif.type === 'lead_added' ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-4 h-4 ${notif.type === 'lead_added' ? 'text-blue-600' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              {initials}
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{settings?.userEmail || ''}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" /> Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Badge */}
          <span className="hidden md:flex px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            AI Active
          </span>
        </div>
      </div>
    </header>
  );
}
