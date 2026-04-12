"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SMSInput from "@/components/SMSInput";
import TransactionList from "@/components/TransactionList";
import Charts from "@/components/Charts";
import HealthScore from "@/components/HealthScore";
import AnomalyLoan from "@/components/AnomalyLoan";
import WhatsAppReport from "@/components/WhatsAppReport";
import FinanceChat from "@/components/FinanceChat";

const T = {
  en: {
    title:"Financial Dashboard",subtitle_empty:"Add your bank data below to get started",subtitle_data:(n)=>`${n} transactions loaded`,income:"Total Income",expenses:"Total Expenses",netBalance:"Net Balance",credits:"Credits across all entries",debits:"Debits across all entries",surplus:"↑ Surplus",deficit:"↓ Deficit",addData:"Add Financial Data",addDataSub:"Bank statement PDF · SMS · Screenshot",addMore:"+ Add More Data",close:"✕ Close",healthTitle:"Financial Health Score",healthSub:"AI business health analysis",anomalyTitle:"Anomaly & Loan Eligibility",anomalySub:"Flagged transactions + loan estimate",insightsTitle:"Income, Expenses & Forecast",insightsSub:"Visual breakdown of your financial activity",txTitle:"All Transactions",txSub:"Search, filter and review every entry",waTitle:"WhatsApp Instant Report",waSub:"Powered by Twilio · Income, expenses & forecast",chatTitle:"Ask Your AI Financial Advisor",chatSub:"Ask anything about your transactions, spending and forecast",emptyTitle:"Your insights will appear here",emptySub:"Upload a bank statement PDF, paste SMS, or share a screenshot. Everything loads automatically.",forecast:"AI is generating your 3-month cash flow forecast…",back:"← Back",startNew:"🔄 Start New",tabs:["Overview","Insights","Transactions","WhatsApp","💬 Ask AI"],footer:"Built for Indian SME owners · Powered by Groq AI · Free during beta",selectLang:"Language",
  },
  hi: {
    title:"वित्तीय डैशबोर्ड",subtitle_empty:"शुरू करने के लिए नीचे अपना बैंक डेटा जोड़ें",subtitle_data:(n)=>`${n} लेनदेन लोड हुए`,income:"कुल आय",expenses:"कुल खर्च",netBalance:"शुद्ध शेष",credits:"सभी प्रविष्टियों में जमा",debits:"सभी प्रविष्टियों में डेबिट",surplus:"↑ अधिशेष",deficit:"↓ घाटा",addData:"वित्तीय डेटा जोड़ें",addDataSub:"बैंक स्टेटमेंट PDF · SMS · स्क्रीनशॉट",addMore:"+ और डेटा जोड़ें",close:"✕ बंद करें",healthTitle:"वित्तीय स्वास्थ्य स्कोर",healthSub:"AI व्यावसायिक स्वास्थ्य विश्लेषण",anomalyTitle:"असामान्य लेनदेन & ऋण पात्रता",anomalySub:"संदिग्ध लेनदेन + ऋण अनुमान",insightsTitle:"आय, व्यय और पूर्वानुमान",insightsSub:"आपकी वित्तीय गतिविधि का दृश्य विश्लेषण",txTitle:"सभी लेनदेन",txSub:"खोजें, फ़िल्टर करें और समीक्षा करें",waTitle:"WhatsApp त्वरित रिपोर्ट",waSub:"Twilio द्वारा संचालित · आय, व्यय और पूर्वानुमान",chatTitle:"AI वित्तीय सलाहकार से पूछें",chatSub:"अपने लेनदेन, खर्च और पूर्वानुमान के बारे में कुछ भी पूछें",emptyTitle:"आपकी जानकारी यहाँ दिखेगी",emptySub:"बैंक स्टेटमेंट PDF अपलोड करें, SMS पेस्ट करें या स्क्रीनशॉट साझा करें।",forecast:"AI आपका 3 महीने का नकदी प्रवाह पूर्वानुमान तैयार कर रहा है…",back:"← वापस",startNew:"🔄 नया शुरू करें",tabs:["अवलोकन","जानकारी","लेनदेन","WhatsApp","💬 AI पूछें"],footer:"भारतीय SME मालिकों के लिए · Groq AI द्वारा संचालित · बीटा में निःशुल्क",selectLang:"भाषा",
  },
  te: {
    title:"ఆర్థిక డాష్‌బోర్డ్",subtitle_empty:"ప్రారంభించడానికి మీ బ్యాంక్ డేటా జోడించండి",subtitle_data:(n)=>`${n} లావాదేవీలు లోడ్ అయ్యాయి`,income:"మొత్తం ఆదాయం",expenses:"మొత్తం ఖర్చులు",netBalance:"నికర నిల్వ",credits:"అన్ని నమోదులలో జమలు",debits:"అన్ని నమోదులలో డెబిట్లు",surplus:"↑ మిగులు",deficit:"↓ లోటు",addData:"ఆర్థిక డేటా జోడించండి",addDataSub:"బ్యాంక్ స్టేట్‌మెంట్ PDF · SMS · స్క్రీన్‌షాట్",addMore:"+ మరింత డేటా జోడించండి",close:"✕ మూసివేయండి",healthTitle:"ఆర్థిక ఆరోగ్య స్కోర్",healthSub:"AI వ్యాపార ఆరోగ్య విశ్లేషణ",anomalyTitle:"అసాధారణ లావాదేవీలు & రుణ అర్హత",anomalySub:"అనుమానాస్పద లావాదేవీలు + రుణ అంచనా",insightsTitle:"ఆదాయం, ఖర్చులు & అంచనా",insightsSub:"మీ ఆర్థిక కార్యకలాపాల దృశ్య విశ్లేషణ",txTitle:"అన్ని లావాదేవీలు",txSub:"వెతకండి, వడపోయండి మరియు సమీక్షించండి",waTitle:"WhatsApp తక్షణ నివేదిక",waSub:"Twilio ద్వారా · ఆదాయం, ఖర్చులు & అంచనా",chatTitle:"AI ఆర్థిక సలహాదారుని అడగండి",chatSub:"మీ లావాదేవీలు, ఖర్చులు మరియు అంచనా గురించి ఏదైనా అడగండి",emptyTitle:"మీ అంతర్దృష్టులు ఇక్కడ కనిపిస్తాయి",emptySub:"బ్యాంక్ స్టేట్‌మెంట్ PDF అప్‌లోడ్ చేయండి, SMS పేస్ట్ చేయండి లేదా స్క్రీన్‌షాట్ షేర్ చేయండి.",forecast:"AI మీ 3-నెలల నగదు ప్రవాహ అంచనాను రూపొందిస్తోంది…",back:"← వెనక్కి",startNew:"🔄 కొత్తగా ప్రారంభించు",tabs:["అవలోకనం","అంతర్దృష్టులు","లావాదేవీలు","WhatsApp","💬 AI అడగండి"],footer:"భారతీయ SME యజమానుల కోసం · Groq AI ద్వారా · బీటాలో ఉచితం",selectLang:"భాష",
  },
  ta: {
    title:"நிதி டாஷ்போர்டு",subtitle_empty:"தொடங்க உங்கள் வங்கி தரவை கீழே சேர்க்கவும்",subtitle_data:(n)=>`${n} பரிவர்த்தனைகள் ஏற்றப்பட்டன`,income:"மொத்த வருமானம்",expenses:"மொத்த செலவுகள்",netBalance:"நிகர இருப்பு",credits:"அனைத்து பதிவுகளிலும் வரவுகள்",debits:"அனைத்து பதிவுகளிலும் பற்றுகள்",surplus:"↑ உபரி",deficit:"↓ பற்றாக்குறை",addData:"நிதி தரவு சேர்க்கவும்",addDataSub:"வங்கி அறிக்கை PDF · SMS · ஸ்கிரீன்ஷாட்",addMore:"+ மேலும் தரவு சேர்க்கவும்",close:"✕ மூடு",healthTitle:"நிதி ஆரோக்கிய மதிப்பெண்",healthSub:"AI வணிக ஆரோக்கிய பகுப்பாய்வு",anomalyTitle:"அசாதாரண பரிவர்த்தனைகள் & கடன் தகுதி",anomalySub:"சந்தேகப்படும் பரிவர்த்தனைகள் + கடன் மதிப்பீடு",insightsTitle:"வருமானம், செலவுகள் & முன்கணிப்பு",insightsSub:"உங்கள் நிதி செயல்பாட்டின் காட்சி பகுப்பாய்வு",txTitle:"அனைத்து பரிவர்த்தனைகளும்",txSub:"தேடு, வடிகட்டு மற்றும் மதிப்பாய்வு செய்",waTitle:"WhatsApp உடனடி அறிக்கை",waSub:"Twilio மூலம் · வருமானம், செலவுகள் & முன்கணிப்பு",chatTitle:"AI நிதி ஆலோசகரிடம் கேளுங்கள்",chatSub:"உங்கள் பரிவர்த்தனைகள், செலவுகள் மற்றும் முன்கணிப்பு பற்றி எதையும் கேளுங்கள்",emptyTitle:"உங்கள் நுண்ணறிவுகள் இங்கே தோன்றும்",emptySub:"வங்கி அறிக்கை PDF பதிவேற்றவும், SMS ஒட்டவும் அல்லது ஸ்கிரீன்ஷாட் பகிரவும்.",forecast:"AI உங்கள் 3 மாத பணப்புழக்க முன்கணிப்பை உருவாக்குகிறது…",back:"← பின்னால்",startNew:"🔄 புதிதாக தொடங்கு",tabs:["மேலோட்டம்","நுண்ணறிவுகள்","பரிவர்த்தனைகள்","WhatsApp","💬 AI கேள்"],footer:"இந்திய SME உரிமையாளர்களுக்காக · Groq AI மூலம் · பீட்டாவில் இலவசம்",selectLang:"மொழி",
  },
};

