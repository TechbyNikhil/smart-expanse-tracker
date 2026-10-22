/**
 * Utility functions for Indian Rupee (₹) formatting and number handling
 */

export const formatCurrency = (amount, includeDecimal = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimal ? 2 : 0,
    maximumFractionDigits: includeDecimal ? 2 : 0,
  });

  const formatted = formatter.format(absNum);
  return isNegative ? `-${formatted}` : formatted;
};

export const formatCompactCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Math.abs(Number(amount));
  const sign = Number(amount) < 0 ? '-' : '';

  if (num >= 10000000) {
    return `${sign}₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `${sign}₹${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `${sign}₹${(num / 1000).toFixed(1)}k`;
  }

  return `${sign}₹${num}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};
