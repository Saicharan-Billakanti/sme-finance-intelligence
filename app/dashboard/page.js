"use client";
import { useState } from "react";
import SMSInput from "@/components/SMSInput";
import TransactionList from "@/components/TransactionList";
import Charts from "@/components/Charts";
import HealthScore from "@/components/HealthScore";
import AnomalyLoan from "@/components/AnomalyLoan";
import WhatsAppReport from "@/components/WhatsAppReport";


export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleTransactionsParsed = async (newTransactions) => {
    const merged = [...transactions, ...newTransactions];
    setTransactions(merged);

    // Auto-generate forecast
    setForecastLoading(true);
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: merged }),
      });
      const data = await res.json();
      if (data.success) setForecast(data.forecast);
    } catch (e) {
      console.error("Forecast failed", e);
    }
    setForecastLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">💼 SME Finance Intelligence</h1>
            <p className="text-xs text-gray-500 mt-0.5">AI-powered financial insights for small businesses</p>
          </div>
          {transactions.length > 0 && (
            <button
              onClick={() => { setTransactions([]); setForecast([]); }}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Row */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{totalCredit.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl font-bold text-red-500 mt-1">₹{totalDebit.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Net Balance</p>
              <p className={`text-2xl font-bold mt-1 ${totalCredit - totalDebit >= 0 ? "text-blue-600" : "text-red-600"}`}>
                ₹{(totalCredit - totalDebit).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* SMS Input */}
        <SMSInput onTransactionsParsed={handleTransactionsParsed} />

        {/* Forecast loading indicator */}
        {forecastLoading && (
          <div className="bg-blue-50 rounded-2xl p-4 text-center text-sm text-blue-600 animate-pulse">
            🤖 AI is generating your 3-month cash flow forecast...
          </div>
        )}

        {/* Health Score */}
        {transactions.length > 0 && <HealthScore transactions={transactions} />}

        {/* Anomaly + Loan */}
        {transactions.length > 0 && <AnomalyLoan transactions={transactions} />}

        {transactions.length > 0 && (
        <WhatsAppReport transactions={transactions} forecast={forecast} />
        )}

        {/* Charts */}
        <Charts transactions={transactions} forecast={forecast} />

        {/* Transaction List */}
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}