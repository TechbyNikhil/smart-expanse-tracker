import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  PiggyBank,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Wallet,
  Sparkles,
} from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Budgets', path: '/budgets', icon: PiggyBank },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#111827] border-r border-[#273449] flex flex-col transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header / Brand Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#273449]">
          <NavLink
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center space-x-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all flex-shrink-0 shadow-lg shadow-emerald-500/10">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col transition-opacity duration-200">
                <span className="text-lg font-black tracking-tight text-[#F8FAFC] flex items-center gap-1">
                  Spend<span className="text-emerald-400">Wise</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Financial OS
                </span>
              </div>
            )}
          </NavLink>

          {/* Close button for Mobile drawer */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/70'
                  } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed && !isMobileOpen ? link.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                      }`}
                    />

                    {(!isCollapsed || isMobileOpen) && (
                      <span className="truncate">{link.name}</span>
                    )}

                    {/* Active pill dot on collapsed */}
                    {isCollapsed && !isMobileOpen && isActive && (
                      <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Pro Banner or Quick Info (only when expanded) */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-4 mx-3 mb-4 rounded-xl bg-[#172033] border border-[#273449] relative overflow-hidden">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SpendWise Local v1.0</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              100% private, instant offline storage with LocalStorage encryption.
            </p>
          </div>
        )}

        {/* Footer / Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-[#273449]">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {!isCollapsed && <span>Collapse Sidebar</span>}
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
