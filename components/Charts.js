"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#2563eb","#16a34a","#ea580c","#8b5cf6","#0891b2","#db2777","#d97706","#64748b","#059669","#dc2626","#7c3aed","#0284c7"];

const T = {
  en: {
    incomeVsExpense: "📊 Income vs Expense",
    spendingCat:     "🥧 Spending by Category",
    forecast:        "🔮 3-Month Cash Flow Forecast",
    forecastTip:     "AI-powered prediction based on your transaction history",
    income:    "Income",
    expense:   "Expense",
    net:       "Net",
    predIncome:  "Predicted Income",
    predExpense: "Predicted Expense",
    netCashFlow: "Net Cash Flow",
    pctOfTotal:  (p) => `${p}% of total`,
  },
  hi: {
    incomeVsExpense: "📊 आय बनाम खर्च",
    spendingCat:     "🥧 श्रेणी अनुसार खर्च",
    forecast:        "🔮 3 महीने का नकदी प्रवाह पूर्वानुमान",
    forecastTip:     "आपके लेनदेन इतिहास पर आधारित AI पूर्वानुमान",
    income:    "आय",
    expense:   "खर्च",
    net:       "शुद्ध",
    predIncome:  "अनुमानित आय",
    predExpense: "अनुमानित खर्च",
    netCashFlow: "शुद्ध नकदी प्रवाह",
    pctOfTotal:  (p) => `कुल का ${p}%`,
  },
  te: {
    incomeVsExpense: "📊 ఆదాయం vs ఖర్చు",
    spendingCat:     "🥧 వర్గం వారీ ఖర్చు",
    forecast:        "🔮 3-నెలల నగదు ప్రవాహ అంచనా",
    forecastTip:     "మీ లావాదేవీ చరిత్ర ఆధారంగా AI అంచనా",
    income:    "ఆదాయం",
    expense:   "ఖర్చు",
    net:       "నికర",
    predIncome:  "అంచనా ఆదాయం",
    predExpense: "అంచనా ఖర్చు",
    netCashFlow: "నికర నగదు ప్రవాహం",
    pctOfTotal:  (p) => `మొత్తంలో ${p}%`,
  },
  ta: {
    incomeVsExpense: "📊 வருமானம் vs செலவு",
    spendingCat:     "🥧 வகைவாரி செலவு",
    forecast:        "🔮 3 மாத பணப்புழக்க முன்கணிப்பு",
    forecastTip:     "உங்கள் பரிவர்த்தனை வரலாற்றின் அடிப்படையில் AI முன்கணிப்பு",
    income:    "வருமானம்",
    expense:   "செலவு",
    net:       "நிகர",
    predIncome:  "கணிக்கப்பட்ட வருமானம்",
    predExpense: "கணிக்கப்பட்ட செலவு",
    netCashFlow: "நிகர பணப்புழக்கம்",
    pctOfTotal:  (p) => `மொத்தத்தில் ${p}%`,
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
      {label && <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>₹{Number(p.value).toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload, pctOfTotal }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 13px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.payload.fill, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{d.name}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginTop: 3 }}>₹{Number(d.value).toLocaleString("en-IN")}</div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{pctOfTotal((d.percent * 100).toFixed(1))}</div>
    </div>
  );
};

export default function Charts({ transactions, forecast, lang = "en" }) {
  if (!transactions || transactions.length === 0) return null;

  const t = T[lang] || T.en;

  const categoryData = transactions.reduce((acc, x) => {
    const ex = acc.find((a) => a.name === x.category);
    if (ex) ex.value += x.amount;
    else acc.push({ name: x.category, value: x.amount });
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const dailyData = transactions.reduce((acc, x) => {
    const ex = acc.find((a) => a.date === x.date);
    if (ex) { if (x.type === "credit") ex.income += x.amount; else ex.expense += x.amount; }
    else acc.push({ date: x.date, income: x.type === "credit" ? x.amount : 0, expense: x.type === "debit" ? x.amount : 0 });
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 16 }}>{children}</div>
  );

  const ChartCard = ({ label, children, tip }) => (
    <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 16, padding: "20px 20px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
      <SectionLabel>{label}</SectionLabel>
      {tip && <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16, marginTop: -10 }}>{tip}</p>}
      {children}
    </div>
  );

  const Legend = ({ items }) => (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
      {items.map((x) => (
        <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280" }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: x.c }} />{x.l}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        .charts-wrap { display: flex; flex-direction: column; gap: 20px; }
        .charts-two  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .charts-two { grid-template-columns: 1fr; } }
        .tip-card { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 10px; background: #eff6ff; border: 1px solid #bfdbfe; }
        .tip-card .tip-month { font-size: 12px; font-weight: 700; color: #1d4ed8; margin-bottom: 2px; }
        .tip-card .tip-text  { font-size: 12px; color: #3b82f6; line-height: 1.5; }
        .tip-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .pie-legend { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; justify-content: center; }
        .pie-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #374151; font-weight: 500; }
        .pie-legend-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      `}</style>

      <div className="charts-wrap">

        <div className="charts-two">
          <ChartCard label={t.incomeVsExpense}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                <Bar dataKey="income"  fill="#2563eb" radius={[5,5,0,0]} name={t.income}  maxBarSize={32} />
                <Bar dataKey="expense" fill="#fca5a5" radius={[5,5,0,0]} name={t.expense} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
            <Legend items={[{ c: "#2563eb", l: t.income }, { c: "#fca5a5", l: t.expense }]} />
          </ChartCard>

          <ChartCard label={t.spendingCat}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={2}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip pctOfTotal={t.pctOfTotal} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {categoryData.slice(0, 8).map((d, i) => (
                <div key={d.name} className="pie-legend-item">
                  <div className="pie-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.name}
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {forecast && forecast.length > 0 && (
          <ChartCard label={t.forecast} tip={t.forecastTip}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={forecast} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                <Bar dataKey="predictedIncome"  fill="#2563eb" radius={[5,5,0,0]} name={t.predIncome}  maxBarSize={28} />
                <Bar dataKey="predictedExpense" fill="#fca5a5" radius={[5,5,0,0]} name={t.predExpense} maxBarSize={28} />
                <Bar dataKey="netCashFlow"      fill="#a78bfa" radius={[5,5,0,0]} name={t.netCashFlow} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
            <Legend items={[{ c: "#2563eb", l: t.income }, { c: "#fca5a5", l: t.expense }, { c: "#a78bfa", l: t.net }]} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {forecast.map((f, i) => (
                <div className="tip-card" key={i}>
                  <span className="tip-icon">💡</span>
                  <div>
                    <div className="tip-month">{f.month}</div>
                    <div className="tip-text">{f.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )}
      </div>
    </>
  );
}