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
  mono: "'DM Mono', monospace", sans: "'Inter', sans-serif",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const dimensions = [
  {
    id: "pipeline", label: "Pipeline Integrity",
    questions: [
      { q: "Stage progression is based on buyer actions, not rep sentiment", low: "Reps advance deals based on gut feel", high: "Stage gates require documented buyer actions" },
      { q: "Forecast accuracy is within 15% of actual closes in a given quarter", low: "Forecasts are routinely off by 30%+", high: "Forecast vs. actual variance is tracked and improving" },
      { q: "Pipeline coverage ratio is measured and acted on by leadership", low: "Coverage is eyeballed informally", high: "3x+ coverage is maintained and managed proactively" },
      { q: "Stale opportunities are reviewed and culled on a defined cadence", low: "Pipeline bloat is chronic; old deals never die", high: "90-day no-activity rule is enforced; pipeline reflects reality" },
    ]
  },
  {
    id: "icp", label: "ICP & Targeting",
    questions: [
      { q: "The ICP is documented with firmographic and behavioral criteria", low: "ICP is tribal knowledge among senior reps", high: "Written ICP with tiered fit criteria is actively maintained" },
      { q: "Disqualification criteria are explicit and applied consistently", low: "We rarely disqualify; every lead gets chased", high: "Reps can articulate why they said no to a deal" },
      { q: "Marketing and sales agree on what a qualified lead looks like", low: "Marketing measures MQLs; sales ignores most of them", high: "Shared MQL definition with a documented SLA and conversion review" },
      { q: "ICP is regularly revisited using closed-won and churned account data", low: "ICP hasn't changed since the last planning cycle", high: "Closed-won analysis informs ICP refinement quarterly" },
    ]
  },
  {
    id: "pricing", label: "Pricing Discipline",
    questions: [
      { q: "List prices are documented and consistently communicated to buyers", low: "Pricing is communicated ad hoc; varies by rep", high: "Price books exist and are enforced as the starting point" },
      { q: "Discounting authority is tiered and requires documentation", low: "Reps discount freely to close; no approval needed", high: "Discount tiers require manager/VP sign-off with a documented rationale" },
      { q: "Win/loss analysis includes deal margin, not just revenue", low: "We measure win rate; margin is a finance problem", high: "Every deal is reviewed for margin; low-margin wins are flagged" },
      { q: "Pricing changes are A/B tested or piloted before full rollout", low: "Pricing changes are made based on competitor intel or gut", high: "Pricing experiments are run with defined success metrics" },
    ]
  },
  {
    id: "attribution", label: "Attribution & Measurement",
    questions: [
      { q: "Marketing investment is tied to pipeline and revenue outcomes", low: "Marketing reports on impressions, clicks, and MQLs", high: "Marketing has a defined pipeline and revenue contribution target" },
      { q: "Lead source attribution is tracked through close", low: "Attribution is lost after the MQL handoff to sales", high: "Multi-touch attribution is tracked from first touch to close" },
      { q: "Campaign ROI is calculated and used to make reinvestment decisions", low: "Campaign spend is based on last year's budget plus a percentage", high: "Campaigns are ranked by ROI; underperformers are cut or restructured" },
      { q: "A/B testing is used regularly to improve conversion rates", low: "Creative and messaging decisions are made by committee", high: "CRO is an ongoing practice with documented learnings" },
    ]
  },
  {
    id: "enablement", label: "Sales Enablement",
    questions: [
      { q: "New reps reach quota attainment target within a defined onboarding window", low: "Ramp time is undefined; new reps figure it out", high: "Structured onboarding with milestone gates and a defined ramp period" },
      { q: "A standard sales methodology is applied consistently across the team", low: "Every rep has their own approach; coaching is ad hoc", high: "A defined methodology is trained and reinforced" },
      { q: "Win/loss reviews are conducted and learnings are shared with the full team", low: "Loss reviews happen occasionally; wins are celebrated, not analyzed", high: "Formal win/loss process with findings shared monthly" },
      { q: "Competitive intelligence is current, accessible, and rep-ready", low: "Reps handle competitive situations on their own", high: "Battlecards are maintained, tested, and updated quarterly" },
    ]
  }
];

