/**
 * Financial calculation engine for SpendWise
 */

// Helper to check if a date string falls in the given month and year
export const isSameMonthAndYear = (dateStr, targetDate = new Date()) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear();
};

// Helper to get previous month date
export const getPreviousMonthDate = (date = new Date()) => {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d;
};

/**
 * Calculates current month summary vs previous month summary
 */
export const calculateSummary = (transactions = []) => {
  const now = new Date();
  const prevMonthDate = getPreviousMonthDate(now);

  let currentMonthIncome = 0;
  let currentMonthExpense = 0;
  let prevMonthIncome = 0;
  let prevMonthExpense = 0;

  let allTimeIncome = 0;
  let allTimeExpense = 0;

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    const isIncome = tx.type === 'income';

    if (isIncome) {
      allTimeIncome += amount;
    } else {
      allTimeExpense += amount;
    }

    if (isSameMonthAndYear(tx.date, now)) {
      if (isIncome) {
        currentMonthIncome += amount;
      } else {
        currentMonthExpense += amount;
      }
    } else if (isSameMonthAndYear(tx.date, prevMonthDate)) {
      if (isIncome) {
        prevMonthIncome += amount;
      } else {
        prevMonthExpense += amount;
      }
    }
  });

  const totalBalance = allTimeIncome - allTimeExpense;
  const currentSavings = currentMonthIncome - currentMonthExpense;
  const prevSavings = prevMonthIncome - prevMonthExpense;

  // Percentage change calculations
  const calculateChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const incomeChange = calculateChange(currentMonthIncome, prevMonthIncome);
  const expenseChange = calculateChange(currentMonthExpense, prevMonthExpense);
  const savingsChange = calculateChange(currentSavings, prevSavings);
  
  // Previous balance change
  const prevBalance = (allTimeIncome - currentMonthIncome) - (allTimeExpense - currentMonthExpense);
  const balanceChange = calculateChange(totalBalance, prevBalance);

  return {
    totalBalance,
    balanceChange,
    currentMonthIncome,
    incomeChange,
    currentMonthExpense,
    expenseChange,
    currentSavings,
    savingsChange,
    savingsRate: currentMonthIncome > 0 ? Math.max(0, Math.round((currentSavings / currentMonthIncome) * 100)) : 0,
    allTimeIncome,
    allTimeExpense,
  };
};

/**
 * Groups transactions by category for expense donut chart
 */
export const calculateCategoryBreakdown = (transactions = [], filterMonthOnly = true) => {
  const now = new Date();
  const filtered = filterMonthOnly
    ? transactions.filter((tx) => tx.type === 'expense' && isSameMonthAndYear(tx.date, now))
    : transactions.filter((tx) => tx.type === 'expense');

  const categoryTotals = {};
  let totalExpenses = 0;

  filtered.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    const cat = tx.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    totalExpenses += amount;
  });

  return Object.keys(categoryTotals).map((category) => {
    const amount = categoryTotals[category];
    const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
    return {
      name: category,
      value: amount,
      percentage,
    };
  }).sort((a, b) => b.value - a.value);
};

/**
 * Calculates monthly trends for bar & line charts
 */
export const calculateMonthlyTrends = (transactions = []) => {
  const monthMap = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize last 6 months in chronological order
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap[key] = {
      key,
      month: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      income: 0,
      expense: 0,
      savings: 0,
    };
  }

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const amount = Number(tx.amount) || 0;

    if (monthMap[key]) {
      if (tx.type === 'income') {
        monthMap[key].income += amount;
      } else {
        monthMap[key].expense += amount;
      }
      monthMap[key].savings = monthMap[key].income - monthMap[key].expense;
    }
  });

  return Object.values(monthMap);
};

/**
 * Calculates daily spending trends for the current month
 */
export const calculateDailySpendingTrends = (transactions = []) => {
  const now = new Date();
  const currentMonthTxs = transactions.filter(
    (tx) => tx.type === 'expense' && isSameMonthAndYear(tx.date, now)
  );

  // Group by day of current month
  const dayMap = {};
  currentMonthTxs.forEach((tx) => {
    const day = new Date(tx.date).getDate();
    dayMap[day] = (dayMap[day] || 0) + Number(tx.amount || 0);
  });

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const trendData = [];

  let cumulative = 0;
  for (let day = 1; day <= Math.min(daysInMonth, Math.max(currentDay, 20)); day++) {
    const dailySpent = dayMap[day] || 0;
    cumulative += dailySpent;
    trendData.push({
      day: `Day ${day}`,
      spent: dailySpent,
      cumulative,
    });
  }

  return trendData;
};

