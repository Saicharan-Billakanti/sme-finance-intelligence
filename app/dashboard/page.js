"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SMSInput from "@/components/SMSInput";
import TransactionList from "@/components/TransactionList";
import Charts from "@/components/Charts";
import HealthScore from "@/components/HealthScore";
import AnomalyLoan from "@/components/AnomalyLoan";
import WhatsAppReport from "@/components/WhatsAppReport";

// ── UI TRANSLATIONS ──────────────────────────────────────────────
const T = {
  en: {
    title:        "Financial Dashboard",
    subtitle_empty: "Add your bank data below to get started",
    subtitle_data:  (n) => `${n} transactions loaded`,
    income:       "Total Income",
    expenses:     "Total Expenses",
    netBalance:   "Net Balance",
    credits:      "Credits across all entries",
    debits:       "Debits across all entries",
    surplus:      "↑ Surplus",
    deficit:      "↓ Deficit",
    addData:      "Add Financial Data",
    addDataSub:   "Bank statement PDF · SMS · Screenshot",
    addMore:      "+ Add More Data",
    close:        "✕ Close",
    healthTitle:  "Financial Health Score",
    healthSub:    "AI business health analysis",
    anomalyTitle: "Anomaly & Loan Eligibility",
    anomalySub:   "Flagged transactions + loan estimate",
    insightsTitle:"Income, Expenses & Forecast",
    insightsSub:  "Visual breakdown of your financial activity",
    txTitle:      "All Transactions",
    txSub:        "Search, filter and review every entry",
    waTitle:      "WhatsApp Instant Report",
    waSub:        "Powered by Twilio · Income, expenses & forecast",
    emptyTitle:   "Your insights will appear here",
    emptySub:     "Upload a bank statement PDF, paste SMS, or share a screenshot. Everything loads automatically.",
    forecast:     "AI is generating your 3-month cash flow forecast…",
    back:         "← Back",
    startNew:     "🔄 Start New",
    tabs:         ["Overview", "Insights", "Transactions", "WhatsApp"],
    footer:       "Built for Indian SME owners · Powered by Groq AI · Free during beta",
    selectLang:   "Language",
  },
  hi: {
    title:        "वित्तीय डैशबोर्ड",
    subtitle_empty: "शुरू करने के लिए नीचे अपना बैंक डेटा जोड़ें",
    subtitle_data:  (n) => `${n} लेनदेन लोड हुए`,
    income:       "कुल आय",
    expenses:     "कुल खर्च",
    netBalance:   "शुद्ध शेष",
    credits:      "सभी प्रविष्टियों में जमा",
    debits:       "सभी प्रविष्टियों में डेबिट",
    surplus:      "↑ अधिशेष",
    deficit:      "↓ घाटा",
    addData:      "वित्तीय डेटा जोड़ें",
    addDataSub:   "बैंक स्टेटमेंट PDF · SMS · स्क्रीनशॉट",
    addMore:      "+ और डेटा जोड़ें",
    close:        "✕ बंद करें",
    healthTitle:  "वित्तीय स्वास्थ्य स्कोर",
    healthSub:    "AI व्यावसायिक स्वास्थ्य विश्लेषण",
    anomalyTitle: "असामान्य लेनदेन & ऋण पात्रता",
    anomalySub:   "संदिग्ध लेनदेन + ऋण अनुमान",
    insightsTitle:"आय, व्यय और पूर्वानुमान",
    insightsSub:  "आपकी वित्तीय गतिविधि का दृश्य विश्लेषण",
    txTitle:      "सभी लेनदेन",
    txSub:        "खोजें, फ़िल्टर करें और समीक्षा करें",
    waTitle:      "WhatsApp त्वरित रिपोर्ट",
    waSub:        "Twilio द्वारा संचालित · आय, व्यय और पूर्वानुमान",
    emptyTitle:   "आपकी जानकारी यहाँ दिखेगी",
    emptySub:     "बैंक स्टेटमेंट PDF अपलोड करें, SMS पेस्ट करें या स्क्रीनशॉट साझा करें।",
    forecast:     "AI आपका 3 महीने का नकदी प्रवाह पूर्वानुमान तैयार कर रहा है…",
    back:         "← वापस",
    startNew:     "🔄 नया शुरू करें",
    tabs:         ["अवलोकन", "जानकारी", "लेनदेन", "WhatsApp"],
    footer:       "भारतीय SME मालिकों के लिए · Groq AI द्वारा संचालित · बीटा में निःशुल्क",
    selectLang:   "भाषा",
  },
  te: {
    title:        "ఆర్థిక డాష్‌బోర్డ్",
    subtitle_empty: "ప్రారంభించడానికి మీ బ్యాంక్ డేటా జోడించండి",
    subtitle_data:  (n) => `${n} లావాదేవీలు లోడ్ అయ్యాయి`,
    income:       "మొత్తం ఆదాయం",
    expenses:     "మొత్తం ఖర్చులు",
    netBalance:   "నికర నిల్వ",
    credits:      "అన్ని నమోదులలో జమలు",
    debits:       "అన్ని నమోదులలో డెబిట్లు",
    surplus:      "↑ మిగులు",
    deficit:      "↓ లోటు",
    addData:      "ఆర్థిక డేటా జోడించండి",
    addDataSub:   "బ్యాంక్ స్టేట్‌మెంట్ PDF · SMS · స్క్రీన్‌షాట్",
    addMore:      "+ మరింత డేటా జోడించండి",
    close:        "✕ మూసివేయండి",
    healthTitle:  "ఆర్థిక ఆరోగ్య స్కోర్",
    healthSub:    "AI వ్యాపార ఆరోగ్య విశ్లేషణ",
    anomalyTitle: "అసాధారణ లావాదేవీలు & రుణ అర్హత",
    anomalySub:   "అనుమానాస్పద లావాదేవీలు + రుణ అంచనా",
    insightsTitle:"ఆదాయం, ఖర్చులు & అంచనా",
    insightsSub:  "మీ ఆర్థిక కార్యకలాపాల దృశ్య విశ్లేషణ",
    txTitle:      "అన్ని లావాదేవీలు",
    txSub:        "వెతకండి, వడపోయండి మరియు సమీక్షించండి",
    waTitle:      "WhatsApp తక్షణ నివేదిక",
    waSub:        "Twilio ద్వారా · ఆదాయం, ఖర్చులు & అంచనా",
    emptyTitle:   "మీ అంతర్దృష్టులు ఇక్కడ కనిపిస్తాయి",
    emptySub:     "బ్యాంక్ స్టేట్‌మెంట్ PDF అప్‌లోడ్ చేయండి, SMS పేస్ట్ చేయండి లేదా స్క్రీన్‌షాట్ షేర్ చేయండి.",
    forecast:     "AI మీ 3-నెలల నగదు ప్రవాహ అంచనాను రూపొందిస్తోంది…",
    back:         "← వెనక్కి",
    startNew:     "🔄 కొత్తగా ప్రారంభించు",
    tabs:         ["అవలోకనం", "అంతర్దృష్టులు", "లావాదేవీలు", "WhatsApp"],
    footer:       "భారతీయ SME యజమానుల కోసం · Groq AI ద్వారా · బీటాలో ఉచితం",
    selectLang:   "భాష",
  },
  ta: {
    title:        "நிதி டாஷ்போர்டு",
    subtitle_empty: "தொடங்க உங்கள் வங்கி தரவை கீழே சேர்க்கவும்",
    subtitle_data:  (n) => `${n} பரிவர்த்தனைகள் ஏற்றப்பட்டன`,
    income:       "மொத்த வருமானம்",
    expenses:     "மொத்த செலவுகள்",
    netBalance:   "நிகர இருப்பு",
    credits:      "அனைத்து பதிவுகளிலும் வரவுகள்",
    debits:       "அனைத்து பதிவுகளிலும் பற்றுகள்",
    surplus:      "↑ உபரி",
    deficit:      "↓ பற்றாக்குறை",
    addData:      "நிதி தரவு சேர்க்கவும்",
    addDataSub:   "வங்கி அறிக்கை PDF · SMS · ஸ்கிரீன்ஷாட்",
    addMore:      "+ மேலும் தரவு சேர்க்கவும்",
    close:        "✕ மூடு",
    healthTitle:  "நிதி ஆரோக்கிய மதிப்பெண்",
    healthSub:    "AI வணிக ஆரோக்கிய பகுப்பாய்வு",
    anomalyTitle: "அசாதாரண பரிவர்த்தனைகள் & கடன் தகுதி",
    anomalySub:   "சந்தேகப்படும் பரிவர்த்தனைகள் + கடன் மதிப்பீடு",
    insightsTitle:"வருமானம், செலவுகள் & முன்கணிப்பு",
    insightsSub:  "உங்கள் நிதி செயல்பாட்டின் காட்சி பகுப்பாய்வு",
    txTitle:      "அனைத்து பரிவர்த்தனைகளும்",
    txSub:        "தேடு, வடிகட்டு மற்றும் மதிப்பாய்வு செய்",
    waTitle:      "WhatsApp உடனடி அறிக்கை",
    waSub:        "Twilio மூலம் · வருமானம், செலவுகள் & முன்கணிப்பு",
    emptyTitle:   "உங்கள் நுண்ணறிவுகள் இங்கே தோன்றும்",
    emptySub:     "வங்கி அறிக்கை PDF பதிவேற்றவும், SMS ஒட்டவும் அல்லது ஸ்கிரீன்ஷாட் பகிரவும்.",
    forecast:     "AI உங்கள் 3 மாத பணப்புழக்க முன்கணிப்பை உருவாக்குகிறது…",
    back:         "← பின்னால்",
    startNew:     "🔄 புதிதாக தொடங்கு",
    tabs:         ["மேலோட்டம்", "நுண்ணறிவுகள்", "பரிவர்த்தனைகள்", "WhatsApp"],
    footer:       "இந்திய SME உரிமையாளர்களுக்காக · Groq AI மூலம் · பீட்டாவில் இலவசம்",
    selectLang:   "மொழி",
  },
};

