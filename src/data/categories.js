export const CATEGORIES = [
  // Expense Categories
  {
    id: 'food',
    name: 'Food & Dining',
    type: 'expense',
    icon: 'UtensilsCrossed',
    color: '#F59E0B', // Amber
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    icon: 'ShoppingBag',
    color: '#EC4899', // Pink
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.3)',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    type: 'expense',
    icon: 'Car',
    color: '#3B82F6', // Blue
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    type: 'expense',
    icon: 'Receipt',
    color: '#8B5CF6', // Purple
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.3)',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'expense',
    icon: 'Film',
    color: '#F43F5E', // Rose
    bg: 'rgba(244, 63, 94, 0.15)',
    border: 'rgba(244, 63, 94, 0.3)',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    type: 'expense',
    icon: 'HeartPulse',
    color: '#06B6D4', // Cyan
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.3)',
  },
  {
    id: 'education',
    name: 'Education',
    type: 'expense',
    icon: 'GraduationCap',
    color: '#10B981', // Emerald
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  
  // Income Categories
  {
    id: 'salary',
    name: 'Salary',
    type: 'income',
    icon: 'Briefcase',
    color: '#22C55E', // Green
    bg: 'rgba(34, 197, 94, 0.15)',
    border: 'rgba(34, 197, 94, 0.3)',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    icon: 'Laptop',
    color: '#14B8A6', // Teal
    bg: 'rgba(20, 184, 166, 0.15)',
    border: 'rgba(20, 184, 166, 0.3)',
  },
  {
    id: 'investments',
    name: 'Investments',
    type: 'income',
    icon: 'TrendingUp',
    color: '#6366F1', // Indigo
    bg: 'rgba(99, 102, 241, 0.15)',
    border: 'rgba(99, 102, 241, 0.3)',
  },
  
  // General / Other
  {
    id: 'other',
    name: 'Other',
    type: 'both',
    icon: 'MoreHorizontal',
    color: '#94A3B8', // Slate
    bg: 'rgba(148, 163, 184, 0.15)',
    border: 'rgba(148, 163, 184, 0.3)',
  },
];

export const PAYMENT_METHODS = [
  'UPI / GPay / PhonePe',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
];

export const getCategoryByName = (name) => {
  return CATEGORIES.find(c => c.name.toLowerCase() === (name || '').toLowerCase()) || {
    id: 'other',
    name: name || 'Other',
    icon: 'MoreHorizontal',
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.15)',
    border: 'rgba(148, 163, 184, 0.3)',
  };
};
