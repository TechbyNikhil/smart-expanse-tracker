import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { useExpense } from '../context/ExpenseContext';

export const ConfirmModal = () => {
  const { confirmDialog, setConfirmDialog } = useExpense();

  if (!confirmDialog.isOpen) return null;

  const handleClose = () => {
    setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  return (
    <Modal isOpen={confirmDialog.isOpen} onClose={handleClose} title={confirmDialog.title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            {confirmDialog.message}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full pt-4 border-t border-[#273449]">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#1E293B] hover:bg-[#273449] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirmDialog.onConfirm) {
                confirmDialog.onConfirm();
              }
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/25 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
