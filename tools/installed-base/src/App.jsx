import { useState, useCallback, useMemo } from "react";

const T = {
  bg: "#0e1117", surface: "#161b22", surfaceHigh: "#1c2333",
  border: "#2a3441", borderHigh: "#3d4f63",
  textPrimary: "#e6edf3", textSecondary: "#8b949e", textMuted: "#545d68",
  accent: "#f0a500", accentDim: "#7d5600", accentLight: "#1a1200",
  danger: "#f85149", dangerDim: "#7d1f1a", dangerLight: "#160a09",
  success: "#3fb950", successLight: "#0a1f0d",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  display: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  sans: "'Barlow', 'Arial', sans-serif",
};

const LINE_COLORS = ["#f0a500", "#3fb950", "#58a6ff", "#f78166", "#d2a8ff"];

const fc = (n) => {
  if (n >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${Math.round(n)}`;
};
const fp = (n) => `${Math.round(n)}%`;
const fn = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(Math.round(n));

function computeLine(line) {
  const { installedBase, avgAge, serviceCycle, overhaulValue,
          attachRate, thirdPartyShare, avgContractValue, contractPenetration } = line;
  const annualServiceRate = 1 / serviceCycle;
  const unitsServiceable = Math.round(installedBase * annualServiceRate);
  const totalTAM = installedBase * overhaulValue * annualServiceRate;
  const oemRevenue = totalTAM * (attachRate / 100);
  const thirdPartyRevenue = totalTAM * (thirdPartyShare / 100);
  const unaddressed = Math.max(0, totalTAM - oemRevenue - thirdPartyRevenue);
  const annualLeakage = thirdPartyRevenue + unaddressed;
  const contractedUnits = Math.round(installedBase * (contractPenetration / 100));
  const contractRevenue = contractedUnits * avgContractValue;
  const recaptureOpportunity = thirdPartyRevenue * 0.5;
  const overdue = Math.round(installedBase * Math.max(0, (avgAge - serviceCycle) / serviceCycle) * 0.3);
  const dueSoon = Math.round(installedBase * 0.25);
  const healthy = Math.max(0, installedBase - overdue - dueSoon);
  const overdueRevenue = overdue * overhaulValue;
  const leakageRate = totalTAM > 0 ? (annualLeakage / totalTAM) * 100 : 0;
  const coverageRatio = totalTAM > 0 ? (contractRevenue / totalTAM) * 100 : 0;
  const contractsNeeded = avgContractValue > 0 ? Math.ceil(annualLeakage / avgContractValue) : 0;
  return { unitsServiceable, totalTAM, oemRevenue, thirdPartyRevenue, unaddressed,
           annualLeakage, contractRevenue, recaptureOpportunity, overdue, dueSoon,
           healthy, overdueRevenue, leakageRate, coverageRatio, contractsNeeded };
}

function aggregate(lines, results) {
  const sum = (key) => results.reduce((a, r) => a + r[key], 0);
  const totalTAM = sum("totalTAM");
  const annualLeakage = sum("annualLeakage");
  return {
    totalTAM, annualLeakage,
    oemRevenue: sum("oemRevenue"),
    thirdPartyRevenue: sum("thirdPartyRevenue"),
    unaddressed: sum("unaddressed"),
    recaptureOpportunity: sum("recaptureOpportunity"),
    contractRevenue: sum("contractRevenue"),
    overdue: sum("overdue"),
    overdueRevenue: sum("overdueRevenue"),
    unitsServiceable: sum("unitsServiceable"),
    totalUnits: lines.reduce((a, l) => a + l.installedBase, 0),
    leakageRate: totalTAM > 0 ? (annualLeakage / totalTAM) * 100 : 0,
  };
}

const DEFAULT_LINE = (name) => ({
  name, installedBase: 2000, avgAge: 7, serviceCycle: 5,
  overhaulValue: 20000, attachRate: 45, thirdPartyShare: 25,
  avgContractValue: 50000, contractPenetration: 35,
});

const DEFAULT_LINES = [
  { ...DEFAULT_LINE("Product Line A"), installedBase: 3000, overhaulValue: 25000, attachRate: 48 },
  { ...DEFAULT_LINE("Product Line B"), installedBase: 1500, overhaulValue: 12000, serviceCycle: 4, attachRate: 38, thirdPartyShare: 32 },
];

function Slider({ value, onChange, min, max, step, format, label, hint, color }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <label style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textSecondary }}>{label}</label>
        <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: color || T.accent }}>{format(value)}</span>
      </div>
      {hint && <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, marginBottom: 6, lineHeight: 1.4 }}>{hint}</div>}
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", cursor: "pointer", accentColor: color || T.accent }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted }}>{format(min)}</span>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted }}>{format(max)}</span>
      </div>
    </div>
  );
}

function BarChart({ segments }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  if (total === 0) return null;
  return (
    <div>
      <div style={{ display: "flex", height: 26, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
        {segments.filter(s => s.value > 0).map((s, i) => (
          <div key={i} style={{ width: `${(s.value/total)*100}%`, background: s.color, minWidth: 2, transition: "width 0.6s ease" }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {segments.filter(s => s.value > 0).map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: 1, background: s.color, flexShrink: 0 }} />
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textSecondary }}>{s.label}</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted }}>{fp((s.value/total)*100)}</span>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: s.color, fontWeight: 600, minWidth: 56, textAlign: "right" }}>{fc(s.value)}</span>
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
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 700, color: T.textMuted, minWidth: 26 }}>{rank}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textSecondary }}>{fn(count)} units · {fc(revenue)} annual opportunity</div>
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase",
        color: c, background: `${c}15`, border: `1px solid ${c}40`, borderRadius: 3, padding: "3px 7px", flexShrink: 0 }}>{urgency}</div>
    </div>
  );
}

function LineCard({ line, result, index, color, onChange, onRemove, onRename, canRemove }) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(line.name);
  const set = (k, v) => onChange({ ...line, [k]: v });

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${color}`, borderRadius: 4, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
          {editingName ? (
            <input value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onBlur={() => { onRename(nameVal || line.name); setEditingName(false); }}
              onKeyDown={e => { if (e.key === "Enter") { onRename(nameVal || line.name); setEditingName(false); } }}
              autoFocus
              style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, color: T.textPrimary, background: "transparent",
                border: "none", borderBottom: `1px solid ${color}`, outline: "none", width: "100%", minWidth: 0 }} />
          ) : (
            <span onClick={() => setEditingName(true)} title="Click to rename"
              style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, color: T.textPrimary, cursor: "text", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {line.name}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0, marginLeft: 12 }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, color }}>TAM: {fc(result.totalTAM)}</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.danger }}>Leakage: {fc(result.annualLeakage)}</span>
          {canRemove && (
            <button onClick={onRemove}
              style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: "0 2px" }}>✕</button>
          )}
        </div>
      </div>
      <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accentDim, marginBottom: 10 }}>— Installed Base</div>
          <Slider label="Units in Field" value={line.installedBase} onChange={v => set("installedBase", v)} min={100} max={50000} step={100} format={fn} color={color} />
          <Slider label="Avg Fleet Age" value={line.avgAge} onChange={v => set("avgAge", v)} min={1} max={20} step={1} format={v => `${v} yrs`} color={color} />
          <Slider label="Service Cycle" value={line.serviceCycle} onChange={v => set("serviceCycle", v)} min={1} max={15} step={1} format={v => `${v} yrs`} color={color} />
          <Slider label="Overhaul Value" value={line.overhaulValue} onChange={v => set("overhaulValue", v)} min={1000} max={500000} step={1000} format={fc} color={color} />
        </div>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accentDim, marginBottom: 10 }}>— Market Position</div>
          <Slider label="OEM Attach Rate" value={line.attachRate} onChange={v => set("attachRate", v)} min={0} max={100} step={1} format={fp} hint="% of service captured by OEM" color={color} />
          <Slider label="3rd-Party MRO Share" value={line.thirdPartyShare} onChange={v => set("thirdPartyShare", v)} min={0} max={100} step={1} format={fp} hint="% going to independent MRO" color={color} />
          <Slider label="Avg Contract Value" value={line.avgContractValue} onChange={v => set("avgContractValue", v)} min={5000} max={500000} step={5000} format={fc} color={color} />
          <Slider label="Contract Penetration" value={line.contractPenetration} onChange={v => set("contractPenetration", v)} min={0} max={100} step={1} format={fp} color={color} />
        </div>
      </div>
    </div>
  );
}