const LANG_OPTIONS = [
  { id: "en", label: "EN", full: "English"  },
  { id: "hi", label: "हि", full: "हिन्दी"   },
  { id: "te", label: "తె", full: "తెలుగు"   },
  { id: "ta", label: "த",  full: "தமிழ்"    },
];

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions]       = useState([]);
  const [forecast, setForecast]               = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [activeTab, setActiveTab]             = useState("overview");
  const [showImport, setShowImport]           = useState(false);
  const [lang, setLang]                       = useState("en");

  const t        = T[lang];
  const tabIds   = ["overview", "insights", "transactions", "whatsapp"];

  const totalCredit = transactions.filter((x) => x.type === "credit").reduce((s, x) => s + x.amount, 0);
  const totalDebit  = transactions.filter((x) => x.type === "debit").reduce((s, x) => s + x.amount, 0);
  const netBalance  = totalCredit - totalDebit;
  const hasData     = transactions.length > 0;

  const handleParsed = async (newTx) => {
    const merged = [...transactions, ...newTx];
    setTransactions(merged);
    setShowImport(false);
    setForecastLoading(true);
    try {
      const res  = await fetch("/api/forecast", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactions: merged }) });
      const data = await res.json();
      if (data.success) setForecast(data.forecast);
    } catch {}
    setForecastLoading(false);
  };

  const handleReset = () => { setTransactions([]); setForecast([]); setActiveTab("overview"); setShowImport(false); };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .db { min-height: 100vh; background: #f0f4ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        /* NAV */
        .db-nav { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #e5e7eb; height: 60px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .db-logo { display: flex; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0; }
        .db-logo-box { width: 32px; height: 32px; background: #2563eb; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: 800; }
        .db-logo-text { font-size: 15px; font-weight: 700; color: #111827; }

        /* Tab pills */
        .db-tabs { display: flex; gap: 2px; background: #f1f5f9; border-radius: 10px; padding: 3px; }
        .db-tab { padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748b; background: transparent; transition: all 0.15s; }
        .db-tab.active { background: #fff; color: #2563eb; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .db-tab:hover:not(.active) { color: #374151; }
        .db-tab.locked { opacity: 0.35; pointer-events: none; }

        /* Language switcher */
        .db-lang-wrap { display: flex; align-items: center; gap: 5px; }
        .db-lang-lbl { font-size: 11px; font-weight: 600; color: #9ca3af; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; }
        .db-lang-btn { font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #64748b; cursor: pointer; transition: all 0.15s; }
        .db-lang-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }
        .db-lang-btn:hover:not(.active) { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }

        /* Nav right */
        .db-nav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .db-btn-back { font-size: 12px; font-weight: 600; color: #64748b; background: #f1f5f9; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
        .db-btn-back:hover { background: #e2e8f0; }
        .db-btn-new { font-size: 12px; font-weight: 600; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
        .db-btn-new:hover { background: #dbeafe; }

        /* Body */
        .db-body { max-width: 1100px; margin: 0 auto; padding: 26px 22px 56px; }
        .db-ph { margin-bottom: 20px; }
        .db-ph h1 { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
        .db-ph p  { font-size: 13px; color: #6b7280; margin-top: 3px; }

        /* Stats */
        .db-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
        .db-stat  { background: #fff; border-radius: 16px; padding: 18px 20px; border: 1px solid #e8edf5; position: relative; overflow: hidden; }
        .db-stat-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 16px 0 0 16px; }
        .db-stat-lbl { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; margin-bottom: 7px; }
        .db-stat-val { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
        .db-stat-sub { font-size: 11px; color: #9ca3af; margin-top: 5px; }
        .db-stat-badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 7px; }

        /* Cards */
        .db-card { background: #fff; border-radius: 18px; border: 1px solid #e8edf5; overflow: hidden; margin-bottom: 18px; }
        .db-card-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 12px; border-bottom: 1px solid #f1f5f9; }
        .db-card-title-row { display: flex; align-items: center; gap: 9px; }
        .db-card-ico { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .db-card-title { font-size: 14px; font-weight: 700; color: #111827; }
        .db-card-sub   { font-size: 12px; color: #9ca3af; margin-top: 1px; }
        .db-card-body  { padding: 20px; }
        .db-two { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
        .db-add-btn { font-size: 13px; font-weight: 600; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; padding: 7px 14px; border-radius: 9px; cursor: pointer; transition: all 0.15s; }
        .db-add-btn:hover { background: #dbeafe; }
        .db-loading { display: flex; align-items: center; gap: 10px; padding: 13px 16px; border-radius: 12px; background: #eff6ff; border: 1px solid #bfdbfe; color: #2563eb; font-size: 13px; font-weight: 500; margin-bottom: 18px; }
        .db-spin { width: 15px; height: 15px; border: 2px solid #bfdbfe; border-top-color: #2563eb; border-radius: 50%; animation: dbspin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes dbspin { to { transform: rotate(360deg); } }
        .db-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 52px 24px; text-align: center; }
        .db-empty-ico { font-size: 40px; margin-bottom: 14px; opacity: 0.35; }
        .db-empty-title { font-size: 15px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .db-empty-sub { font-size: 13px; color: #9ca3af; line-height: 1.6; max-width: 300px; }

        @media (max-width: 768px) {
          .db-two { grid-template-columns: 1fr; }
          .db-stats { grid-template-columns: 1fr; }
          .db-tabs { display: none; }
          .db-logo-text { display: none; }
          .db-nav { padding: 0 14px; }
          .db-body { padding: 18px 14px 48px; }
          .db-lang-lbl { display: none; }
        }
      `}</style>

      <div className="db">

        {/* Navbar */}
        <nav className="db-nav">
          {/* Logo */}
          <div className="db-logo" onClick={() => router.push("/")}>
            <div className="db-logo-box">₹</div>
            <span className="db-logo-text">SME Finance Intelligence</span>
          </div>

          {/* Tab pills */}
          <div className="db-tabs">
            {tabIds.map((id, i) => (
              <button
                key={id}
                className={`db-tab${activeTab === id ? " active" : ""}${!hasData && id !== "overview" ? " locked" : ""}`}
                onClick={() => setActiveTab(id)}
              >{t.tabs[i]}</button>
            ))}
          </div>

          {/* Right: language + back + new */}
          <div className="db-nav-right">
            {/* Language switcher */}
            <div className="db-lang-wrap">
              <span className="db-lang-lbl">{t.selectLang}:</span>
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l.id}
                  className={`db-lang-btn${lang === l.id ? " active" : ""}`}
                  title={l.full}
                  onClick={() => setLang(l.id)}
                >{l.label}</button>
              ))}
            </div>
            <button className="db-btn-back" onClick={() => router.push("/")}>{t.back}</button>
            {hasData && <button className="db-btn-new" onClick={handleReset}>{t.startNew}</button>}
          </div>
        </nav>

        <div className="db-body">

          {/* Page header */}
          <div className="db-ph">
            <h1>{t.title}</h1>
            <p>{hasData ? t.subtitle_data(transactions.length) : t.subtitle_empty}</p>
          </div>

          {/* Stats */}
          {hasData && (
            <div className="db-stats">
              <div className="db-stat">
                <div className="db-stat-bar" style={{ background: "#22c55e" }} />
                <div className="db-stat-lbl">{t.income}</div>
                <div className="db-stat-val" style={{ color: "#16a34a" }}>₹{totalCredit.toLocaleString("en-IN")}</div>
                <div className="db-stat-sub">{t.credits}</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-bar" style={{ background: "#ef4444" }} />
                <div className="db-stat-lbl">{t.expenses}</div>
                <div className="db-stat-val" style={{ color: "#dc2626" }}>₹{totalDebit.toLocaleString("en-IN")}</div>
                <div className="db-stat-sub">{t.debits}</div>
              </div>
              <div className="db-stat">
                <div className="db-stat-bar" style={{ background: netBalance >= 0 ? "#2563eb" : "#f97316" }} />
                <div className="db-stat-lbl">{t.netBalance}</div>
                <div className="db-stat-val" style={{ color: netBalance >= 0 ? "#2563eb" : "#ea580c" }}>
                  ₹{Math.abs(netBalance).toLocaleString("en-IN")}
                </div>
                <div className="db-stat-badge" style={{ background: netBalance >= 0 ? "#dbeafe" : "#ffedd5", color: netBalance >= 0 ? "#1d4ed8" : "#c2410c" }}>
                  {netBalance >= 0 ? t.surplus : t.deficit}
                </div>
              </div>
            </div>
          )}

          {/* Forecast loading */}
          {forecastLoading && (
            <div className="db-loading">
              <div className="db-spin" />{t.forecast}
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <>
              <div className="db-card">
                <div className="db-card-head">
                  <div className="db-card-title-row">
                    <div className="db-card-ico" style={{ background: "#eff6ff" }}>📥</div>
                    <div>
                      <div className="db-card-title">{t.addData}</div>
                      <div className="db-card-sub">{t.addDataSub}</div>
                    </div>
                  </div>
                  {hasData && (
                    <button className="db-add-btn" onClick={() => setShowImport(!showImport)}>
                      {showImport ? t.close : t.addMore}
                    </button>
                  )}
                </div>
                {(!hasData || showImport) && (
                  <div className="db-card-body">
                    <SMSInput onTransactionsParsed={handleParsed} />
                  </div>
                )}
              </div>

              {hasData && (
                <div className="db-two">
                  <div className="db-card" style={{ marginBottom: 0 }}>
                    <div className="db-card-head">
                      <div className="db-card-title-row">
                        <div className="db-card-ico" style={{ background: "#fef2f2" }}>❤️</div>
                        <div>
                          <div className="db-card-title">{t.healthTitle}</div>
                          <div className="db-card-sub">{t.healthSub}</div>
                        </div>
                      </div>
                    </div>
                    <div className="db-card-body"><HealthScore transactions={transactions} /></div>
                  </div>
                  <div className="db-card" style={{ marginBottom: 0 }}>
                    <div className="db-card-head">
                      <div className="db-card-title-row">
                        <div className="db-card-ico" style={{ background: "#fff7ed" }}>🚨</div>
                        <div>
                          <div className="db-card-title">{t.anomalyTitle}</div>
                          <div className="db-card-sub">{t.anomalySub}</div>
                        </div>
                      </div>
                    </div>
                    <div className="db-card-body"><AnomalyLoan transactions={transactions} /></div>
                  </div>
                </div>
              )}

              {!hasData && (
                <div className="db-card">
                  <div className="db-empty">
                    <div className="db-empty-ico">📊</div>
                    <div className="db-empty-title">{t.emptyTitle}</div>
                    <div className="db-empty-sub">{t.emptySub}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── INSIGHTS ── */}
          {activeTab === "insights" && hasData && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title-row">
                  <div className="db-card-ico" style={{ background: "#f0fdf4" }}>📈</div>
                  <div>
                    <div className="db-card-title">{t.insightsTitle}</div>
                    <div className="db-card-sub">{t.insightsSub}</div>
                  </div>
                </div>
              </div>
              <div className="db-card-body"><Charts transactions={transactions} forecast={forecast} /></div>
            </div>
          )}

          {/* ── TRANSACTIONS ── */}
          {activeTab === "transactions" && hasData && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title-row">
                  <div className="db-card-ico" style={{ background: "#f8fafc" }}>🧾</div>
                  <div>
                    <div className="db-card-title">{t.txTitle}</div>
                    <div className="db-card-sub">{t.txSub}</div>
                  </div>
                </div>
              </div>
              <div className="db-card-body"><TransactionList transactions={transactions} /></div>
            </div>
          )}

          {/* ── WHATSAPP ── */}
          {activeTab === "whatsapp" && hasData && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title-row">
                  <div className="db-card-ico" style={{ background: "#f0fdf4" }}>📱</div>
                  <div>
                    <div className="db-card-title">{t.waTitle}</div>
                    <div className="db-card-sub">{t.waSub}</div>
                  </div>
                </div>
              </div>
              <div className="db-card-body"><WhatsAppReport transactions={transactions} forecast={forecast} /></div>
            </div>
          )}

        </div>

        <div style={{ textAlign:"center", padding:"0 0 24px", fontSize:12, color:"#9ca3af" }}>
          {t.footer}
        </div>
      </div>
    </>
  );
}