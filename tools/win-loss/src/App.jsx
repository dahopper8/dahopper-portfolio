import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  headerBg: "#0f172a", headerBorder: "#1e293b",
  pageBg: "#f8f9fb", cardBg: "#ffffff", cardBorder: "#e5e7eb",
  textPrimary: "#111827", textSecondary: "#374151",
  textMuted: "#6b7280", textFaint: "#9ca3af",
  accent: "#1a6b3c", accentLight: "#f0fdf4",
  accentBorder: "#bbf7d0", accentText: "#166534",
  success: "#16a34a", successLight: "#f0fdf4", successBorder: "#bbf7d0",
  warning: "#d97706", warningLight: "#fffbeb", warningBorder: "#fde68a",
  danger: "#dc2626", dangerLight: "#fef2f2", dangerBorder: "#fecaca",
  orange: "#ea580c", orangeLight: "#fff7ed", orangeBorder: "#fed7aa",
  mono: "'DM Mono', monospace", sans: "'Inter', sans-serif",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

// ─── INDUSTRY PROFILES ────────────────────────────────────────────────────────
const INDUSTRIES = {
  saas: {
    label: "B2B SaaS",
    rfpCommon: false, incumbentStrong: false, relationshipDriven: false,
    cycleNorm: "3–9 months", context: "Competitive, product-led evaluation cycles. Buyers are educated. Demo quality and proof points matter most.",
  },
  industrial: {
    label: "Industrial / Manufacturing",
    rfpCommon: true, incumbentStrong: true, relationshipDriven: true,
    cycleNorm: "6–18 months", context: "Distributor and field sales model. Incumbent relationships are the primary barrier. Trust and references outweigh product features.",
  },
  professional_services: {
    label: "Professional Services",
    rfpCommon: true, incumbentStrong: true, relationshipDriven: true,
    cycleNorm: "2–6 months", context: "Relationship and reputation-driven. The team being proposed matters as much as the firm. Referrals and past client relationships are the real pipeline.",
  },
  healthcare: {
    label: "Healthcare & Life Sciences",
    rfpCommon: true, incumbentStrong: true, relationshipDriven: false,
    cycleNorm: "9–18 months", context: "Committee-driven, heavily regulated. Clinical evidence and compliance documentation are table stakes. GPO and IDN dynamics frequently determine outcome.",
  },
  financial_services: {
    label: "Financial Services",
    rfpCommon: true, incumbentStrong: true, relationshipDriven: true,
    cycleNorm: "6–12 months", context: "Compliance and risk tolerance shape every decision. Incumbent vendors have enormous switching cost protection. Executive sponsor is more critical here than in most industries.",
  },
  logistics: {
    label: "Logistics & Supply Chain",
    rfpCommon: true, incumbentStrong: true, relationshipDriven: false,
    cycleNorm: "3–9 months", context: "RFP-dominant with price as a primary criterion. Operational track record and references from similar shippers matter. Displacement requires a clear failure trigger from the incumbent.",
  },
  government: {
    label: "Government & Public Sector",
    rfpCommon: true, incumbentStrong: true, relationshipDriven: false,
    cycleNorm: "12–24 months", context: "Procurement-ruled. Compliance with solicitation requirements is non-negotiable. Relationships matter in pre-solicitation phase but cannot legally influence the formal process.",
  },
};

