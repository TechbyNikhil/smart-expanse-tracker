import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-[#172033] border border-[#273449] rounded-2xl shadow-2xl p-4 sm:p-6 z-10 my-auto sm:my-8 transition-all duration-200 transform scale-100 max-h-[92vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-[#273449]">
          <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="pt-4 overflow-y-auto flex-1 pr-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
