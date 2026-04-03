import { useState, useCallback } from "react";

const T = {
  bg: "#faf8f4", headerBg: "#0f172a", headerBorder: "#1e293b",
  cardBg: "#ffffff", cardBorder: "#e0dbd4",
  textPrimary: "#1a1917", textSecondary: "#44403c",
  textMuted: "#6b6560", textFaint: "#9a9690",
  accent: "#1a6b3c", accentLight: "#f0fdf4",
  accentBorder: "#bbf7d0", accentText: "#166534",
  danger: "#dc2626", dangerLight: "#fef2f2", dangerBorder: "#fecaca",
  warning: "#d97706", warningLight: "#fffbeb", warningBorder: "#fde68a",
  success: "#16a34a", successLight: "#f0fdf4", successBorder: "#bbf7d0",
  caution: "#7c3aed", cautionLight: "#f5f3ff", cautionBorder: "#ddd6fe",
  mono: "'DM Mono', monospace",
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', sans-serif",
};

// ─── DIMENSIONS ───────────────────────────────────────────────────────────────
const DIMENSIONS = [
  {
    id: "data_integrity",
    label: "Commercial Data Integrity",
    short: "Data",
    risk: "HIGH",
    description: "CRM quality, pipeline model reliability, attribution, and reporting infrastructure",
    why: "Poor commercial data is the most consistently underestimated integration risk. It makes the first 90 days harder than they need to be and delays the ability to make confident commercial decisions.",
    questions: [
      { id: "di1", text: "The CRM contains complete, current records for active accounts, opportunities, and contacts — not partially populated or used inconsistently.", risk: "critical", low: "CRM is fragmented, stale, or primarily a reporting artifact", high: "CRM is the operating system — updated, trusted, and relied on" },
      { id: "di2", text: "Pipeline can be reconstructed from CRM data alone, without relying on rep memory or spreadsheet overlays.", risk: "critical", low: "Real pipeline lives in spreadsheets or heads", high: "CRM is the single source of pipeline truth" },
      { id: "di3", text: "Revenue attribution — which activities and channels drive closed revenue — is tracked systematically.", risk: "high", low: "Attribution is guessed or unavailable", high: "Multi-touch attribution tracked from first touch to close" },
      { id: "di4", text: "Commercial reporting gives leadership a consistent view of leading indicators, not just lagging results.", risk: "high", low: "Reports generated ad hoc; no consistent cadence or format", high: "Standardized dashboards reviewed on a defined cadence" },
      { id: "di5", text: "Data definitions — stages, lead types, pipeline qualification — are documented and applied consistently across the team.", risk: "medium", low: "Definitions vary by rep or are informal", high: "Written definitions enforced and consistently applied" },
    ]
  },
  {
    id: "revenue_model",
    label: "Revenue Model Clarity",
    short: "Revenue",
    risk: "HIGH",
    description: "Pricing documentation, contract standardization, revenue repeatability, and model transparency",
    why: "Revenue that depends on informal relationships, undocumented pricing, or highly customized contracts is structurally fragile. The acquirer needs to be able to understand, price, and replicate the revenue model.",
    questions: [
      { id: "rm1", text: "Pricing is documented in a formal price book or rate card that is consistently applied as the starting point.", risk: "critical", low: "Pricing varies by deal, rep, or relationship — no standard reference", high: "Formal price book applied consistently as the default" },
      { id: "rm2", text: "Customer contracts are standardized with limited customization — material exceptions are documented and approved.", risk: "high", low: "Contracts are heavily customized; terms vary significantly", high: "Standard contracts with documented exception approval process" },
      { id: "rm3", text: "Revenue can be classified into recurring, repeatable, and one-time categories with a quantified breakdown.", risk: "high", low: "Revenue quality is opaque or internally debated", high: "Revenue classified by type with documented assumptions" },
      { id: "rm4", text: "The business can articulate what drives a customer to buy — and that driver is documented, not founder-dependent.", risk: "critical", low: "Buying triggers are understood only by founder or senior sales", high: "Buying drivers documented and transferable across reps" },
      { id: "rm5", text: "Gross margin by customer segment or product line is visible and reflects true delivery cost.", risk: "high", low: "Margin analysis is unavailable or unreliable", high: "Segment-level gross margin tracked and current" },
    ]
  },
  {
    id: "sales_motion",
    label: "Sales Motion Transferability",
    short: "Sales Motion",
    risk: "HIGH",
    description: "Process documentation, key person dependency, playbook existence, and motion replicability",
    why: "Sales motions that live in people rather than process are acquisition liabilities. Leadership change — which is common post-close — can destroy pipeline momentum if the motion isn't transferable.",
    questions: [
      { id: "sm1", text: "The sales process is documented in a playbook that a new rep could follow without extensive mentorship.", risk: "critical", low: "Process lives in senior rep knowledge and tribal memory", high: "Written playbook with stage-by-stage guidance and templates" },
      { id: "sm2", text: "If the top two revenue-generating reps left in the first 90 days post-close, pipeline would not collapse.", risk: "critical", low: "Two or fewer reps account for the majority of closed revenue", high: "Revenue distributed across team; no single-rep concentration" },
      { id: "sm3", text: "Qualification criteria are explicit — reps can articulate why they pursue or disqualify a given opportunity.", risk: "high", low: "Reps chase everything; qualification is informal", high: "Written qualification criteria consistently applied" },
      { id: "sm4", text: "New rep onboarding is structured with defined milestones and a measured ramp-to-productivity window.", risk: "medium", low: "Onboarding is informal; ramp time is undefined", high: "Structured onboarding with milestone gates and ramp benchmarks" },
      { id: "sm5", text: "The sales motion is independent of the founder's relationships and network for net new business.", risk: "critical", low: "Most new business flows through founder relationships", high: "Net new business generated by the team, not the founder" },
    ]
  },
  {
    id: "customer_risk",
    label: "Customer Relationship Risk",
    short: "Customers",
    risk: "HIGH",
    description: "Revenue concentration, founder dependency, contract vs. relationship revenue, and retention drivers",
    why: "Customer revenue that is concentrated, relationship-dependent, or not under contract is a valuation risk and an integration risk. The acquirer needs to understand what they're actually buying.",
    questions: [
      { id: "cr1", text: "No single customer represents more than 15% of annual revenue — or concentration is disclosed and under active management.", risk: "critical", low: "Single customer >20% of revenue; undisclosed or unmanaged", high: "Diversified base or concentration disclosed with mitigation plan" },
      { id: "cr2", text: "Customer relationships are institutionalized — multiple contacts per account, documented history, not solely founder-dependent.", risk: "critical", low: "Most customer relationships flow through one person", high: "Multi-threaded relationships documented in CRM" },
      { id: "cr3", text: "The majority of revenue is under contract with defined terms, not subject to informal renewal or relationship-based retention.", risk: "high", low: "Revenue depends on informal relationships or verbal commitments", high: "Majority of revenue under contract with defined renewal terms" },
      { id: "cr4", text: "Gross retention — revenue retained from existing customers before expansion — is 85% or above.", risk: "high", low: "Retention is unknown, below 80%, or deteriorating", high: "Gross retention 85%+ tracked and improving" },
      { id: "cr5", text: "The company knows why customers renew — and that reason is documented and not solely based on individual relationship.", risk: "high", low: "Renewal drivers are assumed or relationship-dependent", high: "Renewal drivers documented from exit interviews and analysis" },
    ]
  },
  {
    id: "stack_readiness",
    label: "Commercial Stack Readiness",
    short: "Tech Stack",
    risk: "MEDIUM",
    description: "Technology configuration, integration complexity, data portability, and compatibility with acquirer systems",
    why: "Commercial technology debt is rarely surfaced in standard diligence. Migrating a poorly configured CRM, untangling point solutions, or reconciling incompatible data models can consume 6–12 months of operational capacity post-close.",
    questions: [
      { id: "sr1", text: "The commercial tech stack is documented — tools, configurations, integrations, and data flows are mapped.", risk: "medium", low: "Stack is undocumented; institutional knowledge lives with one person", high: "Full stack documentation including data flows and integrations" },
      { id: "sr2", text: "Customer and pipeline data can be exported cleanly from the current CRM into a standard format.", risk: "high", low: "Export is complicated, incomplete, or requires significant cleanup", high: "Clean export with documented field mapping available" },
      { id: "sr3", text: "The CRM and core commercial tools are on standard, current versions — not heavily customized legacy configurations.", risk: "medium", low: "Heavy customization or legacy versions requiring significant migration", high: "Standard configurations on current versions with clean architecture" },
      { id: "sr4", text: "Marketing automation and CRM are integrated with consistent data flowing between them.", risk: "medium", low: "Systems are disconnected or integrated inconsistently", high: "Clean bidirectional integration with documented data model" },
      { id: "sr5", text: "The commercial stack can be maintained and configured without dependence on a single internal or external technical resource.", risk: "high", low: "Stack configuration depends on one person or one vendor", high: "Multiple team members capable of maintaining core commercial systems" },
    ]
  },
];