const SECTIONS = [
  {
    id: "deal", label: "Deal Context",
    fields: [
      { id: "outcome",      label: "Outcome",              type: "segment", options: [{ label: "Won", value: "won" }, { label: "Lost", value: "lost" }, { label: "No Decision", value: "nodecision" }] },
      { id: "dealSize",     label: "Deal Size",             type: "segment", options: [{ label: "< $25K", value: "smb" }, { label: "$25–150K", value: "midmarket" }, { label: "$150K+", value: "enterprise" }] },
      { id: "cycleLength",  label: "Sales Cycle",           type: "segment", options: [{ label: "< 3 mo", value: "short" }, { label: "3–9 mo", value: "mid" }, { label: "9+ mo", value: "long" }] },
      { id: "competitive",  label: "Vendor Count",          type: "segment", options: [{ label: "Sole Source", value: "sole" }, { label: "2–3 Vendors", value: "small" }, { label: "4+ Vendors", value: "large" }] },
      { id: "incumbent",    label: "Incumbent Present",     type: "segment", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "Unknown", value: "unknown" }] },
    ]
  },
  {
    id: "champion", label: "Champion & Stakeholders",
    fields: [
      { id: "championStrength", label: "Champion Strength",   type: "scale", low: "Weak / passive",              high: "Strong / active advocate" },
      { id: "executiveAccess",  label: "Executive Access",    type: "scale", low: "No access above manager",     high: "Direct C-suite relationship" },
      { id: "consensusWidth",   label: "Buying Group Width",  type: "scale", low: "Single decision maker",       high: "Broad committee (5+ people)" },
      { id: "championRisk",     label: "Champion Stability",  type: "segment", options: [{ label: "Stable", value: "stable" }, { label: "At Risk", value: "atrisk" }, { label: "Left / Changed", value: "left" }] },
    ]
  },
  {
    id: "response", label: "Response Quality",
    fields: [
      { id: "requirementsAlignment", label: "Requirements Alignment",    type: "scale", low: "Generic response, poor fit",          high: "Tailored precisely to stated needs" },
      { id: "differentiation",       label: "Differentiation Clarity",   type: "scale", low: "Sounded like every other vendor",     high: "Clear, specific why-us narrative" },
      { id: "proofPoints",           label: "Proof Point Strength",      type: "scale", low: "No relevant references or cases",    high: "Strong, directly relevant evidence" },
      { id: "pricingClarity",        label: "Pricing Clarity",           type: "scale", low: "Vague, multiple versions, hedged",   high: "Clear, confident, well-defended" },
      { id: "responseTimeliness",    label: "Response Timeliness",       type: "segment", options: [{ label: "Early", value: "early" }, { label: "On Time", value: "ontime" }, { label: "Late", value: "late" }] },
    ]
  },
  {
    id: "process", label: "Process & Positioning",
    fields: [
      { id: "rfpOrigin",        label: "RFP Origin",           type: "segment", options: [{ label: "We shaped it", value: "shaped" }, { label: "Neutral", value: "neutral" }, { label: "Competitor shaped", value: "competitor" }, { label: "Unknown", value: "unknown" }] },
      { id: "discoveryDepth",   label: "Discovery Depth",      type: "scale", low: "Surface level, relied on RFP text",      high: "Deep — knew unstated needs and politics" },
      { id: "competitiveIntel", label: "Competitive Intel",    type: "scale", low: "Flying blind on competition",            high: "Knew competitors' likely moves" },
      { id: "pricingPosition",  label: "Pricing Position",     type: "segment", options: [{ label: "Lowest", value: "lowest" }, { label: "Mid", value: "mid" }, { label: "Highest", value: "highest" }, { label: "Unknown", value: "unknown" }] },
      { id: "lossReason",       label: "Primary Loss / Risk",  type: "segment", options: [{ label: "Price", value: "price" }, { label: "Product Gap", value: "product" }, { label: "Relationship", value: "relationship" }, { label: "Process", value: "process" }, { label: "No Decision", value: "nodecision" }, { label: "N/A — Won", value: "na" }] },
    ]
  }
];

