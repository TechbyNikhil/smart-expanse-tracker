import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useExpense();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-[#172033]/95 border-emerald-500/40 text-emerald-400'
                : isError
                ? 'bg-[#172033]/95 border-rose-500/40 text-rose-400'
                : 'bg-[#172033]/95 border-blue-500/40 text-blue-400'
            }`}
          >
            <div className="flex items-center space-x-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />}
              {isInfo && <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />}
              <p className="text-sm font-medium text-slate-100">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