const TOTAL_Q = DIMENSIONS.reduce((a, d) => a + d.questions.length, 0);

function riskColor(r) {
  return { critical: T.danger, high: T.warning, medium: T.caution }[r] || T.textMuted;
}

function scoreColor(s) {
  if (s === null) return T.textFaint;
  if (s >= 75) return T.success;
  if (s >= 50) return "#2563eb";
  if (s >= 30) return T.warning;
  return T.danger;
}

function riskLabel(s) {
  if (s === null) return "—";
  if (s >= 75) return "Low Risk";
  if (s >= 50) return "Moderate";
  if (s >= 30) return "Elevated";
  return "High Risk";
}

function computeDimScore(dim, answers) {
  const vals = dim.questions.map(q => answers[q.id]).filter(v => v !== undefined);
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 4)) * 100);
}

function computeOverall(answers) {
  const scores = DIMENSIONS.map(d => computeDimScore(d, answers)).filter(s => s !== null);
  if (scores.length === 0) return 0;
  // Weight critical dimensions more heavily
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function generateMemo(context) {
  const { targetName, industry, dealType, dealStage, dimScores, overall, answers } = context;

  const criticalFlags = DIMENSIONS.flatMap(d =>
    d.questions.filter(q => q.risk === "critical" && answers[q.id] !== undefined && answers[q.id] <= 2)
      .map(q => `${d.label}: ${q.text.slice(0, 80)}`)
  );

  const prompt = `You are a senior PE operating partner writing a commercial diligence memo for an investment committee. Be direct, specific, and credible. Write for operators and investors who have seen many deals.

Target: ${targetName || "the target company"}
Industry: ${industry}
Deal type: ${dealType}
Diligence stage: ${dealStage}
Overall commercial integration risk score: ${overall}/100

Dimension risk scores (higher = lower risk / better commercial infrastructure):
${dimScores.map(d => `- ${d.label}: ${d.score !== null ? d.score + "/100 (" + riskLabel(d.score) + ")" : "Not assessed"}`).join("\n")}

Critical flags identified (score 1-2 on critical questions):
${criticalFlags.length > 0 ? criticalFlags.map(f => `- ${f}`).join("\n") : "None identified"}

Write the following sections. Be specific. Avoid generic consulting language. Write as if you have done 50 of these.

---

## Commercial Risk Summary

Two to three sentences describing the overall commercial integration risk profile of this target. Name the specific risks. Be honest about severity.

## Critical Diligence Questions

List the 3–5 most important questions that must be answered before commercial underwriting can be completed. Each question should be specific, answerable from data room materials or management interviews, and directly tied to a risk identified in the assessment. Format as numbered questions only — no preamble.

## 100-Day Commercial Integration Priorities

List the top 3 commercial integration actions that should be planned and resourced before close. Be specific about what needs to happen, who owns it, and why it takes priority. Format as numbered items.

## Integration Risk Rating

One sentence: rate this target's commercial integration complexity as Low / Moderate / Elevated / High, and give the primary reason.

---

Tone: IC memo quality. Credible, direct, no hedging, no filler.`;

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

function parseMemo(text) {
  if (!text) return { summary: "", questions: "", priorities: "", rating: "" };
  const s = {};
  const summIdx = text.indexOf("## Commercial Risk Summary");
  const questIdx = text.indexOf("## Critical Diligence Questions");
  const priorIdx = text.indexOf("## 100-Day Commercial Integration Priorities");
  const rateIdx = text.indexOf("## Integration Risk Rating");
  if (summIdx !== -1 && questIdx !== -1) s.summary = text.slice(summIdx + 26, questIdx).trim();
  if (questIdx !== -1 && priorIdx !== -1) s.questions = text.slice(questIdx + 31, priorIdx).trim();
  if (priorIdx !== -1 && rateIdx !== -1) s.priorities = text.slice(priorIdx + 44, rateIdx).trim();
  if (rateIdx !== -1) s.rating = text.slice(rateIdx + 25).trim();
  return s;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 5 }}>
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ cursor: "help", color: T.textFaint, fontSize: 11, fontFamily: T.mono,
          border: `1px solid ${T.cardBorder}`, borderRadius: "50%", width: 15, height: 15,
          display: "inline-flex", alignItems: "center", justifyContent: "center", background: T.cardBg }}>?</span>
      {show && <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
        background: T.headerBg, border: `1px solid ${T.headerBorder}`, borderRadius: 6, padding: "8px 12px",
        width: 240, fontSize: 12, color: "#94a3b8", lineHeight: 1.55, zIndex: 100, pointerEvents: "none" }}>{text}</div>}
    </span>
  );
}

