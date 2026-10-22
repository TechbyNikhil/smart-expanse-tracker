import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';
import { getCategoryByName } from '../data/categories';

// Reusable Custom Dark Tooltip
export const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#172033] border border-[#273449] p-2.5 sm:p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs z-50">
        {label && (
          <p className="font-bold text-[#F8FAFC] mb-1.5 border-b border-[#273449] pb-1">
            {label}
          </p>
        )}
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between space-x-3">
              <span className="flex items-center space-x-1.5 text-[#94A3B8]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
              </span>
              <span className="font-bold font-mono text-[#F8FAFC]">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// 1. Income vs Expense Area/Line Chart
export const IncomeExpenseAreaChart = ({ data = [], height = 280 }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-[#94A3B8] text-sm">No trend data available</div>;
  }

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#273449" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            minTickGap={10}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={45}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            formatter={(val) => <span className="text-[11px] sm:text-xs font-medium text-[#94A3B8]">{val}</span>}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#22C55E"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#incomeGradient)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Expenses"
            stroke="#F43F5E"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Monthly Expense Bar Chart
export const MonthlyExpenseBarChart = ({ data = [], height = 280 }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-[#94A3B8] text-sm">No monthly data available</div>;
  }

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#273449" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            minTickGap={10}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={45}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            formatter={(val) => <span className="text-[11px] sm:text-xs font-medium text-[#94A3B8]">{val}</span>}
          />
          <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expense" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Category Donut Chart
const DONUT_COLORS = [
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#94A3B8', // Slate
];

export const CategoryDonutChart = ({ data = [], height = 260 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-[#94A3B8] text-sm flex items-center justify-center h-full">
        No expenses recorded for this period
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Responsive Pie Sizing */}
      <div className="w-full md:w-3/5" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => {
                const cat = getCategoryByName(entry.name);
                const color = cat?.color || DONUT_COLORS[index % DONUT_COLORS.length];
                return <Cell key={`cell-${index}`} fill={color} stroke="#172033" strokeWidth={2} />;
              })}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  return (
                    <div className="bg-[#172033] border border-[#273449] p-2.5 rounded-xl shadow-2xl text-xs z-50">
                      <p className="font-bold text-[#F8FAFC]">{item.name}</p>
                      <p className="font-mono text-emerald-400 mt-1 font-semibold">
                        {formatCurrency(item.value)}
                      </p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">
                        {item.payload.percentage}% of total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category legend with percentages */}
      <div className="w-full md:w-2/5 flex flex-col space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
        {data.slice(0, 6).map((item, index) => {
          const cat = getCategoryByName(item.name);
          const color = cat?.color || DONUT_COLORS[index % DONUT_COLORS.length];
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-[#1E293B]/50 transition-colors"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[#F8FAFC] font-medium truncate text-[11px] sm:text-xs">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <span className="font-mono text-slate-300 font-semibold text-[11px] sm:text-xs">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-[10px] text-[#94A3B8] font-mono">({item.percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Daily Spending Trends Chart
export const DailySpendingTrendChart = ({ data = [], height = 260 }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-[#94A3B8] text-sm">No daily spending data yet</div>;
  }

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#273449" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            minTickGap={15}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={45}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            formatter={(val) => <span className="text-[11px] sm:text-xs font-medium text-[#94A3B8]">{val}</span>}
          />
          <Line
            type="monotone"
            dataKey="spent"
            name="Daily Expense"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', r: 2.5 }}
            activeDot={{ r: 4.5, fill: '#8B5CF6', stroke: '#172033', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            name="Cumulative Month Total"
            stroke="#10B981"
            strokeWidth={1.75}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  IncomeExpenseAreaChart,
  MonthlyExpenseBarChart,
  CategoryDonutChart,
  DailySpendingTrendChart,
};
