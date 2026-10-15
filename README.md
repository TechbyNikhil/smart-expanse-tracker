# SpendWise — Modern Financial Dashboard & Expense Tracker

SpendWise is a financial dashboard and expense tracker built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## ✨ Features

- **📊 Comprehensive Financial Dashboard**
  - Real-time **Total Balance**, **Total Income**, **Total Expenses**, and **Monthly Savings** cards with dynamic comparisons against the previous month.
  - Cash flow overview with income vs. expenses area chart.
  - Category expense donut chart with custom tooltips and legend.
  - Quick monthly budget health progress bar and alerts.
  - Recent transactions list with direct actions.

- **💳 Robust Transaction Management**
  - Add, edit, and delete transactions with confirmation dialogs.
  - Filter by transaction type (Income / Expense).
  - Filter by category and date range.
  - Sort by date (newest/oldest) or amount (highest/lowest).
  - Real-time live search across title, category, payment method, and notes.
  - Export full ledger to CSV format.

- **🎯 Budget Management & Visual Guardrails**
  - Set an overall monthly budget limit.
  - Set individual monthly budgets for specific categories.
  - Dynamic progress bars with color-coded warning states:
    - 🟢 **On Track** (< 80%)
    - 🟡 **Approaching Limit** (80% – 99.9%)
    - 🔴 **Exceeded** (≥ 100%)
  - Live remaining amount calculations and over-budget warnings.

- **📈 Deep Analytics & Insights**
  - Filter analytics by: **This Month**, **Last Month**, **Last 3 Months**, or **Custom Date Range**.
  - Daily burn rate (average daily expenses).
  - Highest-spending category highlighting.
  - Side-by-side monthly income vs. expense comparison bar chart.
  - Category-wise spending breakdown and trajectory charts.

- **💾 Persistence & Privacy**
  - 100% client-side persistent storage with `localStorage`.
  - Full JSON backup download and restore feature.
  - Reset to realistic sample dataset anytime.
  - Clear all data with safety confirmation.

- **🇮🇳 Indian Localization & Aesthetics**
  - Default currency: **Indian Rupee (₹)**.
  - Formatted using the Indian numbering system (Lakhs & Crores, e.g. `₹1,45,000`).
  - Dark theme built with the requested palette (`#0B1120`, `#111827`, `#172033`, `#10B981`, `#8B5CF6`, `#22C55E`, `#F43F5E`, etc.).

---

## 🛠️ Tech Stack

- **React 18** with **Vite**
- **JavaScript (JSX)** (clean, beginner-friendly modular code)
- **Tailwind CSS** (custom dark color palette)
- **React Router v6** (declarative SPA navigation)
- **Recharts** (responsive area, bar, donut, and line charts)
- **Lucide React** (icons)
- **HTML5 LocalStorage** (instant client persistence)

---

## 🚀 Getting Started

To run the application locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Build for production
npm run build
```

The development server runs by default at `http://localhost:5180`.
