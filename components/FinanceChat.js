"use client";
import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "Where am I spending the most?",
  "Am I saving enough?",
  "How is my financial health?",
  "What does my forecast say?",
  "How can I reduce expenses?",
];

export default function FinanceChat({ transactions, forecast }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm your AI financial advisor. Ask me anything about your transactions, spending patterns, or how to improve your finances!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, transactions, forecast }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't connect. Please try again." },
      ]);
    }
    setLoading(false);
  };

  if (!transactions || transactions.length === 0) return null;

  return (
    <>
      <style>{`
        .fc-root { display: flex; flex-direction: column; height: 480px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .fc-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 4px 2px 8px; }
        .fc-messages::-webkit-scrollbar { width: 4px; }
        .fc-messages::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .fc-msg { display: flex; gap: 10px; align-items: flex-start; }
        .fc-msg.user { flex-direction: row-reverse; }

        .fc-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }
        .fc-avatar.ai  { background: #eff6ff; }
        .fc-avatar.usr { background: #2563eb; color: #fff; font-size: 12px; font-weight: 700; }

        .fc-bubble {
          max-width: 78%; padding: 10px 14px; border-radius: 16px;
          font-size: 13px; line-height: 1.6;
        }
        .fc-bubble.ai  { background: #f1f5f9; color: #1e293b; border-radius: 4px 16px 16px 16px; }
        .fc-bubble.user { background: #2563eb; color: #fff; border-radius: 16px 4px 16px 16px; }

        .fc-typing { display: flex; align-items: center; gap: 4px; padding: 10px 14px; }
        .fc-dot { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: fcbounce 1.2s infinite; }
        .fc-dot:nth-child(2) { animation-delay: 0.2s; }
        .fc-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes fcbounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

        .fc-suggestions { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .fc-sug {
          font-size: 11px; font-weight: 600; padding: 5px 11px; border-radius: 20px;
          background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .fc-sug:hover { background: #dbeafe; }

        .fc-input-row { display: flex; gap: 8px; margin-top: 10px; }
        .fc-input {
          flex: 1; padding: 11px 16px; border: 1.5px solid #e2e8f0;
          border-radius: 12px; font-size: 13px; color: #1e293b;
          background: #f8fafc; outline: none; transition: border-color 0.2s;
          font-family: inherit;
        }
        .fc-input:focus { border-color: #2563eb; background: #fff; }
        .fc-input::placeholder { color: #94a3b8; }

        .fc-send {
          width: 42px; height: 42px; border-radius: 12px; border: none;
          background: #2563eb; color: #fff; font-size: 18px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .fc-send:hover:not(:disabled) { background: #1d4ed8; transform: scale(1.05); }
        .fc-send:disabled { opacity: 0.5; cursor: not-allowed; }

        .fc-divider { height: 1px; background: #f1f5f9; margin: 8px 0; }
      `}</style>

      <div className="fc-root">
        {/* Suggestion chips */}
        <div className="fc-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="fc-sug" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="fc-divider" />

        {/* Messages */}
        <div className="fc-messages">
          {messages.map((m, i) => (
            <div key={i} className={`fc-msg ${m.role === "user" ? "user" : ""}`}>
              <div className={`fc-avatar ${m.role === "user" ? "usr" : "ai"}`}>
                {m.role === "user" ? "You" : "💰"}
              </div>
              <div className={`fc-bubble ${m.role === "user" ? "user" : "ai"}`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="fc-msg">
              <div className="fc-avatar ai">💰</div>
              <div className="fc-bubble ai">
                <div className="fc-typing">
                  <div className="fc-dot" />
                  <div className="fc-dot" />
                  <div className="fc-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="fc-input-row">
          <input
            className="fc-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Ask about your finances… e.g. How can I save more?"
            disabled={loading}
          />
          <button
            className="fc-send"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}