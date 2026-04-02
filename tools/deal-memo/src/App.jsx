import { useState } from "react";

const cases = [
  {
    id: "playcore",
    label: "Commercial Infrastructure Build",
    tag: "PE-Backed Manufacturing · B2B/B2G",
    company: "Disguised composite · PE-backed manufacturing portfolio company · $400–600M revenue",
    headline: "From Activity-Driven to Outcome-Driven: Building a Commercial Engine in a PE-Backed Manufacturer",
    tldr: "A portfolio company with strong product and brand equity had built its revenue on relationships and inbound momentum. When organic growth stalled, the PE sponsor identified commercial infrastructure — not product or talent — as the primary constraint. This is the story of what we built, what broke, and what I'd do differently.",
    sections: [
      {
        label: "01 · Situation",
        content: [
          "The company had grown to $400M+ in revenue over two decades on the strength of a dominant market position, a well-regarded product portfolio, and a sales team with deep customer relationships. Win rates on contested opportunities were strong. The problem was that the contested opportunity set was shrinking.",
          "The business had no systematic way to identify prospects before they issued an RFP. Marketing measured impressions and trade show attendance. Sales tracked open opportunities but had no visibility into pre-funnel accounts. The CRM held 18 months of data but had never been used to answer a strategic question. Pipeline reviews were status updates, not analytical conversations.",
          "Revenue growth had averaged 4% annually over the prior three years — below the PE sponsor's 8–10% target. The sponsor's operating partner framed the problem clearly in the first board conversation I observed: 'We have a great business that doesn't know how to grow on purpose.'"
        ]
      },
      {
        label: "02 · Diagnosis",
        content: [
          "I spent the first 30 days doing three things: riding along on sales calls, pulling every closed-won deal from the prior 24 months, and interviewing the 12 highest-performing reps about how they actually found and closed business.",
          "The closed-won analysis was clarifying. 68% of revenue in the prior two years had come from existing accounts or inbound inquiries. Of the remaining 32% — true new business — 80% had come from six reps. Those six reps had an informal but consistent practice: they tracked municipal budget cycles, monitored capital improvement plan filings, and maintained relationships with park directors and facilities managers before any active procurement. They were working a priming window. The other 24 reps were waiting for RFPs.",
          "The CRM diagnosis was equally stark. 340 open opportunities, 60% with no activity in 90 days. Stage progression was optimistic and manual. There was no ICP definition, no lead scoring, no SLA between marketing and sales. Marketing was generating leads that sales was ignoring, and neither function had a shared metric that would surface the problem.",
          "Pricing was the third gap. List prices existed but weren't enforced. Discounting authority was informal. Two reps consistently closed 10–12% below list; analysis showed those deals were marginally profitable at best. The PE sponsor had identified pricing as a lever but hadn't touched it because there was no infrastructure to pull it safely."
        ]
      },
      {
        label: "03 · Intervention",
        content: [
          "We structured the intervention in three sequential phases, each with a defined outcome that gated the next phase.",
          "Phase 1 (months 1–3): Pipeline integrity. We implemented stage-gate criteria requiring documented buyer actions for progression. We ran a pipeline audit that reduced the stated pipeline by 31% — a painful conversation with leadership that became a credibility-builder when the revised forecast proved accurate. We defined an ICP jointly with sales leadership: three firmographic tiers with explicit disqualification criteria.",
          "Phase 2 (months 4–8): Signal-based prospecting. We built a trigger monitoring system for the public-sector segment — the largest vertical — that tracked municipal budget cycles, capital improvement plan filings, bond measure outcomes, and parks department leadership changes. We identified 340 target accounts in the priming window across 12 states and built a sequenced outreach motion for each tier. We established a marketing-to-sales SLA with a shared pipeline contribution metric that aligned both functions for the first time.",
          "Phase 3 (months 9–14): Pricing discipline. We conducted a discount audit across 24 months of closed-won data. We built a pricing authorization matrix with tiered approval requirements and a required rationale field. We piloted a 4% list price increase in two regions with full rep training and objection-handling support before national rollout.",
          "Throughout all three phases, we ran a weekly commercial operating rhythm: a 45-minute deal review with a standard template, a monthly pipeline quality review with marketing, and a quarterly commercial diagnostic for the board."
        ]
      },
      {
        label: "04 · Results",
        content: [
          "By month 18, new business pipeline from the signal-based prospecting motion had reached $28M — representing accounts that had not previously been in any sales process. Conversion from priming window identification to active opportunity averaged 14 months, consistent with our model.",
          "Forecast accuracy improved from a trailing average of ±28% variance to ±11% by Q3 of the intervention. The pipeline audit and stage-gate implementation drove the initial improvement; the shared MQL/pipeline SLA sustained it.",
          "The pricing initiative delivered 180bps of margin improvement in the first full year of implementation, against a PE target of 150bps. Rep resistance was significant in the first quarter; by Q2, the reps who had been most resistant had internalized the authorization process and reported that it actually helped them defend price with buyers.",
          "Revenue growth accelerated from 4% to 9% in the 18 months following full implementation — driven roughly equally by new business and expansion within existing accounts."
        ]
      },
      {
        label: "05 · What Broke",
        content: [
          "The signal-based prospecting system was more brittle than anticipated. It depended on data sources — municipal budget databases, capital plan filings — that were inconsistently formatted and frequently out of date. We spent more time on data hygiene than on outreach in the first two months. If I were rebuilding this today, I would start with a commercial data vendor rather than attempting to build a proprietary scraping solution.",
          "The pricing authorization matrix created a bottleneck. VP approval was required for discounts above 8%, and in the first quarter, approval requests were taking 3–5 days. Two deals slipped because of it. We resolved this by moving to a same-day SLA for standard requests and building a pre-approved discount framework for common deal structures — but we should have anticipated the throughput problem at design.",
          "We underinvested in change management for the CRM stage-gate implementation. The logic was sound; the rollout wasn't. Reps perceived it as surveillance rather than as a tool that would make their forecasts more defensible. A more structured adoption campaign — with rep-level success stories and early-adopter recognition — would have compressed the resistance period."
        ]
      },
      {
        label: "06 · What I'd Do Differently",
        content: [
          "Move faster on the closed-won analysis. I ran it in week three, but I should have run it in day two. The six-rep insight — that the top performers were already working a priming window — reframed the entire strategy. If I'd had that insight at day two instead of week three, the intervention design would have been better from the start. The data to make a good decision was sitting in the CRM. The delay was a prioritization error.",
          "Build the board narrative earlier. We presented a commercial diagnostic at month four. It was well-received. In retrospect, I should have done a preliminary diagnostic at month six weeks — not to have answers, but to establish the analytical frame and signal to the sponsor that this would be a data-driven transformation. PE sponsors are more patient with interventions they helped frame than with ones that arrive fully formed.",
          "Separate the pricing initiative from the pipeline work. We ran them concurrently starting in month four, which created change fatigue in the sales organization. Both initiatives required rep behavior change. Running them sequentially — pipeline integrity first, pricing second — would have been slower on paper but faster in practice."
        ]
      }
    ]
  }
];