// ─── ANALYSIS ─────────────────────────────────────────────────────────────────
function analyze(inputs) {
  const industry = INDUSTRIES[inputs.industry] || INDUSTRIES.saas;
  const champArr = [inputs.championStrength, inputs.executiveAccess, inputs.consensusWidth].filter(v => v !== null);
  const respArr  = [inputs.requirementsAlignment, inputs.differentiation, inputs.proofPoints, inputs.pricingClarity].filter(v => v !== null);
  const procArr  = [inputs.discoveryDepth, inputs.competitiveIntel].filter(v => v !== null);

  const championScore = champArr.length ? champArr.reduce((a, b) => a + b, 0) / champArr.length : null;
  const responseScore = respArr.length  ? respArr.reduce((a, b) => a + b, 0)  / respArr.length  : null;
  const processScore  = procArr.length  ? procArr.reduce((a, b) => a + b, 0)  / procArr.length  : null;

  const allVals  = Object.values(inputs).filter(v => typeof v === "number");
  const avgScale = allVals.length ? allVals.reduce((a, b) => a + b, 0) / allVals.length : 0;
  const winSignal = Math.round((avgScale / 5) * 100);

  const patterns  = [];
  const positives = [];

  if (inputs.championStrength !== null && inputs.championStrength <= 2) patterns.push({ label: "Weak Champion", detail: "A passive or weak champion is the single most common cause of preventable losses. They can't navigate internal politics, can't pre-sell the committee, and won't protect you when the CFO pushes back on price.", severity: "high" });
  if (industry.incumbentStrong && inputs.incumbent === "yes" && inputs.rfpOrigin !== "shaped") patterns.push({ label: "Strong Incumbent in a Relationship-Driven Market", detail: `In ${industry.label}, incumbent vendors benefit from trust built over years of delivery. Without a clear failure trigger or a champion actively driving change, the default outcome is renewal. Pre-RFP access and executive relationships are your primary lever.`, severity: "high" });
  if (industry.rfpCommon && inputs.rfpOrigin === "shaped") positives.push({ label: "Shaped the RFP in an RFP-Dominant Market", detail: `In ${industry.label}, formal procurement processes are the norm. Influencing the evaluation criteria before the solicitation is published is your highest-leverage pre-sale activity — and uncommon enough to be a genuine advantage.` });
  if (inputs.championRisk === "left") patterns.push({ label: "Champion Instability", detail: "A champion who left or changed roles mid-cycle means the relationship equity you built doesn't transfer automatically. This deal needed to be re-qualified from the moment that person's role changed.", severity: "high" });
  if (inputs.executiveAccess !== null && inputs.executiveAccess >= 4) positives.push({ label: "Strong Executive Access", detail: "Direct C-suite access is one of the strongest predictors of win rate in competitive deals. It means you could address objections that never surfaced in the formal process." });
  if (inputs.rfpOrigin === "competitor") patterns.push({ label: "Competitor-Shaped RFP", detail: "When a competitor writes the evaluation criteria, you're playing an away game from day one. The requirements reflect their strengths. Your energy should go toward reframing evaluation criteria, not answering them.", severity: "high" });
  if (inputs.rfpOrigin === "shaped") positives.push({ label: "You Shaped the RFP", detail: "Influencing the evaluation criteria before the formal process is the highest-leverage sales activity in competitive deals. It means the buyer's stated needs map to your strengths." });
  if (inputs.discoveryDepth !== null && inputs.discoveryDepth <= 2) patterns.push({ label: "Shallow Discovery", detail: "Relying on the RFP text for requirements means you only know what the buyer was willing to write down publicly. The real decision criteria lived in conversations you didn't have.", severity: "medium" });
  if (inputs.differentiation !== null && inputs.differentiation <= 2) patterns.push({ label: "Undifferentiated Positioning", detail: "If your response sounded like every other vendor, price became the default decision criterion. Differentiation isn't about features — it's about a specific, defensible reason why your approach is right for this buyer.", severity: "medium" });
  if (inputs.proofPoints !== null && inputs.proofPoints <= 2) patterns.push({ label: "Weak Proof Points", detail: "Generic case studies don't reduce perceived risk. Relevant, specific references from similar companies in similar situations are what move committees.", severity: "medium" });
  if (responseScore !== null && responseScore >= 4) positives.push({ label: "Strong Response Quality", detail: "High marks across alignment, differentiation, and proof points suggest the response itself wasn't the issue. Look to process, champion strength, or pricing for the real decision driver." });
  if (inputs.pricingPosition === "highest" && inputs.lossReason === "price") patterns.push({ label: "Premium Price Without Premium Narrative", detail: "Being the most expensive vendor is fine if the value story is airtight. A price loss at the premium position usually means the differentiation narrative didn't land.", severity: "high" });
  if (inputs.pricingPosition === "lowest" && inputs.outcome === "lost") patterns.push({ label: "Lost Despite Lowest Price", detail: "Losing on price when you were cheapest means price wasn't the real criterion. Something else drove the decision — relationship, product fit, or risk perception.", severity: "medium" });
  if (inputs.competitive === "large" && inputs.competitiveIntel !== null && inputs.competitiveIntel <= 2) patterns.push({ label: "Flying Blind in a Crowded Field", detail: "In a 4+ vendor evaluation, competitive positioning is a required discipline. Not knowing your competitors' likely moves means you can't pre-empt their objections or exploit their weaknesses.", severity: "medium" });
  if (inputs.responseTimeliness === "late") patterns.push({ label: "Late Response", detail: "A late response signals disorganization regardless of content quality. Procurement teams make inferences about your operational capability from how you handle their process.", severity: "medium" });

  const playbook = [];
  if (patterns.some(p => p.label.includes("Champion"))) playbook.push({
    title: "Champion Qualification",
    action: "Before your next deal advances past discovery, run a champion test: can they articulate the business case in their own words, do they have a path to the economic buyer, and have they taken any internal action on your behalf? If the answer to any of these is no, you don't have a champion — you have a contact. Treat the deal accordingly.",
    next: "Build a one-page champion qualification checklist into your CRM stage-gate criteria. Make it a required field, not a suggested one."
  });
  if (patterns.some(p => p.label.includes("RFP"))) playbook.push({
    title: "Pre-RFP Positioning",
    action: "Map every account in your pipeline that is 6–12 months from a likely formal process. For each one, identify: who is shaping the evaluation internally, what problem they're trying to solve, and whether you've had a conversation that wasn't triggered by an RFP. If you haven't, you're already late.",
    next: "Schedule a strategic conversation with one target account this week that has no active opportunity. The goal is to understand their problem, not to sell. Ask what a successful outcome looks like for them in 18 months."
  });
  if (patterns.some(p => p.label.includes("Discovery"))) playbook.push({
    title: "Discovery Depth",
    action: "The questions that surface real buying criteria are uncomfortable: Who loses their job if this fails? Who in the organization is opposed to change? What does the buyer's boss think about this initiative? What happened the last time they tried to solve this problem? Most discovery conversations never get here. Yours need to.",
    next: "Review the last five lost deals and identify the question you didn't ask that would have changed how you approached the deal. Add that question to your discovery framework."
  });
  if (patterns.some(p => p.label.includes("Proof"))) playbook.push({
    title: "Proof Point Architecture",
    action: "Generic case studies don't reduce risk — they just demonstrate that you've had customers. What moves committees is a reference who looks like them: same industry, similar company size, similar problem, and willing to take a call. Build a reference map that lets you deploy the right customer for each deal within 48 hours of being asked.",
    next: "Identify your three best customers and turn them into structured references this quarter. Document the specific outcome, the timeline, and the situation they were in before they bought."
  });
  if (patterns.some(p => p.label.includes("Differentiation"))) playbook.push({
    title: "Competitive Positioning",
    action: "Before your next proposal goes out, write down in two sentences: why this buyer, given their specific situation, should choose you over the alternatives they're actually considering. Not a generic value proposition — the specific reason for this account. If you can't write it in two sentences, you don't have a position. You have a feature list.",
    next: "Run a win/loss debrief with your last three wins and ask the buyers why they chose you. Their language is your positioning, not yours."
  });
  if (playbook.length === 0 && positives.length > 0) playbook.push({
    title: "Document and Replicate",
    action: "This deal shows strong execution across the key dimensions. The risk now is that what worked lives in one person's head rather than in your process. Interview the deal team while the memory is fresh: what did you do in discovery that you don't always do, what made the champion so effective, and what would you do differently if you ran this deal again?",
    next: "Write up a one-page deal debrief and share it with the full sales team this week. Include what you did, why it worked, and what the replicable elements are."
  });

  return { winSignal, championScore, responseScore, processScore, patterns, positives, playbook, outcome: inputs.outcome };
}

