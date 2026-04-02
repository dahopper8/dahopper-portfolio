import { useState } from "react";

const teardowns = [
  {
    id: "pe-manufacturer",
    label: "PE-Backed Manufacturer",
    subtitle: "$200–800M revenue, 3–7 years post-acquisition",
    company: "Archetype: Apex Industrial Holdings",
    situation: `Apex Industrial Holdings is a $450M PE-backed manufacturer of specialty coating equipment, acquired by a mid-market fund four years ago. The fund's thesis was operational improvement and international expansion. Revenue has grown 18% since acquisition — mostly through a bolt-on — but EBITDA margin has compressed 200bps. The new CFO has flagged "commercial inefficiency" as the primary drag.`,
    diagnosis: [
      {
        title: "The pipeline is a forecast, not a funnel",
        detail: "Apex's CRM holds 340 open opportunities. 60% have had no activity in 90+ days. Stage progression is manual and optimistic — reps advance deals when they feel good about them, not when buyers take action. The result is a pipeline that tells leadership what they want to hear until Q4, when everything compresses into a desperate close quarter."
      },
      {
        title: "Sales and marketing operate in separate buildings (metaphorically)",
        detail: "Marketing generates leads by volume. Sales ignores most of them. There's no agreed ICP definition, no lead scoring, and no SLA between functions. Marketing measures MQLs. Sales measures closed revenue. Nobody measures the conversion between them, which means nobody owns the gap — and the gap is where most of the value leaks."
      },
      {
        title: "Pricing is institutional memory, not a system",
        detail: "Apex's pricing lives in the heads of three senior reps and a 2019 Excel model. Discounting authority is informal. Two reps consistently close at 8–12% below list; nobody knows why, and nobody has analyzed whether those deals are profitable. The PE sponsor is sitting on a pricing lever they haven't pulled because nobody has built the infrastructure to pull it safely."
      },
      {
        title: "The acquisition hasn't been integrated commercially",
        detail: "The bolt-on acquired 18 months ago brought a complementary product line and a regional sales team. Those reps still sell the old product exclusively. Cross-sell rate is near zero. The combined ICP — a larger, more complex buyer — hasn't been defined, and no one has built the motion to reach them."
      }
    ],
    fix90: [
      {
        days: "Days 1–30",
        color: "#E85D26",
        actions: [
          "Pipeline audit: export all open opps, categorize by last activity, stage velocity, and rep. Kill or quarantine anything stale. Build a real number.",
          "Define the ICP jointly with sales leadership — not a committee document, a one-pager with three firmographic tiers and a disqualification checklist.",
          "Pull 24 months of closed-won data and identify the 20% of deals that drove 60%+ of margin. That's the real ICP."
        ]
      },
      {
        days: "Days 31–60",
        color: "#EAB308",
        actions: [
          "Implement stage-gate criteria in CRM — deals can't advance without a defined buyer action (not rep opinion). Forecast immediately becomes more honest.",
          "Stand up a weekly deal review cadence with a standard template: stage, next buyer action, blockers, close date confidence. Takes 45 minutes. Surfaces reality fast.",
          "Audit the bottom 15% of deals by margin. Identify the discount pattern. Build a pricing authorization matrix — not to eliminate discounting, but to make it visible and intentional."
        ]
      },
      {
        days: "Days 61–90",
        color: "#2EC27E",
        actions: [
          "Build the cross-sell motion: map the combined ICP, identify the 50 best existing customers for the bolt-on product, and create a targeted outreach sequence.",
          "Establish a marketing-to-sales SLA: define MQL criteria, response time commitment, and a monthly conversion review. Marketing starts optimizing for pipeline quality, not lead volume.",
          "Present a 90-day commercial diagnostic to the board: here's where value is leaking, here's the infrastructure we're building, here's the 12-month trajectory."
        ]
      }
    ],
    wouldDoDifferently: "I'd move faster on the pricing audit. It feels risky to touch pricing before you understand the full picture, but the picture gets clearer faster when you start pulling on that thread. In every PE-backed commercial transformation I've been part of, pricing discipline delivered the fastest margin impact — and the delay was always fear of disrupting reps, not lack of data."
  },
  {
    id: "saas-cs",
    label: "High-Growth B2B SaaS",
    subtitle: "Series C/D, $50–150M ARR, scaling CS org",
    company: "Archetype: Meridian Analytics",
    situation: `Meridian Analytics is a $90M ARR B2B SaaS company in the data observability space, recently closed a $75M Series D. They have 4,500 customers, a 107% NRR, and a CS team that grew from 8 to 34 people in 18 months. The board's top concern: NRR is flattening and CAC payback has stretched to 28 months. The SVP of CS is new, 90 days in, and the org she inherited was built for a different scale.`,
    diagnosis: [
      {
        title: "CS is doing support's job and nobody budgeted for it",
        detail: "Meridian's CSMs spend an estimated 40% of their time on reactive tickets, onboarding questions, and basic how-to requests — work that belongs in support or a digital self-serve layer. This isn't a people problem; it's a handoff design problem. The boundary between CS and support was never defined at the previous scale, and now it's consuming the expansion capacity the business desperately needs."
      },
      {
        title: "Health scoring is measuring activity, not risk",
        detail: "Gainsight is live but configured around CSM-touch metrics: number of calls, last login, QBR completed. These measure whether the CSM did their job, not whether the customer is getting value. The accounts that churn surprise everyone because they were 'green' in the system — they had regular calls, they just weren't making progress toward their original business case."
      },
      {
        title: "Expansion is accidental, not systematic",
        detail: "Meridian's 107% NRR is real, but it's concentrated in the top 15% of accounts — enterprise customers who expanded organically as their data environments grew. The mid-market segment, which is 55% of the customer base, has a sub-100% NRR. There's no defined expansion motion, no trigger-based playbook, and no clear handoff from CS to sales when an account is ready for a commercial conversation."
      },
      {
        title: "Onboarding doesn't create the outcome it promises",
        detail: "Time-to-first-value averages 47 days. Industry benchmark for comparable tools is 14–21 days. The onboarding process was designed when Meridian had 200 customers and a dedicated implementation team. At 4,500 customers it's a bottleneck. Customers who don't see value in 30 days churn at 3x the rate of customers who do — and Meridian is losing that race in nearly half of new accounts."
      }
    ],
    fix90: [
      {
        days: "Days 1–30",
        color: "#E85D26",
        actions: [
          "Audit all CSM time allocation for two weeks — actual time, not estimates. Categorize every activity as: expansion-oriented, relationship-oriented, or reactive/support. The number will be uncomfortable. That's the point.",
          "Pull the churn cohort for the last 12 months and build a pre-churn health profile: what did these accounts look like 90 days before they churned? That's the real health score input.",
          "Map the current onboarding journey end-to-end. Identify every handoff, every delay, and every step that requires a human when it shouldn't."
        ]
      },
      {
        days: "Days 31–60",
        color: "#EAB308",
        actions: [
          "Redesign health scoring around outcome proximity, not activity: Is the customer using the features tied to their stated business case? Are they achieving the benchmarks from the sales process? Are their key users active?",
          "Define the CS/support boundary explicitly. Build a tiered support model — digital self-serve for how-to, support for technical issues, CS for business outcomes and expansion. Start redirecting reactive work within 60 days.",
          "Identify the 200 mid-market accounts most likely to expand based on product usage and company growth signals. Assign them a dedicated expansion motion — not a CSM check-in, a commercial play."
        ]
      },
      {
        days: "Days 61–90",
        color: "#2EC27E",
        actions: [
          "Launch a redesigned onboarding track for new customers: milestone-gated, outcome-focused, with a hard 21-day time-to-first-value target. Instrument it so you know exactly where customers are slowing down.",
          "Build a CS-to-Sales expansion handoff protocol: trigger criteria, warm intro process, compensation alignment. Expansion shouldn't feel like an interruption to the customer relationship — it should feel like a natural next step.",
          "Present a full CS operations diagnostic to the SVP and board: NRR bridge by segment, churn root cause analysis, and a 12-month roadmap with leading indicators that predict NRR 90 days out."
        ]
      }
    ],
    wouldDoDifferently: "I'd involve the product team earlier. CS ops transformations that don't loop in product end up building workarounds for gaps that product could close permanently. The onboarding bottleneck at Meridian almost certainly has a product component — features that could be self-serve, in-app guidance that doesn't exist, activation logic that requires human explanation. The ops fix buys time; the product fix scales."
  }
];

