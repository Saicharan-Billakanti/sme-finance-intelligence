"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">💼</div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          SME Finance Intelligence
        </h1>
        <p className="text-lg text-gray-500 mt-4">
          Paste your bank SMS messages and get instant AI-powered financial insights, 
          expense tracking, and 3-month cash flow forecasts.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          Get Started — It's Free →
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl w-full">
        {[
          { icon: "🤖", title: "AI SMS Parsing", desc: "Paste any bank SMS and AI instantly extracts every transaction" },
          { icon: "📊", title: "Smart Dashboard", desc: "Visual charts showing income, expenses and spending categories" },
          { icon: "🔮", title: "3-Month Forecast", desc: "AI predicts your future cash flow and gives actionable tips" },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-800">{f.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-12">
        Built for Indian SMEs · No data stored · Powered by AI
      </p>
    </div>
  );
}