function buildVerdict(inputs, results) {
  const highSeverity = results.patterns.filter(p => p.severity === "high").length;
  if (inputs.outcome === "won") {
    if (highSeverity === 0) return { label: "Clean Win",        color: T.success, desc: "Strong execution across the key dimensions. This is a repeatable win — document the pattern." };
    return                         { label: "Fortunate Win",    color: T.warning, desc: "You won despite meaningful risk factors. Don't let this mask process gaps that will cost you in future deals." };
  }
  if (inputs.outcome === "nodecision") return { label: "No Decision", color: T.textMuted, desc: "No decisions are rarely neutral. They usually mean the buyer couldn't get internal alignment — often because the champion wasn't strong enough or the business case wasn't tight enough." };
  if (highSeverity >= 2) return { label: "Structural Loss",   color: T.danger,  desc: "Multiple high-severity factors suggest this deal was lost before the RFP arrived. The formal process surfaced a decision that was already made." };
  if (highSeverity === 1) return { label: "Preventable Loss", color: T.orange,  desc: "One critical factor drove this loss. Fixable with process change — but only if you're honest about which factor it was." };
  return                         { label: "Competitive Loss",  color: T.warning, desc: "No dominant failure mode — this was a close call that went the other way. Focus on the marginal differentiators." };
}