const maturityLevels = [
  { min: 0,  max: 25,  label: "Ad Hoc",    color: T.danger,  description: "Commercial operations are informal and founder/rep-dependent. Value leakage is significant and often invisible. The business is growing despite its commercial infrastructure, not because of it." },
  { min: 26, max: 50,  label: "Developing", color: T.warning, description: "Core processes exist but aren't enforced consistently. Revenue is predictable in good quarters but fragile. Leadership has identified the gaps; the organization hasn't yet closed them." },
  { min: 51, max: 75,  label: "Defined",    color: T.accent,  description: "Commercial infrastructure is documented and largely followed. Forecasting is reliable. Marketing and sales are aligned on the basics. The ceiling is execution consistency and measurement rigor." },
  { min: 76, max: 100, label: "Optimized",  color: T.success, description: "The commercial engine is a competitive advantage. Attribution is tight, pricing is disciplined, and the ICP is continuously refined by data. The team is improving the system, not just operating it." },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>{label}</span>
        <span style={{ fontFamily: T.mono, fontSize: 12, color, fontWeight: 600 }}>{score !== null ? `${score}%` : "—"}</span>
      </div>
      <div style={{ background: "#e5e7eb", height: 6, borderRadius: 3 }}>
        {score !== null && (
          <div style={{ background: color, height: "100%", borderRadius: 3, width: `${score}%`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
        )}
      </div>
    </div>
  );
}

export default function CommercialScorecard() {
  const [scores, setScores]   = useState({});
  const [view, setView]       = useState("survey");

  const setScore = (dimId, qIdx, val) => setScores(prev => ({ ...prev, [`${dimId}-${qIdx}`]: val }));
  const getScore = (dimId, qIdx) => scores[`${dimId}-${qIdx}`] ?? null;

  const dimScore = (dim) => {
    const vals = dim.questions.map((_, i) => getScore(dim.id, i)).filter(v => v !== null);
    if (vals.length === 0) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 4)) * 100);
  };

  const totalAnswered  = Object.keys(scores).length;
  const totalQuestions = dimensions.reduce((a, d) => a + d.questions.length, 0);
  const overallScore   = totalAnswered > 0
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / (totalAnswered * 4) * 100)
    : 0;

  const maturity = maturityLevels.find(m => overallScore >= m.min && overallScore <= m.max) || maturityLevels[0];
  const complete = totalAnswered === totalQuestions;

  const weakest = [...dimensions]
    .map(d => ({ ...d, score: dimScore(d) }))
    .filter(d => d.score !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  const improvementGuide = {
    pipeline:    "Start with a pipeline audit and stage-gate criteria. Even a basic buyer-action requirement for stage progression will improve forecast accuracy within one quarter.",
    icp:         "Run a closed-won analysis before touching anything else. The 20% of deals that drove 60%+ of margin will tell you more about your real ICP than any planning session.",
    pricing:     "Begin with a discount audit across 24 months of closed-won data. Identify the pattern before touching list prices.",
    attribution: "Even a basic first-touch/last-touch model beats no model. Start there before investing in multi-touch infrastructure.",
    enablement:  "Ramp time and methodology consistency are the first two levers. Define what 'ramped' means before adding headcount.",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.sans, color: T.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ background: T.headerBg, padding: "20px 40px", borderBottom: `1px solid ${T.headerBorder}` }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 5 }}>
              Commercial Infrastructure · Self-Assessment
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              Commercial Maturity Scorecard
            </h1>
            <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: 13 }}>
              20 questions · 5 dimensions · ~8 minutes
            </p>
          </div>
          <div style={{ display: "flex", gap: 1, background: T.headerBorder, borderRadius: 7, padding: 2 }}>
            {[{ v: "survey", l: "Assessment" }, { v: "results", l: "Results" }].map(tab => (
              <button key={tab.v} onClick={() => setView(tab.v)} style={{
                padding: "8px 16px", background: view === tab.v ? "#1e293b" : "transparent",
                border: "none", borderRadius: 5, cursor: "pointer",
                fontFamily: T.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                color: view === tab.v ? "#f1f5f9" : "#94a3b8", transition: "all 0.15s"
              }}>{tab.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 40px 80px" }}>

        {view === "survey" && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>{totalAnswered} / {totalQuestions} answered</span>
                {complete && <span style={{ fontFamily: T.mono, fontSize: 11, color: T.success, fontWeight: 600 }}>✓ Complete</span>}
              </div>
              <div style={{ background: "#e5e7eb", height: 3, borderRadius: 2 }}>
                <div style={{ background: T.accent, height: "100%", borderRadius: 2, width: `${(totalAnswered / totalQuestions) * 100}%`, transition: "width 0.3s" }} />
              </div>
            </div>

            {dimensions.map(dim => (
              <div key={dim.id} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${T.cardBorder}` }}>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.textPrimary }}>{dim.label}</h2>
                  {dimScore(dim) !== null && (
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, fontWeight: 600 }}>{dimScore(dim)}%</span>
                  )}
                </div>

                {dim.questions.map((q, i) => {
                  const val = getScore(dim.id, i);
                  return (
                    <div key={i} style={{
                      background: T.cardBg,
                      border: `1px solid ${val !== null ? T.accentBorder : T.cardBorder}`,
                      borderLeft: `3px solid ${val !== null ? T.accent : T.cardBorder}`,
                      borderRadius: 8, padding: "16px 18px", marginBottom: 10,
                      transition: "border-color 0.2s"
                    }}>
                      <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 500, color: T.textPrimary, lineHeight: 1.5 }}>{q.q}</p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: T.textFaint, flex: 1, lineHeight: 1.3 }}>{q.low}</span>
                        <div style={{ display: "flex", gap: 5 }}>
                          {[1, 2, 3, 4].map(v => (
                            <button key={v} onClick={() => setScore(dim.id, i, v)} style={{
                              width: 36, height: 36, borderRadius: 6,
                              background: val === v ? T.accent : val !== null && v <= val ? T.accentLight : "#f9fafb",
                              color: val === v ? "white" : val !== null && v <= val ? T.accentText : T.textMuted,
                              border: val === v ? `2px solid ${T.accent}` : `2px solid ${T.cardBorder}`,
                              fontWeight: 700, fontSize: 13, cursor: "pointer",
                              transition: "all 0.15s", fontFamily: T.mono
                            }}>{v}</button>
                          ))}
                        </div>
                        <span style={{ fontSize: 11, color: T.textFaint, flex: 1, textAlign: "right", lineHeight: 1.3 }}>{q.high}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {complete && (
              <button onClick={() => setView("results")} style={{
                width: "100%", background: T.accent, color: "white", border: "none",
                borderRadius: 8, padding: "14px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: T.sans, letterSpacing: "0.02em"
              }}>
                View Results →
              </button>
            )}
          </div>
        )}

        {view === "results" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {totalAnswered < 4 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: T.textMuted }}>
                <p style={{ fontSize: 15 }}>Complete at least one dimension in the Assessment tab to see results.</p>
                <button onClick={() => setView("survey")} style={{ marginTop: 16, background: T.accent, color: "white", border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600 }}>
                  Go to Assessment →
                </button>
              </div>
            ) : (
              <>
                {/* Overall */}
                <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderTop: `3px solid ${maturity.color}`, borderRadius: 10, padding: "24px 28px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", gap: 28, alignItems: "center" }}>
                  <div style={{ textAlign: "center", minWidth: 80 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 48, fontWeight: 800, color: maturity.color, lineHeight: 1 }}>{overallScore}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>Score</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: maturity.color, marginBottom: 6 }}>Maturity Level</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>{maturity.label}</div>
                    <p style={{ margin: 0, color: T.textMuted, fontSize: 13, lineHeight: 1.65 }}>{maturity.description}</p>
                  </div>
                </div>

                {/* Dimension bars */}
                <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Dimension Breakdown</div>
                  {dimensions.map(dim => {
                    const s = dimScore(dim);
                    if (s === null) return null;
                    const color = s >= 76 ? T.success : s >= 51 ? T.accent : s >= 26 ? T.warning : T.danger;
                    return <ScoreBar key={dim.id} label={dim.label} score={s} color={color} />;
                  })}
                </div>

                {/* Improvement areas */}
                {weakest.length > 0 && (
                  <div style={{ background: T.warningLight, border: `1px solid ${T.warningBorder}`, borderLeft: `3px solid ${T.warning}`, borderRadius: 10, padding: "20px 24px", marginBottom: 20 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.warning, marginBottom: 16 }}>
                      Highest-Leverage Improvement Areas
                    </div>
                    {weakest.map(dim => (
                      <div key={dim.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.warningBorder}` }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: T.textPrimary, marginBottom: 6 }}>
                          {dim.label} · {dim.score}%
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: T.textSecondary, lineHeight: 1.65 }}>
                          {improvementGuide[dim.id]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${T.cardBorder}` }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textFaint }}>David Hopper · Commercial Operations</span>
                  <button onClick={() => setView("survey")} style={{ background: "none", border: "none", color: T.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.sans }}>← Revise answers</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
