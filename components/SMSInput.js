"use client";
import { useState } from "react";

const LANGUAGES = [
  { id: "en", label: "🇮🇳 English", flag: "en" },
  { id: "hi", label: "हिन्दी",      flag: "hi" },
  { id: "te", label: "తెలుగు",      flag: "te" },
  { id: "ta", label: "தமிழ்",       flag: "ta" },
];

const SAMPLE_SMS = {
  en: `SBI: Rs.15000 credited to your account on 09-Apr-26 by UPI. Ref No 123456789
HDFC Bank: Rs.2500 debited from your account on 08-Apr-26. Info: ELECTRICITY BILL
Paytm: Rs.8000 credited to your ac XXXXXX1234 on 07-Apr-26. UPI Ref 987654321
SBI: Rs.5000 debited from your account on 06-Apr-26. Info: RENT PAYMENT
HDFC Bank: Rs.3200 debited on 05-Apr-26. Info: WHOLESALE PURCHASE
SBI: Rs.22000 credited to your account on 04-Apr-26 by UPI. SALES COLLECTION`,

  hi: `SBI: Rs.15000 aapke khate mein 09-Apr-26 ko UPI dwara jama kiye gaye. Ref 123456789
HDFC Bank: Rs.2500 aapke khate se 08-Apr-26 ko kata gaya. Bijli Bill
Paytm: Rs.8000 aapke ac XXXXXX1234 mein 07-Apr-26 ko jama. UPI Ref 987654321
SBI: Rs.5000 08-Apr-26 ko kata gaya. Kiraya Bhugtan`,

  te: `SBI: Rs.15000 mee account lo 09-Apr-26 na UPI dwara jama chesindi. Ref 123456789
HDFC Bank: Rs.2500 mee account nundi 08-Apr-26 na katayindi. Electricity Bill
Paytm: Rs.8000 mee ac XXXXXX1234 lo 07-Apr-26 na jama. UPI Ref 987654321
SBI: Rs.5000 06-Apr-26 na katayindi. Rent Chellimpu`,

  ta: `SBI: Rs.15000 ungal account-il 09-Apr-26 anru UPI moolam seththu vechullattu. Ref 123456789
HDFC Bank: Rs.2500 ungal account-il irunthu 08-Apr-26 anru pidithu kollattattu. Minthara Bill
Paytm: Rs.8000 ungal ac XXXXXX1234-il 07-Apr-26 anru seththu. UPI Ref 987654321`,
};