const defaultInputs = { industry: 'saas', ...Object.fromEntries(SECTIONS.flatMap(s => s.fields.map(f => [f.id, null]))) };

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function SegBtn({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 1, background: T.cardBorder, borderRadius: 7, padding: 2, flexWrap: "wrap" }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          flex: 1, minWidth: 60, padding: "8px 6px",
          background: value === opt.value ? T.headerBg : T.cardBg,
          border: "none", borderRadius: 5, cursor: "pointer",
          fontFamily: T.mono, fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase",
          color: value === opt.value ? "#e2e8f0" : T.textMuted,
          transition: "all 0.15s", fontWeight: value === opt.value ? 600 : 400
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

function ScaleInput({ value, onChange, low, high }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(v => (
          <button key={v} onClick={() => onChange(v)} style={{
            flex: 1, padding: "9px 0",
            background: value === v ? "#1e293b" : value !== null && v <= value ? "#f1f5f9" : "#f9fafb",
            border: value === v ? `2px solid #1e293b` : `2px solid ${T.cardBorder}`,
            borderRadius: 6, cursor: "pointer",
            fontFamily: T.mono, fontSize: 13, fontWeight: 700,
            color: value === v ? "white" : value !== null && v <= value ? T.textPrimary : T.textMuted,
            transition: "all 0.15s"
          }}>{v}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint, maxWidth: "45%", lineHeight: 1.3 }}>{low}</span>
        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint, maxWidth: "45%", textAlign: "right", lineHeight: 1.3 }}>{high}</span>
      </div>
    </div>
  );
}

