import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import Modal from './Modal';

export const TransactionFormModal = () => {
  const {
    isModalOpen,
    closeModal,
    addTransaction,
    editTransaction,
    editingTransaction,
  } = useExpense();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI / GPay / PhonePe',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title || '',
        amount: editingTransaction.amount || '',
        type: editingTransaction.type || 'expense',
        category: editingTransaction.category || 'Food & Dining',
        date: editingTransaction.date || new Date().toISOString().split('T')[0],
        paymentMethod: editingTransaction.paymentMethod || 'UPI / GPay / PhonePe',
        notes: editingTransaction.notes || '',
      });
      setErrors({});
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI / GPay / PhonePe',
        notes: '',
      });
      setErrors({});
    }
  }, [editingTransaction, isModalOpen]);

  // Filter categories based on transaction type
  const availableCategories = CATEGORIES.filter(
    (cat) => cat.type === 'both' || cat.type === formData.type
  );

  const handleTypeChange = (newType) => {
    // Pick the first valid category for this type
    const validCats = CATEGORIES.filter((c) => c.type === 'both' || c.type === newType);
    const newCategory = validCats.length > 0 ? validCats[0].name : 'Other';
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newCategory,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }

    if (!formData.amount) {
      errs.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be greater than ₹0';
    }

    if (!formData.date) {
      errs.date = 'Date is required';
    }

    if (!formData.category) {
      errs.category = 'Category is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTransaction) {
      editTransaction(editingTransaction.id, formData);
    } else {
      addTransaction(formData);
    }

    closeModal();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Selector (Income vs Expense) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-[#0B1120] rounded-xl border border-[#273449]">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                formData.type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                formData.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Amount (₹) <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#94A3B8]">
              ₹
            </span>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full bg-[#1E293B] border rounded-xl py-3 pl-9 pr-4 text-lg font-semibold text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.amount
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-[#273449] focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="flex items-center text-xs text-rose-400 mt-1.5 space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.amount}</span>
            </p>
          )}
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Title / Description <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="e.g. Grocery store, Salary payout, Electric bill"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full bg-[#1E293B] border rounded-xl py-2.5 sm:py-2 pl-10 pr-4 text-base sm:text-sm font-medium text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-[#273449] focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.title && (
            <p className="flex items-center text-xs text-rose-400 mt-1.5 space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Category & Payment Method in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Category <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 sm:py-2 pl-10 pr-4 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none transition-all cursor-pointer"
              >
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-[#172033] text-[#F8FAFC]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-xs text-rose-400 mt-1.5">{errors.category}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Payment Method
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 sm:py-2 pl-10 pr-4 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none transition-all cursor-pointer"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method} className="bg-[#172033] text-[#F8FAFC]">
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Date <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full bg-[#1E293B] border rounded-xl py-2.5 sm:py-2 pl-10 pr-4 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:ring-2 transition-all ${
                errors.date
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-[#273449] focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.date && (
            <p className="text-xs text-rose-400 mt-1.5">{errors.date}</p>
          )}
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Notes (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="Add any additional details or tags..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 px-4 text-base sm:text-sm font-medium text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-3 border-t border-[#273449]">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 py-3 sm:py-2.5 px-4 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#1E293B] hover:bg-[#273449] transition-all min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 sm:py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-1.5 min-h-[44px]"
          >
            <span>{editingTransaction ? 'Save Changes' : 'Add Transaction'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
