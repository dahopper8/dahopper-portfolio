import { useState, useCallback, useMemo } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#0e1117",
  surface: "#161b22",
  surfaceHigh: "#1c2333",
  border: "#2a3441",
  borderHigh: "#3d4f63",
  textPrimary: "#e6edf3",
  textSecondary: "#8b949e",
  textMuted: "#545d68",
  accent: "#f0a500",
  accentDim: "#7d5600",
  accentLight: "#1a1200",
  danger: "#f85149",
  dangerDim: "#7d1f1a",
  dangerLight: "#160a09",
  success: "#3fb950",
  successLight: "#0a1f0d",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  display: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  sans: "'Barlow', 'Arial', sans-serif",
};

const fc = (n) => {
  if (n >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${Math.round(n)}`;
};
const fp = (n) => `${Math.round(n)}%`;
const fn = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(Math.round(n));

// ─── COMPUTE ──────────────────────────────────────────────────────────────────
function compute(i) {
  const {
    installedBase, avgAge, serviceCycle, overhaulValue,
    attachRate, thirdPartyShare, avgContractValue, contractPenetration
  } = i;

  // Units due for service this year
  const annualServiceRate = 1 / serviceCycle;
  const unitsServiceable = Math.round(installedBase * annualServiceRate);

  // Total serviceable aftermarket opportunity (TAM for aftermarket)
  const totalAftermarketTAM = installedBase * overhaulValue * annualServiceRate;

  // What OEM is currently capturing
  const oemAttachRevenue = totalAftermarketTAM * (attachRate / 100);

  // What third parties are capturing
  const thirdPartyRevenue = totalAftermarketTAM * (thirdPartyShare / 100);

  // Uncaptured/uncontracted remainder
  const unaddressed = totalAftermarketTAM - oemAttachRevenue - thirdPartyRevenue;

  // Annual revenue leakage (third party + unaddressed)
  const annualLeakage = thirdPartyRevenue + Math.max(0, unaddressed);

  // Contract revenue (from contracted accounts)
  const contractedUnits = Math.round(installedBase * (contractPenetration / 100));
  const contractRevenue = contractedUnits * avgContractValue;

  // Recovery opportunity — if you could recapture 50% of third party share
  const recaptureOpportunity = thirdPartyRevenue * 0.5;

  // Priority tiers based on age vs service cycle
  const overdue = Math.round(installedBase * Math.max(0, (avgAge - serviceCycle) / serviceCycle) * 0.3);
  const dueSoon = Math.round(installedBase * 0.25);
  const healthy = installedBase - overdue - dueSoon;

  // Revenue at risk from overdue units
  const overdueRevenue = overdue * overhaulValue;

  // Leakage rate
  const leakageRate = totalAftermarketTAM > 0 ? (annualLeakage / totalAftermarketTAM) * 100 : 0;

  // Coverage ratio — contracted vs total opportunity
  const coverageRatio = totalAftermarketTAM > 0 ? (contractRevenue / totalAftermarketTAM) * 100 : 0;

  // Payback: if avg contract value is known, how many contracts to cover leakage
  const contractsNeeded = avgContractValue > 0 ? Math.ceil(annualLeakage / avgContractValue) : 0;

  return {
    unitsServiceable,
    totalAftermarketTAM,
    oemAttachRevenue,
    thirdPartyRevenue,
    unaddressed: Math.max(0, unaddressed),
    annualLeakage,
    contractRevenue,
    recaptureOpportunity,
    overdue, dueSoon, healthy,
    overdueRevenue,
    leakageRate,
    coverageRatio,
    contractsNeeded,
  };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Slider({ value, onChange, min, max, step, format, label, hint }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <label style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textSecondary }}>{label}</label>
        <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.accent }}>{format(value)}</span>
      </div>
      {hint && <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textMuted, marginBottom: 8, lineHeight: 1.4 }}>{hint}</div>}
      <div style={{ position: "relative", height: 4, background: T.border, borderRadius: 2 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: T.accent, borderRadius: 2 }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: -8, left: 0, width: "100%", opacity: 0, cursor: "pointer", height: 20 }} />
        <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%", background: T.accent, border: `2px solid ${T.bg}`,
          boxShadow: `0 0 0 2px ${T.accent}`, pointerEvents: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted }}>{format(min)}</span>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted }}>{format(max)}</span>
      </div>
    </div>
  );
}

function MetricBlock({ label, value, sub, highlight, danger, large }) {
  const color = danger ? T.danger : highlight ? T.accent : T.textPrimary;
  return (
    <div style={{ padding: "16px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: T.display, fontSize: large ? 36 : 28, fontWeight: 700, color, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: sub ? 5 : 0 }}>{value}</div>
      {sub && <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textSecondary, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ segments }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  return (
    <div>
      <div style={{ display: "flex", height: 32, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ width: `${(s.value/total)*100}%`, background: s.color, position: "relative",
            transition: "width 0.8s ease", minWidth: s.value > 0 ? 2 : 0 }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 1, background: s.color, flexShrink: 0 }} />
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textSecondary }}>{s.label}</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textMuted }}>{fp((s.value/total)*100)}</span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: s.color, fontWeight: 600, minWidth: 60, textAlign: "right" }}>{fc(s.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriorityRow({ rank, label, count, revenue, urgency }) {
  const colors = { critical: T.danger, elevated: T.accent, monitor: T.success };
  const c = colors[urgency] || T.textSecondary;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0",
      borderBottom: `1px solid ${T.border}` }}>
      <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 700, color: T.textMuted, minWidth: 28 }}>{rank}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textSecondary }}>{fn(count)} units · {fc(revenue)} annual opportunity</div>
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
        color: c, background: `${c}15`, border: `1px solid ${c}40`,
        borderRadius: 3, padding: "3px 8px" }}>{urgency}</div>
    </div>
  );
}

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULTS = {
  installedBase: 5000,
  avgAge: 8,
  serviceCycle: 5,
  overhaulValue: 15000,
  attachRate: 42,
  thirdPartyShare: 28,
  avgContractValue: 45000,
  contractPenetration: 35,
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function InstalledBaseModeler() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const set = useCallback((k, v) => setInputs(p => ({ ...p, [k]: v })), []);
  const r = useMemo(() => compute(inputs), [inputs]);

  const revenueSegments = [
    { label: "OEM Attached", value: r.oemAttachRevenue, color: T.success },
    { label: "Third-Party MRO", value: r.thirdPartyRevenue, color: T.danger },
    { label: "Unaddressed", value: r.unaddressed, color: T.textMuted },
  ];

  const unitSegments = [
    { label: "Overdue for Service", value: r.overdue, color: T.danger },
    { label: "Due Within Cycle", value: r.dueSoon, color: T.accent },
    { label: "Within Cycle", value: r.healthy, color: "#2d3f2f" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary, fontFamily: T.sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        body { background: ${T.bg}; }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${T.surface}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.accentDim, marginBottom: 6 }}>
              Capital Equipment · Aftermarket Revenue
            </div>
            <h1 style={{ fontFamily: T.display, fontSize: 26, fontWeight: 800, color: T.textPrimary, letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 1 }}>
              Installed Base Revenue Modeler
            </h1>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, textAlign: "right", lineHeight: 1.8 }}>
            David Hopper<br />
            <a href="https://dahopper.com" style={{ color: T.accentDim, textDecoration: "none" }}>dahopper.com</a>
          </div>
        </div>
      </div>

      {/* Sub-header — the thesis */}
      <div style={{ background: `${T.accent}08`, borderBottom: `1px solid ${T.accentDim}`, padding: "10px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <p style={{ fontFamily: T.mono, fontSize: 11, color: T.accentDim, lineHeight: 1.5 }}>
            Given a known installed base of capital equipment — how much aftermarket revenue should you be capturing, and what's the gap between what you're getting and what's available?
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 40px 80px", display: "grid", gridTemplateColumns: "320px 1fr", gap: 28, alignItems: "start" }}>

        {/* INPUT PANEL */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "24px", position: "sticky", top: 24 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: T.textMuted, marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
            Model Inputs
          </div>

          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accentDim, marginBottom: 14 }}>
            — Installed Base
          </div>
          <Slider label="Total Units in Field" value={inputs.installedBase} onChange={v => set("installedBase", v)} min={100} max={50000} step={100} format={fn} hint="All units sold and operating in the field" />
          <Slider label="Average Fleet Age" value={inputs.avgAge} onChange={v => set("avgAge", v)} min={1} max={20} step={1} format={v => `${v} yrs`} hint="Mean age of installed base in years" />
          <Slider label="Service Cycle Length" value={inputs.serviceCycle} onChange={v => set("serviceCycle", v)} min={1} max={15} step={1} format={v => `${v} yrs`} hint="Standard overhaul/service interval" />
          <Slider label="Average Overhaul Value" value={inputs.overhaulValue} onChange={v => set("overhaulValue", v)} min={1000} max={500000} step={1000} format={fc} hint="Parts + labor per service event" />

          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accentDim, marginBottom: 14, marginTop: 8 }}>
            — Market Position
          </div>
          <Slider label="OEM Attach Rate" value={inputs.attachRate} onChange={v => set("attachRate", v)} min={0} max={100} step={1} format={fp} hint="% of service events captured by OEM" />
          <Slider label="Third-Party MRO Share" value={inputs.thirdPartyShare} onChange={v => set("thirdPartyShare", v)} min={0} max={100} step={1} format={fp} hint="Estimated % going to independent MRO" />

          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accentDim, marginBottom: 14, marginTop: 8 }}>
            — Contract Program
          </div>
          <Slider label="Avg Contract Value" value={inputs.avgContractValue} onChange={v => set("avgContractValue", v)} min={5000} max={500000} step={5000} format={fc} hint="Annual value of a service contract" />
          <Slider label="Contract Penetration" value={inputs.contractPenetration} onChange={v => set("contractPenetration", v)} min={0} max={100} step={1} format={fp} hint="% of installed base under contract" />
        </div>

        {/* OUTPUT PANEL */}
        <div style={{ animation: "fadeIn 0.3s ease" }}>

          {/* Top metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, marginBottom: 1, background: T.border }}>
            {[
              { label: "Total Aftermarket TAM", value: fc(r.totalAftermarketTAM), sub: `${fn(r.unitsServiceable)} units serviceable annually`, large: true },
              { label: "Annual Revenue Leakage", value: fc(r.annualLeakage), sub: `${fp(r.leakageRate)} of total opportunity`, danger: true, large: true },
              { label: "Recapture Opportunity", value: fc(r.recaptureOpportunity), sub: "Est. at 50% third-party recovery", highlight: true, large: true },
            ].map((m, i) => (
              <div key={i} style={{ background: T.surface, padding: "20px 20px 16px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 8 }}>{m.label}</div>
                <div style={{ fontFamily: T.display, fontSize: 32, fontWeight: 800, color: m.danger ? T.danger : m.highlight ? T.accent : T.textPrimary, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: 6 }}>{m.value}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textSecondary }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Revenue distribution */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px", marginTop: 16, marginBottom: 16 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Annual Aftermarket Revenue Distribution</div>
            <BarChart segments={revenueSegments} />
          </div>

          {/* Fleet age distribution */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Fleet Service Status Distribution</div>
            <BarChart segments={unitSegments.map(s => ({ ...s, value: s.value }))} />
            {r.overdue > 0 && (
              <div style={{ marginTop: 14, background: T.dangerLight, border: `1px solid ${T.dangerDim}`, borderRadius: 3, padding: "10px 12px" }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.danger }}>
                  {fn(r.overdue)} units overdue represent {fc(r.overdueRevenue)} in at-risk annual service revenue — highest priority for field contact.
                </span>
              </div>
            )}
          </div>

          {/* Prioritized intervention model */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textMuted, marginBottom: 4 }}>Prioritized Intervention Model</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textMuted, marginBottom: 16 }}>Accounts to target first, sequenced by service urgency and revenue impact</div>
            <PriorityRow rank="01" label="Overdue units without OEM service history" count={r.overdue} revenue={r.overdueRevenue} urgency="critical" />
            <PriorityRow rank="02" label="Units due within next service cycle — no contract" count={Math.round(r.dueSoon * (1 - inputs.contractPenetration / 100))} revenue={Math.round(r.dueSoon * (1 - inputs.contractPenetration / 100) * inputs.overhaulValue / inputs.serviceCycle)} urgency="elevated" />
            <PriorityRow rank="03" label="Known third-party MRO accounts — displacement target" count={Math.round(inputs.installedBase * inputs.thirdPartyShare / 100)} revenue={r.thirdPartyRevenue} urgency="elevated" />
            <PriorityRow rank="04" label="Uncontracted units within service window" count={Math.round(r.unitsServiceable * (1 - inputs.contractPenetration / 100))} revenue={Math.round(r.unitsServiceable * (1 - inputs.contractPenetration / 100) * inputs.overhaulValue)} urgency="monitor" />
          </div>

          {/* Contract program analysis */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Contract Program Coverage</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, background: T.border }}>
              {[
                { label: "Contract Revenue", value: fc(r.contractRevenue), color: T.success },
                { label: "Coverage Ratio", value: fp(r.coverageRatio), color: r.coverageRatio < 30 ? T.danger : r.coverageRatio < 60 ? T.accent : T.success },
                { label: "Contracted Units", value: fn(Math.round(inputs.installedBase * inputs.contractPenetration / 100)), color: T.textPrimary },
                { label: "Contracts to Close Gap", value: String(r.contractsNeeded), color: T.accent },
              ].map((m, i) => (
                <div key={i} style={{ background: T.surfaceHigh, padding: "14px 16px" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.label}</div>
                  <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
                </div>
              ))}
            </div>
            {r.contractsNeeded > 0 && (
              <div style={{ marginTop: 12, background: T.accentLight, border: `1px solid ${T.accentDim}`, borderRadius: 3, padding: "10px 12px" }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent }}>
                  Closing {r.contractsNeeded} net new service contracts at {fc(inputs.avgContractValue)} average would fully offset current annual leakage of {fc(r.annualLeakage)}.
                </span>
              </div>
            )}
          </div>

          {/* Key assumptions note */}
          <div style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 4, padding: "14px 16px" }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 8 }}>Model Assumptions</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textMuted, lineHeight: 1.7 }}>
              TAM calculated as: installed base × overhaul value ÷ service cycle length. Leakage = third-party share + unaddressed opportunity. Fleet status distribution uses age-to-cycle ratio with empirical overdue weighting. Recapture opportunity assumes 50% conversion of displaced third-party volume. Contract coverage assumes uniform distribution across installed base. All figures are directional — actual results depend on geographic concentration, fleet composition, and channel dynamics.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, letterSpacing: "0.1em" }}>Installed Base Revenue Modeler · David Hopper</div>
        <a href="https://dahopper.com" style={{ fontFamily: T.mono, fontSize: 9, color: T.accentDim, textDecoration: "none", letterSpacing: "0.1em" }}>dahopper.com →</a>
      </div>
    </div>
  );
}
