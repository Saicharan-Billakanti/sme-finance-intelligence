"use client";
import { useState } from "react";
import SMSInput from "@/components/SMSInput";
import TransactionList from "@/components/TransactionList";
import Charts from "@/components/Charts";
import HealthScore from "@/components/HealthScore";
import AnomalyLoan from "@/components/AnomalyLoan";
import WhatsAppReport from "@/components/WhatsAppReport";
import Link from "next/link";

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

  const netBalance = totalCredit - totalDebit;

  const handleTransactionsParsed = async (newTransactions) => {
    const merged = [...transactions, ...newTransactions];
    setTransactions(merged);

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
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)" }}>

      {/* ── NAVBAR (matches landing page exactly) ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                ₹
              </div>
              <span className="font-bold text-[#111827] hidden sm:block">
                SME Finance Intelligence
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/#features" className="text-[#6b7280] text-sm font-medium hover:text-[#111827] transition">Features</a>
              <a href="/#how" className="text-[#6b7280] text-sm font-medium hover:text-[#111827] transition">How it works</a>
              <a href="/#why" className="text-[#6b7280] text-sm font-medium hover:text-[#111827] transition">Why Us</a>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#6b7280]">Dashboard</span>
              {transactions.length > 0 && (
                <button
                  onClick={() => { setTransactions([]); setForecast([]); }}
                  className="text-xs text-[#dc2626] hover:text-red-700 border border-[#fecaca] px-3 py-1.5 rounded-lg bg-[#fef2f2] hover:bg-[#fee2e2] transition"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Page Title */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-[#111827]">Financial Dashboard</h1>
          <p className="text-[#6b7280] mt-1">
            {transactions.length === 0
              ? "Add your bank data below to get started"
              : `${transactions.length} transaction${transactions.length !== 1 ? "s" : ""} loaded`}
          </p>
        </div>

        {/* ── STATS ROW (only when data exists) ── */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 border-l-4 border-l-[#16a34a]">
              <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide mb-2">Total Income</p>
              <p className="text-3xl font-bold text-[#16a34a]">₹{totalCredit.toLocaleString("en-IN")}</p>
              <p className="text-[#9ca3af] text-xs mt-1">Credits across all entries</p>
            </div>
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 border-l-4 border-l-[#dc2626]">
              <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-[#dc2626]">₹{totalDebit.toLocaleString("en-IN")}</p>
              <p className="text-[#9ca3af] text-xs mt-1">Debits across all entries</p>
            </div>
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wide mb-2">Net Balance</p>
                  <p className={`text-3xl font-bold ${netBalance >= 0 ? "text-[#111827]" : "text-[#dc2626]"}`}>
                    {netBalance >= 0 ? "+" : ""}₹{Math.abs(netBalance).toLocaleString("en-IN")}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${netBalance >= 0 ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fee2e2] text-[#dc2626]"}`}>
                  {netBalance >= 0 ? "↑ Healthy" : "↓ Deficit"}
                </span>
              </div>
              <p className="text-[#9ca3af] text-xs mt-3">{netBalance >= 0 ? "Surplus position" : "Review expenses"}</p>
            </div>
          </div>
        )}

        {/* ── SMS INPUT (wrapped in matching card shell) ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-[#f3f4f6]">
            <h2 className="text-lg font-bold text-[#111827]">📥 Add Financial Data</h2>
            <p className="text-[#6b7280] text-sm mt-0.5">Upload bank statement, SMS screenshot, or paste SMS</p>
          </div>
          <div className="p-6">
            <SMSInput onTransactionsParsed={handleTransactionsParsed} />
          </div>
        </div>

        {/* ── FORECAST LOADING ── */}
        {forecastLoading && (
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-[#bfdbfe] border-t-[#2563eb] rounded-full animate-spin flex-shrink-0" />
            <p className="text-[#2563eb] text-sm font-medium">AI is generating your 3-month cash flow forecast…</p>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {transactions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-12 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Your insights will appear here</h3>
            <p className="text-[#6b7280] text-sm max-w-sm mx-auto leading-relaxed">
              Paste a bank SMS, upload a PDF statement, or share a screenshot above.
              Your health score, forecasts, anomalies, and charts will load automatically.
            </p>
          </div>
        )}

        {/* ── HEALTH SCORE ── */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]">❤️ Financial Health Score</h2>
            </div>
            <div className="p-6">
              <HealthScore transactions={transactions} />
            </div>
          </div>
        )}

        {/* ── ANOMALY + LOAN ── */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] border-l-4 border-l-[#dc2626] overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]">🚨 Anomaly Detection & Loan Eligibility</h2>
            </div>
            <div className="p-6">
              <AnomalyLoan transactions={transactions} />
            </div>
          </div>
        )}

        {/* ── WHATSAPP REPORT ── */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]">📲 WhatsApp Instant Report</h2>
              <p className="text-[#6b7280] text-sm mt-0.5">Powered by Twilio · Sends income, expenses, health score & forecast</p>
            </div>
            <div className="p-6">
              <WhatsAppReport transactions={transactions} forecast={forecast} />
            </div>
          </div>
        )}

        {/* ── CHARTS ── */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]">📊 Income, Expenses & Forecast</h2>
            </div>
            <div className="p-6">
              <Charts transactions={transactions} forecast={forecast} />
            </div>
          </div>
        )}

        {/* ── TRANSACTION LIST ── */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]">📋 All Transactions</h2>
            </div>
            <div className="p-6">
              <TransactionList transactions={transactions} />
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-[#9ca3af] text-xs pb-6">
          Built for Indian SME owners · Powered by Groq AI · Free during beta
        </p>

      </main>
    </div>
  );
}