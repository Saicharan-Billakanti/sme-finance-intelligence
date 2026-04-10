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
    if (!content.trim()) {
      setError("Please provide SMS messages first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/parse-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smsText: content }),
      });
      const data = await response.json();
      if (data.success) {
        onTransactionsParsed(data.transactions);
        setSmsText("");
      } else {
        setError("Failed to parse SMS. Try again.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  const handlePDFUpload = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setUploadedFile(file.name);
    setLoading(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        const response = await fetch("/api/parse-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64 }),
        });
        const data = await response.json();
        if (data.success) {
          onTransactionsParsed(data.transactions);
          setUploadedFile(null);
        } else {
          setError("Could not read PDF. Make sure it's a bank statement.");
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("PDF upload failed.");
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        const mimeType = file.type;
        const response = await fetch("/api/parse-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, mimeType }),
        });
        const data = await response.json();
        if (data.success) {
          onTransactionsParsed(data.transactions);
        } else {
          setError("Could not read SMS from image. Try a clearer screenshot.");
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Image upload failed.");
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file.name.endsWith(".pdf")) handlePDFUpload(file);
    else if (file.type.startsWith("image/")) handleImageUpload(file);
    else setError("Please drop a PDF or image file");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Import Transactions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload bank statement, SMS screenshot, or paste SMS
          </p>
        </div>
        <button
          onClick={() => { setSmsText(sampleSMS); setActiveTab("paste"); }}
          className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
        >
          Load Sample
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["paste", "pdf", "image"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setError(""); setUploadedFile(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab === "paste" && "📋 Paste SMS"}
            {tab === "pdf" && "📑 Bank Statement"}
            {tab === "image" && "🖼️ Screenshot"}
          </button>
        ))}
      </div>

      {/* Paste Tab */}
      {activeTab === "paste" && (
        <textarea
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
          placeholder={`Paste your SMS messages here...\n\nExample:\nSBI: Rs.15000 credited to your account on 09-Apr-26 by UPI\nHDFC: Rs.2500 debited on 08-Apr-26. Info: ELECTRICITY BILL`}
          className="w-full h-48 p-4 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-50"
        />
      )}

      {/* PDF Upload Tab */}
      {activeTab === "pdf" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:border-blue-300"
          }`}
          onClick={() => document.getElementById("pdf-upload").click()}
        >
          {uploadedFile ? (
            <>
              <p className="text-4xl mb-3">📑</p>
              <p className="text-sm font-medium text-blue-600">{uploadedFile}</p>
              <p className="text-xs text-gray-400 mt-1">Processing...</p>
            </>
          ) : (
            <>
              <p className="text-4xl mb-3">📑</p>
              <p className="text-sm font-medium text-gray-700">
                Click or drag & drop bank statement PDF
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Works with SBI, HDFC, ICICI, Axis, Kotak & all Indian banks
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Download from NetBanking → Account Statement
              </p>
            </>
          )}
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handlePDFUpload(e.target.files[0])}
          />
        </div>
      )}

      {/* Image Upload Tab */}
      {activeTab === "image" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:border-blue-300"
          }`}
          onClick={() => document.getElementById("img-upload").click()}
        >
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-sm font-medium text-gray-700">
            Click or drag & drop SMS screenshot
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Take screenshot of bank SMS from Messages app
          </p>
          <input
            id="img-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {activeTab === "paste" && (
        <button
          onClick={() => handleParse()}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Analyzing with AI...
            </span>
          ) : (
            "Analyze SMS with AI"
          )}
        </button>
      )}

      {loading && activeTab !== "paste" && (
        <div className="mt-4 text-center text-sm text-blue-600 animate-pulse">
         🤖 AI is analyzing your {activeTab === "pdf" ? "bank statement (30-60 sec)..." : "screenshot..."}
        </div>
      )}
    </div>
  );
}