export default function GTMTeardown() {
  const [active, setActive] = useState(0);
  const t = teardowns[active];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf7f2",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#1a1a1a"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Sans+3:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{
        background: "#1a1a1a",
        padding: "32px 48px 28px",
        borderBottom: "4px solid #E85D26"
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E85D26", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>
            Commercial Diagnostics · Field Notes
          </div>
          <h1 style={{
            margin: "0 0 8px", fontSize: 36, fontWeight: 800, color: "#faf7f2",
            fontFamily: "'Playfair Display', serif", lineHeight: 1.15, letterSpacing: "-0.01em"
          }}>
            GTM Operating Model Teardown
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.5 }}>
            What's actually broken, why it's broken, and what a strong operator fixes first.
          </p>
        </div>
      </div>

      {/* Selector */}
      <div style={{ background: "#f0ebe3", borderBottom: "1px solid #e0d8cc" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 48px", display: "flex", gap: 0 }}>
          {teardowns.map((td, i) => (
            <button
              key={td.id}
              onClick={() => setActive(i)}
              style={{
                background: "none", border: "none", padding: "16px 20px",
                cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13, fontWeight: active === i ? 700 : 500,
                color: active === i ? "#1a1a1a" : "#64748b",
                borderBottom: active === i ? "3px solid #E85D26" : "3px solid transparent",
                transition: "all 0.15s",
                textAlign: "left"
              }}
            >
              <div>{td.label}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400, marginTop: 1 }}>{td.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 48px 80px", animation: "fadeIn 0.3s ease both" }} key={active}>

        {/* Company header */}
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#E85D26", marginBottom: 12
        }}>{t.company}</div>

        {/* Situation */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
            The Situation
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, lineHeight: 1.75, color: "#374151", margin: 0 }}>
            {t.situation}
          </p>
        </section>

        <div style={{ width: 40, height: 3, background: "#E85D26", marginBottom: 40 }} />

        {/* Diagnosis */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: "0 0 24px", letterSpacing: "-0.01em" }}>
            The Diagnosis
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {t.diagnosis.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 20 }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 22,
                  color: "#e0d8cc", fontWeight: 500, lineHeight: 1,
                  minWidth: 32, paddingTop: 4
                }}>0{i + 1}</div>
                <div>
                  <h3 style={{
                    fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700,
                    fontSize: 15, margin: "0 0 8px", color: "#111"
                  }}>{d.title}</h3>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif", fontSize: 14,
                    lineHeight: 1.75, color: "#4b5563", margin: 0
                  }}>{d.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ width: 40, height: 3, background: "#E85D26", marginBottom: 40 }} />

        {/* 90-day fix */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: "0 0 24px", letterSpacing: "-0.01em" }}>
            What I'd Fix First: The 90-Day Plan
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {t.fix90.map((phase, i) => (
              <div key={i} style={{
                borderLeft: `4px solid ${phase.color}`,
                paddingLeft: 20
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: phase.color, marginBottom: 12, fontWeight: 500
                }}>{phase.days}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {phase.actions.map((a, j) => (
                    <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: phase.color, marginTop: 4, fontSize: 8, flexShrink: 0 }}>◆</span>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, lineHeight: 1.65, color: "#374151", margin: 0 }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ width: 40, height: 3, background: "#E85D26", marginBottom: 40 }} />

        {/* What I'd do differently */}
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
            What I'd Do Differently the Second Time
          </h2>
          <blockquote style={{
            margin: 0,
            borderLeft: "4px solid #e0d8cc",
            paddingLeft: 20,
            fontStyle: "italic",
            fontFamily: "'Georgia', serif",
            fontSize: 15, lineHeight: 1.75, color: "#4b5563"
          }}>
            {t.wouldDoDifferently}
          </blockquote>
        </section>

        <div style={{
          marginTop: 56, paddingTop: 24,
          borderTop: "1px solid #e0d8cc",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#94a3b8" }}>
            David Hopper · Commercial Operations & Transformation
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#c9bfb3" }}>
            Field Notes Series
          </span>
        </div>
      </div>
    </div>
  );
}
