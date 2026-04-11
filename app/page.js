"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SMSInput from "@/components/SMSInput";
import TransactionList from "@/components/TransactionList";
import Charts from "@/components/Charts";
import HealthScore from "@/components/HealthScore";
import AnomalyLoan from "@/components/AnomalyLoan";
import WhatsAppReport from "@/components/WhatsAppReport";

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [showImport, setShowImport] = useState(false);

  const totalCredit = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
  const totalDebit  = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);
  const netBalance  = totalCredit - totalDebit;

  const handleTransactionsParsed = async (newTransactions) => {
    const merged = [...transactions, ...newTransactions];
    setTransactions(merged);
    setShowImport(false);
    setForecastLoading(true);
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: merged }),
      });
      const data = await res.json();
      if (data.success) setForecast(data.forecast);
    } catch (e) { console.error(e); }
    setForecastLoading(false);
  };

  const handleStartNew = () => {
    setTransactions([]);
    setForecast([]);
    setActiveSection("overview");
    setShowImport(false);
  };

  const hasData = transactions.length > 0;

  const navItems = [
    { id: "overview",     label: "Overview"     },
    { id: "insights",     label: "Insights"     },
    { id: "transactions", label: "Transactions" },
    { id: "whatsapp",     label: "WhatsApp"     },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .db-root {
          min-height: 100vh;
          background: #f6f8fc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .db-topnav {
          position: sticky; top: 0; z-index: 40;
          background: #fff; border-bottom: 1px solid #e8edf5;
          padding: 0 32px;
          display: flex; align-items: center; justify-content: space-between;
          height: 60px; gap: 12px;
        }
        .db-logo { display: flex; align-items: center; gap: 9px; cursor: pointer; flex-shrink: 0; }
        .db-logo-icon {
          width: 32px; height: 32px; background: #2563eb;
          border-radius: 9px; display: flex; align-items: center;
          justify-content: center; color: #fff; font-size: 15px; font-weight: 800;
        }
        .db-logo-text { font-size: 15px; font-weight: 700; color: #111827; }
        .db-nav-pills {
          display: flex; gap: 2px;
          background: #f1f5f9; border-radius: 10px; padding: 3px;
        }
        .db-nav-pill {
          display: flex; align-items: center;
          padding: 7px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: none; background: transparent; color: #64748b;
          transition: all 0.15s;
        }
        .db-nav-pill.active { background: #fff; color: #2563eb; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .db-nav-pill:hover:not(.active) { color: #374151; }
        .db-nav-pill.disabled { opacity: 0.4; pointer-events: none; }
        .db-topnav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .db-back-btn {
          font-size: 12px; font-weight: 600; color: #64748b;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          padding: 6px 14px; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.15s;
        }
        .db-back-btn:hover { background: #e2e8f0; color: #374151; }
        .db-new-btn {
          font-size: 12px; font-weight: 600; color: #2563eb;
          background: #eff6ff; border: 1px solid #bfdbfe;
          padding: 6px 14px; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.15s;
        }
        .db-new-btn:hover { background: #dbeafe; }
        .db-clear-btn {
          font-size: 12px; font-weight: 600; color: #dc2626;
          background: #fef2f2; border: 1px solid #fecaca;
          padding: 6px 14px; border-radius: 8px; cursor: pointer;
          transition: all 0.15s;
        }
        .db-clear-btn:hover { background: #fee2e2; }
        .db-body { max-width: 1200px; margin: 0 auto; padding: 28px 28px 48px; }
        .db-page-title { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
        .db-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; margin-bottom: 24px; }
        .db-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .db-stat {
          background: #fff; border-radius: 16px; padding: 20px 24px;
          border: 1px solid #e8edf5; position: relative; overflow: hidden;
        }
        .db-stat-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 16px 0 0 16px; }
        .db-stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
        .db-stat-value { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
        .db-stat-sub { font-size: 12px; color: #9ca3af; margin-top: 6px; }
        .db-stat-badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 8px; }
        .db-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .db-card { background: #fff; border-radius: 18px; border: 1px solid #e8edf5; overflow: hidden; margin-bottom: 20px; }
        .db-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px 14px; border-bottom: 1px solid #f1f5f9;
        }
        .db-card-title-row { display: flex; align-items: center; gap: 9px; }
        .db-card-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .db-card-title { font-size: 14px; font-weight: 700; color: #111827; }
        .db-card-sub { font-size: 12px; color: #9ca3af; margin-top: 1px; }
        .db-card-body { padding: 20px 22px; }
        .db-add-more-btn {
          font-size: 13px; font-weight: 600; color: #2563eb;
          background: #eff6ff; border: 1px solid #bfdbfe;
          padding: 7px 16px; border-radius: 9px; cursor: pointer;
          display: flex; align-items: center; gap: 6px; transition: all 0.15s;
        }
        .db-add-more-btn:hover { background: #dbeafe; }
        .db-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; }
        .db-empty-icon { font-size: 40px; margin-bottom: 14px; opacity: 0.4; }
        .db-empty-title { font-size: 15px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .db-empty-sub { font-size: 13px; color: #9ca3af; line-height: 1.6; max-width: 280px; }
        .db-loading {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px; border-radius: 12px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          color: #2563eb; font-size: 13px; font-weight: 500; margin-bottom: 20px;
        }
        .db-spin { width: 16px; height: 16px; border: 2px solid #bfdbfe; border-top-color: #2563eb; border-radius: 50%; animation: dbs 0.7s linear infinite; flex-shrink: 0; }
        @keyframes dbs { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .db-two-col { grid-template-columns: 1fr; }
          .db-stats { grid-template-columns: 1fr; }
          .db-nav-pills { display: none; }
          .db-topnav { padding: 0 16px; }
          .db-body { padding: 20px 16px 48px; }
        }
      `}</style>

      <div className="db-root">

        {/* Top Nav */}
        <nav className="db-topnav">
          <div className="db-logo" onClick={() => router.push("/")}>
            <div className="db-logo-icon">₹</div>
            <span className="db-logo-text">SME Finance Intelligence</span>
          </div>

          <div className="db-nav-pills">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`db-nav-pill${activeSection === item.id ? " active" : ""}${!hasData && item.id !== "overview" ? " disabled" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="db-topnav-right">
            {/* Always show Back button */}
            <button className="db-back-btn" onClick={() => router.push("/")}>
              ← Back
            </button>
            {/* Show Start New only when data exists */}
            {hasData && (
              <>
                <button className="db-new-btn" onClick={handleStartNew}>
                  🔄 Start New
                </button>
                <button className="db-clear-btn" onClick={handleStartNew}>
                  Clear All
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="db-body">

          {/* Page Header */}
          <h1 className="db-page-title">Financial Dashboard</h1>
          <p className="db-page-sub">
            {hasData ? `${transactions.length} transactions loaded` : "Add your bank data below to get started"}
          </p>

          {/* Stat Cards */}
          {hasData && (
            <div className="db-stats">
              <div className="db-stat">
                <div className="db-stat-accent" style={{ background: "#22c55e" }} />
                <div className="db-stat-label">Total Income</div>
                <div className="db-stat-value" style={{ color: "#16a34a" }}>₹{totalCredit.toLocaleString("en-IN")}</div>
                <div className="db-stat-sub">Credits across all entries</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-accent" style={{ background: "#ef4444" }} />
                <div className="db-stat-label">Total Expenses</div>
                <div className="db-stat-value" style={{ color: "#dc2626" }}>₹{totalDebit.toLocaleString("en-IN")}</div>
                <div className="db-stat-sub">Debits across all entries</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-accent" style={{ background: netBalance >= 0 ? "#2563eb" : "#f97316" }} />
                <div className="db-stat-label">Net Balance</div>
                <div className="db-stat-value" style={{ color: netBalance >= 0 ? "#2563eb" : "#ea580c" }}>
                  ₹{Math.abs(netBalance).toLocaleString("en-IN")}
                </div>
                <div className="db-stat-badge" style={{ background: netBalance >= 0 ? "#dbeafe" : "#ffedd5", color: netBalance >= 0 ? "#1d4ed8" : "#c2410c" }}>
                  {netBalance >= 0 ? "↑ Surplus" : "↓ Deficit"}
                </div>
              </div>
            </div>
          )}

          {/* Forecast Loading */}
          {forecastLoading && (
            <div className="db-loading">
              <div className="db-spin" />
              AI is generating your 3-month cash flow forecast…
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {activeSection === "overview" && (
            <>
              {/* Import Card */}
              <div className="db-card">
                <div className="db-card-header">
                  <div className="db-card-title-row">
                    <div className="db-card-icon" style={{ background: "#eff6ff" }}>📥</div>
                    <div>
                      <div className="db-card-title">Add Financial Data</div>
                      <div className="db-card-sub">Upload bank statement, SMS screenshot, or paste SMS</div>
                    </div>
                  </div>
                  {hasData && (
                    <button className="db-add-more-btn" onClick={() => setShowImport(!showImport)}>
                      {showImport ? "✕ Close" : "+ Add More Data"}
                    </button>
                  )}
                </div>
                {(!hasData || showImport) && (
                  <div className="db-card-body">
                    <SMSInput onTransactionsParsed={handleTransactionsParsed} />
                  </div>
                )}
              </div>

              {/* Health Score + Anomaly side by side */}
              {hasData && (
                <div className="db-two-col">
                  <div className="db-card" style={{ marginBottom: 0 }}>
                    <div className="db-card-header">
                      <div className="db-card-title-row">
                        <div className="db-card-icon" style={{ background: "#fef2f2" }}>❤️</div>
                        <div>
                          <div className="db-card-title">Financial Health Score</div>
                          <div className="db-card-sub">AI-powered business health analysis</div>
                        </div>
                      </div>
                    </div>
                    <div className="db-card-body">
                      <HealthScore transactions={transactions} />
                    </div>
                  </div>
                  <div className="db-card" style={{ marginBottom: 0 }}>
                    <div className="db-card-header">
                      <div className="db-card-title-row">
                        <div className="db-card-icon" style={{ background: "#fff7ed" }}>🚨</div>
                        <div>
                          <div className="db-card-title">Anomaly & Loan Eligibility</div>
                          <div className="db-card-sub">Flagged transactions + loan estimate</div>
                        </div>
                      </div>
                    </div>
                    <div className="db-card-body">
                      <AnomalyLoan transactions={transactions} />
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!hasData && (
                <div className="db-card">
                  <div className="db-empty">
                    <div className="db-empty-icon">📊</div>
                    <div className="db-empty-title">Your insights will appear here</div>
                    <div className="db-empty-sub">
                      Paste a bank SMS, upload a PDF statement, or share a screenshot above.
                      Your health score, forecasts, anomalies, and charts will load automatically.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── INSIGHTS ── */}
          {activeSection === "insights" && hasData && (
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-title-row">
                  <div className="db-card-icon" style={{ background: "#f0fdf4" }}>📈</div>
                  <div>
                    <div className="db-card-title">Income, Expenses & Forecast</div>
                    <div className="db-card-sub">Visual breakdown of your financial activity</div>
                  </div>
                </div>
              </div>
              <div className="db-card-body">
                <Charts transactions={transactions} forecast={forecast} />
              </div>
            </div>
          )}

          {/* ── TRANSACTIONS ── */}
          {activeSection === "transactions" && hasData && (
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-title-row">
                  <div className="db-card-icon" style={{ background: "#f8fafc" }}>🧾</div>
                  <div>
                    <div className="db-card-title">All Transactions</div>
                    <div className="db-card-sub">Search, filter and review every entry</div>
                  </div>
                </div>
              </div>
              <div className="db-card-body">
                <TransactionList transactions={transactions} />
              </div>
            </div>
          )}

          {/* ── WHATSAPP ── */}
          {activeSection === "whatsapp" && hasData && (
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-title-row">
                  <div className="db-card-icon" style={{ background: "#f0fdf4" }}>📱</div>
                  <div>
                    <div className="db-card-title">WhatsApp Instant Report</div>
                    <div className="db-card-sub">Powered by Twilio · Sends income, expenses, health score & forecast</div>
                  </div>
                </div>
              </div>
              <div className="db-card-body">
                <WhatsAppReport transactions={transactions} forecast={forecast} />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "0 0 24px", fontSize: 12, color: "#9ca3af" }}>
          Built for Indian SME owners · Powered by Groq AI · Free during beta
        </div>
      </div>
    </>
  );
}