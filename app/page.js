"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: "🤖", title: "AI SMS Parsing", desc: "Paste any bank SMS — AI instantly extracts every transaction in seconds" },
    { icon: "📑", title: "Bank Statement Upload", desc: "Upload PDF statements from SBI, HDFC, ICICI, Axis, Union Bank & more" },
    { icon: "🖼️", title: "Screenshot Reader", desc: "Take a photo of your SMS inbox — AI reads and parses every transaction" },
    { icon: "📊", title: "Smart Dashboard", desc: "Visual charts showing income, expenses and 15 spending categories" },
    { icon: "🔮", title: "3-Month Forecast", desc: "AI predicts your future cash flow and gives actionable business tips" },
    { icon: "🏦", title: "Loan Eligibility", desc: "Know instantly how much business loan you qualify for based on your data" },
    { icon: "⚠️", title: "Anomaly Detection", desc: "AI flags unusual transactions automatically — never miss suspicious activity" },
    { icon: "💯", title: "Health Score", desc: "Get a financial health score out of 100 — like CIBIL but for your business" },
    { icon: "📱", title: "WhatsApp Reports", desc: "Receive your complete financial summary instantly on WhatsApp" },
  ];

  const stats = [
    { number: "11", label: "AI Features" },
    { number: "15+", label: "Spending Categories" },
    { number: "All", label: "Indian Banks Supported" },
    { number: "Free", label: "During Beta" },
  ];

  const banks = ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Union Bank", "Kotak Bank", "PNB", "BOI"];

  const steps = [
    { step: "01", title: "Upload your data", desc: "Paste SMS, upload bank statement PDF, or drop a screenshot" },
    { step: "02", title: "AI analyzes instantly", desc: "Our AI reads every transaction and categorizes them automatically" },
    { step: "03", title: "Get insights", desc: "See your health score, forecast, loan eligibility and WhatsApp report" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">₹</div>
            <span className="font-bold text-gray-900 text-lg">SME Finance Intelligence</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a>
            <a href="#banks" className="hover:text-blue-600 transition">Supported Banks</a>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            Try for Free →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                AI-Powered Financial Intelligence
              </div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Smart Finance for Your
                <span className="text-blue-600"> Growing Business</span>
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Upload your bank statement or paste SMS messages — get instant AI-powered insights, expense tracking, cash flow forecasts and loan eligibility. Built for Indian SMEs.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                  Get Started — It's Free →
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">✓ No credit card needed</span>
                <span className="flex items-center gap-1.5">✓ No data stored</span>
                <span className="flex items-center gap-1.5">✓ Setup in 2 minutes</span>
              </div>
            </div>

            {/* Hero Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Net Balance</p>
                  <p className="text-3xl font-bold text-gray-900">₹34,300</p>
                </div>
                <div className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  ↑ Healthy
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Income</p>
                  <p className="text-xl font-bold text-green-600">₹45,000</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
                  <p className="text-xl font-bold text-red-500">₹10,700</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-700">Financial Health Score</p>
                  <p className="text-xs text-green-600 font-medium">Excellent</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-blue-600">85</p>
                  <div className="flex-1 bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: "85%"}}></div>
                  </div>
                  <p className="text-xs text-gray-500">/ 100</p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs font-medium text-gray-700 mb-1">🏦 Loan Eligibility</p>
                <p className="text-xl font-bold text-orange-600">₹1,35,000</p>
                <p className="text-xs text-gray-500 mt-1">Based on your transaction history</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white">{s.number}</p>
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banks */}
      <section id="banks" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide">Works with all major Indian banks</p>
          <div className="flex flex-wrap justify-center gap-4">
            {banks.map((bank, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything your business needs</h2>
            <p className="text-lg text-gray-500">11 powerful AI features — all free, all in one place</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-blue-100 transition">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get insights in 3 simple steps</h2>
            <p className="text-lg text-gray-500">No accountant needed. No training required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 text-gray-300 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Built specifically for Indian SMEs</h2>
              {[
                { title: "Understands Indian bank SMS formats", desc: "SBI, HDFC, ICICI, Axis, UPI — our AI reads them all perfectly" },
                { title: "Hindi, Telugu & Tamil support", desc: "Works with vernacular language SMS messages from any Indian bank" },
                { title: "UPI transaction intelligence", desc: "Automatically categorizes Paytm, PhonePe, GPay transactions" },
                { title: "Zero data storage", desc: "Your financial data is never stored — complete privacy guaranteed" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 mb-6">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
              <div className="space-y-4">
                {[
                  { label: "Time saved monthly", value: "10+ hours", color: "bg-blue-600" },
                  { label: "Transaction accuracy", value: "95%+", color: "bg-green-500" },
                  { label: "Banks supported", value: "All Indian", color: "bg-orange-500" },
                  { label: "Setup time", value: "2 minutes", color: "bg-purple-500" },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <span className={`${item.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Join thousands of Indian SME owners who are making smarter financial decisions with AI.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-blue-600 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-50 transition shadow-xl"
          >
            Get Started — It's Free →
          </button>
          <p className="text-blue-300 text-sm mt-4">No credit card required · No data stored · Free during beta</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">₹</div>
            <span className="font-bold text-white">SME Finance Intelligence</span>
          </div>
          <p className="text-gray-500 text-sm">Built for Indian SMEs · Powered by AI · Free during beta</p>
        </div>
      </footer>
    </div>
  );
}