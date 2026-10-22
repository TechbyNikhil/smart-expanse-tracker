import React from 'react';
import { Download, Plus, FileSpreadsheet } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import TransactionList from '../components/TransactionList';

export const Transactions = () => {
  const { transactions, openAddModal, showToast } = useExpense();

  // Export transactions to CSV file
  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      showToast('No transactions to export', 'error');
      return;
    }

    const headers = ['ID', 'Title', 'Type', 'Amount (INR)', 'Category', 'Date', 'Payment Method', 'Notes'];
    const rows = transactions.map((t) => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.date,
      `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transactions exported to CSV successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Transaction History
          </h2>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-0.5 sm:mt-1">
            Search, filter, edit, and organize all your income and expense records.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-[#F8FAFC] transition-all min-h-[40px]"
            title="Export as CSV"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all min-h-[40px]"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Main Filterable Transaction Manager */}
      <TransactionList
        limit={null}
        showControls={true}
        title="All Records"
        subtitle="Manage and filter your full ledger"
      />
    </div>
  );
};

export default Transactions;
