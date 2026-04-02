export default function PrimingWindowThesis() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e0e0e",
      fontFamily: "'Georgia', serif",
      color: "#e8e0d4"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .pullquote { font-family: 'Playfair Display', serif; font-style: italic; font-size: 22px; line-height: 1.5; color: #E85D26; border-left: 3px solid #E85D26; padding-left: 24px; margin: 40px 0; }
        .body-text { font-family: 'Source Sans 3', sans-serif; font-size: 16px; line-height: 1.85; color: #b8b0a4; margin: 0 0 24px; }
        .section-hed { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #e8e0d4; margin: 40px 0 16px; letter-spacing: -0.01em; }
        .signal-card { background: #161616; border: 1px solid #2a2a2a; border-left: 3px solid #E85D26; border-radius: 8px; padding: 16px 20px; margin-bottom: 12px; }
        .signal-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #E85D26; margin-bottom: 6px; }
        .signal-title { font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 700; color: #e8e0d4; margin-bottom: 4px; }
        .signal-desc { font-family: 'Source Sans 3', sans-serif; font-size: 13px; color: #6b6560; line-height: 1.55; margin: 0; }
        .table-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: #2a2a2a; }
        .table-cell { background: #0e0e0e; padding: 12px 16px; font-family: 'Source Sans 3', sans-serif; font-size: 13px; color: #b8b0a4; line-height: 1.5; }
        .table-header { background: #161616 !important; font-weight: 700; color: #e8e0d4; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Hero */}
      <div style={{ borderBottom: "1px solid #1e1e1e", padding: "60px 48px 48px", background: "linear-gradient(180deg, #111 0%, #0e0e0e 100%)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", animation: "fadeIn 0.6s ease" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E85D26", marginBottom: 20 }}>
            Commercial Strategy · Original Thesis
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900,
            margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#f0e8dc"
          }}>
            The Priming Window
          </h1>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: 22, color: "#6b6560", margin: "0 0 28px", lineHeight: 1.4
          }}>
            Most B2B sales teams show up when a buyer is already shopping. The real opportunity is the 6–12 months before they know they need to.
          </p>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: "#4a4540" }}>
              David Hopper · Commercial Operations & Strategy
            </div>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#2a2a2a" }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4a4540" }}>
              ~8 min read
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 48px 100px", animation: "fadeIn 0.8s ease" }}>

        <p className="body-text">
          Most B2B sales teams are running a reactive motion disguised as a proactive one. They call it pipeline — but what they're really doing is competing in the same window as every other vendor who showed up after the RFP went out, after the champion posted the evaluation criteria on LinkedIn, after the budget was already earmarked for a decision.
        </p>

        <p className="body-text">
          There's a different window. I've come to call it the priming window: the period — typically 6 to 18 months before a formal buying process begins — when the conditions that will drive a purchase are forming, but the buyer hasn't yet framed it as a purchase decision. They're experiencing friction. They're losing people. They're growing faster than their infrastructure. They're about to get a new boss with a different philosophy.
        </p>

        <p className="body-text">
          The team that reaches them in this window doesn't compete on the RFP. They wrote it.
        </p>

        <div className="pullquote">
          The team that reaches a buyer in the priming window doesn't compete on the RFP. They wrote it.
        </div>

        <h2 className="section-hed">Why the Window Exists</h2>

        <p className="body-text">
          B2B buying processes have a well-documented structure: a trigger event creates organizational pain, internal consensus builds around a solution category, a formal evaluation begins, vendors are shortlisted, and a decision is made. Most sales and marketing investment concentrates at the bottom of this funnel — SEO to capture intent, SDRs to respond to inbound, AEs to run demos for buyers already in process.
        </p>

        <p className="body-text">
          But the trigger event doesn't come from nowhere. Before a company "decides" to replace their CRM, their commercial ops leader has been frustrated with it for eight months. Before a manufacturer launches an RFP for a new GTM partner, their VP of Sales has been making excuses to the board for two quarters. Before a SaaS company starts evaluating CS platforms, their NRR has been declining for a year and their CS team headcount has doubled with no corresponding improvement in outcomes.
        </p>

        <p className="body-text">
          These pre-trigger conditions are observable. They leave signals. And they are almost entirely ignored by sales teams optimizing for near-term pipeline.
        </p>

        <h2 className="section-hed">What the Signals Look Like</h2>

        <p className="body-text" style={{ marginBottom: 20 }}>
          The priming window isn't invisible — it's just not where most teams are looking. Across several commercial transformations, I've identified five reliable signal categories that consistently precede buying activity by 6–18 months:
        </p>

        {[
          { label: "Leadership Change", title: "A new executive in a decision-relevant role", desc: "New VPs of Sales, Marketing, CS, and Operations are the single most reliable buying signal in B2B. They arrive with mandates. They benchmark their inherited infrastructure against best-in-class. They have 90 days to establish credibility with their board. They buy." },
          { label: "Growth Inflection", title: "Revenue or headcount crossing a structural threshold", desc: "Companies that double in size often find their existing infrastructure was built for a different business. The CRM, the CS platform, the sales motion — none of it scales linearly. Growth doesn't cause buying decisions; it reveals the cost of deferred infrastructure investment." },
          { label: "Acquisition or Restructuring", title: "M&A, divestitures, or major reorganizations", desc: "Post-acquisition integration creates a forced rationalization of commercial systems. Two CRMs become one. Two CS teams merge. Two pricing models need reconciliation. The first 18 months after a transaction are among the most active commercial buying windows in any company's lifecycle." },
          { label: "Performance Decline Signal", title: "A lagging metric that precedes a recognized problem", desc: "NRR compression, win rate decline, elongating sales cycles, rising CAC — these metrics deteriorate visibly before leadership names them as problems. If you can identify them in public filings, earnings calls, job postings, or industry benchmarks, you're reading the problem before it's been acknowledged internally." },
          { label: "Technology Transition", title: "A platform migration or stack rationalization", desc: "When a company migrates from on-prem to cloud, or consolidates from a fragmented martech stack, adjacent buying decisions follow. Technology transitions expose integration gaps, capability gaps, and workflow gaps simultaneously. They create a buying environment where inertia is already broken." }
        ].map((s, i) => (
          <div key={i} className="signal-card">
            <div className="signal-label">{`0${i + 1} · ${s.label}`}</div>
            <div className="signal-title">{s.title}</div>
            <p className="signal-desc">{s.desc}</p>
          </div>
        ))}

        <h2 className="section-hed">The Operationalization Problem</h2>

        <p className="body-text">
          The reason most teams don't work the priming window isn't that they don't believe it exists. It's that their commercial infrastructure isn't built for it.
        </p>

        <p className="body-text">
          Quota attainment is measured quarterly. Pipeline coverage ratios are built on 90-day demand. Marketing campaigns are optimized for form fills, not for relationships built 12 months before a decision. SDR compensation is tied to meetings booked, not to accounts developed. The entire operating model rewards fishing downstream.
        </p>

        <p className="body-text">
          Priming window strategy requires a different architecture. It requires an account selection model that can identify pre-trigger accounts from firmographic and signal data. It requires content and outreach designed to provide value to a buyer who doesn't know they're a buyer yet. It requires CSMs and AEs who are compensated — even partially — for developing accounts over longer horizons. And it requires leadership that can hold the tension between this quarter's number and next year's pipeline.
        </p>

        <div className="pullquote">
          Priming window strategy requires a different architecture. The entire operating model rewards fishing downstream.
        </div>

        <h2 className="section-hed">What It Looks Like in Practice</h2>

        <p className="body-text">
          At PlayCore, we built a timing-based prospect system that tracked a specific set of signals across our target account universe: municipal budget cycles, park system leadership changes, capital improvement plan filings, and bond measure outcomes. These signals preceded formal RFPs by 9–18 months. By the time the RFP appeared, we had often already built a relationship with the key stakeholder — and in several cases, helped shape the specification criteria.
        </p>

        <p className="body-text">
          At Stericycle, a similar logic applied to healthcare and manufacturing accounts facing regulatory compliance deadlines. A new OSHA standard, a state regulatory change, or a hospital system certification requirement created a priming window with a hard close date. We mapped those windows 12–18 months out and built a coverage model around them.
        </p>

        <p className="body-text">
          Neither of these was a sophisticated technology play. They were disciplined signal-tracking disciplines applied to well-understood buying patterns. The sophistication today — with AI-assisted signal monitoring, intent data platforms, and automated trigger workflows — makes this approach more scalable than it was five years ago. But the underlying logic is the same: the buyer's journey starts before the buyer thinks it does.
        </p>

        <h2 className="section-hed">A Framework for Building the Motion</h2>

        <div style={{ border: "1px solid #2a2a2a", borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
          <div className="table-row">
            {["Phase", "What You're Doing", "What the Buyer Is Doing"].map(h => (
              <div key={h} className="table-cell table-header">{h}</div>
            ))}
          </div>
          {[
            ["Signal Detection (12–18 mo)", "Identifying pre-trigger accounts via firmographic and behavioral signals", "Experiencing early friction; hasn't named it as a problem yet"],
            ["Value Seeding (9–12 mo)", "Providing high-relevance content, benchmarks, or insight — no pitch", "Building awareness of the problem category; may be benchmarking internally"],
            ["Relationship Building (6–9 mo)", "Establishing a trusted advisor relationship with the likely champion", "Beginning to socialize the problem internally; building internal consensus"],
            ["Problem Framing (3–6 mo)", "Helping the buyer articulate the business case for change", "Drafting the internal justification; evaluating solution categories"],
            ["Solution Positioning (0–3 mo)", "Positioned as the obvious choice when the formal process begins", "Running formal evaluation — or, ideally, skipping it"],
          ].map((row, i) => (
            <div key={i} className="table-row">
              {row.map((cell, j) => (
                <div key={j} className="table-cell" style={{ color: j === 0 ? "#E85D26" : undefined, fontFamily: j === 0 ? "'DM Mono', monospace" : undefined, fontSize: j === 0 ? 12 : undefined }}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        <h2 className="section-hed">The Honest Limits</h2>

        <p className="body-text">
          Priming window strategy isn't a replacement for demand generation or for working active pipeline. Most commercial organizations need all three motions running simultaneously. The question is resource allocation — and most teams are dramatically over-indexed on the bottom of the funnel.
        </p>

        <p className="body-text">
          It also requires patience and organizational buy-in that's hard to sustain when a board is asking about this quarter's number. The value of priming window investment accrues 12–18 months after it's made, which makes it the first thing cut when a quarter goes sideways.
        </p>

        <p className="body-text">
          The teams that sustain it do so because they've built leading indicators into their operating model — metrics that measure the health of the early-stage relationship development motion, not just the pipeline it eventually produces. They track accounts entered into the priming window, depth of engagement by account, champion relationship scores. They know what's coming before it shows up in the forecast.
        </p>

        <p className="body-text">
          That's the real competitive advantage: not the signals themselves, but the discipline to act on them — and the commercial infrastructure to convert them, 18 months later, into revenue.
        </p>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: "1px solid #1e1e1e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, color: "#e8e0d4", fontSize: 14 }}>David Hopper</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#4a4540", fontSize: 12, marginTop: 2 }}>Commercial Operations & Transformation · Chattanooga, TN</div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#2a2a2a", textAlign: "right" }}>
            linkedin.com/in/dahopper<br />dahopper@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
}
