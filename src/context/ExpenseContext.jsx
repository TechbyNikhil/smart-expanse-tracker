import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_USER_PROFILE } from '../data/defaultData';
import {
  calculateSummary,
  calculateBudgetProgress,
  calculateMonthlyTrends,
  calculateCategoryBreakdown,
  calculateDailySpendingTrends,
} from '../utils/calculations';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  // Persistent State
  const [transactions, setTransactions] = useLocalStorage('spendwise_transactions', INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useLocalStorage('spendwise_budgets', INITIAL_BUDGETS);
  const [userProfile, setUserProfile] = useLocalStorage('spendwise_profile', INITIAL_USER_PROFILE);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Global Quick Search Keyword (Navbar & Transactions sync)
  const [globalSearch, setGlobalSearch] = useState('');

  // Toast Notification state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Transaction Operations
  const addTransaction = (newTx) => {
    const transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      amount: Number(newTx.amount),
    };
    setTransactions((prev) => [transaction, ...prev]);
    showToast(`Transaction "${newTx.title}" added successfully!`, 'success');
  };

  const editTransaction = (id, updatedFields) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updatedFields, amount: Number(updatedFields.amount) } : tx))
    );
    showToast('Transaction updated successfully!', 'success');
  };

  const deleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    showToast(`Deleted "${target?.title || 'transaction'}"`, 'info');
  };

  const promptDeleteTransaction = (tx) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Transaction',
      message: `Are you sure you want to permanently delete "${tx.title}" (₹${Number(tx.amount).toLocaleString('en-IN')})? This will update your financial balance.`,
      onConfirm: () => {
        deleteTransaction(tx.id);
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      },
    });
  };

  const promptResetDemoData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Demo Data',
      message: 'This will restore the sample dataset with realistic multi-month expenses, incomes, and budgets. Custom transactions will be overwritten.',
      onConfirm: () => {
        setTransactions(INITIAL_TRANSACTIONS);
        setBudgets(INITIAL_BUDGETS);
        setUserProfile(INITIAL_USER_PROFILE);
        showToast('Demo data restored successfully!', 'success');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      },
    });
  };

  const promptClearAllData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear All Transactions',
      message: 'Are you sure you want to delete all transactions and reset data? This cannot be undone.',
      onConfirm: () => {
        setTransactions([]);
        showToast('All transaction records cleared.', 'info');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
      },
    });
  };

  // Budget Operations
  const setMonthlyBudget = (amount) => {
    setBudgets((prev) => ({
      ...prev,
      monthlyLimit: Number(amount),
    }));
    showToast('Overall monthly budget updated!', 'success');
  };

  const setCategoryBudget = (category, amount) => {
    setBudgets((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: Number(amount),
      },
    }));
    showToast(`Budget for ${category} updated!`, 'success');
  };

  const removeCategoryBudget = (category) => {
    setBudgets((prev) => {
      const nextCats = { ...prev.categories };
      delete nextCats[category];
      return {
        ...prev,
        categories: nextCats,
      };
    });
    showToast(`Removed budget for ${category}`, 'info');
  };

  // Modal Handlers
  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Live Calculations (Memoized for peak UI responsiveness)
  const summary = useMemo(() => calculateSummary(transactions), [transactions]);
  const budgetProgress = useMemo(() => calculateBudgetProgress(transactions, budgets), [transactions, budgets]);
  const monthlyTrends = useMemo(() => calculateMonthlyTrends(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(transactions, true), [transactions]);
  const allTimeCategoryBreakdown = useMemo(() => calculateCategoryBreakdown(transactions, false), [transactions]);
  const dailySpendingTrends = useMemo(() => calculateDailySpendingTrends(transactions), [transactions]);

  const value = {
    transactions,
    budgets,
    userProfile,
    setUserProfile,
    summary,
    budgetProgress,
    monthlyTrends,
    categoryBreakdown,
    allTimeCategoryBreakdown,
    dailySpendingTrends,
    addTransaction,
    editTransaction,
    deleteTransaction,
    promptDeleteTransaction,
    promptResetDemoData,
    promptClearAllData,
    setMonthlyBudget,
    setCategoryBudget,
    removeCategoryBudget,
    isModalOpen,
    editingTransaction,
    openAddModal,
    openEditModal,
    closeModal,
    confirmDialog,
    setConfirmDialog,
    globalSearch,
    setGlobalSearch,
    toasts,
    showToast,
    removeToast,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
