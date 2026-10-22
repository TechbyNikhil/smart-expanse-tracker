import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  PiggyBank,
  Settings,
} from 'lucide-react';

const BOTTOM_NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Budgets', path: '/budgets', icon: PiggyBank },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const MobileBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#111827]/95 backdrop-blur-xl border-t border-[#273449] lg:hidden px-2 py-1.5 safe-area-bottom shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-400 font-bold scale-105'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-[#94A3B8]'}`} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-1 truncate">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