function QuestionCard({ question, value, onChange }) {
  const rc = riskColor(question.risk);
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${value !== undefined ? T.accentBorder : T.cardBorder}`,
      borderLeft: `3px solid ${value !== undefined ? T.accent : T.cardBorder}`,
      borderRadius: 8, padding: "16px 18px", marginBottom: 10, transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase",
          color: rc, background: value !== undefined ? "transparent" : `${rc}12`,
          border: `1px solid ${rc}33`, borderRadius: 3, padding: "2px 6px", flexShrink: 0, marginTop: 2 }}>
          {question.risk}
        </span>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.textPrimary, lineHeight: 1.55 }}>{question.text}</p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: T.textFaint, flex: 1, lineHeight: 1.3, fontFamily: T.mono }}>{question.low}</span>
        <div style={{ display: "flex", gap: 5 }}>
          {[1, 2, 3, 4].map(v => (
            <button key={v} onClick={() => onChange(v)} style={{
              width: 36, height: 36, borderRadius: 6,
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

const defaultContext = { targetName: "", industry: "B2B SaaS / Software", dealType: "Platform acquisition", dealStage: "Pre-LOI / Early Diligence" };

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function CommercialDiligenceDiagnostic() {
  const [step, setStep] = useState("intro");
  const [activeDim, setActiveDim] = useState(0);
  const [answers, setAnswers] = useState({});
  const [context, setContext] = useState(defaultContext);
  const [generating, setGenerating] = useState(false);
  const [narrative, setNarrative] = useState("");

  const setAnswer = useCallback((qid, val) => setAnswers(p => ({ ...p, [qid]: val })), []);
  const answered = Object.keys(answers).length;
  const overall = computeOverall(answers);
  const dimScores = DIMENSIONS.map(d => ({ label: d.label, score: computeDimScore(d, answers) }));

  const criticalReds = DIMENSIONS.flatMap(d =>
    d.questions.filter(q => q.risk === "critical" && answers[q.id] !== undefined && answers[q.id] <= 2)
  ).length;

  const handleGenerate = async () => {
    setGenerating(true);
    setStep("results");
    try {
      const text = await generateMemo({ ...context, dimScores, overall, answers });
      setNarrative(text);
    } catch (e) {
      setNarrative("Unable to generate memo. Please check your connection and try again.");
    }
    setGenerating(false);
  };

  const parsed = parseMemo(narrative);

  const industries = ["B2B SaaS / Software", "Industrial / Manufacturing", "Professional Services", "Healthcare & Life Sciences", "Financial Services", "Logistics & Supply Chain", "Government & Public Sector", "Consumer / Retail", "Other"];
  const dealTypes = ["Platform acquisition", "Add-on acquisition", "Roll-up target", "Carve-out", "Founder-led buyout", "Corporate divestiture"];
  const dealStages = ["Pre-LOI / Early Diligence", "Post-LOI / Confirmatory Diligence", "Pre-Close / Final Review"];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6560' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px !important; }
        @media print { nav, .no-print { display: none !important; } body { background: white; } }
      `}</style>

      {/* Header */}
      <div style={{ background: T.headerBg, borderBottom: `1px solid ${T.headerBorder}`, padding: "18px 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="/operator" style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 700, color: "#f1f5f9", textDecoration: "none", letterSpacing: "-0.01em" }}>
              Meridian<span style={{ color: T.accent }}>.</span>
            </a>
            <span style={{ color: T.headerBorder, fontSize: 18 }}>·</span>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 2 }}>Pre-Close · Commercial Due Diligence</div>
              <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 600, color: "#cbd5e1" }}>Commercial Diligence Diagnostic</div>
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
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.accent, marginBottom: 14 }}>Pre-Close · Commercial Due Diligence</div>
              <h1 style={{ fontFamily: T.serif, fontSize: 38, fontWeight: 700, color: T.textPrimary, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
                What does this business actually look like to operate?
              </h1>
              <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, marginBottom: 6 }}>
                Standard commercial diligence evaluates what the business has produced. This diagnostic evaluates how hard the business will be to operate and grow post-close — the commercial integration risk that the P&L can't tell you.
              </p>
              <p style={{ fontSize: 14, color: T.textFaint, lineHeight: 1.7 }}>
                25 questions across five dimensions. Output is a structured diligence memo: critical flags, confirmatory diligence questions, and 100-day integration priorities.
              </p>
            </div>

            {/* Dimension overview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
              {DIMENSIONS.map((d, i) => (
                <div key={d.id} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, fontWeight: 600 }}>0{i+1}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{d.label}</span>
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase",
                      color: d.risk === "HIGH" ? T.warning : T.caution,
                      background: d.risk === "HIGH" ? T.warningLight : T.cautionLight,
                      border: `1px solid ${d.risk === "HIGH" ? T.warningBorder : T.cautionBorder}`,
                      borderRadius: 3, padding: "2px 6px" }}>{d.risk} RISK AREA</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: T.textMuted, lineHeight: 1.55 }}>{d.why}</p>
                </div>
              ))}
            </div>

            {/* Context */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "24px 28px", marginBottom: 28 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.cardBorder}` }}>Deal Context</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                {[
                  { key: "targetName", label: "Target Name", type: "text", placeholder: "Optional" },
                  { key: "industry", label: "Industry", type: "select", options: industries },
                  { key: "dealType", label: "Deal Type", type: "select", options: dealTypes },
                  { key: "dealStage", label: "Diligence Stage", type: "select", options: dealStages },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginBottom: 7 }}>{f.label}</label>
                    {f.type === "text"
                      ? <input value={context[f.key]} onChange={e => setContext(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                          style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.cardBorder}`, borderRadius: 6, fontFamily: T.sans, fontSize: 13, color: T.textPrimary, background: T.bg }} />
                      : <select value={context[f.key]} onChange={e => setContext(p => ({ ...p, [f.key]: e.target.value }))}
                          style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.cardBorder}`, borderRadius: 6, fontFamily: T.sans, fontSize: 13, color: T.textPrimary, background: T.bg }}>
                          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    }
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setStep("assess")} style={{ background: T.headerBg, color: "white", border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.sans }}>
              Begin Diagnostic →
            </button>
          </div>
        )}

        {/* ASSESSMENT */}
        {step === "assess" && (
          <div className="fade-up">
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>{answered} / {TOTAL_Q} answered</span>
                {criticalReds > 0 && <span style={{ fontFamily: T.mono, fontSize: 11, color: T.danger }}>{criticalReds} critical flag{criticalReds !== 1 ? "s" : ""}</span>}
              </div>
              <div style={{ background: T.cardBorder, height: 3, borderRadius: 2 }}>
                <div style={{ background: criticalReds > 0 ? T.danger : T.accent, height: "100%", borderRadius: 2, width: `${(answered/TOTAL_Q)*100}%`, transition: "width 0.3s" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}>
              <div style={{ position: "sticky", top: 24 }}>
                {DIMENSIONS.map((d, i) => {
                  const score = computeDimScore(d, answers);
                  const answeredIn = d.questions.filter(q => answers[q.id] !== undefined).length;
                  const critIn = d.questions.filter(q => q.risk === "critical" && answers[q.id] !== undefined && answers[q.id] <= 2).length;
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
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint, marginTop: 2 }}>
                          {answeredIn}/{d.questions.length}
                          {critIn > 0 && <span style={{ color: T.danger, marginLeft: 4 }}>⚠{critIn}</span>}
                        </div>
                      </div>
                      {score !== null && <span style={{ fontFamily: T.mono, fontSize: 11, color: scoreColor(score), fontWeight: 600 }}>{score}</span>}
                    </button>
                  );
                })}
                <button onClick={handleGenerate}
                  disabled={answered < Math.floor(TOTAL_Q * 0.7)}
                  style={{
                    width: "100%", marginTop: 16, padding: "12px",
                    background: answered >= Math.floor(TOTAL_Q * 0.7) ? T.headerBg : "#e0dbd4",
                    color: answered >= Math.floor(TOTAL_Q * 0.7) ? "white" : T.textFaint,
                    border: "none", borderRadius: 6,
                    cursor: answered >= Math.floor(TOTAL_Q * 0.7) ? "pointer" : "not-allowed",
                    fontFamily: T.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600
                  }}>
                  {answered >= Math.floor(TOTAL_Q * 0.7) ? "Generate Memo →" : `${Math.ceil(TOTAL_Q * 0.7) - answered} more needed`}
                </button>
              </div>

              <div key={activeDim}>
                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.cardBorder}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 4 }}>Dimension 0{activeDim+1} · {DIMENSIONS[activeDim].risk} Risk Area</div>
                  <h2 style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 700, color: T.textPrimary, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{DIMENSIONS[activeDim].label}</h2>
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: T.textMuted }}>{DIMENSIONS[activeDim].description}</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.textFaint, lineHeight: 1.6, fontStyle: "italic" }}>{DIMENSIONS[activeDim].why}</p>
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
          <div className="fade-up">
            {/* Report header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>
                  Commercial Diligence Memo · {context.industry} · {context.dealType} · {context.dealStage}
                </div>
                <h1 style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 700, color: T.textPrimary, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                  {context.targetName ? `${context.targetName} · ` : ""}Commercial Diligence Assessment
                </h1>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
              </div>
              <button onClick={() => window.print()} className="no-print" style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "9px 18px", color: T.textMuted, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Print / Save PDF
              </button>
            </div>

            {/* Critical flags banner */}
            {criticalReds > 0 && (
              <div style={{ background: T.dangerLight, border: `1px solid ${T.dangerBorder}`, borderLeft: `3px solid ${T.danger}`, borderRadius: 8, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: T.danger, fontSize: 16, flexShrink: 0 }}>⚠</span>
                <p style={{ margin: 0, fontSize: 13, color: "#991b1b", lineHeight: 1.6 }}>
                  <strong>{criticalReds} critical flag{criticalReds !== 1 ? "s" : ""} identified</strong> — responses scored 1–2 on questions designated as critical integration risk factors. These require resolution or mitigation before commercial underwriting can be completed.
                </p>
              </div>
            )}

            {/* Score overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
              {DIMENSIONS.map(d => {
                const score = computeDimScore(d, answers);
                const s = score || 0;
                return (
                  <div key={d.id} style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderTop: `3px solid ${scoreColor(s)}`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textFaint, marginBottom: 8 }}>{d.short}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 700, color: scoreColor(s), lineHeight: 1, marginBottom: 4 }}>{score !== null ? score : "—"}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: scoreColor(s), textTransform: "uppercase", letterSpacing: "0.06em" }}>{riskLabel(s)}</div>
                  </div>
                );
              })}
            </div>

            {/* Score bars with critical question detail */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Risk Profile by Dimension</div>
              {DIMENSIONS.map(d => {
                const score = computeDimScore(d, answers) || 0;
                const critFlags = d.questions.filter(q => q.risk === "critical" && answers[q.id] !== undefined && answers[q.id] <= 2);
                return (
                  <div key={d.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid #f5f4f2` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>{d.label}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 12, color: scoreColor(score), fontWeight: 600 }}>{score}/100 · {riskLabel(score)}</span>
                    </div>
                    <div style={{ background: "#e0dbd4", height: 5, borderRadius: 3, marginBottom: critFlags.length > 0 ? 8 : 0 }}>
                      <div style={{ background: scoreColor(score), height: "100%", borderRadius: 3, width: `${score}%`, transition: "width 1s ease" }} />
                    </div>
                    {critFlags.map(q => (
                      <div key={q.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 6 }}>
                        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.danger, flexShrink: 0, marginTop: 2 }}>⚠ CRITICAL</span>
                        <span style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.4 }}>{q.text}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Claude memo */}
            {generating ? (
              <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "40px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, border: `3px solid ${T.cardBorder}`, borderTop: `3px solid ${T.accent}`, borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Generating diligence memo...</div>
              </div>
            ) : narrative ? (
              <>
                {parsed.summary && (
                  <div style={{ background: T.headerBg, borderRadius: 10, padding: "24px 28px", marginBottom: 20 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 12 }}>Commercial Risk Summary</div>
                    <p style={{ margin: 0, fontSize: 15, color: "#cbd5e1", lineHeight: 1.8, fontFamily: T.serif }}>{parsed.summary}</p>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {parsed.questions && (
                    <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px 24px" }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 14 }}>Critical Diligence Questions</div>
                      <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.85, whiteSpace: "pre-line" }}>{parsed.questions}</div>
                    </div>
                  )}

                  {parsed.priorities && (
                    <div style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 10, padding: "20px 24px" }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 14 }}>100-Day Integration Priorities</div>
                      <div style={{ fontSize: 13, color: T.accentText, lineHeight: 1.85, whiteSpace: "pre-line" }}>{parsed.priorities}</div>
                    </div>
                  )}
                </div>

                {parsed.rating && (
                  <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderLeft: `3px solid ${scoreColor(overall)}`, borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 6 }}>Integration Risk Rating</div>
                    <p style={{ margin: 0, fontSize: 14, color: T.textPrimary, fontWeight: 500 }}>{parsed.rating}</p>
                  </div>
                )}
              </>
            ) : null}

            {/* Next step CTA */}
            <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px 24px", marginBottom: 28, display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent, marginBottom: 6 }}>Post-Close</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Establish your execution baseline in the first 90 days</div>
                <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>Run the Commercial Execution Diagnostic to benchmark current performance and produce your first board-ready commercial summary.</div>
              </div>
              <a href="/operator/ced" style={{ background: T.headerBg, color: "white", border: "none", borderRadius: 6, padding: "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.sans, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                Run CED →
              </a>
            </div>

            <div className="no-print" style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setStep("assess"); setActiveDim(0); }} style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "10px 20px", color: T.textMuted, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>← Revise Answers</button>
              <button onClick={() => { setAnswers({}); setContext(defaultContext); setNarrative(""); setStep("intro"); }} style={{ background: "none", border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: "10px 20px", color: T.textMuted, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>New Assessment</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${T.cardBorder}`, padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint }}>Meridian · Commercial Intelligence Suite · David Hopper</div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/operator" style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textDecoration: "none" }}>← Meridian Suite</a>
          <a href="https://dahopper.com" style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textDecoration: "none" }}>dahopper.com →</a>
        </div>
      </div>
    </div>
  );
}
