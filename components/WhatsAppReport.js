"use client";
import { useState } from "react";

export default function WhatsAppReport({ transactions, forecast }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!phone || phone.length !== 10) { setError("Enter a valid 10-digit number"); return; }
    setLoading(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/whatsapp-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, transactions, forecast }),
      });
      const data = await res.json();
      if (data.success) { setSuccess(true); setPhone(""); }
      else setError("Failed to send. Try again.");
    } catch { setError("Something went wrong."); }
    setLoading(false);
  };

  if (!transactions || transactions.length === 0) return null;

  const totalCredit = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
  const totalDebit  = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);

  const previews = [
    { icon: "💰", label: "Income",   value: `₹${totalCredit.toLocaleString("en-IN")}`, color: "#16a34a" },
    { icon: "💸", label: "Expenses", value: `₹${totalDebit.toLocaleString("en-IN")}`,  color: "#dc2626" },
    { icon: "📈", label: "Forecast", value: forecast?.length ? "3 months" : "–",        color: "#2563eb" },
  ];

  return (
    <>
      <style>{`
        .wa-wrap { display: flex; flex-direction: column; gap: 18px; }

        .wa-preview {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        .wa-prev-item {
          padding: 12px 14px; border-radius: 12px;
          background: #f8fafc; border: 1px solid #f1f5f9;
          display: flex; flex-direction: column; gap: 4px;
        }
        .wa-prev-icon  { font-size: 16px; }
        .wa-prev-label { font-size: 10px; font-weight: 600; color: #9ca3af; letter-spacing: 0.06em; text-transform: uppercase; }
        .wa-prev-val   { font-size: 14px; font-weight: 800; }

        .wa-divider { height: 1px; background: #f1f5f9; }

        .wa-input-row  { display: flex; gap: 10px; align-items: flex-start; }
        .wa-phone-wrap {
          flex: 1; display: flex; align-items: center;
          border: 1.5px solid #e2e8f0; border-radius: 11px;
          overflow: hidden; background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wa-phone-wrap:focus-within {
          border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
        }
        .wa-prefix {
          padding: 12px 12px; font-size: 13px; font-weight: 600;
          color: #6b7280; background: #f8fafc;
          border-right: 1.5px solid #e2e8f0; white-space: nowrap;
        }
        .wa-phone-wrap input {
          flex: 1; padding: 12px 14px; font-size: 14px; font-weight: 500;
          color: #111827; background: transparent; border: none; outline: none;
        }
        .wa-phone-wrap input::placeholder { color: #9ca3af; }

        .wa-send-btn {
          padding: 12px 20px; border-radius: 11px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff; font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 14px rgba(34,197,94,0.35);
          transition: all 0.2s; display: flex; align-items: center; gap: 7px;
          white-space: nowrap;
        }
        .wa-send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(34,197,94,0.4); }
        .wa-send-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .wa-error {
          font-size: 12px; color: #dc2626; padding: 8px 12px;
          background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;
        }

        .wa-success {
          padding: 18px 20px; border-radius: 14px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 1px solid #bbf7d0;
          display: flex; align-items: center; gap: 14px;
        }
        .wa-success-icon {
          width: 42px; height: 42px; border-radius: 50%;
          background: #22c55e; display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .wa-success-title { font-size: 15px; font-weight: 700; color: #15803d; }
        .wa-success-sub   { font-size: 12px; color: #16a34a; margin-top: 2px; }
        .wa-success-again { font-size: 11px; color: #22c55e; background: none; border: none; cursor: pointer; text-decoration: underline; margin-top: 4px; padding: 0; }

        .wa-note {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: #9ca3af;
        }
        .wa-note-dot { width: 4px; height: 4px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }

        .spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="wa-wrap">
        {/* Preview tiles */}
        <div className="wa-preview">
          {previews.map((p) => (
            <div className="wa-prev-item" key={p.label}>
              <span className="wa-prev-icon">{p.icon}</span>
              <span className="wa-prev-label">{p.label}</span>
              <span className="wa-prev-val" style={{ color: p.color }}>{p.value}</span>
            </div>
          ))}
        </div>

        <div className="wa-divider" />

        {success ? (
          <div className="wa-success">
            <div className="wa-success-icon">✓</div>
            <div>
              <div className="wa-success-title">Report sent successfully!</div>
              <div className="wa-success-sub">Check your WhatsApp for the full financial summary</div>
              <button className="wa-success-again" onClick={() => setSuccess(false)}>Send again</button>
            </div>
          </div>
        ) : (
          <>
            <div className="wa-input-row">
              <div style={{ flex: 1 }}>
                <div className="wa-phone-wrap">
                  <span className="wa-prefix">🇮🇳 +91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                  />
                </div>
                {error && <div className="wa-error" style={{ marginTop: 8 }}>⚠️ {error}</div>}
              </div>
              <button className="wa-send-btn" onClick={handleSend} disabled={loading}>
                {loading ? <><div className="spin" /> Sending…</> : <>📲 Send Report</>}
              </button>
            </div>
            <div className="wa-note">
              <div className="wa-note-dot" />
              Powered by Twilio · Sends income, expenses, health score & 3-month forecast
            </div>
          </>
        )}
      </div>
    </>
  );
}