/**
 * Calculates budget status per category and overall
 */
export const calculateBudgetProgress = (transactions = [], budgets = {}) => {
  const now = new Date();
  const currentMonthExpenses = transactions.filter(
    (tx) => tx.type === 'expense' && isSameMonthAndYear(tx.date, now)
  );

  const spentPerCategory = {};
  let totalSpent = 0;

  currentMonthExpenses.forEach((tx) => {
    const cat = tx.category || 'Other';
    const amount = Number(tx.amount) || 0;
    spentPerCategory[cat] = (spentPerCategory[cat] || 0) + amount;
    totalSpent += amount;
  });

  const categoriesConfig = budgets.categories || {};
  const overallLimit = budgets.monthlyLimit || 100000;

  const categoryProgress = Object.keys(categoriesConfig).map((category) => {
    const budget = categoriesConfig[category] || 0;
    const spent = spentPerCategory[category] || 0;
    const remaining = Math.max(0, budget - spent);
    const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;

    let status = 'normal'; // green
    if (percentage >= 100) {
      status = 'exceeded'; // red
    } else if (percentage >= 80) {
      status = 'warning'; // amber
    }

    return {
      category,
      budget,
      spent,
      remaining,
      percentage,
      status,
      isOver: spent > budget,
      overAmount: Math.max(0, spent - budget),
    };
  });

  const overallPercentage = overallLimit > 0 ? Math.round((totalSpent / overallLimit) * 100) : 0;
  let overallStatus = 'normal';
  if (overallPercentage >= 100) overallStatus = 'exceeded';
  else if (overallPercentage >= 80) overallStatus = 'warning';

  return {
    overall: {
      budget: overallLimit,
      spent: totalSpent,
      remaining: Math.max(0, overallLimit - totalSpent),
      percentage: overallPercentage,
      status: overallStatus,
      isOver: totalSpent > overallLimit,
      overAmount: Math.max(0, totalSpent - overallLimit),
    },
    categories: categoryProgress,
  };
};

/**
 * Analytics page detailed calculations
 */
export const calculateAnalyticsData = (transactions = [], period = 'this-month', customStart = null, customEnd = null) => {
  const now = new Date();
  let filtered = [];

  if (period === 'this-month') {
    filtered = transactions.filter((tx) => isSameMonthAndYear(tx.date, now));
  } else if (period === 'last-month') {
    const prev = getPreviousMonthDate(now);
    filtered = transactions.filter((tx) => isSameMonthAndYear(tx.date, prev));
  } else if (period === 'last-3-months') {
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    filtered = transactions.filter((tx) => new Date(tx.date) >= threeMonthsAgo);
  } else if (period === 'custom' && customStart && customEnd) {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
    filtered = transactions.filter((tx) => {
      const d = new Date(tx.date);
      return d >= start && d <= end;
    });
  } else {
    filtered = [...transactions];
  }

  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryExpenses = {};

  filtered.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
      const cat = tx.category || 'Other';
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + amount;
    }
  });

  // Highest spending category
  let highestCategory = { name: 'None', amount: 0, percentage: 0 };
  Object.entries(categoryExpenses).forEach(([cat, amount]) => {
    if (amount > highestCategory.amount) {
      highestCategory = {
        name: cat,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      };
    }
  });

  // Calculate average daily expenses
  // Number of active days in selection
  const daysCount = period === 'this-month' 
    ? Math.max(1, now.getDate()) 
    : period === 'last-month' 
      ? 30 
      : period === 'last-3-months' 
        ? 90 
        : 30;
  const averageDailyExpense = Math.round(totalExpenses / daysCount);

  // Category breakdown list
  const categoryList = Object.entries(categoryExpenses)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    filteredTransactions: filtered,
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    highestCategory,
    averageDailyExpense,
    categoryList,
  };
};
