"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f97316", "#a855f7", "#eab308", "#ec4899", "#6b7280", "#14b8a6", "#f43f5e", "#8b5cf6", "#06b6d4", "#84cc16", "#fb923c"];
export default function Charts({ transactions, forecast }) {
  if (!transactions || transactions.length === 0) return null;

  // Category breakdown for pie chart
  const categoryData = transactions.reduce((acc, t) => {
    const existing = acc.find((item) => item.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, []);

  // Daily income vs expense for bar chart
  const dailyData = transactions.reduce((acc, t) => {
    const existing = acc.find((item) => item.date === t.date);
    if (existing) {
      if (t.type === "credit") existing.income += t.amount;
      else existing.expense += t.amount;
    } else {
      acc.push({
        date: t.date,
        income: t.type === "credit" ? t.amount : 0,
        expense: t.type === "debit" ? t.amount : 0,
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-6">
      {/* Income vs Expense Bar Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Income vs Expense
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Pie Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Spending by Category
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Chart */}
      {forecast && forecast.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            3-Month Cash Flow Forecast
          </h2>
          <p className="text-sm text-gray-500 mb-6">AI-powered prediction based on your transaction history</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="predictedIncome" fill="#22c55e" radius={[4, 4, 0, 0]} name="Predicted Income" />
              <Bar dataKey="predictedExpense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Predicted Expense" />
              <Bar dataKey="netCashFlow" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Net Cash Flow" />
            </BarChart>
          </ResponsiveContainer>
          {/* Forecast Tips */}
          <div className="mt-4 space-y-2">
            {forecast.map((f, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                <span className="text-blue-500 text-sm">💡</span>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">{f.month}:</span> {f.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}