const LANG_OPTIONS = [
  { id:"en", label:"EN", full:"English" },
  { id:"hi", label:"हि", full:"हिन्दी"  },
  { id:"te", label:"తె", full:"తెలుగు"  },
  { id:"ta", label:"த",  full:"தமிழ்"   },
];

// Shared card wrapper — matches landing page card style exactly
function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #f3f4f6",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      overflow: "hidden",
      marginBottom: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ icon, iconBg, title, sub, action }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px 14px", borderBottom:"1px solid #f3f4f6" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:iconBg||"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{icon}</div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{title}</div>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{sub}</div>
        </div>
      </div>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions]       = useState([]);
  const [forecast, setForecast]               = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [activeTab, setActiveTab]             = useState("overview");
  const [showImport, setShowImport]           = useState(false);
  const [lang, setLang]                       = useState("en");

  const t      = T[lang];
  const tabIds = ["overview","insights","transactions","whatsapp","chat"];

  const totalCredit = transactions.filter(x=>x.type==="credit").reduce((s,x)=>s+x.amount,0);
  const totalDebit  = transactions.filter(x=>x.type==="debit").reduce((s,x)=>s+x.amount,0);
  const netBalance  = totalCredit - totalDebit;
  const hasData     = transactions.length > 0;

  const handleParsed = async (newTx) => {
    const merged = [...transactions, ...newTx];
    setTransactions(merged);
    setShowImport(false);
    setForecastLoading(true);
    try {
      const res  = await fetch("/api/forecast",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ transactions:merged }) });
      const data = await res.json();
      if (data.success) setForecast(data.forecast);
    } catch {}
    setForecastLoading(false);
  };

  const handleReset = () => { setTransactions([]); setForecast([]); setActiveTab("overview"); setShowImport(false); };

  return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── NAVBAR — pixel-matched to landing page ── */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"#fff", borderBottom:"1px solid #f3f4f6", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>

          {/* Logo */}
          <div onClick={()=>router.push("/")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }}>
            <div style={{ width:32, height:32, background:"#2563eb", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:800 }}>₹</div>
            <span style={{ fontWeight:700, color:"#111827", fontSize:15 }}>SME Finance Intelligence</span>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:2, background:"#f1f5f9", borderRadius:10, padding:3 }} className="dash-tabs">
            {tabIds.map((id,i) => {
              const isChat   = id==="chat";
              const isActive = activeTab===id;
              const isLocked = !hasData && id!=="overview";
              return (
                <button key={id} onClick={()=>!isLocked&&setActiveTab(id)} style={{
                  padding:"7px 14px", borderRadius:8, border:"none",
                  cursor:isLocked?"not-allowed":"pointer",
                  fontSize:13, fontWeight:600, whiteSpace:"nowrap",
                  transition:"all 0.15s", opacity:isLocked?0.35:1,
                  background: isActive?(isChat?"#7c3aed":"#fff"):"transparent",
                  color: isActive?(isChat?"#fff":"#2563eb"):(isChat?"#7c3aed":"#64748b"),
                  boxShadow: isActive?"0 1px 4px rgba(0,0,0,0.08)":"none",
                }}>
                  {t.tabs[i]}
                </button>
              );
            })}
          </div>

          {/* Right: lang + home link + start new */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <span style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{t.selectLang}:</span>
            {LANG_OPTIONS.map(l=>(
              <button key={l.id} title={l.full} onClick={()=>setLang(l.id)} style={{
                fontSize:12, fontWeight:700, padding:"5px 9px", borderRadius:8,
                border:"1.5px solid", borderColor:lang===l.id?"#2563eb":"#e2e8f0",
                background:lang===l.id?"#2563eb":"#f8fafc",
                color:lang===l.id?"#fff":"#64748b",
                cursor:"pointer", transition:"all 0.15s",
              }}>{l.label}</button>
            ))}

            {/* Home — styled like landing nav links */}
            <a
              href="/"
              style={{ fontSize:13, fontWeight:500, color:"#6b7280", textDecoration:"none", padding:"6px 10px", borderRadius:8, transition:"color 0.15s" }}
              onMouseOver={e=>e.currentTarget.style.color="#2563eb"}
              onMouseOut={e=>e.currentTarget.style.color="#6b7280"}
            >
              ← Home
            </a>

            {/* Start New — same as landing's CTA */}
            {hasData && (
              <button onClick={handleReset} style={{
                background:"#2563eb", color:"#fff",
                padding:"8px 18px", borderRadius:10,
                fontSize:13, fontWeight:600, border:"none", cursor:"pointer",
                boxShadow:"0 2px 8px rgba(37,99,235,0.25)", transition:"background 0.15s",
              }}
                onMouseOver={e=>e.currentTarget.style.background="#1d4ed8"}
                onMouseOut={e=>e.currentTarget.style.background="#2563eb"}
              >
                {t.startNew}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO STRIP — matches landing gradient ── */}
      <div style={{ background:"linear-gradient(to bottom, #eff6ff 0%, #fff 100%)", paddingTop:36, paddingBottom:8 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
          <h1 style={{ fontSize:30, fontWeight:800, color:"#111827", letterSpacing:"-0.03em", marginBottom:4 }}>{t.title}</h1>
          <p style={{ fontSize:14, color:"#6b7280", marginBottom:28 }}>{hasData ? t.subtitle_data(transactions.length) : t.subtitle_empty}</p>

          {/* Stat cards — styled like landing hero cards */}
          {hasData && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }} className="stat-grid">
              {[
                { label:t.income,   value:`₹${totalCredit.toLocaleString("en-IN")}`, sub:t.credits,  accent:"#22c55e", valColor:"#16a34a", badge:null },
                { label:t.expenses, value:`₹${totalDebit.toLocaleString("en-IN")}`,  sub:t.debits,   accent:"#ef4444", valColor:"#dc2626", badge:null },
                { label:t.netBalance, value:`₹${Math.abs(netBalance).toLocaleString("en-IN")}`, sub:null, accent:netBalance>=0?"#2563eb":"#f97316", valColor:netBalance>=0?"#2563eb":"#ea580c",
                  badge:{ text:netBalance>=0?t.surplus:t.deficit, bg:netBalance>=0?"#dbeafe":"#ffedd5", color:netBalance>=0?"#1d4ed8":"#c2410c" } },
              ].map((s,i)=>(
                <div key={i} style={{ background:"#fff", borderRadius:18, padding:"18px 20px", border:"1px solid #f3f4f6", position:"relative", overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:s.accent, borderRadius:"18px 0 0 18px" }} />
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#9ca3af", marginBottom:7 }}>{s.label}</div>
                  <div style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.03em", lineHeight:1, color:s.valColor }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize:11, color:"#9ca3af", marginTop:5 }}>{s.sub}</div>}
                  {s.badge && <div style={{ display:"inline-flex", alignItems:"center", padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700, marginTop:7, background:s.badge.bg, color:s.badge.color }}>{s.badge.text}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Forecast loading */}
          {forecastLoading && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, background:"#eff6ff", border:"1px solid #bfdbfe", color:"#2563eb", fontSize:13, fontWeight:500, marginBottom:20 }}>
              <div style={{ width:15, height:15, border:"2px solid #bfdbfe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }} />
              {t.forecast}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="dash-main-content" style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px 80px" }}>

        {/* OVERVIEW */}
        {activeTab==="overview" && (
          <>
            <Card>
              <CardHeader icon="📥" iconBg="#eff6ff" title={t.addData} sub={t.addDataSub}
                action={hasData && (
                  <button onClick={()=>setShowImport(!showImport)} style={{ fontSize:13, fontWeight:600, color:"#2563eb", background:"#eff6ff", border:"1px solid #bfdbfe", padding:"7px 14px", borderRadius:9, cursor:"pointer" }}>
                    {showImport ? t.close : t.addMore}
                  </button>
                )}
              />
              {(!hasData||showImport) && <div style={{ padding:20 }}><SMSInput onTransactionsParsed={handleParsed} /></div>}
            </Card>

            {hasData && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:20 }} className="two-col">
                <Card style={{ marginBottom:0 }}>
                  <CardHeader icon="❤️" iconBg="#fef2f2" title={t.healthTitle} sub={t.healthSub} />
                  <div style={{ padding:20 }}><HealthScore transactions={transactions} lang={lang} /></div>
                </Card>
                <Card style={{ marginBottom:0 }}>
                  <CardHeader icon="🚨" iconBg="#fff7ed" title={t.anomalyTitle} sub={t.anomalySub} />
                  <div style={{ padding:20 }}><AnomalyLoan transactions={transactions} lang={lang} /></div>
                </Card>
              </div>
            )}

            {!hasData && (
              <Card>
                <div style={{ padding:"56px 24px", textAlign:"center" }}>
                  <div style={{ fontSize:44, marginBottom:14, opacity:0.25 }}>📊</div>
                  <div style={{ fontSize:16, fontWeight:600, color:"#374151", marginBottom:6 }}>{t.emptyTitle}</div>
                  <div style={{ fontSize:13, color:"#9ca3af", lineHeight:1.7, maxWidth:300, margin:"0 auto" }}>{t.emptySub}</div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* INSIGHTS */}
        {activeTab==="insights" && hasData && (
          <Card>
            <CardHeader icon="📈" iconBg="#f0fdf4" title={t.insightsTitle} sub={t.insightsSub} />
            <div style={{ padding:20 }}><Charts transactions={transactions} forecast={forecast} lang={lang} /></div>
          </Card>
        )}

        {/* TRANSACTIONS */}
        {activeTab==="transactions" && hasData && (
          <Card>
            <CardHeader icon="🧾" iconBg="#f8fafc" title={t.txTitle} sub={t.txSub} />
            <div style={{ padding:20 }}><TransactionList transactions={transactions} lang={lang} /></div>
          </Card>
        )}

        {/* WHATSAPP */}
        {activeTab==="whatsapp" && hasData && (
          <Card>
            <CardHeader icon="📱" iconBg="#f0fdf4" title={t.waTitle} sub={t.waSub} />
            <div style={{ padding:20 }}><WhatsAppReport transactions={transactions} forecast={forecast} lang={lang} /></div>
          </Card>
        )}

        {/* CHAT */}
        {activeTab==="chat" && hasData && (
          <Card>
            <CardHeader icon="💬" iconBg="#f5f3ff" title={t.chatTitle} sub={t.chatSub} />
            <div style={{ padding:20 }}><FinanceChat transactions={transactions} forecast={forecast} /></div>
          </Card>
        )}
      </div>

      {/* FOOTER — hidden on mobile (bottom nav takes its place) */}
      <footer className="dash-footer" style={{ background:"#111827", padding:"28px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, background:"#2563eb", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:800 }}>₹</div>
            <span style={{ fontWeight:700, color:"#fff", fontSize:14 }}>SME Finance Intelligence</span>
          </div>
          <p style={{ color:"#6b7280", fontSize:12 }}>{t.footer}</p>
        </div>
      </footer>

      {/* ── MOBILE BOTTOM NAV BAR ── */}
      {/* Icons for each tab */}
      <nav className="mobile-bottom-nav">
        {[
          { id:"overview",     icon:"🏠", label:"Home"    },
          { id:"insights",     icon:"📈", label:"Insights" },
          { id:"transactions", icon:"🧾", label:"Txns"    },
          { id:"whatsapp",     icon:"📱", label:"WhatsApp" },
          { id:"chat",         icon:"💬", label:"Ask AI"  },
        ].map(item => {
          const isActive = activeTab === item.id;
          const isLocked = !hasData && item.id !== "overview";
          return (
            <button
              key={item.id}
              onClick={() => !isLocked && setActiveTab(item.id)}
              className={`mobile-nav-btn${isActive ? " active" : ""}${isLocked ? " locked" : ""}`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }

        /* ── Desktop: hide bottom nav ── */
        .mobile-bottom-nav { display: none; }

        /* ── Mobile ── */
        @media (max-width:768px) {
          .dash-tabs   { display: none !important; }
          .dash-footer { display: none !important; }

          /* Bottom nav bar */
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 100;
            background: #fff;
            border-top: 1px solid #e5e7eb;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
            padding: 6px 0 env(safe-area-inset-bottom, 6px);
          }
          .mobile-nav-btn {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 6px 4px;
            background: none;
            border: none;
            cursor: pointer;
            transition: all 0.15s;
            -webkit-tap-highlight-color: transparent;
          }
          .mobile-nav-btn.locked {
            opacity: 0.3;
            pointer-events: none;
          }
          .mobile-nav-icon {
            font-size: 20px;
            line-height: 1;
          }
          .mobile-nav-label {
            font-size: 10px;
            font-weight: 600;
            color: #9ca3af;
            letter-spacing: 0.02em;
          }
          .mobile-nav-btn.active .mobile-nav-label {
            color: #2563eb;
          }
          .mobile-nav-btn.active .mobile-nav-icon {
            filter: drop-shadow(0 0 4px rgba(37,99,235,0.4));
          }

          /* Add bottom padding so content isn't hidden behind bottom nav */
          .dash-main-content {
            padding-bottom: 90px !important;
          }
        }

        @media (max-width:640px) {
          .stat-grid { grid-template-columns: 1fr !important; }
          .two-col   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}