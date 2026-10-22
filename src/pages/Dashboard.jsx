import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRight,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import SummaryCard from '../components/SummaryCard';
import { IncomeExpenseAreaChart, CategoryDonutChart } from '../components/ExpenseChart';
import TransactionList from '../components/TransactionList';
import { formatCurrency } from '../utils/formatCurrency';

export const Dashboard = () => {
  const {
    summary,
    monthlyTrends,
    categoryBreakdown,
    budgetProgress,
    openAddModal,
  } = useExpense();

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Financial Dashboard
          </h2>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-0.5 sm:mt-1">
            Real-time breakdown of your income, expenses, active budgets, and savings.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <SummaryCard
          title="Total Balance"
          amount={summary.totalBalance}
          change={summary.balanceChange}
          icon={Wallet}
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.15)"
        />
        <SummaryCard
          title="Total Income"
          amount={summary.currentMonthIncome}
          change={summary.incomeChange}
          icon={TrendingUp}
          iconColor="#22C55E"
          iconBg="rgba(34, 197, 94, 0.15)"
        />
        <SummaryCard
          title="Total Expenses"
          amount={summary.currentMonthExpense}
          change={summary.expenseChange}
          isExpenseCard={true}
          icon={TrendingDown}
          iconColor="#F43F5E"
          iconBg="rgba(244, 63, 94, 0.15)"
        />
        <SummaryCard
          title="Monthly Savings"
          amount={summary.currentSavings}
          change={summary.savingsChange}
          badgeText={`${summary.savingsRate}% saved`}
          icon={PiggyBank}
          iconColor="#8B5CF6"
          iconBg="rgba(139, 92, 246, 0.15)"
        />
      </div>

      {/* Charts Section: Income vs Expense Area + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Trend Chart */}
        <div className="lg:col-span-2 bg-[#172033] border border-[#273449] rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#F8FAFC]">
                Cash Flow Overview
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Income vs. Expenses across recent months
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-2">
            <IncomeExpenseAreaChart data={monthlyTrends} height={290} />
          </div>
        </div>

        {/* Expense Category Donut Chart */}
        <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#F8FAFC]">
                Expense Breakdown
              </h3>
              <p className="text-xs text-[#94A3B8]">Current month by category</p>
            </div>
          </div>

          <div className="pt-2">
            <CategoryDonutChart data={categoryBreakdown} height={250} />
          </div>
        </div>
      </div>

      {/* Bottom Grid: Budget Health Overview & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Budget Health Widget */}
        <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base md:text-lg font-bold text-[#F8FAFC]">
                  Monthly Budget Health
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Spent {formatCurrency(budgetProgress.overall.spent)} of {formatCurrency(budgetProgress.overall.budget)}
                </p>
              </div>
              <Link
                to="/budgets"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#94A3B8]">Overall Usage</span>
                <span
                  className={`font-mono font-bold ${
                    budgetProgress.overall.status === 'exceeded'
                      ? 'text-rose-400'
                      : budgetProgress.overall.status === 'warning'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {budgetProgress.overall.percentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-[#0B1120] rounded-full overflow-hidden border border-[#273449]/80 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetProgress.overall.status === 'exceeded'
                      ? 'bg-rose-500'
                      : budgetProgress.overall.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, budgetProgress.overall.percentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#94A3B8] pt-1">
                <span>Remaining: {formatCurrency(budgetProgress.overall.remaining)}</span>
                <span>{budgetProgress.overall.isOver ? 'Exceeded' : 'On track'}</span>
              </div>
            </div>

            {/* Top 3 Category Progress items */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top Category Budgets
              </h4>
              {budgetProgress.categories.slice(0, 3).map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#F8FAFC] font-medium">{cat.category}</span>
                    <span className="font-mono text-slate-400">
                      {formatCurrency(cat.spent)} / {formatCurrency(cat.budget)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0B1120] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cat.status === 'exceeded'
                          ? 'bg-rose-500'
                          : cat.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#273449]">
            <Link
              to="/budgets"
              className="w-full py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-[#273449] text-xs font-semibold text-center block text-[#F8FAFC] transition-colors"
            >
              View All Category Budgets
            </Link>
          </div>
        </div>

        {/* Recent Transactions List (with quick limit = 6) */}
        <div className="lg:col-span-2">
          <TransactionList
            limit={6}
            showControls={false}
            title="Recent Transactions"
            subtitle="Latest financial movements"
          />
          <div className="mt-3 text-center">
            <Link
              to="/transactions"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-2 px-4 rounded-xl hover:bg-emerald-500/10 transition-colors"
            >
              <span>View and manage all transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
