import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import CategoryIcon from './CategoryIcon';

export const BudgetCard = ({ item, onEdit, onDelete }) => {
  const { category, budget, spent, remaining, percentage, status, isOver, overAmount } = item;

  // Status-based styling
  let progressColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let statusText = 'On Track';
  let StatusIcon = CheckCircle;

  if (status === 'exceeded') {
    progressColor = 'bg-[#F43F5E]';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    statusText = 'Exceeded';
    StatusIcon = AlertCircle;
  } else if (status === 'warning') {
    progressColor = 'bg-[#F59E0B]';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    statusText = 'Near Limit';
    StatusIcon = AlertTriangle;
  }

  // Cap display percentage bar at 100% so it doesn't overflow container
  const progressWidth = Math.min(100, Math.max(0, percentage));

  return (
    <div className="bg-[#172033] border border-[#273449] rounded-2xl p-5 shadow-xl hover:border-[#384b66] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <CategoryIcon categoryName={category} size={20} />
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC] tracking-tight">{category}</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold py-0.5 px-2 rounded-full border ${badgeColor}`}>
                <StatusIcon className="w-3 h-3" />
                <span>{statusText}</span>
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {percentage}% used
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={() => onEdit(category, budget)}
              className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-lg transition-colors"
              title="Edit Budget"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(category)}
              className="p-1.5 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Remove Budget"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Financial Numbers */}
      <div className="flex items-baseline justify-between mb-2.5">
        <div>
          <span className="text-xs text-[#94A3B8]">Spent: </span>
          <span className="text-sm font-bold font-mono text-[#F8FAFC]">{formatCurrency(spent)}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#94A3B8]">Limit: </span>
          <span className="text-sm font-bold font-mono text-slate-300">{formatCurrency(budget)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-[#0B1120] rounded-full overflow-hidden border border-[#273449]/60 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Remaining / Exceeded footer */}
      <div className="flex items-center justify-between mt-3 text-xs">
        {isOver ? (
          <span className="text-rose-400 font-semibold flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Over budget by {formatCurrency(overAmount)}</span>
          </span>
        ) : (
          <span className="text-[#94A3B8]">
            Remaining: <span className="font-semibold text-emerald-400 font-mono">{formatCurrency(remaining)}</span>
          </span>
        )}

        <span className="text-[11px] text-slate-500">This Month</span>
      </div>
    </div>
  );
};

export default BudgetCard;
