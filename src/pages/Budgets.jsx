import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  PiggyBank,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatCurrency';
import BudgetCard from '../components/BudgetCard';
import BudgetModal from '../components/BudgetModal';

export const Budgets = () => {
  const {
    budgets,
    budgetProgress,
    removeCategoryBudget,
  } = useExpense();

  const [modalState, setModalState] = useState({
    isOpen: false,
    category: null,
    amount: '',
  });

  const handleOpenAdd = () => {
    setModalState({ isOpen: true, category: null, amount: '' });
  };

  const handleEditOverall = () => {
    setModalState({
      isOpen: true,
      category: 'Overall Monthly',
      amount: budgets.monthlyLimit || 100000,
    });
  };

  const handleEditCategory = (catName, currentLimit) => {
    setModalState({
      isOpen: true,
      category: catName,
      amount: currentLimit,
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, category: null, amount: '' });
  };

  const { overall, categories } = budgetProgress;

  // Identify categories with warnings or exceeded limits
  const alertedCategories = categories.filter((c) => c.status !== 'normal');

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Budgets & Expense Guardrails
          </h2>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-0.5 sm:mt-1">
            Set spending boundaries for categories and stay ahead of monthly expenses.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category Budget</span>
          </button>
        </div>
      </div>

      {/* Main Overall Monthly Budget Hero Card */}
      <div className="bg-[#172033] border border-[#273449] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Overall Monthly Limit
              </span>
              <span
                className={`text-[11px] font-semibold py-0.5 px-2 rounded-full border ${
                  overall.status === 'exceeded'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : overall.status === 'warning'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {overall.status === 'exceeded'
                  ? 'Exceeded'
                  : overall.status === 'warning'
                  ? 'Approaching Limit'
                  : 'Healthy Budget'}
              </span>
            </div>

            <div className="flex items-baseline space-x-2 sm:space-x-3 flex-wrap">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-[#F8FAFC]">
                {formatCurrency(overall.spent)}
              </h3>
              <span className="text-xs sm:text-sm md:text-base text-[#94A3B8] font-mono">
                / {formatCurrency(overall.budget)}
              </span>
            </div>

            <p className="text-xs text-[#94A3B8]">
              {overall.isOver ? (
                <span className="text-rose-400 font-semibold">
                  You have exceeded your overall budget limit by {formatCurrency(overall.overAmount)}.
                </span>
              ) : (
                <span>
                  You have <strong className="text-emerald-400 font-mono">{formatCurrency(overall.remaining)}</strong> remaining to spend this month.
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleEditOverall}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 py-2.5 sm:py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-[#F8FAFC] transition-colors min-h-[40px]"
            >
              <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Adjust Monthly Limit</span>
            </button>
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="w-full h-3.5 bg-[#0B1120] rounded-full overflow-hidden border border-[#273449]/70 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overall.status === 'exceeded'
                  ? 'bg-rose-500'
                  : overall.status === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, overall.percentage)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#94A3B8] font-mono">
            <span>0%</span>
            <span>{overall.percentage}% Utilized</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Warning Alert Banner (if any budget has exceeded or warning) */}
      {alertedCategories.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3.5 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-300">
              Attention Required: {alertedCategories.length} category {alertedCategories.length === 1 ? 'is' : 'are'} nearing or over budget
            </h4>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              {alertedCategories.map((c) => `${c.category} (${c.percentage}%)`).join(', ')}. Review pending transactions or adjust monthly allocations.
            </p>
          </div>
        </div>
      )}

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            Category Budgets ({categories.length})
          </h3>
          <span className="text-xs text-[#94A3B8]">
            Auto-calculated from actual monthly transactions
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="bg-[#172033] border border-[#273449] rounded-2xl p-12 text-center space-y-3">
            <p className="text-sm text-[#94A3B8]">No category budgets set up yet.</p>
            <button
              onClick={handleOpenAdd}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 py-2 px-4 rounded-xl shadow-md"
            >
              Add First Category Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {categories.map((catItem) => (
              <BudgetCard
                key={catItem.category}
                item={catItem}
                onEdit={handleEditCategory}
                onDelete={removeCategoryBudget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for Setting/Updating Budgets */}
      <BudgetModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        initialCategory={modalState.category}
        initialAmount={modalState.amount}
      />
    </div>
  );
};

export default Budgets;