export default function SMSInput({ onTransactionsParsed }) {
  const [smsText, setSmsText]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [activeTab, setActiveTab]   = useState("paste");
  const [dragOver, setDragOver]     = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  const handleParse = async (text) => {
    const content = text || smsText;
    if (!content.trim()) { setError("Please provide SMS messages first"); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/parse-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smsText: content, language: activeLang }),
      });
      const data = await response.json();
      if (data.success) { onTransactionsParsed(data.transactions); setSmsText(""); }
      else setError("Failed to parse SMS. Try again.");
    } catch { setError("Something went wrong."); }
    setLoading(false);
  };

  const handlePDFUpload = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) { setError("Please upload a PDF file"); return; }
    setUploadedFile(file.name); setLoading(true); setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        const response = await fetch("/api/parse-pdf", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64 }),
        });
        const data = await response.json();
        if (data.success) { onTransactionsParsed(data.transactions); setUploadedFile(null); }
        else setError("Could not read PDF. Make sure it's a bank statement.");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch { setError("PDF upload failed."); setLoading(false); }
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) { setError("Please upload an image file"); return; }
    setLoading(true); setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        const response = await fetch("/api/parse-image", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, mimeType: file.type }),
        });
        const data = await response.json();
        if (data.success) onTransactionsParsed(data.transactions);
        else setError("Could not read SMS from image. Try a clearer screenshot.");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch { setError("Image upload failed."); setLoading(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file.name.endsWith(".pdf")) handlePDFUpload(file);
    else if (file.type.startsWith("image/")) handleImageUpload(file);
    else setError("Please drop a PDF or image file");
  };

  return (
    <>
      <style>{`
        .si-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        /* ── HEADER ROW ── */
        .si-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; gap: 12px; flex-wrap: wrap; }
        .si-header-left h2 { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 2px; }
        .si-header-left p  { font-size: 12px; color: #6b7280; margin: 0; }

        /* ── LANGUAGE SELECTOR ── */
        .si-lang-row { display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap; }
        .si-lang-btn {
          font-size: 11px; font-weight: 600; padding: 4px 10px;
          border-radius: 20px; cursor: pointer; border: 1.5px solid #e2e8f0;
          background: #f8fafc; color: #64748b; transition: all 0.15s;
        }
        .si-lang-btn.active {
          background: #eff6ff; color: #2563eb;
          border-color: #93c5fd; box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
        }
        .si-lang-btn:hover:not(.active) { border-color: #cbd5e1; color: #374151; background: #fff; }

        /* ── LOAD SAMPLE ── */
        .si-sample-btn {
          font-size: 12px; font-weight: 600; color: #2563eb;
          background: #eff6ff; border: 1px solid #bfdbfe;
          padding: 6px 14px; border-radius: 8px; cursor: pointer;
          transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
        }
        .si-sample-btn:hover { background: #dbeafe; }

        /* ── TABS ── */
        .si-tabs { display: flex; gap: 6px; margin-bottom: 16px; background: #f1f5f9; padding: 4px; border-radius: 12px; }
        .si-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 9px 10px; border-radius: 9px; font-size: 13px; font-weight: 600;
          cursor: pointer; border: none; transition: all 0.2s; background: transparent;
          color: #64748b;
        }
        .si-tab.active { background: #fff; color: #2563eb; box-shadow: 0 1px 6px rgba(37,99,235,0.12); }
        .si-tab:hover:not(.active) { background: rgba(255,255,255,0.6); color: #374151; }

        /* ── HIGHLIGHTED BANK STATEMENT TAB ── */
        .si-tab.pdf-tab {
          position: relative;
        }
        .si-tab.pdf-tab.active {
          background: #2563eb; color: #fff;
          box-shadow: 0 4px 14px rgba(37,99,235,0.4);
        }
        .si-tab.pdf-tab:not(.active) {
          background: #eff6ff; color: #2563eb;
          border: 1.5px solid #bfdbfe;
        }
        .si-tab.pdf-tab:not(.active):hover {
          background: #dbeafe;
        }
        .si-recommended {
          position: absolute; top: -8px; right: 4px;
          font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
          background: #2563eb; color: #fff;
          padding: 2px 6px; border-radius: 20px;
          white-space: nowrap;
        }
        .si-tab.pdf-tab.active .si-recommended {
          background: #fff; color: #2563eb;
        }

        /* ── TEXTAREA ── */
        .si-textarea {
          width: 100%; height: 180px; padding: 16px;
          border: 1.5px solid #e2e8f0; border-radius: 14px;
          background: #f8fafc; color: #1e293b;
          font-size: 13px; font-family: 'SF Mono', 'Fira Code', monospace;
          line-height: 1.7; resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .si-textarea:focus { outline: none; border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .si-textarea::placeholder { color: #94a3b8; font-family: inherit; }

        /* ── DROP ZONE ── */
        .si-drop {
          height: 180px; border: 2px dashed #cbd5e1; border-radius: 14px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; cursor: pointer; transition: all 0.2s; background: #f8fafc;
        }
        .si-drop.pdf-drop { border-color: #93c5fd; background: #f0f7ff; }
        .si-drop:hover, .si-drop.over { border-color: #2563eb; background: #eff6ff; }
        .si-drop-icon  { font-size: 36px; line-height: 1; }
        .si-drop-title { font-size: 14px; font-weight: 700; color: #374151; }
        .si-drop-sub   { font-size: 12px; color: #94a3b8; text-align: center; max-width: 300px; line-height: 1.5; }
        .si-drop-hint  { font-size: 11px; color: #2563eb; font-weight: 600; margin-top: 2px; }
        .si-drop-banks {
          display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-top: 4px;
        }
        .si-bank-tag {
          font-size: 10px; font-weight: 600; padding: 2px 8px;
          border-radius: 20px; background: #dbeafe; color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        /* ── ANALYZE BUTTON ── */
        .si-analyze-btn {
          width: 100%; margin-top: 16px;
          padding: 14px; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #fff; font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .si-analyze-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
        .si-analyze-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* ── ERROR ── */
        .si-error {
          margin-top: 10px; padding: 10px 14px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #dc2626; font-size: 13px; font-weight: 500;
        }

        /* ── PROCESSING ── */
        .si-processing {
          margin-top: 14px; padding: 12px 16px; border-radius: 12px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          display: flex; align-items: center; gap: 10px;
          color: #2563eb; font-size: 13px; font-weight: 500;
        }
        .si-spin { width: 16px; height: 16px; border: 2px solid #bfdbfe; border-top-color: #2563eb; border-radius: 50%; animation: sispin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes sispin { to { transform: rotate(360deg); } }

        /* ── UPLOADED FILE ── */
        .si-uploaded { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .si-uploaded .fname { font-size: 13px; font-weight: 600; color: #2563eb; }
        .si-uploaded .fstatus { font-size: 11px; color: #94a3b8; }
      `}</style>

      <div className="si-root">

        {/* Header */}
        <div className="si-header">
          <div className="si-header-left">
            <h2>Import Transactions</h2>
            <p>Supports English, Hindi, Telugu & Tamil bank SMS</p>
            {/* Language Selector */}
            <div className="si-lang-row">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  className={`si-lang-btn${activeLang === lang.id ? " active" : ""}`}
                  onClick={() => setActiveLang(lang.id)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          <button
            className="si-sample-btn"
            onClick={() => { setSmsText(SAMPLE_SMS[activeLang]); setActiveTab("paste"); }}
          >
            Load Sample
          </button>
        </div>

        {/* Tabs */}
        <div className="si-tabs">
          <button
            className={`si-tab${activeTab === "paste" ? " active" : ""}`}
            onClick={() => { setActiveTab("paste"); setError(""); setUploadedFile(null); }}
          >
            <span>📋</span> Paste SMS
          </button>

          {/* Highlighted Bank Statement Tab */}
          <button
            className={`si-tab pdf-tab${activeTab === "pdf" ? " active" : ""}`}
            onClick={() => { setActiveTab("pdf"); setError(""); setUploadedFile(null); }}
          >
            <span className="si-recommended">⭐ Recommended</span>
            <span>📑</span> Bank Statement
          </button>

          <button
            className={`si-tab${activeTab === "image" ? " active" : ""}`}
            onClick={() => { setActiveTab("image"); setError(""); setUploadedFile(null); }}
          >
            <span>📸</span> Screenshot
          </button>
        </div>

        {/* Paste Tab */}
        {activeTab === "paste" && (
          <textarea
            className="si-textarea"
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder={`Paste your bank SMS messages here…\n\nExample:\nSBI: Rs.15000 credited to your account on 09-Apr-26 by UPI\nHDFC: Rs.2500 debited on 08-Apr-26. Info: ELECTRICITY BILL`}
          />
        )}

        {/* PDF Tab — Highlighted */}
        {activeTab === "pdf" && (
          <div
            className={`si-drop pdf-drop${dragOver ? " over" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("pdf-upload").click()}
          >
            {uploadedFile ? (
              <div className="si-uploaded">
                <span style={{ fontSize: 32 }}>📑</span>
                <span className="fname">{uploadedFile}</span>
                <span className="fstatus">Processing…</span>
              </div>
            ) : (
              <>
                <span className="si-drop-icon">📑</span>
                <span className="si-drop-title">Upload your Bank Statement PDF</span>
                <span className="si-drop-sub">Get 100+ transactions analyzed instantly — much faster than SMS</span>
                <div className="si-drop-banks">
                  {["SBI", "HDFC", "ICICI", "Axis", "Union Bank", "Kotak", "PNB"].map((b) => (
                    <span key={b} className="si-bank-tag">{b}</span>
                  ))}
                </div>
                <span className="si-drop-hint">📥 Download from NetBanking → Account Statement</span>
              </>
            )}
            <input id="pdf-upload" type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => handlePDFUpload(e.target.files[0])} />
          </div>
        )}

        {/* Image Tab */}
        {activeTab === "image" && (
          <div
            className={`si-drop${dragOver ? " over" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("img-upload").click()}
          >
            <span className="si-drop-icon">📸</span>
            <span className="si-drop-title">Drop your SMS screenshot here</span>
            <span className="si-drop-sub">Take a screenshot of bank SMS from your Messages app and upload it</span>
            <input id="img-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(e.target.files[0])} />
          </div>
        )}

        {error && <div className="si-error">⚠️ {error}</div>}

        {activeTab === "paste" && (
          <button className="si-analyze-btn" onClick={() => handleParse()} disabled={loading}>
            {loading
              ? <><div className="si-spin" /> Analyzing with AI…</>
              : <>✦ Analyze SMS with AI</>}
          </button>
        )}

        {loading && activeTab !== "paste" && (
          <div className="si-processing">
            <div className="si-spin" />
            AI is reading your {activeTab === "pdf" ? "bank statement (30–60 sec)" : "screenshot"}…
          </div>
        )}
      </div>
    </>
  );
}