function PatternCard({ pattern }) {
  const isHigh = pattern.severity === "high";
  return (
    <div style={{
      background: isHigh ? T.dangerLight : T.orangeLight,
      border: `1px solid ${isHigh ? T.dangerBorder : T.orangeBorder}`,
      borderLeft: `3px solid ${isHigh ? T.danger : T.orange}`,
      borderRadius: 8, padding: "14px 16px", marginBottom: 10
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: isHigh ? T.danger : T.orange }}>{pattern.label}</span>
        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: isHigh ? T.danger : T.orange, opacity: 0.7 }}>{pattern.severity}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: T.textSecondary, lineHeight: 1.65 }}>{pattern.detail}</p>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function WinLossAnalyzer() {
  const [inputs, setInputs]               = useState(defaultInputs);
  const [activeSection, setActiveSection] = useState(0);
  const [showResults, setShowResults]     = useState(false);
  const [deals, setDeals]                 = useState([]);
  const [view, setView]                   = useState("analyze"); // "analyze" | "portfolio"

  const set = (key, val) => setInputs(p => ({ ...p, [key]: val }));

  const answeredCount = Object.values(inputs).filter(v => v !== null).length;
  const totalFields   = SECTIONS.flatMap(s => s.fields).length;
  const canAnalyze    = answeredCount >= Math.floor(totalFields * 0.6);

  const results = analyze(inputs);
  const verdict = buildVerdict(inputs, results);

  const saveDeal = () => {
    setDeals(prev => [...prev, { inputs: { ...inputs }, results: { ...results }, verdict: { ...verdict }, savedAt: Date.now() }]);
  };

  // Portfolio aggregates
  const wonDeals  = deals.filter(d => d.inputs.outcome === "won");
  const lostDeals = deals.filter(d => d.inputs.outcome === "lost");
  const avgWinScore  = wonDeals.length  > 0 ? Math.round(wonDeals.reduce((a,d) => a + d.results.winSignal, 0) / wonDeals.length)  : null;
  const avgLossScore = lostDeals.length > 0 ? Math.round(lostDeals.reduce((a,d) => a + d.results.winSignal, 0) / lostDeals.length) : null;

  // Pattern frequency across all deals
  const patternCounts = {};
  deals.forEach(d => d.results.patterns.forEach(p => { patternCounts[p.label] = (patternCounts[p.label]||0)+1; }));
  const topPatterns = Object.entries(patternCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);

  // Loss reason distribution
  const lossReasons = {};
  deals.filter(d=>d.inputs.lossReason&&d.inputs.lossReason!=="na").forEach(d => { lossReasons[d.inputs.lossReason]=(lossReasons[d.inputs.lossReason]||0)+1; });

  // Section score averages across lost deals
  const avgChampion = deals.length > 0 ? Math.round(deals.reduce((a,d)=>a+(d.results.championScore||0),0)/deals.length*20) : null;
  const avgResponse = deals.length > 0 ? Math.round(deals.reduce((a,d)=>a+(d.results.responseScore||0),0)/deals.length*20) : null;
  const avgProcess  = deals.length > 0 ? Math.round(deals.reduce((a,d)=>a+(d.results.processScore||0),0)/deals.length*20) : null;

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.sans, color: T.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(5px);  } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Header */}
      <div style={{ background: T.headerBg, padding: "20px 40px", borderBottom: `1px solid ${T.headerBorder}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 5 }}>
              Deal Intelligence · Pattern Recognition
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Win / Loss Analyzer</h1>
            <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: 13 }}>Diagnose what actually drove the outcome — and what to change.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {deals.length >= 3 && (
              <div style={{ display: "flex", gap: 1, background: T.headerBorder, borderRadius: 7, padding: 2 }}>
                {[{v:"analyze",l:"Analyze"},{v:"portfolio",l:`Portfolio (${deals.length})`}].map(m=>(
                  <button key={m.v} onClick={()=>setView(m.v)} style={{
                    padding:"8px 14px", background:view===m.v?"#1e293b":"transparent",
                    border:"none", borderRadius:5, cursor:"pointer",
                    fontFamily:T.mono, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase",
                    color:view===m.v?"#f1f5f9":"#94a3b8", transition:"all 0.15s", fontWeight:view===m.v?600:400
                  }}>{m.l}</button>
                ))}
              </div>
            )}
            <div style={{ fontFamily: T.mono, fontSize: 10, color: "#334155", textAlign: "right", lineHeight: 1.6 }}>
              David Hopper<br />Commercial Operations
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 40px 80px" }}>

        {view === "portfolio" && deals.length >= 3 ? (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Summary row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Deals Logged",    value: deals.length,                     color: "#334155" },
                { label: "Win Rate",         value: deals.filter(d=>d.inputs.outcome==="won").length > 0 ? `${Math.round((wonDeals.length/deals.length)*100)}%` : "—", color: T.success },
                { label: "Avg Win Score",    value: avgWinScore  !== null ? avgWinScore  : "—", color: T.success },
                { label: "Avg Loss Score",   value: avgLossScore !== null ? avgLossScore : "—", color: T.danger  },
              ].map(m=>(
                <div key={m.label} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderTop: `3px solid ${m.color}`, borderRadius: 8, padding: "16px 18px" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 26, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Execution scores */}
            {avgChampion !== null && (
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Average Execution Scores Across All Deals</div>
                {[
                  { label: "Champion & Stakeholders", score: avgChampion },
                  { label: "Response Quality",        score: avgResponse },
                  { label: "Process & Intelligence",  score: avgProcess  },
                ].map(({ label, score }) => score !== null && (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: T.textMuted }}>{label}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 12, color: score >= 60 ? T.success : score >= 40 ? T.warning : T.danger, fontWeight: 600 }}>{score}%</span>
                    </div>
                    <div style={{ background: "#e5e7eb", height: 6, borderRadius: 3 }}>
                      <div style={{ background: score >= 60 ? T.success : score >= 40 ? T.warning : T.danger, height: "100%", borderRadius: 3, width: `${score}%`, transition: "width 0.8s" }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Top loss patterns */}
            {topPatterns.length > 0 && (
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Most Frequent Loss Patterns</div>
                {topPatterns.map(([label, count], i) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < topPatterns.length-1 ? `1px solid ${T.cardBorder}` : "none" }}>
                    <span style={{ fontSize: 13, color: T.textSecondary, flex: 1 }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ background: "#e5e7eb", height: 6, borderRadius: 3, width: 80 }}>
                        <div style={{ background: T.danger, height: "100%", borderRadius: 3, width: `${Math.round((count/deals.length)*100)}%` }}/>
                      </div>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.danger, fontWeight: 600, minWidth: 30 }}>{count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loss reason distribution */}
            {Object.keys(lossReasons).length > 0 && (
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Primary Loss Reason Distribution</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(lossReasons).sort((a,b)=>b[1]-a[1]).map(([reason, count]) => (
                    <div key={reason} style={{ background: T.dangerLight, border: `1px solid ${T.dangerBorder}`, borderRadius: 6, padding: "6px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: "#991b1b", textTransform: "capitalize" }}>{reason}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.danger }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deal log */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 14 }}>Deal Log</div>
              {deals.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < deals.length-1 ? `1px solid ${T.cardBorder}` : "none" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint }}>#{i+1}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, padding: "2px 8px", borderRadius: 4, background: d.inputs.outcome==="won"?T.successLight:T.dangerLight, color: d.inputs.outcome==="won"?T.success:T.danger, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.inputs.outcome||"—"}</span>
                    <span style={{ fontSize: 13, color: T.textMuted }}>{d.verdict.label}</span>
                  </div>
                  <span style={{ fontFamily: T.mono, fontSize: 13, color: T.textPrimary, fontWeight: 600 }}>{d.results.winSignal}</span>
                </div>
              ))}
            </div>
          </div>
        ) : !showResults ? (
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>

            {/* Section nav */}
            <div style={{ position: "sticky", top: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textMuted }}>{answeredCount} / {totalFields} answered</span>
                </div>
                <div style={{ background: "#e5e7eb", height: 3, borderRadius: 2 }}>
                  <div style={{ background: T.accent, height: "100%", borderRadius: 2, width: `${(answeredCount/totalFields)*100}%`, transition: "width 0.3s" }} />
                </div>
              </div>

              {SECTIONS.map((s, i) => {
                const answered = s.fields.filter(f => inputs[f.id] !== null).length;
                return (
                  <button key={s.id} onClick={() => setActiveSection(i)} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    background: activeSection === i ? T.cardBg : "transparent",
                    border: activeSection === i ? `1px solid ${T.accentBorder}` : "1px solid transparent",
                    borderLeft: activeSection === i ? `3px solid ${T.accent}` : "3px solid transparent",
                    borderRadius: 6, padding: "10px 12px", cursor: "pointer",
                    marginBottom: 4, textAlign: "left", transition: "all 0.15s"
                  }}>
                    <div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: activeSection === i ? T.accent : "#94a3b8", fontWeight: activeSection === i ? 600 : 400 }}>{s.label}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: answered === s.fields.length ? T.success : T.textFaint, marginTop: 2 }}>{answered}/{s.fields.length}</div>
                    </div>
                  </button>
                );
              })}

              <button
                onClick={() => setShowResults(true)}
                disabled={!canAnalyze}
                style={{
                  width: "100%", marginTop: 16, padding: "12px",
                  background: canAnalyze ? T.accent : "#e5e7eb",
                  color: canAnalyze ? "white" : T.textFaint,
                  border: "none", borderRadius: 6,
                  cursor: canAnalyze ? "pointer" : "not-allowed",
                  fontFamily: T.mono, fontSize: 11, letterSpacing: "0.08em",
                  textTransform: "uppercase", fontWeight: 600, transition: "all 0.2s"
                }}
              >
                {canAnalyze ? "Analyze Deal →" : `${Math.ceil(totalFields * 0.6) - answeredCount} more needed`}
              </button>
            </div>

            {/* Active section */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", animation: "slideIn 0.25s ease" }} key={activeSection}>
              <h2 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 700, color: T.textPrimary, paddingBottom: 14, borderBottom: `1px solid ${T.cardBorder}` }}>
                {SECTIONS[activeSection].label}
              </h2>

              {SECTIONS[activeSection].fields.map(field => (
                <div key={field.id} style={{ marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: T.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginBottom: 10 }}>
                    {field.label}
                    {inputs[field.id] !== null && <span style={{ color: T.success }}>✓</span>}
                  </label>
                  {field.type === "segment" && <SegBtn options={field.options} value={inputs[field.id]} onChange={v => set(field.id, v)} />}
                  {field.type === "scale"   && <ScaleInput value={inputs[field.id]} onChange={v => set(field.id, v)} low={field.low} high={field.high} />}
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 16, borderTop: `1px solid ${T.cardBorder}` }}>
                <button onClick={() => setActiveSection(i => Math.max(0, i - 1))} disabled={activeSection === 0}
                  style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "8px 16px", color: activeSection === 0 ? T.textFaint : T.textMuted, cursor: activeSection === 0 ? "default" : "pointer", fontFamily: T.mono, fontSize: 11 }}>
                  ← Back
                </button>
                {activeSection < SECTIONS.length - 1 && (
                  <button onClick={() => setActiveSection(i => i + 1)}
                    style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 6, padding: "8px 16px", color: T.accentText, cursor: "pointer", fontFamily: T.mono, fontSize: 11, fontWeight: 600 }}>
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Verdict */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderTop: `3px solid ${verdict.color}`, borderRadius: 10, padding: "24px 28px", marginBottom: 20, display: "flex", gap: 24, alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ fontFamily: T.mono, fontSize: 42, fontWeight: 800, color: verdict.color, lineHeight: 1 }}>{results.winSignal}</div>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>Exec Score</div>
              </div>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: verdict.color, marginBottom: 6 }}>Deal Verdict</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>{verdict.label}</div>
                <p style={{ margin: 0, fontSize: 13, color: T.textMuted, lineHeight: 1.65 }}>{verdict.desc}</p>
              </div>
            </div>

            {/* Score breakdown + positives */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Execution Breakdown</div>
                {[
                  { label: "Champion & Stakeholders", score: results.championScore },
                  { label: "Response Quality",        score: results.responseScore },
                  { label: "Process & Intelligence",  score: results.processScore  },
                ].map(({ label, score }) => score !== null && (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: T.textMuted }}>{label}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textPrimary, fontWeight: 600 }}>{Math.round((score/5)*100)}%</span>
                    </div>
                    <div style={{ background: "#e5e7eb", height: 5, borderRadius: 3 }}>
                      <div style={{ background: T.accent, height: "100%", borderRadius: 3, width: `${(score/5)*100}%`, transition: "width 0.8s" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: T.successLight, border: `1px solid ${T.successBorder}`, borderLeft: `3px solid ${T.success}`, borderRadius: 10, padding: "20px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.success, marginBottom: 12 }}>What Worked</div>
                {results.positives.length > 0 ? results.positives.map((p, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < results.positives.length - 1 ? `1px solid ${T.successBorder}` : "none" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.55 }}>{p.detail}</div>
                  </div>
                )) : (
                  <div style={{ fontSize: 13, color: T.textFaint, fontStyle: "italic" }}>No strong positive signals from the inputs provided.</div>
                )}
              </div>
            </div>

            {/* Patterns */}
            {results.patterns.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.danger, marginBottom: 12 }}>
                  Loss Patterns & Risk Factors ({results.patterns.length})
                </div>
                {results.patterns.sort((a, b) => a.severity === "high" ? -1 : 1).map((p, i) => <PatternCard key={i} pattern={p} />)}
              </div>
            )}

            {/* Playbook */}
            <div style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderLeft: `3px solid ${T.accent}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent, marginBottom: 14 }}>Playbook Recommendations</div>
              {results.playbook.map((item, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < results.playbook.length - 1 ? `1px solid ${T.accentBorder}` : "none" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, flexShrink: 0, marginTop: 1, minWidth: 20 }}>0{i + 1}</span>
                    <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: T.accent, fontWeight: 600 }}>{typeof item === "object" ? item.title : "Recommendation"}</div>
                  </div>
                  <p style={{ margin: "0 0 10px 32px", fontSize: 13, color: T.accentText, lineHeight: 1.75 }}>{typeof item === "object" ? item.action : item}</p>
                  {typeof item === "object" && item.next && (
                    <div style={{ marginLeft: 32, background: T.cardBg, border: `1px solid ${T.accentBorder}`, borderLeft: `3px solid ${T.accent}`, borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>First action</div>
                      <p style={{ margin: 0, fontSize: 12, color: T.accentText, lineHeight: 1.65 }}>{item.next}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => { setShowResults(false); setInputs(defaultInputs); setActiveSection(0); }}
              style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "10px 20px", color: T.textMuted, cursor: "pointer", fontFamily: T.mono, fontSize: 11 }}>
              ← Analyze another deal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}