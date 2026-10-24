import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  Database,
  Sliders,
  DollarSign,
  Heart,
  LogOut,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

export const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    userProfile,
    setUserProfile,
    transactions,
    budgets,
    promptResetDemoData,
    promptClearAllData,
    showToast,
  } = useExpense();

  const [name, setName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [jobTitle, setJobTitle] = useState(userProfile.jobTitle || '');
  const [savingsGoal, setSavingsGoal] = useState(userProfile.monthlySavingsGoal || 50000);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name,
      email,
      jobTitle,
      monthlySavingsGoal: Number(savingsGoal),
    }));
    showToast('Profile settings saved successfully!', 'success');
  };

  // Export full JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userProfile,
      transactions,
      budgets,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SpendWise_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON Backup downloaded!', 'success');
  };

  // Import JSON Backup
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          window.localStorage.setItem('spendwise_transactions', JSON.stringify(parsed.transactions));
          if (parsed.budgets) {
            window.localStorage.setItem('spendwise_budgets', JSON.stringify(parsed.budgets));
          }
          if (parsed.userProfile) {
            window.localStorage.setItem('spendwise_profile', JSON.stringify(parsed.userProfile));
          }
          showToast('Backup restored successfully! Reloading data...', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast('Invalid backup file format.', 'error');
        }
      } catch (err) {
        showToast('Error parsing backup JSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs md:text-sm text-[#94A3B8] mt-0.5 sm:mt-1">
          Manage your personal details, currency formatting, and data backups.
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-[#172033] border border-[#273449] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#273449] mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Personal Profile</h3>
            <p className="text-xs text-[#94A3B8]">Personalize your dashboard experience</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 px-3.5 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 px-3.5 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                Job Title / Occupation
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 px-3.5 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
                Monthly Savings Goal (₹)
              </label>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl py-2.5 px-3.5 text-base sm:text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all min-h-[42px]"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Currency & Locale System Card */}
      <div className="bg-[#172033] border border-[#273449] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#273449] mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Currency & Localization</h3>
            <p className="text-xs text-[#94A3B8]">Display and numeric formatting standards</p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1120] border border-[#273449]">
            <span className="text-[#94A3B8]">Default Currency</span>
            <span className="font-bold text-[#F8FAFC] font-mono">Indian Rupee (₹) — INR</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1120] border border-[#273449]">
            <span className="text-[#94A3B8]">Numbering System</span>
            <span className="font-bold text-[#F8FAFC] font-mono">Indian Format (Lakhs & Crores, e.g. ₹1,50,000)</span>
          </div>
        </div>
      </div>

      {/* Account Security & Active Session */}
      <div className="bg-[#172033] border border-[#273449] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#273449]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Active Session & Security</h3>
              <p className="text-xs text-[#94A3B8]">Current authentication status and session controls</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Session
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#273449]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
              Signed-in User
            </span>
            <span className="text-sm font-bold text-[#F8FAFC] mt-0.5 block truncate">
              {user?.name || userProfile?.name || 'Authorized Member'}
            </span>
            <span className="text-xs text-slate-400 block truncate font-mono mt-0.5">
              {user?.email || userProfile?.email}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#273449]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
              Security Protocol
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
              Encrypted Offline Storage
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              Protected by Client-side Token
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-xs text-[#94A3B8]">
            Need to switch accounts or end your current session?
          </p>
          <button
            type="button"
            onClick={() => {
              logout();
              showToast('You have been signed out.', 'info');
              navigate('/login');
            }}
            className="py-2.5 px-5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out from SpendWise</span>
          </button>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="bg-[#172033] border border-[#273449] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#273449]">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Data Management & Backup</h3>
            <p className="text-xs text-[#94A3B8]">Export or import your complete financial database</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-[#F8FAFC] transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Full JSON Backup</span>
          </button>

          <label className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-[#F8FAFC] transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Restore from JSON File</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>

        {/* Demo Data & Danger Zone */}
        <div className="pt-4 border-t border-[#273449] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Reset & Danger Zone
          </h4>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1120] border border-[#273449]">
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#F8FAFC]">Restore Demo Dataset</p>
              <p className="text-xs text-[#94A3B8]">
                Reloads rich sample transactions, charts, and budget limits.
              </p>
            </div>
            <button
              onClick={promptResetDemoData}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center space-x-1.5 flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1120] border border-[#273449]">
            <div>
              <p className="text-xs sm:text-sm font-bold text-rose-400">Clear All Transactions</p>
              <p className="text-xs text-[#94A3B8]">
                Permanently wipes all transactions from browser LocalStorage.
              </p>
            </div>
            <button
              onClick={promptClearAllData}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center justify-center space-x-1.5 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
