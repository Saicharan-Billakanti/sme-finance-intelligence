"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from "recharts";

const COLORS = ["#2563eb","#16a34a","#ea580c","#8b5cf6","#0891b2","#db2777","#d97706","#64748b","#059669","#dc2626","#7c3aed","#0284c7"];

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

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 13px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.payload.fill, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{d.name}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginTop: 3 }}>₹{Number(d.value).toLocaleString("en-IN")}</div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{(d.percent * 100).toFixed(1)}% of total</div>
    </div>
  );
};

export default function Charts({ transactions, forecast }) {
  if (!transactions || transactions.length === 0) return null;

  const categoryData = transactions.reduce((acc, t) => {
    const ex = acc.find((x) => x.name === t.category);
    if (ex) ex.value += t.amount;
    else acc.push({ name: t.category, value: t.amount });
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const dailyData = transactions.reduce((acc, t) => {
    const ex = acc.find((x) => x.date === t.date);
    if (ex) { if (t.type === "credit") ex.income += t.amount; else ex.expense += t.amount; }
    else acc.push({ date: t.date, income: t.type === "credit" ? t.amount : 0, expense: t.type === "debit" ? t.amount : 0 });
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

  return (
    <>
      <style>{`
        .charts-wrap { display: flex; flex-direction: column; gap: 20px; }
        .charts-two  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .charts-two { grid-template-columns: 1fr; } }

        .tip-card {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 11px 14px; border-radius: 10px;
          background: #eff6ff; border: 1px solid #bfdbfe;
        }
        .tip-card .tip-month { font-size: 12px; font-weight: 700; color: #1d4ed8; margin-bottom: 2px; }
        .tip-card .tip-text  { font-size: 12px; color: #3b82f6; line-height: 1.5; }
        .tip-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

        .pie-legend { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; justify-content: center; }
        .pie-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #374151; font-weight: 500; }
        .pie-legend-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      `}</style>

      <div className="charts-wrap">

        {/* Bar + Pie side by side */}
        <div className="charts-two">
          <ChartCard label="📊 Income vs Expense">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                <Bar dataKey="income"  fill="#2563eb" radius={[5,5,0,0]} name="Income"  maxBarSize={32} />
                <Bar dataKey="expense" fill="#fca5a5" radius={[5,5,0,0]} name="Expense" maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:8 }}>
              {[{c:"#2563eb",l:"Income"},{c:"#fca5a5",l:"Expense"}].map(x=>(
                <div key={x.l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#6b7280" }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:x.c }} />{x.l}
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard label="🥧 Spending by Category">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={2}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
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

        {/* Forecast */}
        {forecast && forecast.length > 0 && (
          <ChartCard label="🔮 3-Month Cash Flow Forecast" tip="AI-powered prediction based on your transaction history">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={forecast} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                <Bar dataKey="predictedIncome"  fill="#2563eb" radius={[5,5,0,0]} name="Predicted Income"  maxBarSize={28} />
                <Bar dataKey="predictedExpense" fill="#fca5a5" radius={[5,5,0,0]} name="Predicted Expense" maxBarSize={28} />
                <Bar dataKey="netCashFlow"       fill="#a78bfa" radius={[5,5,0,0]} name="Net Cash Flow"     maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div style={{ display:"flex", gap:16, justifyContent:"center", margin:"10px 0 16px" }}>
              {[{c:"#2563eb",l:"Income"},{c:"#fca5a5",l:"Expense"},{c:"#a78bfa",l:"Net"}].map(x=>(
                <div key={x.l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#6b7280" }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:x.c }} />{x.l}
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
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