import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  User,
  ShieldCheck,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    userProfile,
    openAddModal,
    budgetProgress,
    globalSearch,
    setGlobalSearch,
    showToast,
  } = useExpense();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Formatted Current Date (e.g. Sunday, 11 Oct 2026)
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  // Generate dynamic smart notification items based on budget progress
  const notifications = [];

  if (budgetProgress.overall.isOver) {
    notifications.push({
      id: 'notif-overall',
      type: 'warning',
      title: 'Overall Budget Exceeded',
      message: `You've exceeded your monthly limit by ₹${budgetProgress.overall.overAmount.toLocaleString('en-IN')}`,
      time: 'Just now',
    });
  } else if (budgetProgress.overall.status === 'warning') {
    notifications.push({
      id: 'notif-overall-warn',
      type: 'warning',
      title: 'Budget Alert',
      message: `You have utilized ${budgetProgress.overall.percentage}% of your monthly budget.`,
      time: 'Today',
    });
  }

  budgetProgress.categories.forEach((cat) => {
    if (cat.isOver) {
      notifications.push({
        id: `notif-${cat.category}`,
        type: 'danger',
        title: `${cat.category} Over Budget`,
        message: `Exceeded by ₹${cat.overAmount.toLocaleString('en-IN')}`,
        time: 'Active',
      });
    }
  });

  if (notifications.length === 0) {
    notifications.push({
      id: 'notif-default',
      type: 'success',
      title: 'Budgets On Track',
      message: 'All your expense categories are within their allocated monthly limits.',
      time: 'Active',
    });
  }

  const userInitial = userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1120]/80 backdrop-blur-md border-b border-[#273449] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Welcome Message */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-bold text-[#F8FAFC] tracking-tight flex items-center gap-1.5">
            <span>Welcome back,</span>
            <span className="text-emerald-400 font-extrabold truncate max-w-[150px] sm:max-w-none">
              {userProfile.name.split(' ')[0]}
            </span>
            <span className="hidden sm:inline">👋</span>
          </h1>
          <p className="text-[11px] md:text-xs text-[#94A3B8]">{todayFormatted}</p>
        </div>
      </div>

      {/* Right: Quick Search, Notifications, Add Button, Avatar */}
      <div className="flex items-center space-x-2 md:space-x-3.5">
        {/* Search Bar / Trigger */}
        <div className="relative">
          {/* Desktop Search Input */}
          <div className="hidden md:flex items-center relative w-56 lg:w-72">
            <Search className="absolute left-3 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Quick search transactions..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-1.5 pl-9 pr-3 text-xs text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-xl transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={openAddModal}
          className="flex items-center space-x-1.5 py-1.5 px-3 md:px-3.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>

        {/* Notification Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-xl transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((n) => n.type === 'danger' || n.type === 'warning') && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0B1120] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/30 sm:hidden"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-[#172033] border border-[#273449] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#273449]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                    Notifications
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {notifications.length} alerts
                  </span>
                </div>

                <div className="divide-y divide-[#273449]/60 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="py-3 flex items-start space-x-3">
                      {notif.type === 'danger' || notif.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#F8FAFC]">{notif.title}</p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-[#1E293B] transition-colors focus:outline-none"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {userInitial}
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/30 sm:hidden"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-xs bg-[#172033] border border-[#273449] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-[#273449]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F8FAFC] truncate">{userProfile.name}</h4>
                    <p className="text-[11px] text-[#94A3B8] truncate">{userProfile.email}</p>
                  </div>
                </div>

                <div className="pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Currency:</span>
                    <span className="font-semibold text-emerald-400 font-mono">INR (₹)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Account Status:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#273449] space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-[#94A3B8]" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      showToast('Logged out successfully', 'info');
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile search bar expandable */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0B1120] border-b border-[#273449] p-3 md:hidden z-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2 pl-9 pr-8 text-xs text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
