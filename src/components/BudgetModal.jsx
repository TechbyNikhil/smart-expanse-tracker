import React, { useState, useEffect } from 'react';
import { Tag, DollarSign, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { CATEGORIES } from '../data/categories';
import { useExpense } from '../context/ExpenseContext';

export const BudgetModal = ({ isOpen, onClose, initialCategory = null, initialAmount = '' }) => {
  const { setCategoryBudget, setMonthlyBudget } = useExpense();
  
  const [budgetType, setBudgetType] = useState('category'); // 'category' | 'overall'
  const [category, setCategory] = useState(initialCategory || 'Food & Dining');
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '');
  const [error, setError] = useState('');

  // Filter only expense categories
  const expenseCategories = CATEGORIES.filter((c) => c.type === 'expense' || c.type === 'both');

  useEffect(() => {
    if (initialCategory) {
      if (initialCategory === 'Overall Monthly') {
        setBudgetType('overall');
      } else {
        setBudgetType('category');
        setCategory(initialCategory);
      }
      setAmount(initialAmount ? String(initialAmount) : '');
    } else {
      setBudgetType('category');
      setCategory('Food & Dining');
      setAmount('');
    }
    setError('');
  }, [isOpen, initialCategory, initialAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }

    if (budgetType === 'overall') {
      setMonthlyBudget(Number(amount));
    } else {
      setCategoryBudget(category, Number(amount));
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCategory ? 'Update Budget' : 'Set New Budget'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle between Overall Monthly limit and Category limit */}
        {!initialCategory && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Budget Target
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B1120] rounded-xl border border-[#273449]">
              <button
                type="button"
                onClick={() => setBudgetType('category')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  budgetType === 'category'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Specific Category
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('overall')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  budgetType === 'overall'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Overall Monthly Limit
              </button>
            </div>
          </div>
        )}

        {budgetType === 'category' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Expense Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              <select
                value={category}
                disabled={Boolean(initialCategory && initialCategory !== 'Overall Monthly')}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 sm:py-2 pl-10 pr-4 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 cursor-pointer"
              >
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#172033] text-[#F8FAFC]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Budget Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Monthly Budget Limit (₹) <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#94A3B8]">
              ₹
            </span>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-3 pl-9 pr-4 text-lg font-bold text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
            />
          </div>
          {error && (
            <p className="flex items-center text-xs text-rose-400 mt-1.5 space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-3 border-t border-[#273449]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 sm:py-2.5 px-4 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#1E293B] hover:bg-[#273449] transition-all min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 sm:py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all min-h-[44px]"
          >
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
