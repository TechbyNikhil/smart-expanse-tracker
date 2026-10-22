import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export const SummaryCard = ({
  title,
  amount,
  change,
  period = 'vs last month',
  icon: Icon,
  iconColor = '#10B981',
  iconBg = 'rgba(16, 185, 129, 0.15)',
  isExpenseCard = false,
  badgeText = null,
}) => {
  // If it's an expense card, an increase in expense is undesirable (red), and a decrease is positive (green)
  // For income, balance, savings, an increase is positive (green), and a decrease is undesirable (red)
  const isPositiveChange = change > 0;
  const isNegativeChange = change < 0;
  const isNeutralChange = change === 0;

  let isGood = isPositiveChange;
  if (isExpenseCard) {
    isGood = isNegativeChange; // lower expenses is good
  }

  return (
    <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden group hover:border-[#384b66] transition-all duration-300">
      {/* Decorative gradient blob */}
      <div
        className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ backgroundColor: iconColor }}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#94A3B8]">
          {title}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: iconBg,
            borderColor: `${iconColor}40`,
            color: iconColor,
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC] font-mono">
          {formatCurrency(amount)}
        </h3>

        {/* Change Comparison Indicator */}
        <div className="flex items-center space-x-2 text-xs">
          {badgeText ? (
            <span className="font-semibold text-emerald-400 py-0.5 px-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {badgeText}
            </span>
          ) : (
            <div
              className={`flex items-center space-x-1 font-semibold py-0.5 px-2 rounded-full border ${
                isNeutralChange
                  ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  : isGood
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {isNeutralChange ? (
                <Minus className="w-3 h-3" />
              ) : isPositiveChange ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}

          <span className="text-[#94A3B8] text-[11px] sm:text-xs">{period}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
