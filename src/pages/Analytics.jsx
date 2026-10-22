import React, { useState, useMemo } from 'react';
import {
  Calendar,
  TrendingDown,
  TrendingUp,
  PieChart as PieIcon,
  Flame,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { calculateAnalyticsData } from '../utils/calculations';
import { formatCurrency } from '../utils/formatCurrency';
import {
  MonthlyExpenseBarChart,
  CategoryDonutChart,
  DailySpendingTrendChart,
} from '../components/ExpenseChart';
import CategoryIcon from '../components/CategoryIcon';

export const Analytics = () => {
  const { transactions, monthlyTrends, dailySpendingTrends } = useExpense();

  // Period filter: 'this-month' | 'last-month' | 'last-3-months' | 'custom'
  const [period, setPeriod] = useState('this-month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Calculate analytics metrics based on selection
  const analytics = useMemo(() => {
    return calculateAnalyticsData(transactions, period, customStart, customEnd);
  }, [transactions, period, customStart, customEnd]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Financial Analytics & Insights
          </h2>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
            Deep dive into your spending habits, trends, and category distribution.
          </p>
        </div>

        {/* Period Selector Tabs - scrollable on mobile */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#172033] rounded-xl border border-[#273449] overflow-x-auto no-scrollbar w-full sm:w-auto flex-nowrap">
          <button
            onClick={() => setPeriod('this-month')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              period === 'this-month'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('last-month')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              period === 'last-month'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setPeriod('last-3-months')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              period === 'last-3-months'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Last 3 Months
          </button>
          <button
            onClick={() => setPeriod('custom')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              period === 'custom'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Custom Date Range Pickers (if Custom is chosen) */}
      {period === 'custom' && (
        <div className="p-3.5 sm:p-4 bg-[#172033] border border-[#273449] rounded-2xl flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:space-x-2">
            <span className="text-xs font-semibold text-[#94A3B8]">Start Date:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-[#1E293B] border border-[#273449] rounded-xl py-2 sm:py-1.5 px-3 text-sm sm:text-xs text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:space-x-2">
            <span className="text-xs font-semibold text-[#94A3B8]">End Date:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-[#1E293B] border border-[#273449] rounded-xl py-2 sm:py-1.5 px-3 text-sm sm:text-xs text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Analytics Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Spending */}
        <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8]">Total Spending</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold font-mono text-[#F8FAFC]">
            {formatCurrency(analytics.totalExpenses)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1.5">
            Outflow in selected period
          </p>
        </div>

        {/* Highest Spending Category */}
        <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8]">Top Expense Category</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-xl font-extrabold text-[#F8FAFC] truncate">
              {analytics.highestCategory.name}
            </h3>
            {analytics.highestCategory.amount > 0 && (
              <span className="text-xs font-bold text-amber-400 font-mono">
                ({analytics.highestCategory.percentage}%)
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1.5 font-mono">
            {formatCurrency(analytics.highestCategory.amount)} spent
          </p>
        </div>

        {/* Average Daily Expenses */}
        <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8]">Daily Burn Rate</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold font-mono text-[#F8FAFC]">
            {formatCurrency(analytics.averageDailyExpense)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1.5">
            Average spent per active day
          </p>
        </div>

        {/* Net Savings */}
        <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8]">Period Net Savings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-extrabold font-mono ${analytics.netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(analytics.netSavings)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1.5">
            Income minus expenses
          </p>
        </div>
      </div>

      {/* Charts Section: Monthly Income vs Expenses Comparison + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-[#172033] border border-[#273449] rounded-2xl p-5 md:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#F8FAFC]">
                Monthly Income vs. Expenses Comparison
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Visual side-by-side performance of inflows and outflows
              </p>
            </div>
          </div>
          <MonthlyExpenseBarChart data={monthlyTrends} height={300} />
        </div>

        {/* Category Breakdown Donut */}
        <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 md:p-6 shadow-xl">
          <div className="mb-2">
            <h3 className="text-base md:text-lg font-bold text-[#F8FAFC]">
              Category Allocation
            </h3>
            <p className="text-xs text-[#94A3B8]">Share of expenses in selected period</p>
          </div>
          <CategoryDonutChart data={analytics.categoryList} height={250} />
        </div>
      </div>

      {/* Spending Trend Line Chart */}
      <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-bold text-[#F8FAFC]">
            Daily Spending Trajectory
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Daily expense amounts and cumulative month burn
          </p>
        </div>
        <DailySpendingTrendChart data={dailySpendingTrends} height={280} />
      </div>

      {/* Category Breakdown Table / Detailed Progress */}
      <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 md:p-6 shadow-xl">
        <h3 className="text-base md:text-lg font-bold text-[#F8FAFC] mb-4">
          Category-Wise Spending Ranking
        </h3>

        {analytics.categoryList.length === 0 ? (
          <p className="text-sm text-[#94A3B8] py-6 text-center">No expenses in this period</p>
        ) : (
          <div className="space-y-4">
            {analytics.categoryList.map((item, index) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-slate-500 font-bold text-xs w-4">#{index + 1}</span>
                    <CategoryIcon categoryName={item.name} size={16} />
                    <span className="font-semibold text-[#F8FAFC]">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-[#F8FAFC]">
                      {formatCurrency(item.value)}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 py-0.5 px-2 rounded-full border border-emerald-500/20">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-[#0B1120] rounded-full overflow-hidden border border-[#273449]/60">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
