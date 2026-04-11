"use client";
import { useState } from "react";

export default function SMSInput({ onTransactionsParsed }) {
  const [smsText, setSmsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const sampleSMS = `SBI: Rs.15000 credited to your account on 09-Apr-26 by UPI. Ref No 123456789
HDFC Bank: Rs.2500 debited from your account on 08-Apr-26. Info: ELECTRICITY BILL
Paytm: Rs.8000 credited to your ac XXXXXX1234 on 07-Apr-26. UPI Ref 987654321
SBI: Rs.5000 debited from your account on 06-Apr-26. Info: RENT PAYMENT
HDFC Bank: Rs.3200 debited on 05-Apr-26. Info: WHOLESALE PURCHASE
SBI: Rs.22000 credited to your account on 04-Apr-26 by UPI. SALES COLLECTION`;

  const handleParse = async (text) => {
    const content = text || smsText;
    if (!content.trim()) { setError("Please provide SMS messages first"); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/parse-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smsText: content }),
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

  const tabs = [
    { id: "paste", icon: "📋", label: "Paste SMS" },
    { id: "pdf",   icon: "📄", label: "Bank Statement" },
    { id: "image", icon: "📸", label: "Screenshot" },
  ];

  return (
    <>
      <style>{`
        .sms-tabs { display: flex; gap: 6px; margin-bottom: 20px; background: #f1f5f9; padding: 4px; border-radius: 12px; }
        .sms-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 9px 14px; border-radius: 9px; font-size: 13px; font-weight: 600;
          cursor: pointer; border: none; transition: all 0.2s; background: transparent;
          color: #64748b;
        }
        .sms-tab.active {
          background: #fff; color: #2563eb;
          box-shadow: 0 1px 6px rgba(37,99,235,0.12), 0 1px 3px rgba(0,0,0,0.07);
        }
        .sms-tab:hover:not(.active) { background: rgba(255,255,255,0.6); color: #374151; }

        .sms-textarea {
          width: 100%; height: 180px; padding: 16px;
          border: 1.5px solid #e2e8f0; border-radius: 14px;
          background: #f8fafc; color: #1e293b;
          font-size: 13px; font-family: 'DM Mono', 'Fira Code', monospace;
          line-height: 1.7; resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sms-textarea:focus { outline: none; border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .sms-textarea::placeholder { color: #94a3b8; font-family: inherit; }

        .drop-zone {
          height: 180px; border: 2px dashed #cbd5e1; border-radius: 14px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; cursor: pointer; transition: all 0.2s; background: #f8fafc;
        }
        .drop-zone:hover, .drop-zone.over {
          border-color: #2563eb; background: #eff6ff;
        }
        .drop-zone .dz-icon { font-size: 36px; line-height: 1; }
        .drop-zone .dz-title { font-size: 14px; font-weight: 600; color: #374151; }
        .drop-zone .dz-sub { font-size: 12px; color: #94a3b8; text-align: center; max-width: 280px; line-height: 1.5; }
        .drop-zone .dz-hint { font-size: 11px; color: #2563eb; font-weight: 500; margin-top: 2px; }

        .analyze-btn {
          width: 100%; margin-top: 16px;
          padding: 14px; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #fff; font-size: 14px; font-weight: 700;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .analyze-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
        .analyze-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .load-sample-btn {
          font-size: 12px; font-weight: 600; color: #2563eb;
          background: #eff6ff; border: 1px solid #bfdbfe;
          padding: 5px 12px; border-radius: 8px; cursor: pointer;
          transition: all 0.15s;
        }
        .load-sample-btn:hover { background: #dbeafe; }

        .sms-error {
          margin-top: 10px; padding: 10px 14px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #dc2626; font-size: 13px; font-weight: 500;
        }

        .processing-bar {
          margin-top: 14px; padding: 12px 16px; border-radius: 12px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          display: flex; align-items: center; gap: 10px;
          color: #2563eb; font-size: 13px; font-weight: 500;
        }
        .spin { width: 16px; height: 16px; border: 2px solid #bfdbfe; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .uploaded-name {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .uploaded-name .fname { font-size: 13px; font-weight: 600; color: #2563eb; }
        .uploaded-name .fstatus { font-size: 11px; color: #94a3b8; }

        .sms-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; gap: 12px; }
        .sms-header-text h2 { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 2px; }
        .sms-header-text p { font-size: 12px; color: #6b7280; margin: 0; }

        .lang-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px; }
        .lang-chip { font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 20px; background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; letter-spacing: 0.03em; }
      `}</style>

      <div>
        <div className="sms-header">
          <div className="sms-header-text">
            <h2>Import Transactions</h2>
            <p>Upload bank statement, SMS screenshot, or paste SMS</p>
            <div className="lang-chips">
              <span className="lang-chip">🇮🇳 English</span>
              <span className="lang-chip">हिन्दी</span>
              <span className="lang-chip">తెలుగు</span>
              <span className="lang-chip">தமிழ்</span>
            </div>
          </div>
          <button className="load-sample-btn" onClick={() => { setSmsText(sampleSMS); setActiveTab("paste"); }}>
            Load Sample
          </button>
        </div>

        {/* Tabs */}
        <div className="sms-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sms-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => { setActiveTab(tab.id); setError(""); setUploadedFile(null); }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Paste Tab */}
        {activeTab === "paste" && (
          <textarea
            className="sms-textarea"
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder={`Paste your bank SMS messages here…\n\nExample:\nSBI: Rs.15000 credited to your account on 09-Apr-26 by UPI\nHDFC: Rs.2500 debited on 08-Apr-26. Info: ELECTRICITY BILL`}
          />
        )}

        {/* PDF Tab */}
        {activeTab === "pdf" && (
          <div
            className={`drop-zone${dragOver ? " over" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("pdf-upload").click()}
          >
            {uploadedFile ? (
              <div className="uploaded-name">
                <span style={{ fontSize: 32 }}>📄</span>
                <span className="fname">{uploadedFile}</span>
                <span className="fstatus">Processing…</span>
              </div>
            ) : (
              <>
                <span className="dz-icon">📄</span>
                <span className="dz-title">Drop your bank statement PDF here</span>
                <span className="dz-sub">Works with SBI, HDFC, ICICI, Axis, Kotak & all Indian banks</span>
                <span className="dz-hint">Download from NetBanking → Account Statement</span>
              </>
            )}
            <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handlePDFUpload(e.target.files[0])} />
          </div>
        )}

        {/* Image Tab */}
        {activeTab === "image" && (
          <div
            className={`drop-zone${dragOver ? " over" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("img-upload").click()}
          >
            <span className="dz-icon">📸</span>
            <span className="dz-title">Drop your SMS screenshot here</span>
            <span className="dz-sub">Take a screenshot of bank SMS from your Messages app and upload it</span>
            <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />
          </div>
        )}

        {error && <div className="sms-error">⚠️ {error}</div>}

        {activeTab === "paste" && (
          <button className="analyze-btn" onClick={() => handleParse()} disabled={loading}>
            {loading ? (
              <><div className="spin" /> Analyzing with AI…</>
            ) : (
              <>✦ Analyze SMS with AI</>
            )}
          </button>
        )}

        {loading && activeTab !== "paste" && (
          <div className="processing-bar">
            <div className="spin" />
            AI is reading your {activeTab === "pdf" ? "bank statement (30–60 sec)" : "screenshot"}…
          </div>
        )}
      </div>
    </>
  );
}