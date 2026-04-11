"use client";

const T = {
  en: {
    anomalySection: "⚠ Anomaly Detection",
    unusualTitle: "Unusual Transactions Detected",
    flagged: (n) => `${n} transaction${n !== 1 ? "s" : ""} flagged as abnormally large`,
    avgNote: (n) => `Your average transaction is ₹${n}`,
    noAnomaly: "No anomalies found",
    noAnomalySub: "All transactions look within normal range",
    loanSection: "🏦 Business Loan Eligibility",
    loanTitle: "Loan Estimate",
    eligible: "✓ Eligible",
    notYet: "✗ Not Yet",
    estLabel: "Estimated Eligibility",
    loanNote: "* Indicative amount. Actual eligibility subject to bank verification.",
    reason1: "Based on your income consistency and savings rate",
    reason2: "Based on your transaction history",
    reason3: "Add more transactions to check loan eligibility",
    factors: ["Regular Income", "Savings Rate ≥ 20%", "5+ Transactions"],
  },
  hi: {
    anomalySection: "⚠ असामान्य गतिविधि",
    unusualTitle: "असामान्य लेनदेन मिले",
    flagged: (n) => `${n} लेनदेन असामान्य रूप से बड़े`,
    avgNote: (n) => `आपका औसत लेनदेन ₹${n} है`,
    noAnomaly: "कोई असामान्यता नहीं",
    noAnomalySub: "सभी लेनदेन सामान्य सीमा में हैं",
    loanSection: "🏦 व्यावसायिक ऋण पात्रता",
    loanTitle: "ऋण अनुमान",
    eligible: "✓ पात्र",
    notYet: "✗ अभी नहीं",
    estLabel: "अनुमानित पात्रता",
    loanNote: "* सांकेतिक राशि। वास्तविक पात्रता बैंक सत्यापन पर निर्भर।",
    reason1: "आपकी आय और बचत दर के आधार पर",
    reason2: "आपके लेनदेन इतिहास के आधार पर",
    reason3: "ऋण पात्रता जांचने के लिए अधिक लेनदेन जोड़ें",
    factors: ["नियमित आय", "बचत दर ≥ 20%", "5+ लेनदेन"],
  },
  te: {
    anomalySection: "⚠ అసాధారణ గుర్తింపు",
    unusualTitle: "అసాధారణ లావాదేవీలు గుర్తించబడ్డాయి",
    flagged: (n) => `${n} లావాదేవీలు అసాధారణంగా పెద్దవి`,
    avgNote: (n) => `మీ సగటు లావాదేవీ ₹${n}`,
    noAnomaly: "అసాధారణతలు లేవు",
    noAnomalySub: "అన్ని లావాదేవీలు సాధారణ పరిధిలో ఉన్నాయి",
    loanSection: "🏦 వ్యాపార రుణ అర్హత",
    loanTitle: "రుణ అంచనా",
    eligible: "✓ అర్హత ఉంది",
    notYet: "✗ ఇంకా కాదు",
    estLabel: "అంచనా అర్హత",
    loanNote: "* సూచన మొత్తం. అసలు అర్హత బ్యాంక్ ధృవీకరణకు లోబడి ఉంటుంది.",
    reason1: "మీ ఆదాయ స్థిరత్వం మరియు పొదుపు రేటు ఆధారంగా",
    reason2: "మీ లావాదేవీ చరిత్ర ఆధారంగా",
    reason3: "రుణ అర్హత తనిఖీకి మరిన్ని లావాదేవీలు జోడించండి",
    factors: ["క్రమమైన ఆదాయం", "పొదుపు రేటు ≥ 20%", "5+ లావాదేవీలు"],
  },
  ta: {
    anomalySection: "⚠ அசாதாரண கண்டறிதல்",
    unusualTitle: "அசாதாரண பரிவர்த்தனைகள் கண்டறியப்பட்டன",
    flagged: (n) => `${n} பரிவர்த்தனைகள் அசாதாரணமாக பெரியவை`,
    avgNote: (n) => `உங்கள் சராசரி பரிவர்த்தனை ₹${n}`,
    noAnomaly: "எந்த அசாதாரணமும் இல்லை",
    noAnomalySub: "அனைத்து பரிவர்த்தனைகளும் சாதாரண வரம்பில் உள்ளன",
    loanSection: "🏦 வணிக கடன் தகுதி",
    loanTitle: "கடன் மதிப்பீடு",
    eligible: "✓ தகுதியானது",
    notYet: "✗ இன்னும் இல்லை",
    estLabel: "மதிப்பிடப்பட்ட தகுதி",
    loanNote: "* குறிப்பு தொகை. உண்மையான தகுதி வங்கி சரிபார்ப்புக்கு உட்பட்டது.",
    reason1: "உங்கள் வருமான நிலைத்தன்மை மற்றும் சேமிப்பு விகிதம் அடிப்படையில்",
    reason2: "உங்கள் பரிவர்த்தனை வரலாறு அடிப்படையில்",
    reason3: "கடன் தகுதி சரிபார்க்க மேலும் பரிவர்த்தனைகள் சேர்க்கவும்",
    factors: ["வழக்கமான வருமானம்", "சேமிப்பு விகிதம் ≥ 20%", "5+ பரிவர்த்தனைகள்"],
  },
};

