import { useState, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#faf8f4",
  headerBg: "#0f172a",
  headerBorder: "#1e293b",
  cardBg: "#ffffff",
  cardBorder: "#e0dbd4",
  textPrimary: "#1a1917",
  textSecondary: "#44403c",
  textMuted: "#6b6560",
  textFaint: "#9a9690",
  accent: "#1a6b3c",
  accentLight: "#f0fdf4",
  accentBorder: "#bbf7d0",
  accentText: "#166534",
  danger: "#dc2626",
  dangerLight: "#fef2f2",
  dangerBorder: "#fecaca",
  warning: "#d97706",
  warningLight: "#fffbeb",
  warningBorder: "#fde68a",
  success: "#16a34a",
  successLight: "#f0fdf4",
  successBorder: "#bbf7d0",
  mono: "'DM Mono', monospace",
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', sans-serif",
};

// ─── ASSESSMENT DIMENSIONS ────────────────────────────────────────────────────
const DIMENSIONS = [
  {
    id: "revenue_architecture",
    label: "Revenue Architecture",
    short: "Revenue",
    description: "Commercial model design, coverage, team structure, and motion",
    questions: [
      { id: "ra1", text: "The revenue target is formally decomposed into net new, expansion, and renewal components with named owners for each.", low: "Single revenue number, informal ownership", high: "Three-part model with accountable owners" },
      { id: "ra2", text: "Sales headcount and territory design are based on quantified coverage math, not historical ratios.", low: "Headcount determined by budget availability", high: "Coverage model drives headcount planning" },
      { id: "ra3", text: "The go-to-market motion (inbound, outbound, partner, PLG) is explicitly chosen and resourced accordingly.", low: "Motion is undefined or inherited, not chosen", high: "Motion is explicit, funded, and measured" },
      { id: "ra4", text: "Sales capacity — deals per rep per year — is calculated and used to validate the plan.", low: "Rep capacity is assumed, not calculated", high: "Capacity math validates every headcount decision" },
      { id: "ra5", text: "Compensation plans are designed to drive the specific behaviors the revenue model requires.", low: "Plans inherited or benchmarked without design intent", high: "Every comp element maps to a specific commercial behavior" },
      { id: "ra6", text: "The company has a clear ICP with documented firmographic and behavioral criteria that sales and marketing agree on.", low: "ICP is tribal knowledge or undefined", high: "Written ICP with tiered criteria, joint agreement" },
    ]
  },
  {
    id: "pipeline_integrity",
    label: "Pipeline Integrity",
    short: "Pipeline",
    description: "Pipeline quality, forecast accuracy, and qualification rigor",
    questions: [
      { id: "pi1", text: "Stage progression is based on documented buyer actions, not rep sentiment or time elapsed.", low: "Reps advance deals based on gut feel", high: "Stage gates require documented buyer actions" },
      { id: "pi2", text: "Forecast accuracy — projected vs. actual — is tracked and within 15% on a rolling quarterly basis.", low: "Forecast variance is rarely measured or addressed", high: "Variance tracked, root-caused, and improving" },
      { id: "pi3", text: "Pipeline coverage ratio is actively managed and maintained at an appropriate multiple for the motion.", low: "Coverage eyeballed informally", high: "Coverage maintained proactively with defined floor" },
      { id: "pi4", text: "Disqualification criteria are explicit, applied consistently, and sales leadership enforces them.", low: "Every lead gets chased regardless of fit", high: "Clear exit criteria applied consistently" },
      { id: "pi5", text: "Stale opportunities are reviewed and culled on a defined cadence — pipeline reflects reality.", low: "Pipeline bloat is chronic; old deals never die", high: "Defined review cadence keeps pipeline clean" },
      { id: "pi6", text: "The business can distinguish between pipeline at risk of slipping and pipeline that will close in period.", low: "All pipeline treated the same regardless of risk", high: "Risk-tiered pipeline with specific mitigation plays" },
    ]
  },
  {
    id: "pricing_discipline",
    label: "Pricing Discipline",
    short: "Pricing",
    description: "Pricing strategy, discount governance, and margin management",
    questions: [
      { id: "pd1", text: "List prices are documented, consistently communicated, and treated as the starting point — not a ceiling.", low: "Pricing varies by rep; no single source of truth", high: "Price books enforced as the default starting point" },
      { id: "pd2", text: "Discounting authority is tiered with documented rationale required above defined thresholds.", low: "Reps discount freely with no approval required", high: "Tiered authority with documented business case" },
      { id: "pd3", text: "Win/loss analysis includes deal margin, not just revenue — low-margin wins are identified and reviewed.", low: "Win rate tracked; margin is a finance problem", high: "Every deal reviewed for margin; outliers flagged" },
      { id: "pd4", text: "The business understands the value it delivers to customers and prices reflect that value, not just cost plus.", low: "Pricing based on cost or competitive matching", high: "Value-based pricing with documented rationale" },
      { id: "pd5", text: "Price changes are piloted with defined success metrics before full rollout.", low: "Pricing changes made ad hoc based on gut or pressure", high: "Pricing experiments with defined evaluation criteria" },
      { id: "pd6", text: "Customer-level profitability is visible and used to inform account strategy decisions.", low: "Customer profitability is unknown or unavailable", high: "Customer-level margin informs retention and expansion priorities" },
    ]
  },
  {
    id: "customer_base_health",
    label: "Customer Base Health",
    short: "Customer",
    description: "Retention, expansion, and net revenue retention performance",
    questions: [
      { id: "ch1", text: "Gross and net revenue retention are tracked, reported to the board, and improving.", low: "Retention is tracked inconsistently if at all", high: "GRR and NRR reported monthly with trend visibility" },
      { id: "ch2", text: "Churn is analyzed by cohort, segment, and root cause — not just reported as a single number.", low: "Churn reported as a rate without root-cause analysis", high: "Cohort-level analysis with root-cause classification" },
      { id: "ch3", text: "At-risk accounts are identified early using leading indicators, not lagging ones like NPS or support volume.", low: "Accounts flagged at-risk only after visible deterioration", high: "Leading indicators drive early intervention before churn signals appear" },
      { id: "ch4", text: "Expansion is treated as a structured commercial motion with targets, plays, and accountability.", low: "Expansion happens opportunistically when customers ask", high: "Expansion pipeline with targets and dedicated plays" },
      { id: "ch5", text: "Customer Success has a defined revenue accountability — either expansion pipeline or NRR — not just satisfaction scores.", low: "CS measured on satisfaction and ticket volume", high: "CS owns a revenue metric with accountability" },
      { id: "ch6", text: "The company knows its best customers' firmographic profile and uses it to improve new logo targeting.", low: "Best customer profiles are anecdotal", high: "Closed-won analysis informs ICP and targeting" },
    ]
  },
  {
    id: "commercial_org",
    label: "Commercial Org Effectiveness",
    short: "Org",
    description: "Organizational design, enablement, accountability, and RevOps infrastructure",
    questions: [
      { id: "co1", text: "Revenue operations owns CRM governance, pipeline reporting, and commercial data — not as a shared IT function but as a dedicated commercial role.", low: "RevOps is undefined or fragmented across functions", high: "Dedicated RevOps with clear scope and accountability" },
      { id: "co2", text: "New reps reach productivity within a defined ramp window measured by quota attainment, not just onboarding completion.", low: "Ramp is undefined; new reps figure it out", high: "Defined ramp target with milestone gates" },
      { id: "co3", text: "Sales and marketing have shared pipeline definitions, shared attribution logic, and a joint pipeline review.", low: "Marketing measures MQLs; sales ignores most of them", high: "Shared definitions with joint pipeline accountability" },
      { id: "co4", text: "Commercial reporting gives leadership a real-time view of leading indicators — not just lagging results.", low: "Board sees revenue results; leading indicators are invisible", high: "Leading indicators visible and reviewed regularly" },
      { id: "co5", text: "Decision-making authority across commercial functions is explicit — who owns what, and at what level.", low: "Authority is implicit, contested, or unclear", high: "Explicit RACI with named owners for commercial decisions" },
      { id: "co6", text: "The commercial tech stack is configured to support the actual motion — not inherited from a prior strategy.", low: "Tech stack inherited; configured for a different motion", high: "Stack configured specifically for current GTM motion" },
    ]
  },
];