export default function InstalledBaseModeler() {
  const [lines, setLines] = useState(DEFAULT_LINES);
  const [activeTab, setActiveTab] = useState("portfolio");

  const results = useMemo(() => lines.map(computeLine), [lines]);
  const agg = useMemo(() => aggregate(lines, results), [lines, results]);

  const updateLine = useCallback((i, updated) => setLines(prev => prev.map((l, idx) => idx === i ? updated : l)), []);
  const renameLine = useCallback((i, name) => setLines(prev => prev.map((l, idx) => idx === i ? { ...l, name } : l)), []);
  const removeLine = useCallback((i) => setLines(prev => prev.filter((_, idx) => idx !== i)), []);
  const addLine = useCallback(() => setLines(prev => [...prev, DEFAULT_LINE(`Product Line ${String.fromCharCode(65 + prev.length)}`)]), []);

  const revenueSegments = [
    { label: "OEM Attached", value: agg.oemRevenue, color: T.success },
    { label: "Third-Party MRO", value: agg.thirdPartyRevenue, color: T.danger },
    { label: "Unaddressed", value: agg.unaddressed, color: T.textMuted },
  ];

  const lineContributions = lines.map((l, i) => ({
    label: l.name, value: results[i].totalTAM, color: LINE_COLORS[i % LINE_COLORS.length]
  }));

  const aggDueSoon = results.reduce((a, r) => a + r.dueSoon, 0);
  const avgContractPct = lines.reduce((a, l) => a + l.contractPenetration, 0) / lines.length / 100;
  const aggThirdPartyUnits = lines.reduce((a, l) => a + Math.round(l.installedBase * l.thirdPartyShare / 100), 0);
  const aggUncontractedServiceable = results.reduce((a, r, i) => a + Math.round(r.unitsServiceable * (1 - lines[i].contractPenetration / 100)), 0);
  const dueSoonRevenue = results.reduce((a, r, i) => a + Math.round(r.dueSoon * (1 - lines[i].contractPenetration / 100) * lines[i].overhaulValue / lines[i].serviceCycle), 0);
  const uncontractedRevenue = results.reduce((a, r, i) => a + Math.round(r.unitsServiceable * (1 - lines[i].contractPenetration / 100) * lines[i].overhaulValue), 0);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary, fontFamily: T.sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        body { background: #0e1117; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; outline: none; width: 100%; background: #2a3441; cursor: pointer; display: block; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: currentColor; cursor: pointer; border: 2px solid #0e1117; }
        input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: currentColor; cursor: pointer; border: 2px solid #0e1117; box-shadow: none; }
        input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; }
        input[type=range]::-moz-range-track { height: 4px; border-radius: 2px; background: #2a3441; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #161b22; } ::-webkit-scrollbar-thumb { background: #2a3441; border-radius: 3px; }
      `}</style>

      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.accentDim, marginBottom: 5 }}>Capital Equipment · Aftermarket Revenue · Multi-Line</div>
            <h1 style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, color: T.textPrimary, letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 1 }}>Installed Base Revenue Modeler</h1>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, textAlign: "right", lineHeight: 1.8 }}>
            David Hopper<br /><a href="https://dahopper.com" style={{ color: T.accentDim, textDecoration: "none" }}>dahopper.com</a>
          </div>
        </div>
      </div>

      <div style={{ background: `${T.accent}08`, borderBottom: `1px solid ${T.accentDim}`, padding: "9px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontFamily: T.mono, fontSize: 10, color: T.accentDim }}>
            Model aftermarket revenue across multiple product lines. Configure each independently — installed base, service cycle, overhaul value, OEM attach rate, third-party share. Portfolio view aggregates everything.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 40px 80px" }}>

        {/* Product line cards */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: T.textMuted }}>Product Lines ({lines.length}) — click name to rename</div>
            {lines.length < 5 && (
              <button onClick={addLine} style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.accent, borderRadius: 3, padding: "6px 12px", cursor: "pointer" }}>+ Add Line</button>
            )}
          </div>
          {lines.map((line, i) => (
            <LineCard key={i} line={line} result={results[i]} index={i}
              color={LINE_COLORS[i % LINE_COLORS.length]}
              onChange={updated => updateLine(i, updated)}
              onRemove={() => removeLine(i)}
              onRename={name => renameLine(i, name)}
              canRemove={lines.length > 1} />
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
          {[{ key: "portfolio", label: "Portfolio Summary" }, { key: "breakdown", label: "Line Breakdown" }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              fontFamily: T.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
              background: "none", border: "none", padding: "10px 20px",
              color: activeTab === t.key ? T.accent : T.textMuted,
              borderBottom: activeTab === t.key ? `2px solid ${T.accent}` : "2px solid transparent",
              cursor: "pointer", transition: "all 0.15s"
            }}>{t.label}</button>
          ))}
        </div>

        {activeTab === "portfolio" && (
          <div style={{ animation: "fadeIn 0.25s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, marginBottom: 1, background: T.border }}>
              {[
                { label: "Total Aftermarket TAM", value: fc(agg.totalTAM), sub: `${fn(agg.unitsServiceable)} units serviceable annually`, color: T.textPrimary },
                { label: "Annual Revenue Leakage", value: fc(agg.annualLeakage), sub: `${fp(agg.leakageRate)} of total opportunity`, color: T.danger },
                { label: "Recapture Opportunity", value: fc(agg.recaptureOpportunity), sub: "50% third-party recovery scenario", color: T.accent },
                { label: "Total Installed Base", value: fn(agg.totalUnits), sub: `across ${lines.length} product line${lines.length !== 1 ? "s" : ""}`, color: T.textSecondary },
              ].map((m, i) => (
                <div key={i} style={{ background: T.surface, padding: "18px 18px 14px" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontFamily: T.display, fontSize: 30, fontWeight: 800, color: m.color, lineHeight: 1, marginBottom: 5 }}>{m.value}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textSecondary }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, marginBottom: 14 }}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "18px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textMuted, marginBottom: 14 }}>Revenue Distribution — OEM vs Leakage</div>
                <BarChart segments={revenueSegments} />
              </div>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "18px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textMuted, marginBottom: 14 }}>TAM Contribution by Product Line</div>
                <BarChart segments={lineContributions} />
              </div>
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "18px", marginBottom: 14 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: T.textMuted, marginBottom: 4 }}>Prioritized Intervention Model — Portfolio View</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, marginBottom: 14 }}>Accounts to target first across all product lines, sequenced by urgency and revenue impact</div>
              <PriorityRow rank="01" label="Overdue units across all lines — no recent OEM service record" count={agg.overdue} revenue={agg.overdueRevenue} urgency="critical" />
              <PriorityRow rank="02" label="Due within service cycle — not under contract" count={Math.round(aggDueSoon * (1 - avgContractPct))} revenue={dueSoonRevenue} urgency="elevated" />
              <PriorityRow rank="03" label="Known third-party MRO accounts — active displacement targets" count={aggThirdPartyUnits} revenue={agg.thirdPartyRevenue} urgency="elevated" />
              <PriorityRow rank="04" label="Uncontracted units within active service window" count={aggUncontractedServiceable} revenue={uncontractedRevenue} urgency="monitor" />
            </div>

            <div style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 4, padding: "12px 14px" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted, marginBottom: 6 }}>Model Assumptions</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, lineHeight: 1.7 }}>
                Each product line computes independently: TAM = installed base × overhaul value ÷ service cycle. Portfolio figures are additive. Leakage = third-party share + unaddressed opportunity. Recapture assumes 50% conversion of displaced third-party volume. All figures are directional.
              </div>
            </div>
          </div>
        )}

        {activeTab === "breakdown" && (
          <div style={{ animation: "fadeIn 0.25s ease" }}>
            {lines.map((line, i) => {
              const r = results[i];
              const color = LINE_COLORS[i % LINE_COLORS.length];
              return (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${color}`, borderRadius: 4, padding: "18px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                      <span style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.04em" }}>{line.name}</span>
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted }}>{fn(line.installedBase)} units · {line.serviceCycle}yr cycle · {fc(line.overhaulValue)} overhaul</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: T.border, marginBottom: 14 }}>
                    {[
                      { label: "Aftermarket TAM", value: fc(r.totalTAM), c: color },
                      { label: "OEM Revenue", value: fc(r.oemRevenue), c: T.success },
                      { label: "Leakage", value: fc(r.annualLeakage), c: T.danger },
                      { label: "Leakage Rate", value: fp(r.leakageRate), c: r.leakageRate > 50 ? T.danger : r.leakageRate > 30 ? T.accent : T.success },
                      { label: "Recapture Opp.", value: fc(r.recaptureOpportunity), c: T.accent },
                    ].map((m, j) => (
                      <div key={j} style={{ background: T.surfaceHigh, padding: "12px 14px" }}>
                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textMuted, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.label}</div>
                        <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 700, color: m.c, lineHeight: 1 }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <BarChart segments={[
                    { label: "OEM Attached", value: r.oemRevenue, color: T.success },
                    { label: "Third-Party MRO", value: r.thirdPartyRevenue, color: T.danger },
                    { label: "Unaddressed", value: r.unaddressed, color: T.textMuted },
                  ]} />
                  <div style={{ display: "flex", gap: 20, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textSecondary }}>Contract revenue: <span style={{ color: T.success }}>{fc(r.contractRevenue)}</span></div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textSecondary }}>Coverage: <span style={{ color: r.coverageRatio < 30 ? T.danger : r.coverageRatio < 60 ? T.accent : T.success }}>{fp(r.coverageRatio)}</span></div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textSecondary }}>Contracts to close gap: <span style={{ color: T.accent }}>{r.contractsNeeded}</span></div>
                    {r.overdue > 0 && <div style={{ fontFamily: T.mono, fontSize: 9, color: T.danger }}>⚠ {fn(r.overdue)} units overdue — {fc(r.overdueRevenue)} at risk</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, letterSpacing: "0.1em" }}>Installed Base Revenue Modeler · David Hopper</div>
        <a href="https://dahopper.com" style={{ fontFamily: T.mono, fontSize: 9, color: T.accentDim, textDecoration: "none", letterSpacing: "0.1em" }}>dahopper.com →</a>
      </div>
    </div>
  );
}
