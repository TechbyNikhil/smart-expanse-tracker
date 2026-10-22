import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  X,
  Inbox,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import CategoryIcon from './CategoryIcon';
import { CATEGORIES } from '../data/categories';

export const TransactionList = ({
  limit = null,
  showControls = true,
  title = 'Transactions',
  subtitle = null,
}) => {
  const {
    transactions,
    openAddModal,
    openEditModal,
    promptDeleteTransaction,
    globalSearch,
    setGlobalSearch,
  } = useExpense();

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'this-month', 'last-month'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Sync when globalSearch changes
  React.useEffect(() => {
    if (globalSearch !== searchTerm) {
      setSearchTerm(globalSearch);
    }
  }, [globalSearch]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setGlobalSearch(val);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setGlobalSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setSortBy('date-desc');
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.title.toLowerCase().includes(q) ||
          (tx.notes && tx.notes.toLowerCase().includes(q)) ||
          tx.category.toLowerCase().includes(q) ||
          (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((tx) => tx.category === categoryFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      if (dateFilter === 'this-month') {
        result = result.filter((tx) => {
          if (!tx.date) return false;
          const d = new Date(tx.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
      } else if (dateFilter === 'last-month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        result = result.filter((tx) => {
          if (!tx.date) return false;
          const d = new Date(tx.date);
          return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
        });
      }
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'amount-desc') {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === 'amount-asc') {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });

    if (limit && typeof limit === 'number') {
      return result.slice(0, limit);
    }

    return result;
  }, [transactions, searchTerm, typeFilter, categoryFilter, dateFilter, sortBy, limit]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    dateFilter !== 'all' ||
    sortBy !== 'date-desc';

  return (
    <div className="bg-[#172033] border border-[#273449] rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#F8FAFC] tracking-tight">{title}</h2>
          {subtitle ? (
            <p className="text-[11px] sm:text-xs md:text-sm text-[#94A3B8] mt-0.5">{subtitle}</p>
          ) : (
            <p className="text-[11px] sm:text-xs md:text-sm text-[#94A3B8] mt-0.5">
              Showing {filteredTransactions.length} of {transactions.length} records
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          {showControls && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                showFiltersPanel || hasActiveFilters
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#1E293B] border-[#273449] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          )}

          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (if controls enabled) */}
      {showControls && (
        <div className="space-y-4 mb-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by title, category, payment method, or notes..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 pl-10 pr-10 text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapsible / Expandable filter drawer */}
          {showFiltersPanel && (
            <div className="p-4 bg-[#0B1120] rounded-xl border border-[#273449] space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Type Filter */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#273449] rounded-lg py-2 px-3 text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">All Types (Income & Expense)</option>
                    <option value="income">Income Only (+)</option>
                    <option value="expense">Expense Only (-)</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#273449] rounded-lg py-2 px-3 text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Time Period</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#273449] rounded-lg py-2 px-3 text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">All Time</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#273449] rounded-lg py-2 px-3 text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="date-desc">Date: Newest First</option>
                    <option value="date-asc">Date: Oldest First</option>
                    <option value="amount-desc">Amount: High to Low</option>
                    <option value="amount-asc">Amount: Low to High</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end pt-2 border-t border-[#273449]">
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Transaction Records Table / List */}
      {filteredTransactions.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-[#0B1120]/40 rounded-xl border border-dashed border-[#273449]">
          <div className="w-12 h-12 rounded-2xl bg-[#1E293B] flex items-center justify-center text-[#94A3B8]">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-[#F8FAFC]">No transactions found</h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-sm">
              {hasActiveFilters
                ? 'Try adjusting your filters or search keywords to find what you are looking for.'
                : 'Start tracking your financial journey by adding your first transaction today.'}
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              onClick={clearAllFilters}
              className="mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1.5 px-3 rounded-lg bg-emerald-500/10"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={openAddModal}
              className="mt-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 py-2 px-4 rounded-xl shadow-md"
            >
              Add First Transaction
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[#273449]/60">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="py-3 sm:py-3.5 px-1.5 sm:px-2 flex items-center justify-between group hover:bg-[#1E293B]/40 rounded-xl transition-all"
              >
                {/* Left: Category Icon & Title & Details */}
                <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <CategoryIcon categoryName={tx.category} size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC] truncate">{tx.title}</p>
                      <span className="hidden sm:inline-block text-[11px] font-medium py-0.5 px-2 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#273449]">
                        {tx.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{formatDate(tx.date)}</span>
                      </span>
                      {tx.paymentMethod && (
                        <span className="hidden md:flex items-center space-x-1">
                          <CreditCard className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{tx.paymentMethod}</span>
                        </span>
                      )}
                      {tx.notes && (
                        <span className="hidden lg:inline-block text-slate-400 truncate max-w-[200px]" title={tx.notes}>
                          • {tx.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0 ml-2">
                  <div className="text-right">
                    <span
                      className={`text-xs sm:text-sm md:text-base font-bold font-mono ${
                        isIncome ? 'text-[#22C55E]' : 'text-[#F43F5E]'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider block sm:hidden">
                      {tx.category}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-0.5 sm:space-x-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(tx)}
                      className="p-1 sm:p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-lg transition-colors"
                      title="Edit transaction"
                      aria-label="Edit transaction"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => promptDeleteTransaction(tx)}
                      className="p-1 sm:p-1.5 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete transaction"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
