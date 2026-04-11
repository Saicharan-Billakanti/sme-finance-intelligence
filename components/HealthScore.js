"use client";

const T = {
  en: {
    excellent: "Excellent",
    moderate:  "Moderate",
    needsWork: "Needs Work",
    healthScore: "Health Score",
    basedOn: (n) => `Based on ${n} transaction${n !== 1 ? "s" : ""}`,
    savingsRate:  "Savings Rate",
    expenseRatio: "Expense Ratio",
    transactions: "Transactions",
    ins1: "Your expenses are high relative to income. Try cutting non-essential costs.",
    ins2: "Good savings rate! Keep maintaining this balance.",
    ins3: "You're spending more than you earn this period.",
    ins4: "Add more transactions for a more accurate score.",
  },
  hi: {
    excellent: "उत्कृष्ट",
    moderate:  "सामान्य",
    needsWork: "सुधार आवश्यक",
    healthScore: "स्वास्थ्य स्कोर",
    basedOn: (n) => `${n} लेनदेन पर आधारित`,
    savingsRate:  "बचत दर",
    expenseRatio: "व्यय अनुपात",
    transactions: "लेनदेन",
    ins1: "आपके खर्चे आय की तुलना में अधिक हैं। गैर-जरूरी खर्च कम करें।",
    ins2: "अच्छी बचत दर! यह संतुलन बनाए रखें।",
    ins3: "आप इस अवधि में आय से अधिक खर्च कर रहे हैं।",
    ins4: "सटीक स्कोर के लिए अधिक लेनदेन जोड़ें।",
  },
  te: {
    excellent: "అద్భుతం",
    moderate:  "సాధారణం",
    needsWork: "మెరుగుపరచాలి",
    healthScore: "ఆరోగ్య స్కోర్",
    basedOn: (n) => `${n} లావాదేవీల ఆధారంగా`,
    savingsRate:  "పొదుపు రేటు",
    expenseRatio: "వ్యయ నిష్పత్తి",
    transactions: "లావాదేవీలు",
    ins1: "మీ ఖర్చులు ఆదాయంతో పోలిస్తే ఎక్కువగా ఉన్నాయి. అనవసర ఖర్చులు తగ్గించండి.",
    ins2: "మంచి పొదుపు రేటు! ఈ సమతుల్యతను కొనసాగించండి.",
    ins3: "మీరు ఈ కాలంలో సంపాదించిన దానికంటే ఎక్కువ ఖర్చు చేస్తున్నారు.",
    ins4: "మరింత ఖచ్చితమైన స్కోర్‌కు మరిన్ని లావాదేవీలు జోడించండి.",
  },
  ta: {
    excellent: "சிறந்தது",
    moderate:  "மிதமானது",
    needsWork: "மேம்பாடு தேவை",
    healthScore: "ஆரோக்கிய மதிப்பெண்",
    basedOn: (n) => `${n} பரிவர்த்தனைகளின் அடிப்படையில்`,
    savingsRate:  "சேமிப்பு விகிதம்",
    expenseRatio: "செலவு விகிதம்",
    transactions: "பரிவர்த்தனைகள்",
    ins1: "உங்கள் செலவுகள் வருமானத்தை விட அதிகமாக உள்ளன. தேவையற்ற செலவுகளை குறைக்கவும்.",
    ins2: "நல்ல சேமிப்பு விகிதம்! இந்த சமநிலையை தொடர்ந்து பராமரிக்கவும்.",
    ins3: "இந்த காலகட்டத்தில் நீங்கள் சம்பாதிப்பதை விட அதிகமாக செலவிடுகிறீர்கள்.",
    ins4: "துல்லியமான மதிப்பெண்ணுக்கு மேலும் பரிவர்த்தனைகளை சேர்க்கவும்.",
  },
};