const TOTAL_QUESTIONS = DIMENSIONS.reduce((a, d) => a + d.questions.length, 0);

function scoreColor(s) {
  if (s >= 75) return T.success;
  if (s >= 50) return "#2563eb";
  if (s >= 30) return T.warning;
  return T.danger;
}

function scoreBg(s) {
  if (s >= 75) return T.successLight;
  if (s >= 50) return "#eff6ff";
  if (s >= 30) return T.warningLight;
  return T.dangerLight;
}

function scoreLabel(s) {
  if (s >= 75) return "Strong";
  if (s >= 50) return "Developing";
  if (s >= 30) return "At Risk";
  return "Critical";
}

function computeDimScore(dim, answers) {
  const vals = dim.questions.map(q => answers[q.id]).filter(v => v !== undefined);
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 4)) * 100);
}

function computeOverall(answers) {
  const scores = DIMENSIONS.map(d => computeDimScore(d, answers)).filter(s => s !== null);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 80 }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e0db" strokeWidth={size * 0.07} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size * 0.07}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: T.mono, fontSize: size * 0.22, fontWeight: 700, fill: color, transform: `rotate(90deg) translate(0, -${size}px)` }}>
        {score}
      </text>
    </svg>
  );
}

function QuestionCard({ question, value, onChange }) {
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${value !== undefined ? T.accentBorder : T.cardBorder}`,
      borderLeft: `3px solid ${value !== undefined ? T.accent : T.cardBorder}`,
      borderRadius: 8, padding: "18px 20px", marginBottom: 10, transition: "border-color 0.2s" }}>
      <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 500, color: T.textPrimary, lineHeight: 1.6, fontFamily: T.sans }}>{question.text}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: T.textFaint, flex: 1, lineHeight: 1.3, fontFamily: T.mono }}>{question.low}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4].map(v => (
            <button key={v} onClick={() => onChange(v)} style={{
              width: 38, height: 38, borderRadius: 6,
              background: value === v ? T.headerBg : value !== undefined && v <= value ? "#f1f5f9" : T.bg,
              color: value === v ? "white" : value !== undefined && v <= value ? T.textPrimary : T.textMuted,
              border: value === v ? `2px solid ${T.headerBg}` : `2px solid ${T.cardBorder}`,
              fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: T.mono
            }}>{v}</button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: T.textFaint, flex: 1, textAlign: "right", lineHeight: 1.3, fontFamily: T.mono }}>{question.high}</span>
      </div>
    </div>
  );
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function generateRecommendations(context) {
  const { companyName, industry, holdPeriod, dimScores, overall, weakest, answers } = context;

  const prompt = `You are a senior PE operating partner reviewing a commercial execution diagnostic for a portfolio company. Write a focused, specific, actionable analysis.

Company: ${companyName || "the portfolio company"}
Industry: ${industry}
Hold period stage: ${holdPeriod}
Overall commercial execution score: ${overall}/100

Dimension scores:
${dimScores.map(d => `- ${d.label}: ${d.score}/100 (${scoreLabel(d.score)})`).join("\n")}

The three weakest dimensions are: ${weakest.map(d => d.label).join(", ")}.

Write the following sections. Be direct, specific, and PE-fluent. Avoid generic consulting language. Write for an operator who needs to act, and a board that needs to understand risk and opportunity.

---

## Priority Initiatives

List the top 3 highest-impact commercial initiatives this company should pursue, in priority order. For each:
- Name the initiative (5 words or fewer)
- State the specific problem it addresses (2 sentences)
- Describe the first concrete action (1 sentence, starts with a verb)
- Estimate the revenue or margin impact (rough order of magnitude, with clear assumptions)

## Board-Level Summary

Write 3 sentences suitable for a board update: what is the current state of commercial execution, what is the primary risk, and what is the primary opportunity. Be specific to this company's scores, not generic.

## 90-Day Focus

Name the single most important commercial initiative for the next 90 days and explain why it takes precedence over the others (3-4 sentences).

---

Tone: direct, credible, operator-level. No bullet soup. No hedging. Write as if you've seen dozens of companies at this stage and you know what actually matters.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function CommercialExecutionDiagnostic() {
  const [step, setStep] = useState("intro"); // intro | assess | results
  const [activeDim, setActiveDim] = useState(0);
  const [answers, setAnswers] = useState({});
  const [context, setContext] = useState({ companyName: "", industry: "B2B SaaS / Software", holdPeriod: "Year 1–2 (Early)" });
  const [results, setResults] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [narrative, setNarrative] = useState("");
  const printRef = useRef(null);

  const answered = Object.keys(answers).length;
  const overall = computeOverall(answers);
  const dimScores = DIMENSIONS.map(d => ({ ...d, score: computeDimScore(d, answers) })).filter(d => d.score !== null);
  const weakest = [...dimScores].sort((a, b) => a.score - b.score).slice(0, 3);

  const setAnswer = useCallback((qid, val) => setAnswers(p => ({ ...p, [qid]: val })), []);

  const handleGenerate = async () => {
    setGenerating(true);
    setStep("results");
    const dimScoresFull = DIMENSIONS.map(d => ({ label: d.label, score: computeDimScore(d, answers) || 0 }));
    try {
      const text = await generateRecommendations({ ...context, dimScores: dimScoresFull, overall, weakest, answers });
      setNarrative(text);
    } catch (e) {
      setNarrative("Unable to generate narrative. Please check your connection and try again.");
    }
    setGenerating(false);
  };

  const handlePrint = () => window.print();

  const parseNarrative = (text) => {
    if (!text) return { initiatives: "", board: "", focus: "" };
    const sections = { initiatives: "", board: "", focus: "" };
    const initIdx = text.indexOf("## Priority Initiatives");
    const boardIdx = text.indexOf("## Board-Level Summary");
    const focusIdx = text.indexOf("## 90-Day Focus");
    if (initIdx !== -1 && boardIdx !== -1) sections.initiatives = text.slice(initIdx + 23, boardIdx).trim();
    if (boardIdx !== -1 && focusIdx !== -1) sections.board = text.slice(boardIdx + 22, focusIdx).trim();
    if (focusIdx !== -1) sections.focus = text.slice(focusIdx + 16).trim();
    return sections;
  };

  const parsed = parseNarrative(narrative);

  const industries = ["B2B SaaS / Software", "Industrial / Manufacturing", "Professional Services", "Healthcare & Life Sciences", "Financial Services", "Logistics & Supply Chain", "Government & Public Sector", "Consumer / Retail", "Other"];
  const holdPeriods = ["Pre-Close / Diligence", "Year 1–2 (Early)", "Year 2–3 (Value Creation)", "Year 3+ (Pre-Exit)"];

  return (
    <div ref={printRef} style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2378716c' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px !important; }
        @media print {
          nav, .no-print { display: none !important; }
          body { background: white; }
          .print-page { page-break-after: always; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: T.headerBg, borderBottom: `1px solid ${T.headerBorder}`, padding: "18px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="/operator" style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 700, color: "#f1f5f9", textDecoration: "none", letterSpacing: "-0.01em" }}>Meridian<span style={{ color: T.accent }}>.</span></a>
            <span style={{ color: T.headerBorder, fontSize: 18 }}>·</span>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 2 }}>Post-Close · Execution Assessment</div>
              <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 600, color: "#cbd5e1" }}>Commercial Execution Diagnostic</div>
            </div>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: "#334155", textAlign: "right", lineHeight: 1.7 }}>
            David Hopper<br /><a href="https://dahopper.com" style={{ color: T.accent, textDecoration: "none" }}>dahopper.com</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 48px 100px" }}>

        {/* INTRO */}
        {step === "intro" && (
          <div className="fade-up">
            <div style={{ maxWidth: 640, marginBottom: 48 }}>
              <h1 style={{ fontFamily: T.serif, fontSize: 38, fontWeight: 700, color: T.textPrimary, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
                Where is your commercial<br />engine actually performing?
              </h1>
              <p style={{ fontSize: 16, color: T.textMuted, lineHeight: 1.8, marginBottom: 0 }}>
                This diagnostic assesses commercial execution across five dimensions that consistently determine whether a PE-backed company hits its value creation plan. 30 questions. 12 minutes. Output structured for both operator use and board reporting.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {DIMENSIONS.map((d, i) => (
                <div key={d.id} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, fontWeight: 600, minWidth: 20, marginTop: 2 }}>0{i+1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, marginBottom: 3 }}>{d.label}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{d.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Context inputs */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "24px 28px", marginBottom: 28 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.cardBorder}` }}>Company Context</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { key: "companyName", label: "Company Name", type: "text", placeholder: "Optional — for report header" },
                  { key: "industry", label: "Industry", type: "select", options: industries },
                  { key: "holdPeriod", label: "Hold Period Stage", type: "select", options: holdPeriods },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: "block", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginBottom: 7 }}>{field.label}</label>
                    {field.type === "text" ? (
                      <input value={context[field.key]} onChange={e => setContext(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.cardBorder}`, borderRadius: 6, fontFamily: T.sans, fontSize: 13, color: T.textPrimary, background: T.bg }} />
                    ) : (
                      <select value={context[field.key]} onChange={e => setContext(p => ({ ...p, [field.key]: e.target.value }))}
                        style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.cardBorder}`, borderRadius: 6, fontFamily: T.sans, fontSize: 13, color: T.textPrimary, background: T.bg }}>
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setStep("assess")} style={{ background: T.headerBg, color: "white", border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.sans, letterSpacing: "0.01em" }}>
              Begin Assessment →
            </button>
          </div>
        )}

        {/* ASSESSMENT */}
        {step === "assess" && (
          <div className="fade-up">
            {/* Progress */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>{answered} / {TOTAL_QUESTIONS} answered</span>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>{Math.round((answered/TOTAL_QUESTIONS)*100)}% complete</span>
              </div>
              <div style={{ background: T.cardBorder, height: 3, borderRadius: 2 }}>
                <div style={{ background: T.accent, height: "100%", borderRadius: 2, width: `${(answered/TOTAL_QUESTIONS)*100}%`, transition: "width 0.3s" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}>
              {/* Dimension nav */}
              <div style={{ position: "sticky", top: 24 }}>
                {DIMENSIONS.map((d, i) => {
                  const score = computeDimScore(d, answers);
                  const answeredInDim = d.questions.filter(q => answers[q.id] !== undefined).length;
                  return (
                    <button key={d.id} onClick={() => setActiveDim(i)} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%", background: activeDim === i ? T.cardBg : "transparent",
                      border: activeDim === i ? `1px solid ${T.accentBorder}` : "1px solid transparent",
                      borderLeft: activeDim === i ? `3px solid ${T.accent}` : "3px solid transparent",
                      borderRadius: 6, padding: "10px 12px", cursor: "pointer", marginBottom: 4, textAlign: "left"
                    }}>
                      <div>
                        <div style={{ fontFamily: T.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: activeDim === i ? T.accent : T.textMuted, fontWeight: activeDim === i ? 600 : 400 }}>{d.short}</div>
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint, marginTop: 2 }}>{answeredInDim}/{d.questions.length}</div>
                      </div>
                      {score !== null && <span style={{ fontFamily: T.mono, fontSize: 11, color: scoreColor(score), fontWeight: 600 }}>{score}</span>}
                    </button>
                  );
                })}

                <button onClick={handleGenerate}
                  disabled={answered < Math.floor(TOTAL_QUESTIONS * 0.7)}
                  style={{
                    width: "100%", marginTop: 16, padding: "12px",
                    background: answered >= Math.floor(TOTAL_QUESTIONS * 0.7) ? T.headerBg : "#e2e0db",
                    color: answered >= Math.floor(TOTAL_QUESTIONS * 0.7) ? "white" : T.textFaint,
                    border: "none", borderRadius: 6,
                    cursor: answered >= Math.floor(TOTAL_QUESTIONS * 0.7) ? "pointer" : "not-allowed",
                    fontFamily: T.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600
                  }}>
                  {answered >= Math.floor(TOTAL_QUESTIONS * 0.7) ? "Generate Report →" : `${Math.ceil(TOTAL_QUESTIONS * 0.7) - answered} more needed`}
                </button>
              </div>

              {/* Active dimension */}
              <div key={activeDim}>
                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.cardBorder}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 6 }}>Dimension 0{activeDim+1} of 05</div>
                  <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 700, color: T.textPrimary, margin: "0 0 6px" }}>{DIMENSIONS[activeDim].label}</h2>
                  <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>{DIMENSIONS[activeDim].description}</p>
                </div>
                {DIMENSIONS[activeDim].questions.map(q => (
                  <QuestionCard key={q.id} question={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.cardBorder}` }}>
                  <button onClick={() => setActiveDim(i => Math.max(0, i-1))} disabled={activeDim === 0}
                    style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "9px 18px", color: activeDim === 0 ? T.textFaint : T.textMuted, cursor: activeDim === 0 ? "default" : "pointer", fontFamily: T.mono, fontSize: 11 }}>← Previous</button>
                  {activeDim < DIMENSIONS.length - 1 && (
                    <button onClick={() => setActiveDim(i => i+1)}
                      style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 6, padding: "9px 18px", color: T.accentText, cursor: "pointer", fontFamily: T.mono, fontSize: 11, fontWeight: 600 }}>Next →</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <div className="fade-up print-page">
            {/* Report header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>Commercial Execution Diagnostic · {context.industry} · {context.holdPeriod}</div>
                <h1 style={{ fontFamily: T.serif, fontSize: 32, fontWeight: 700, color: T.textPrimary, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                  {context.companyName ? `${context.companyName} · ` : ""}Commercial Execution Report
                </h1>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
              </div>
              <button onClick={handlePrint} className="no-print" style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "9px 18px", color: T.textMuted, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Print / Save PDF
              </button>
            </div>

            {/* Overall score */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderTop: `3px solid ${scoreColor(overall)}`, borderRadius: 10, padding: "28px 32px", marginBottom: 20, display: "flex", gap: 28, alignItems: "center" }}>
              <ScoreRing score={overall} size={90} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: scoreColor(overall), marginBottom: 6 }}>Overall Execution Score</div>
                <div style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>{scoreLabel(overall)} — {overall}/100</div>
                <p style={{ margin: 0, fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>
                  {overall >= 75 ? "Commercial execution is a relative strength. The value creation opportunity lies in optimizing existing strengths and protecting against execution drift as the company scales." :
                   overall >= 50 ? "Core commercial infrastructure exists but performance is uneven across dimensions. Focused investment in the weakest areas will have disproportionate impact on revenue and margin outcomes." :
                   overall >= 30 ? "Commercial execution has meaningful gaps that represent both risk to the current plan and opportunity for structured improvement. Prioritization is essential — not everything can be fixed at once." :
                   "Significant commercial execution gaps exist across multiple dimensions. The value creation plan depends on rapid, sequenced intervention in the areas flagged below."}
                </p>
              </div>
            </div>

            {/* Dimension breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
              {DIMENSIONS.map(d => {
                const score = computeDimScore(d, answers) || 0;
                return (
                  <div key={d.id} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderTop: `3px solid ${scoreColor(score)}`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textFaint, marginBottom: 8 }}>{d.short}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 26, fontWeight: 700, color: scoreColor(score), lineHeight: 1, marginBottom: 4 }}>{score}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: scoreColor(score), textTransform: "uppercase", letterSpacing: "0.06em" }}>{scoreLabel(score)}</div>
                  </div>
                );
              })}
            </div>

            {/* Score bars */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Dimension Breakdown</div>
              {DIMENSIONS.map(d => {
                const score = computeDimScore(d, answers) || 0;
                return (
                  <div key={d.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>{d.label}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 12, color: scoreColor(score), fontWeight: 600 }}>{score}/100 · {scoreLabel(score)}</span>
                    </div>
                    <div style={{ background: "#e2e0db", height: 6, borderRadius: 3 }}>
                      <div style={{ background: scoreColor(score), height: "100%", borderRadius: 3, width: `${score}%`, transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Claude narrative */}
            {generating ? (
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "40px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, border: `3px solid ${T.cardBorder}`, borderTop: `3px solid ${T.accent}`, borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Generating analysis...</div>
              </div>
            ) : narrative ? (
              <>
                {/* Board summary */}
                {parsed.board && (
                  <div style={{ background: T.headerBg, borderRadius: 10, padding: "24px 28px", marginBottom: 20 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 12 }}>Board-Level Summary</div>
                    <p style={{ margin: 0, fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, fontFamily: T.serif }}>{parsed.board}</p>
                  </div>
                )}

                {/* Priority initiatives */}
                {parsed.initiatives && (
                  <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "24px 28px", marginBottom: 20 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Priority Initiatives</div>
                    <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.85, whiteSpace: "pre-line" }}>{parsed.initiatives}</div>
                  </div>
                )}

                {/* 90-day focus */}
                {parsed.focus && (
                  <div style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderLeft: `3px solid ${T.accent}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 10 }}>90-Day Focus</div>
                    <p style={{ margin: 0, fontSize: 14, color: T.accentText, lineHeight: 1.8, fontFamily: T.serif }}>{parsed.focus}</p>
                  </div>
                )}
              </>
            ) : null}

            {/* Question-level detail */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px 24px", marginBottom: 28 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Detailed Scores by Dimension</div>
              {DIMENSIONS.map(d => (
                <div key={d.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.cardBorder}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: T.textPrimary }}>{d.label}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 12, color: scoreColor(computeDimScore(d, answers)||0), fontWeight: 600 }}>{computeDimScore(d, answers)||0}/100</span>
                  </div>
                  {d.questions.map(q => {
                    const v = answers[q.id];
                    return v !== undefined ? (
                      <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid #f5f4f2` }}>
                        <span style={{ fontSize: 12, color: T.textMuted, flex: 1, paddingRight: 12, lineHeight: 1.4 }}>{q.text.slice(0, 80)}{q.text.length > 80 ? "…" : ""}</span>
                        <div style={{ display: "flex", gap: 3 }}>
                          {[1,2,3,4].map(n => (
                            <div key={n} style={{ width: 18, height: 18, borderRadius: 3, background: n <= v ? scoreColor(computeDimScore(d, answers)||0) : "#e2e0db", opacity: n <= v ? 1 : 0.3 }} />
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ))}
            </div>

            <div className="no-print" style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setStep("assess"); setActiveDim(0); }} style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "10px 20px", color: T.textMuted, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>← Revise Answers</button>
              <button onClick={() => { setAnswers({}); setContext({ companyName: "", industry: "B2B SaaS / Software", holdPeriod: "Year 1–2 (Early)" }); setNarrative(""); setStep("intro"); }} style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "10px 20px", color: T.textMuted, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>New Assessment</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.cardBorder}`, padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint }}>Commercial Execution Diagnostic · David Hopper</div>
        <div style={{ display: "flex", gap: 16 }}><a href="/operator" style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textDecoration: "none" }}>← Meridian Suite</a><a href="https://dahopper.com" style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textDecoration: "none" }}>dahopper.com →</a></div>
      </div>
    </div>
  );
}