export default function DealMemo() {
  const [activeSection, setActiveSection] = useState(0);
  const c = cases[0];

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Sans+3:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Masthead */}
      <div style={{ background: "#1a1a18", borderBottom: "3px solid #c8a96e", padding: "0 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e" }}>
            Field Case Studies · Commercial Transformation
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#3a3a36", letterSpacing: "0.1em" }}>
            David Hopper · dahopper@gmail.com
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "#1a1a18", padding: "52px 48px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8a96e", background: "#c8a96e18", border: "1px solid #c8a96e33", borderRadius: 4, padding: "4px 10px" }}>
              {c.tag}
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a4a44", border: "1px solid #2a2a26", borderRadius: 4, padding: "4px 10px" }}>
              Composite · Disguised
            </span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "#f0ede6", margin: "0 0 20px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            {c.headline}
          </h1>
          <div style={{ background: "#111110", border: "1px solid #2a2a26", borderLeft: "3px solid #c8a96e", borderRadius: 6, padding: "16px 20px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 8 }}>TL;DR</div>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#a8a49c", margin: 0, lineHeight: 1.65 }}>{c.tldr}</p>
          </div>
          <div style={{ marginTop: 16, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#3a3a36" }}>{c.company}</div>
        </div>
      </div>

      {/* Nav + Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px" }}>
        {/* Section nav */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e8e4dc", marginBottom: 0, overflowX: "auto" }}>
          {c.sections.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)} style={{
              background: "none", border: "none", padding: "16px 18px",
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: activeSection === i ? "#1a1a18" : "#9a9690",
              borderBottom: activeSection === i ? "2px solid #c8a96e" : "2px solid transparent",
              cursor: "pointer", whiteSpace: "nowrap",
              fontWeight: activeSection === i ? 600 : 400,
              transition: "all 0.15s"
            }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div style={{ padding: "40px 0 80px", animation: "fadeIn 0.3s ease both" }} key={activeSection}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a18", margin: "0 0 28px", letterSpacing: "-0.01em" }}>
            {c.sections[activeSection].label.split(" · ")[1]}
          </h2>
          {c.sections[activeSection].content.map((para, i) => (
            <p key={i} style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: 16,
              lineHeight: 1.85, color: "#3a3530", margin: "0 0 24px"
            }}>{para}</p>
          ))}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #e8e4dc" }}>
            <button
              onClick={() => setActiveSection(i => Math.max(0, i - 1))}
              disabled={activeSection === 0}
              style={{
                background: "none", border: "1px solid #e8e4dc", borderRadius: 6,
                padding: "10px 18px", fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13, fontWeight: 600, color: activeSection === 0 ? "#ccc" : "#3a3530",
                cursor: activeSection === 0 ? "default" : "pointer"
              }}
            >← Previous</button>

            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#9a9690", alignSelf: "center" }}>
              {activeSection + 1} / {c.sections.length}
            </span>

            <button
              onClick={() => setActiveSection(i => Math.min(c.sections.length - 1, i + 1))}
              disabled={activeSection === c.sections.length - 1}
              style={{
                background: activeSection === c.sections.length - 1 ? "none" : "#1a1a18",
                border: "1px solid #1a1a18", borderRadius: 6,
                padding: "10px 18px", fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13, fontWeight: 600,
                color: activeSection === c.sections.length - 1 ? "#ccc" : "#f0ede6",
                cursor: activeSection === c.sections.length - 1 ? "default" : "pointer"
              }}
            >Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
