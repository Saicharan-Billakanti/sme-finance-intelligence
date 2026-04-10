"use client";
import { useState } from "react";

export default function WhatsAppReport({ transactions, forecast }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!phone || phone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/whatsapp-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, transactions, forecast }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setPhone("");
      } else {
        setError("Failed to send. Try again.");
      }
    } catch (e) {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
          📱
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Send Report to WhatsApp
          </h2>
          <p className="text-sm text-gray-500">
            Get your financial summary instantly on WhatsApp
          </p>
        </div>
      </div>

      {success ? (
        <div className="bg-green-100 rounded-xl p-4 text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-green-700 font-medium">
            Report sent successfully!
          </p>
          <p className="text-sm text-green-600 mt-1">
            Check your WhatsApp for the financial summary
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-3 text-xs text-green-600 underline"
          >
            Send again
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <span className="px-3 py-3 text-sm text-gray-500 border-r border-gray-200 bg-gray-50">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="Enter 10-digit number"
                className="flex-1 px-3 py-3 text-sm focus:outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-500 text-white px-5 py-3 rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Sending..." : "Send on WhatsApp 📲"}
          </button>
        </div>
      )}
    </div>
  );
}