export default function AnomalyLoan({ transactions, lang = "en" }) {
  if (!transactions || transactions.length === 0) return null;

  const t = T[lang] || T.en;

  const totalCredit = transactions.filter((x) => x.type === "credit").reduce((sum, x) => sum + x.amount, 0);
  const totalDebit  = transactions.filter((x) => x.type === "debit").reduce((sum, x) => sum + x.amount, 0);
  const avgTransaction = transactions.length > 0
    ? transactions.reduce((sum, x) => sum + x.amount, 0) / transactions.length : 0;

  const anomalies = transactions.filter((x) => x.amount > avgTransaction * 2);

  const monthlyIncome = totalCredit;
  const savingsRate = totalCredit > 0 ? ((totalCredit - totalDebit) / totalCredit) * 100 : 0;

  let loanAmount = 0, loanEligible = false, loanReason = "";
  if (savingsRate >= 20 && monthlyIncome >= 10000) {
    loanEligible = true; loanAmount = Math.round(monthlyIncome * 3);
    loanReason = t.reason1;
  } else if (monthlyIncome >= 5000) {
    loanEligible = true; loanAmount = Math.round(monthlyIncome * 1.5);
    loanReason = t.reason2;
  } else {
    loanReason = t.reason3;
  }

  const factors = [
    { label: t.factors[0], met: monthlyIncome >= 5000 },
    { label: t.factors[1], met: savingsRate >= 20 },
    { label: t.factors[2], met: transactions.length >= 5 },
  ];

  return (
    <>
      <style>{`
        .al-wrap { display: flex; flex-direction: column; gap: 20px; }
        .al-anomaly-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .al-anomaly-icon { width: 34px; height: 34px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .al-anomaly-title { font-size: 15px; font-weight: 700; color: #111827; }
        .al-anomaly-sub   { font-size: 12px; color: #6b7280; margin-top: 1px; }
        .al-anomaly-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: 12px; background: #fff; border: 1px solid #fde68a; gap: 12px; transition: background 0.15s; }
        .al-anomaly-row:hover { background: #fffbeb; }
        .al-anomaly-left  { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .al-anomaly-badge { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(245,158,11,0.2); }
        .al-anomaly-desc { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .al-anomaly-meta { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .al-anomaly-right { text-align: right; flex-shrink: 0; }
        .al-anomaly-amt   { font-size: 14px; font-weight: 700; }
        .al-anomaly-mult  { font-size: 11px; color: #d97706; font-weight: 600; margin-top: 1px; }
        .al-avg-note { margin-top: 10px; padding: 9px 12px; border-radius: 10px; background: #fffbeb; border: 1px solid #fde68a; font-size: 12px; color: #92400e; display: flex; align-items: center; gap: 6px; }
        .al-loan-box { border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
        .al-loan-top { padding: 18px 20px 16px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-bottom: 1px solid #fde68a; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .al-loan-header { display: flex; align-items: center; gap: 10px; }
        .al-loan-icon { width: 38px; height: 38px; border-radius: 11px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); flex-shrink: 0; }
        .al-loan-title  { font-size: 15px; font-weight: 700; color: #111827; }
        .al-loan-reason { font-size: 12px; color: #92400e; margin-top: 2px; }
        .al-eligible-badge   { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; background: #dcfce7; color: #16a34a; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .al-ineligible-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .al-loan-amount-row { padding: 16px 20px; background: #fff; }
        .al-loan-label  { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
        .al-loan-amount { font-size: 32px; font-weight: 800; color: #ea580c; letter-spacing: -0.03em; line-height: 1; }
        .al-loan-note   { font-size: 11px; color: #9ca3af; margin-top: 4px; }
        .al-factors { padding: 14px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; flex-wrap: wrap; gap: 8px; }
        .al-factor { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .al-factor.met   { background: #dcfce7; color: #16a34a; }
        .al-factor.unmet { background: #f1f5f9; color: #94a3b8; }
        .al-not-eligible { padding: 18px 20px; background: #fff; }
        .al-not-eligible p { font-size: 14px; color: #6b7280; line-height: 1.6; }
        .al-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; margin-bottom: 12px; }
      `}</style>

      <div className="al-wrap">

        {/* ANOMALY */}
        {anomalies.length > 0 ? (
          <div>
            <div className="al-section-label">{t.anomalySection}</div>
            <div className="al-anomaly-header">
              <div className="al-anomaly-icon">🔍</div>
              <div>
                <div className="al-anomaly-title">{t.unusualTitle}</div>
                <div className="al-anomaly-sub">{t.flagged(anomalies.length)}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {anomalies.map((x, i) => (
                <div className="al-anomaly-row" key={i}>
                  <div className="al-anomaly-left">
                    <div className="al-anomaly-badge" />
                    <div>
                      <div className="al-anomaly-desc">{x.description}</div>
                      <div className="al-anomaly-meta">{x.date} · {x.category}</div>
                    </div>
                  </div>
                  <div className="al-anomaly-right">
                    <div className="al-anomaly-amt" style={{ color: x.type === "credit" ? "#16a34a" : "#dc2626" }}>
                      {x.type === "credit" ? "+" : "−"}₹{x.amount.toLocaleString("en-IN")}
                    </div>
                    <div className="al-anomaly-mult">{Math.round(x.amount / avgTransaction)}× avg</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="al-avg-note">
              💡 {t.avgNote(Math.round(avgTransaction).toLocaleString("en-IN"))}
            </div>
          </div>
        ) : (
          <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>{t.noAnomaly}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{t.noAnomalySub}</div>
            </div>
          </div>
        )}

        {/* LOAN */}
        <div>
          <div className="al-section-label">{t.loanSection}</div>
          <div className="al-loan-box">
            <div className="al-loan-top">
              <div className="al-loan-header">
                <div className="al-loan-icon">🏦</div>
                <div>
                  <div className="al-loan-title">{t.loanTitle}</div>
                  <div className="al-loan-reason">{loanReason}</div>
                </div>
              </div>
              {loanEligible
                ? <span className="al-eligible-badge">{t.eligible}</span>
                : <span className="al-ineligible-badge">{t.notYet}</span>}
            </div>

            {loanEligible ? (
              <>
                <div className="al-loan-amount-row">
                  <div className="al-loan-label">{t.estLabel}</div>
                  <div className="al-loan-amount">₹{loanAmount.toLocaleString("en-IN")}</div>
                  <div className="al-loan-note">{t.loanNote}</div>
                </div>
                <div className="al-factors">
                  {factors.map((f) => (
                    <span key={f.label} className={`al-factor ${f.met ? "met" : "unmet"}`}>
                      {f.met ? "✓" : "○"} {f.label}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="al-not-eligible">
                <p>{loanReason}</p>
                <div className="al-factors" style={{ padding: "12px 0 0", background: "transparent" }}>
                  {factors.map((f) => (
                    <span key={f.label} className={`al-factor ${f.met ? "met" : "unmet"}`}>
                      {f.met ? "✓" : "○"} {f.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}