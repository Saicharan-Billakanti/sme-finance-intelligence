"use client";
import { useState } from "react";

const categoryStyle = {
  Sales:       { bg: "#dbeafe", color: "#1d4ed8" },
  Purchase:    { bg: "#fee2e2", color: "#991b1b" },
  Salary:      { bg: "#d1fae5", color: "#065f46" },
  Rent:        { bg: "#fed7aa", color: "#9a3412" },
  Utilities:   { bg: "#fef9c3", color: "#854d0e" },
  Tax:         { bg: "#ede9fe", color: "#5b21b6" },
  Loan:        { bg: "#fce7f3", color: "#9d174d" },
  Transfer:    { bg: "#e0f2fe", color: "#075985" },
  Food:        { bg: "#d1fae5", color: "#065f46" },
  Transport:   { bg: "#fef3c7", color: "#92400e" },
  Shopping:    { bg: "#fce7f3", color: "#be185d" },
  Healthcare:  { bg: "#ecfdf5", color: "#047857" },
  Education:   { bg: "#eff6ff", color: "#1e40af" },
  Entertainment:{ bg: "#fdf4ff", color: "#7e22ce" },
  Other:       { bg: "#f1f5f9", color: "#475569" },
};

export default function TransactionList({ transactions }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  if (!transactions || transactions.length === 0) return null;

  const totalCredit = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
  const totalDebit  = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);

  const filtered = transactions.filter((t) => {
    const matchSearch = t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.type === filter;
    return matchSearch && matchFilter;
  });

  const categories = [...new Set(transactions.map((t) => t.category))];

  return (
    <>
      <style>{`
        .tl-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
        }
        .tl-summary { display: flex; gap: 14px; align-items: center; }
        .tl-count { font-size: 13px; font-weight: 700; color: #111827; }
        .tl-credit { font-size: 12px; font-weight: 700; color: #16a34a; }
        .tl-debit  { font-size: 12px; font-weight: 700; color: #dc2626; }
        .tl-sep    { width: 1px; height: 14px; background: #e2e8f0; }

        .tl-controls { display: flex; gap: 8px; flex-wrap: wrap; }

        .tl-search {
          position: relative;
        }
        .tl-search-icon {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          font-size: 12px; color: #9ca3af; pointer-events: none;
        }
        .tl-search input {
          padding: 7px 12px 7px 30px; border: 1.5px solid #e2e8f0;
          border-radius: 9px; font-size: 12px; color: #374151;
          background: #f8fafc; outline: none; width: 160px;
          transition: border-color 0.2s, background 0.2s;
        }
        .tl-search input:focus { border-color: #2563eb; background: #fff; }

        .tl-filter-btn {
          padding: 7px 12px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          font-size: 12px; font-weight: 600; cursor: pointer;
          background: #f8fafc; color: #64748b; transition: all 0.15s;
        }
        .tl-filter-btn.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
        .tl-filter-btn:hover:not(.active) { border-color: #cbd5e1; background: #fff; color: #374151; }

        .tl-list { display: flex; flex-direction: column; gap: 4px; max-height: 420px; overflow-y: auto; padding-right: 2px; }
        .tl-list::-webkit-scrollbar { width: 4px; }
        .tl-list::-webkit-scrollbar-track { background: transparent; }
        .tl-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .tl-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px; border-radius: 11px; gap: 12px;
          background: #fafafa; border: 1px solid transparent;
          transition: all 0.15s; cursor: default;
        }
        .tl-row:hover { background: #f0f6ff; border-color: #dbeafe; }

        .tl-left  { display: flex; align-items: center; gap: 11px; min-width: 0; }
        .tl-avatar {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .tl-avatar.credit { background: #dcfce7; }
        .tl-avatar.debit  { background: #fee2e2; }

        .tl-desc { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
        .tl-meta { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
        .tl-cat  { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
        .tl-date { font-size: 11px; color: #94a3b8; }
        .tl-bank { font-size: 11px; color: #94a3b8; }

        .tl-right  { text-align: right; flex-shrink: 0; }
        .tl-amount { font-size: 14px; font-weight: 800; }
        .tl-amount.credit { color: #16a34a; }
        .tl-amount.debit  { color: #dc2626; }

        .tl-empty { text-align: center; padding: 32px; color: #9ca3af; font-size: 13px; }
      `}</style>

      <div>
        {/* Toolbar */}
        <div className="tl-toolbar">
          <div className="tl-summary">
            <span className="tl-count">{filtered.length} of {transactions.length}</span>
            <div className="tl-sep" />
            <span className="tl-credit">↑ ₹{totalCredit.toLocaleString("en-IN")}</span>
            <span className="tl-debit">↓ ₹{totalDebit.toLocaleString("en-IN")}</span>
          </div>
          <div className="tl-controls">
            <div className="tl-search">
              <span className="tl-search-icon">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
              />
            </div>
            {["all", "credit", "debit"].map((f) => (
              <button
                key={f}
                className={`tl-filter-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "credit" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="tl-list">
          {filtered.length === 0 ? (
            <div className="tl-empty">No transactions match your search</div>
          ) : (
            filtered.map((t, i) => {
              const cs = categoryStyle[t.category] || categoryStyle.Other;
              return (
                <div className="tl-row" key={i}>
                  <div className="tl-left">
                    <div className={`tl-avatar ${t.type}`}>
                      {t.type === "credit" ? "↑" : "↓"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="tl-desc">{t.description}</div>
                      <div className="tl-meta">
                        <span className="tl-cat" style={{ background: cs.bg, color: cs.color }}>{t.category}</span>
                        {t.date && <span className="tl-date">{t.date}</span>}
                        {t.bank && <span className="tl-bank">· {t.bank}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="tl-right">
                    <div className={`tl-amount ${t.type}`}>
                      {t.type === "credit" ? "+" : "−"}₹{t.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}