export default function HealthScore({ transactions, lang = "en" }) {
  if (!transactions || transactions.length === 0) return null;

  const t = T[lang] || T.en;

  const totalCredit = transactions.filter((x) => x.type === "credit").reduce((sum, x) => sum + x.amount, 0);
  const totalDebit  = transactions.filter((x) => x.type === "debit").reduce((sum, x) => sum + x.amount, 0);

  const savingsRate    = totalCredit > 0 ? ((totalCredit - totalDebit) / totalCredit) * 100 : 0;
  const diversityScore = new Set(transactions.map((x) => x.category)).size * 10;
  const volumeScore    = Math.min(transactions.length * 5, 30);
  const score = Math.min(Math.max(Math.round(savingsRate * 0.5 + diversityScore + volumeScore), 0), 100);

  const expenseRatio   = totalCredit > 0 ? Math.round((totalDebit / totalCredit) * 100) : 0;
  const savingsRatePct = Math.round(Math.max(savingsRate, 0));

  const getStatus = (s) => {
    if (s >= 70) return { label: t.excellent, color: "#16a34a", bg: "#dcfce7", ring: "#16a34a", track: "#bbf7d0" };
    if (s >= 50) return { label: t.moderate,  color: "#d97706", bg: "#fef3c7", ring: "#d97706", track: "#fde68a" };
    return              { label: t.needsWork,  color: "#dc2626", bg: "#fee2e2", ring: "#ef4444", track: "#fecaca" };
  };
  const status = getStatus(score);

  const R = 54, C = 2 * Math.PI * R;
  const filled = (score / 100) * C;

  const metrics = [
    { label: t.savingsRate,  value: savingsRatePct,      max: 100, unit: "%", color: "#2563eb" },
    { label: t.expenseRatio, value: expenseRatio,         max: 100, unit: "%", color: expenseRatio > 80 ? "#dc2626" : "#f97316" },
    { label: t.transactions, value: transactions.length,  max: Math.max(transactions.length, 20), unit: "", color: "#8b5cf6" },
  ];

  const insights = [];
  if (savingsRate < 20)  insights.push({ icon: "⚠️", text: t.ins1, color: "#f97316" });
  if (savingsRate >= 20) insights.push({ icon: "✓",  text: t.ins2, color: "#16a34a" });
  if (totalDebit > totalCredit) insights.push({ icon: "⚠️", text: t.ins3, color: "#dc2626" });
  if (transactions.length < 5)  insights.push({ icon: "ℹ",  text: t.ins4, color: "#2563eb" });

  return (
    <>
      <style>{`
        .hs-wrap { display: flex; flex-direction: column; gap: 20px; }
        .hs-top  { display: flex; align-items: center; gap: 28px; }
        .hs-ring-wrap { position: relative; flex-shrink: 0; width: 128px; height: 128px; }
        .hs-ring-wrap svg { transform: rotate(-90deg); }
        .hs-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
        .hs-score-num { font-size: 30px; font-weight: 800; color: #111827; line-height: 1; letter-spacing: -0.03em; }
        .hs-score-of  { font-size: 11px; color: #9ca3af; font-weight: 500; }
        .hs-status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; margin-bottom: 6px; }
        .hs-status-dot  { width: 7px; height: 7px; border-radius: 50%; }
        .hs-label { font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.02em; margin-bottom: 2px; }
        .hs-sub   { font-size: 12px; color: #6b7280; }
        .hs-metrics     { display: flex; flex-direction: column; gap: 10px; }
        .hs-metric-row  { display: flex; flex-direction: column; gap: 4px; }
        .hs-metric-top  { display: flex; justify-content: space-between; align-items: center; }
        .hs-metric-label { font-size: 12px; font-weight: 600; color: #374151; }
        .hs-metric-val   { font-size: 12px; font-weight: 700; color: #111827; }
        .hs-bar-track { height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .hs-bar-fill  { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }
        .hs-insights  { display: flex; flex-direction: column; gap: 7px; padding-top: 4px; border-top: 1px solid #f1f5f9; }
        .hs-insight   { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #374151; line-height: 1.5; }
        .hs-insight-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; margin-top: 1px; }
      `}</style>

      <div className="hs-wrap">
        <div className="hs-top">
          <div className="hs-ring-wrap">
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r={R} fill="none" stroke={status.track} strokeWidth="10" />
              <circle cx="64" cy="64" r={R} fill="none" stroke={status.ring} strokeWidth="10"
                strokeDasharray={`${filled} ${C}`} strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }} />
            </svg>
            <div className="hs-ring-center">
              <span className="hs-score-num">{score}</span>
              <span className="hs-score-of">/ 100</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="hs-status-pill" style={{ background: status.bg, color: status.color }}>
              <div className="hs-status-dot" style={{ background: status.color }} />
              {status.label}
            </div>
            <div className="hs-label">{t.healthScore}</div>
            <div className="hs-sub">{t.basedOn(transactions.length)}</div>
          </div>
        </div>

        <div className="hs-metrics">
          {metrics.map((m) => (
            <div className="hs-metric-row" key={m.label}>
              <div className="hs-metric-top">
                <span className="hs-metric-label">{m.label}</span>
                <span className="hs-metric-val">{m.value}{m.unit}</span>
              </div>
              <div className="hs-bar-track">
                <div className="hs-bar-fill" style={{ width: `${Math.min((m.value / m.max) * 100, 100)}%`, background: m.color }} />
              </div>
            </div>
          ))}
        </div>

        {insights.length > 0 && (
          <div className="hs-insights">
            {insights.map((ins, i) => (
              <div className="hs-insight" key={i}>
                <div className="hs-insight-icon" style={{ background: ins.color + "18", color: ins.color }}>{ins.icon}</div>
                <span>{ins.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}