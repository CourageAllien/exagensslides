import { useState, useEffect, useRef } from "react";

const X = {
  primary: "#0077B6", deep: "#023E8A", accent: "#00B4D8", light: "#CAF0F8",
  gradient: "linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)",
  dark: "#0A1628", text: "#1B2A4A", muted: "#7B8BA5", bg: "#F7FAFC",
  sky: "#EFF8FF", mint: "#ECFDF5", rose: "#FFF1F2", amber: "#FFFBEB",
  success: "#10B981", danger: "#EF4444", warning: "#F59E0B",
};

const BrainIcon = ({ size = 24, color = X.primary }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a3.5 3.5 0 00-3.29 4.72A3.5 3.5 0 004 10.5a3.5 3.5 0 001.08 2.53A3.5 3.5 0 004 15.5a3.5 3.5 0 003.08 3.47A3.5 3.5 0 0010.5 22h3a3.5 3.5 0 003.42-3.03A3.5 3.5 0 0020 15.5a3.5 3.5 0 00-1.08-2.47A3.5 3.5 0 0020 10.5a3.5 3.5 0 00-2.21-3.28A3.5 3.5 0 0014.5 2h-5z"/>
    <path d="M12 2v20" opacity="0.2"/>
  </svg>
);
const SendIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const CheckCircle = ({ size = 20, color = X.success }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
const XCircle = ({ size = 20, color = X.danger }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

const CHALLENGES = [
  { id: "flat_digital", emoji: "📱", title: "Digital Sessions Are Transactional", context: "BECU sees 450K+ daily logins, but members check balances and leave. Average session: 2.1 minutes. No proactive guidance, no conversation, no reason to stay.", becuSpecific: "With 95% of interactions digital, BECU's app is a utility — not a relationship channel. Members feel served but not known.", stat: "CU app sessions avg 2.1 min vs 4.8 min at top banks", solution: "Exagens transforms passive sessions into behavioral conversations. At Desjardins, 3.4x more frequent interactions, 98% satisfaction.", tag: "Engagement", color: "#3B82F6" },
  { id: "young_churn", emoji: "🧑‍💻", title: "Members Under 40 Are Drifting", context: "Younger members expect hyper-personalization. They get generic product emails. Satisfaction among under-40s is 16 points lower.", becuSpecific: "BECU's mission resonates with younger values — but the digital experience doesn't reflect it. Fintechs feel more personal despite having no community mission.", stat: "31% of CU members under 40 plan to leave in 12 months — J.D. Power 2025", solution: "Exagens treats each member as segment of one. Language, tone, guidance adapt to age, life stage, and financial context.", tag: "Retention", color: "#8B5CF6" },
  { id: "cross_sell_gap", emoji: "💳", title: "Product Penetration Lags Banks", context: "Average BECU member holds ~2.2 products. Big bank customers hold 5.3. Cross-sell campaigns feel like blasts — not personal recommendations.", becuSpecific: "BECU has the products. Members have the needs. The gap is a conversation layer connecting the right product to the right person at the right moment.", stat: "CU avg: 2.2 products/member vs 5.3 at big banks — 58% gap", solution: "Exagens' behavioral engine identifies receptive moments. At Desjardins, holiday bonding interactions tripled offer acceptance.", tag: "Revenue", color: "#EC4899" },
  { id: "wellness_generic", emoji: "🌱", title: "Financial Wellness Tools Sit Unused", context: "BECU offers articles, calculators, generic tips. Only ~12% of members engage. The content isn't wrong — it's just not individualized.", becuSpecific: "BECU's cooperative mission is to improve members' financial lives. But static content can't move behavior — individualized nudges can.", stat: "Only 12% of CU members actively use financial wellness tools", solution: "MoneySparxs delivers actionable, individualized guidance — not education. Members save 3.4x more per year.", tag: "Mission", color: "#10B981" },
  { id: "deposit_pressure", emoji: "🏦", title: "Deposits Are Under Pressure", context: "High-yield fintech accounts and neobanks are siphoning deposits. CU deposit growth hit 1.8% in 2025 — lowest in a decade.", becuSpecific: "Members don't know what they don't know. Many could save more or consolidate — if someone told them personally.", stat: "CU deposit growth slowed to 1.8% in 2025 — lowest in decade", solution: "Exagens nudges members toward savings behaviors tied to real patterns. Desjardins: 25% more savings accounts, $300M+ deposits.", tag: "Growth", color: "#F59E0B" },
  { id: "scale_human", emoji: "🏢", title: "The Human Touch Can't Scale", context: "Branch visits down 38% since 2019 but satisfaction there remains highest. The advisory relationship has no digital equivalent.", becuSpecific: "BECU's branch staff are beloved. But with 1.4M members and shrinking traffic, you can't advisor-your-way to engagement at scale.", stat: "Branch visits ↓38% since 2019 · Digital logins ↑67%", solution: "Exagens replicates branch empathy digitally, autonomously, for every member simultaneously. No additional staff.", tag: "Efficiency", color: "#06B6D4" },
];

const SOL_MAP = {
  flat_digital: { metric: "3.4x", label: "Session Lift", title: "Behavioral Conversations" },
  young_churn: { metric: "2.7x", label: "Response Rate", title: "Segment-of-One" },
  cross_sell_gap: { metric: "11x", label: "Account Opens", title: "Behavioral Cross-Sell" },
  wellness_generic: { metric: "3.4x", label: "Savings Lift", title: "MoneySparxs" },
  deposit_pressure: { metric: "$300M+", label: "Deposits", title: "Deposit Catalyst" },
  scale_human: { metric: "98%", label: "Satisfaction", title: "Digital Branch" },
};

function SwipeCard({ challenge, onSwipe, isTop, num, total }) {
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [drag, setDrag] = useState(false);
  const [exit, setExit] = useState(null);
  const s = useRef({ x: 0, y: 0 });
  const start = (cx, cy) => { if (!isTop) return; setDrag(true); s.current = { x: cx, y: cy }; };
  const move = (cx, cy) => { if (!drag) return; setDx(cx - s.current.x); setDy((cy - s.current.y) * 0.3); };
  const end = () => { if (!drag) return; setDrag(false); if (dx > 100) doExit("r"); else if (dx < -100) doExit("l"); else { setDx(0); setDy(0); } };
  const doExit = d => { setExit(d); setTimeout(() => onSwipe(d === "r"), 350); };
  let t = `translate(${dx}px,${dy}px) rotate(${dx * 0.06}deg)`, o = 1;
  if (exit === "r") { t = "translate(500px,-40px) rotate(20deg)"; o = 0; }
  if (exit === "l") { t = "translate(-500px,-40px) rotate(-20deg)"; o = 0; }

  return (
    <div onMouseDown={e => start(e.clientX, e.clientY)} onMouseMove={e => move(e.clientX, e.clientY)} onMouseUp={end} onMouseLeave={() => drag && end()}
      onTouchStart={e => start(e.touches[0].clientX, e.touches[0].clientY)} onTouchMove={e => move(e.touches[0].clientX, e.touches[0].clientY)} onTouchEnd={end}
      style={{ position: "absolute", inset: 0, background: "#fff", borderRadius: 20, boxShadow: drag ? "0 24px 60px rgba(0,0,0,0.16)" : "0 8px 32px rgba(0,0,0,0.08)", transform: t, opacity: o, transition: drag ? "none" : "all 0.35s cubic-bezier(.4,0,.2,1)", cursor: isTop ? "grab" : "default", userSelect: "none", overflow: "hidden", zIndex: isTop ? 10 : 5, border: "1px solid #EDF2F7" }}>
      <div style={{ height: 5, background: `linear-gradient(90deg, ${challenge.color}, ${challenge.color}88)` }} />
      {dx > 40 && <div style={{ position: "absolute", top: 28, left: 24, padding: "8px 22px", border: `3px solid ${X.success}`, borderRadius: 10, transform: "rotate(-12deg)", zIndex: 20, background: "rgba(255,255,255,0.92)" }}><span style={{ fontSize: 18, fontWeight: 800, color: X.success, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>RESONATES</span></div>}
      {dx < -40 && <div style={{ position: "absolute", top: 28, right: 24, padding: "8px 22px", border: `3px solid ${X.danger}`, borderRadius: 10, transform: "rotate(12deg)", zIndex: 20, background: "rgba(255,255,255,0.92)" }}><span style={{ fontSize: 18, fontWeight: 800, color: X.danger, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>NOT NOW</span></div>}
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", height: "calc(100% - 5px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ padding: "3px 10px", background: `${challenge.color}12`, borderRadius: 6, fontSize: 10, fontWeight: 700, color: challenge.color, fontFamily: "'DM Sans', sans-serif" }}>{challenge.tag}</span>
          <span style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif" }}>{num}/{total}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>{challenge.emoji}</span>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: X.dark, margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>{challenge.title}</h3>
        </div>
        <p style={{ fontSize: 13, color: X.text, margin: "0 0 10px", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{challenge.context}</p>
        <div style={{ padding: "10px 12px", background: X.sky, borderRadius: 8, marginBottom: 10, borderLeft: `3px solid ${X.primary}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: X.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>For BECU</div>
          <div style={{ fontSize: 12, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{challenge.becuSpecific}</div>
        </div>
        <div style={{ padding: "8px 10px", background: X.bg, borderRadius: 6, marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: X.text, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>📊 {challenge.stat}</div>
        </div>
        <div style={{ marginTop: "auto", padding: "10px 12px", background: `${X.deep}06`, borderRadius: 8, border: `1px solid ${X.deep}10` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
            <BrainIcon size={12} color={X.deep} />
            <span style={{ fontSize: 9, fontWeight: 700, color: X.deep, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif" }}>Exagens Solution</span>
          </div>
          <div style={{ fontSize: 11, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{challenge.solution}</div>
        </div>
      </div>
    </div>
  );
}

function MatchOverlay({ challenge, onClose }) {
  const s = SOL_MAP[challenge.id];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(2,62,138,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", animation: "mf 0.4s ease" }}>
      <div style={{ fontSize: 44, marginBottom: 10 }}>{challenge.emoji}</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>It's a Match</h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif", textAlign: "center", maxWidth: 340 }}>
        <b style={{ color: "#fff" }}>{challenge.title}</b> — and Exagens has a proven solution.
      </p>
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 32, fontWeight: 800, color: X.light, fontFamily: "'DM Sans', sans-serif" }}>{s.metric}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{s.label}</div></div>
        <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: X.light, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Exagens Solution</div></div>
      </div>
      <button onClick={onClose} style={{ padding: "11px 32px", borderRadius: 10, border: "none", background: "#fff", color: X.deep, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Keep Swiping →</button>
      <style>{`@keyframes mf { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>
  );
}

function Nav({ c, t, onP, onN, onD }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 48px", background: "#fff", borderTop: "1px solid #EDF2F7", flexShrink: 0 }}>
      <button onClick={onP} disabled={c === 0} style={{ padding: "9px 24px", borderRadius: 10, border: c === 0 ? "1.5px solid #E2E8F0" : `1.5px solid ${X.primary}30`, background: "#fff", color: c === 0 ? "#CBD5E0" : X.primary, fontSize: 12, fontWeight: 700, cursor: c === 0 ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: t }).map((_, i) => <div key={i} onClick={() => onD(i)} style={{ width: c === i ? 24 : 8, height: 8, borderRadius: 4, background: c === i ? X.gradient : "#E2E8F0", cursor: "pointer", transition: "all 0.3s" }} />)}
      </div>
      <button onClick={onN} disabled={c === t - 1} style={{ padding: "9px 24px", borderRadius: 10, border: "none", background: c === t - 1 ? "#E2E8F0" : X.gradient, color: c === t - 1 ? "#CBD5E0" : "#fff", fontSize: 12, fontWeight: 700, cursor: c === t - 1 ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>Next →</button>
    </div>
  );
}

function StepBadge({ n }) {
  return <div style={{ width: 20, height: 20, borderRadius: 6, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>{n}</span></div>;
}

function S0() {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flex: 1.1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><BrainIcon size={28} color={X.deep} /><span style={{ fontSize: 20, fontWeight: 800, color: X.deep, fontFamily: "'DM Sans', sans-serif" }}>exagens</span></div>
        <div style={{ display: "inline-flex", padding: "5px 12px", background: X.sky, borderRadius: 8, fontSize: 10, color: X.deep, marginBottom: 24, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, alignSelf: "flex-start" }}>🔒 Prepared exclusively for BECU · March 2026</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: X.dark, margin: "0 0 14px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, letterSpacing: -1 }}>Behavioral Banking<br /><span style={{ background: X.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Personalized for BECU</span></h1>
        <p style={{ fontSize: 16, color: X.muted, margin: "0 0 32px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", maxWidth: 460 }}>An interactive experience built around BECU's real challenges. Swipe through what resonates — we'll show exactly how Exagens solves it, with verified Desjardins results.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ v: "$300M+", s: "Deposits grown", bg: X.sky }, { v: "98%", s: "Member satisfaction", bg: X.mint }, { v: "11x", s: "Savings accounts opened", bg: X.amber }].map((d, i) => (
            <div key={i} style={{ padding: 14, background: d.bg, borderRadius: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: X.deep, fontFamily: "'DM Sans', sans-serif" }}>{d.v}</div>
              <div style={{ fontSize: 10, color: X.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{d.s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 0.9, background: X.gradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06 }}>{Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ position: "absolute", width: 1.5, height: Math.random() * 160 + 30, background: "#fff", top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 180}deg)` }} />)}</div>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 40px" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><BrainIcon size={38} color="#fff" /></div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>Swipe. Match. Transform.</h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", maxWidth: 260, margin: "0 auto 24px", lineHeight: 1.5 }}>Identify challenges. Match with solutions proven at North America's largest credit union.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {["Behavioral Science", "AI", "Neuroscience"].map(t => <span key={t} style={{ padding: "4px 10px", background: "rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{t}</span>)}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 18 }}>{["Desjardins", "Gartner Cool Vendor", "CCUA"].map(n => <span key={n} style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>{n}</span>)}</div>
      </div>
    </div>
  );
}

function S1({ path, setPath }) {
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={1} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Understanding BECU</span></div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>We've Analyzed BECU's Opportunity</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: X.bg, borderRadius: 14, padding: 20, border: "1px solid #EDF2F7" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: X.dark, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>📊 BECU Profile</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ l: "Assets", v: "$30B+" }, { l: "Members", v: "1.4M" }, { l: "Daily Logins", v: "450K+" }, { l: "HQ", v: "Tukwila, WA" }, { l: "Products/Member", v: "~2.2" }, { l: "Digital", v: "95%" }].map((s, i) => <div key={i}><div style={{ fontSize: 9, color: X.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{s.l}</div><div style={{ fontSize: 15, fontWeight: 800, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>{s.v}</div></div>)}
          </div>
        </div>
        <div style={{ background: X.rose, borderRadius: 14, padding: 20, border: "1px solid #FECDD3" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: X.dark, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>⚡ The Gap</h3>
          {["Digital interactions are high-volume but shallow", "Under-40 satisfaction declining industry-wide", "Product penetration at 2.2 vs 5.3 at big banks", "Branch visits ↓38% — advisory not scaling"].map((t, i) => <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 8 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: X.danger, marginTop: 5, flexShrink: 0 }} /><span style={{ fontSize: 11, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{t}</span></div>)}
        </div>
      </div>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: X.dark, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>BECU's top priority?</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[{ id: "growth", emoji: "📈", title: "Grow Revenue", desc: "Deposits, cross-sell, wallet share", bg: X.amber }, { id: "engage", emoji: "💬", title: "Deepen Engagement", desc: "Make digital relational", bg: X.sky }, { id: "mission", emoji: "🌱", title: "Financial Well-Being", desc: "Deliver on BECU's mission at scale", bg: X.mint }].map(p => (
          <div key={p.id} onClick={() => setPath(p.id)} style={{ padding: 16, borderRadius: 12, cursor: "pointer", transition: "all 0.25s", border: path === p.id ? `2px solid ${X.primary}` : "1.5px solid #E2E8F0", background: path === p.id ? p.bg : "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 24 }}>{p.emoji}</span>{path === p.id && <CheckCircle size={18} color={X.primary} />}</div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: X.dark, margin: "0 0 2px", fontFamily: "'DM Sans', sans-serif" }}>{p.title}</h4>
            <p style={{ fontSize: 10, color: X.muted, margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function S2({ sel, skip, onSwipe }) {
  const [overlay, setOverlay] = useState(null);
  const idx = sel.length + skip.length;
  const rem = CHALLENGES.slice(idx);
  const done = rem.length === 0;
  const handleSwipe = (liked) => { if (liked) { setOverlay(CHALLENGES[idx]); setTimeout(() => onSwipe(true), 50); } else onSwipe(false); };

  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      {overlay && <MatchOverlay challenge={overlay} onClose={() => setOverlay(null)} />}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={2} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Swipe Your Challenges</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div><h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>Drag Right on What Resonates</h2><p style={{ fontSize: 13, color: X.muted, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Each card is customized to BECU's situation.</p></div>
        <div style={{ display: "flex", gap: 12 }}><span style={{ fontSize: 12, color: X.success, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>✓ {sel.length}</span><span style={{ fontSize: 12, color: X.muted, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>✕ {skip.length}</span></div>
      </div>
      <div style={{ height: 4, background: "#EDF2F7", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}><div style={{ height: "100%", background: X.gradient, width: `${(idx / CHALLENGES.length) * 100}%`, transition: "width 0.4s" }} /></div>
      {done ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><BrainIcon size={48} /><h3 style={{ fontSize: 22, fontWeight: 800, color: X.dark, margin: "14px 0 6px", fontFamily: "'DM Sans', sans-serif" }}>Analysis Complete</h3><p style={{ fontSize: 14, color: X.muted, fontFamily: "'DM Sans', sans-serif" }}>{sel.length} matches → Hit Next →</p></div>
      ) : (
        <div style={{ flex: 1, display: "flex", gap: 32 }}>
          <div style={{ flex: 1, position: "relative" }}>{rem.slice(0, 2).reverse().map((c, i) => <SwipeCard key={c.id} challenge={c} onSwipe={handleSwipe} isTop={i === Math.min(rem.length, 2) - 1} num={idx + 1} total={CHALLENGES.length} />)}</div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, width: 120 }}>
            <button onClick={() => handleSwipe(false)} style={{ padding: "12px", borderRadius: 10, border: `2px solid ${X.danger}30`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 700, color: X.danger, fontFamily: "'DM Sans', sans-serif" }}><XCircle size={16} /> Not Now</button>
            <button onClick={() => handleSwipe(true)} style={{ padding: "12px", borderRadius: 10, border: "none", background: X.gradient, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 4px 14px ${X.primary}30` }}><CheckCircle size={16} color="#fff" /> Resonates</button>
          </div>
        </div>
      )}
    </div>
  );
}

function S3({ sel, active, setActive }) {
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={3} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Your Matched Solutions</span></div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>{sel.length} Solution{sel.length !== 1 ? "s" : ""} Matched to BECU</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>Each proven at Desjardins. Click to explore.</p>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: sel.length > 3 ? "1fr 1fr 1fr" : `repeat(${Math.max(sel.length, 1)}, 1fr)`, gap: 12, overflow: "auto" }}>
        {sel.map(id => { const c = CHALLENGES.find(ch => ch.id === id); const s = SOL_MAP[id]; if (!c || !s) return null; const a = active === id;
          return (<div key={id} onClick={() => setActive(a ? null : id)} style={{ padding: 18, borderRadius: 14, cursor: "pointer", transition: "all 0.3s", background: a ? X.gradient : "#fff", border: a ? "none" : "1px solid #EDF2F7", boxShadow: a ? `0 10px 36px ${X.primary}20` : "0 2px 10px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><span style={{ fontSize: 22 }}>{c.emoji}</span><h4 style={{ fontSize: 14, fontWeight: 700, color: a ? "#fff" : X.dark, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</h4></div>
            <div style={{ fontSize: 12, color: a ? "rgba(255,255,255,0.8)" : X.muted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45, marginBottom: 12 }}>{c.solution}</div>
            <div style={{ marginTop: "auto", padding: 12, borderRadius: 10, background: a ? "rgba(255,255,255,0.12)" : X.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 9, color: a ? "rgba(255,255,255,0.5)" : X.muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div><div style={{ fontSize: 10, color: a ? "rgba(255,255,255,0.65)" : X.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>Verified at Desjardins</div></div>
              <div style={{ fontSize: 28, fontWeight: 800, color: a ? "#fff" : X.primary, fontFamily: "'DM Sans', sans-serif" }}>{s.metric}</div>
            </div>
          </div>);
        })}
      </div>
    </div>
  );
}

function S4() {
  const [activeMetric, setActiveMetric] = useState(0);
  const metrics = [
    { val: "11x", label: "New Savings Accounts", desc: "Behavioral nudges drove 11x more new high-interest savings account openings compared to the same 3-month period without Exagens.", icon: "🏦" },
    { val: "13x", label: "Deposit Growth", desc: "Members deposited 13x more into new accounts when guided by behavioral conversations vs. standard digital prompts.", icon: "💰" },
    { val: "$300M+", label: "Total Deposits Grown", desc: "Over 40,000 new accounts with $300M+ deposited — all autonomous, with 98% member satisfaction.", icon: "📈" },
    { val: "3.4x", label: "Savings Per Member", desc: "Members guided by behavioral banking saved 3.4x more per year than those without the behavioral layer.", icon: "🌱" },
    { val: "8M+", label: "Conversations", desc: "Over 8 million proactive behavioral conversations across 3M+ members — each one individualized.", icon: "💬" },
    { val: "98%", label: "Satisfaction", desc: "Member satisfaction with behavioral interactions rated 98% — matching or exceeding in-branch advisory.", icon: "💚" },
  ];
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={4} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Proof — Desjardins Case Study</span></div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>8 Years of Results at North America's Largest Credit Union</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>Desjardins ($407B assets, 7M+ members) has renewed with Exagens 4 consecutive times since 2015. Click any metric.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, alignContent: "start" }}>
          {metrics.map((m, i) => (
            <div key={i} onClick={() => setActiveMetric(i)} style={{ padding: 16, borderRadius: 12, cursor: "pointer", transition: "all 0.25s", background: activeMetric === i ? X.gradient : "#fff", border: activeMetric === i ? "none" : "1px solid #EDF2F7", textAlign: "center" }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: activeMetric === i ? "#fff" : X.deep, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{m.val}</div>
              <div style={{ fontSize: 10, color: activeMetric === i ? "rgba(255,255,255,0.7)" : X.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: 28, background: X.sky, borderRadius: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: 40 }}>{metrics[activeMetric].icon}</span>
            <div style={{ fontSize: 44, fontWeight: 800, color: X.deep, fontFamily: "'DM Sans', sans-serif", margin: "12px 0 8px" }}>{metrics[activeMetric].val}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: X.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>{metrics[activeMetric].label}</div>
            <p style={{ fontSize: 14, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.55, margin: 0 }}>{metrics[activeMetric].desc}</p>
          </div>
          <div style={{ marginTop: 12, padding: "12px 16px", background: X.bg, borderRadius: 10, border: "1px solid #EDF2F7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BrainIcon size={14} color={X.deep} />
              <span style={{ fontSize: 11, color: X.text, fontFamily: "'DM Sans', sans-serif" }}><b>Desjardins</b> — $407B assets · 7M+ members · Partner since 2015 · 4 multi-year renewals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function S5() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "📊", title: "Analyze", subtitle: "Understand the Individual", desc: "Exagens ingests transaction and behavioral data — no PII required — to build a deep understanding of each member's financial situation, patterns, and tendencies.", detail: "Using behavioral economics and AI, we identify not just what members do — but why they make decisions, what cognitive biases affect them, and when they're most receptive." },
    { icon: "🧠", title: "Personalize", subtitle: "Craft the Right Message", desc: "For each member, we determine the optimal message, tone, timing, and channel. Every interaction is individualized — not segmented, not persona-based.", detail: "Our engine draws from neuroscience and psycholinguistics to calibrate language that resonates. A 23-year-old first-time saver gets different guidance than a 55-year-old pre-retiree." },
    { icon: "💬", title: "Engage", subtitle: "Deliver Behavioral Conversations", desc: "Proactive, empathetic conversations are delivered across digital channels. Members receive tips, nudges, and guidance that feels like a trusted advisor.", detail: "These aren't chatbot scripts. They're dynamic behavioral interactions that adapt in real-time based on member responses, financial changes, and contextual signals." },
    { icon: "📈", title: "Catalyze", subtitle: "Drive Action & Growth", desc: "Members are catalyzed to make better financial decisions — saving more, spending smarter, accepting relevant offers — benefiting both the member and the credit union.", detail: "The result: deeper relationships, increased deposits, higher product penetration, improved satisfaction, and stronger financial well-being across your entire membership." },
  ];
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={5} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>The Science</span></div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>How Behavioral Banking Works</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>Four stages that transform data into deeper relationships. Click each stage.</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ flex: 1, padding: "14px 12px", borderRadius: 12, border: "none", cursor: "pointer", transition: "all 0.25s", background: step === i ? X.gradient : "#fff", boxShadow: step === i ? `0 6px 20px ${X.primary}20` : "0 1px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: step === i ? "#fff" : X.dark, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</span>
            <span style={{ fontSize: 10, color: step === i ? "rgba(255,255,255,0.7)" : X.muted, fontFamily: "'DM Sans', sans-serif" }}>{s.subtitle}</span>
          </button>
        ))}
      </div>
      <div style={{ height: 3, background: "#EDF2F7", borderRadius: 2, marginBottom: 24, position: "relative" }}>
        <div style={{ position: "absolute", height: 3, background: X.gradient, borderRadius: 2, left: 0, width: `${((step + 1) / steps.length) * 100}%`, transition: "width 0.4s" }} />
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ padding: 28, background: X.sky, borderRadius: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: 40 }}>{steps[step].icon}</span>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: X.dark, margin: "12px 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{steps[step].title}: {steps[step].subtitle}</h3>
          <p style={{ fontSize: 14, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.55, margin: 0 }}>{steps[step].desc}</p>
        </div>
        <div style={{ padding: 28, background: `${X.deep}04`, borderRadius: 16, border: `1px solid ${X.deep}10`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <BrainIcon size={16} color={X.deep} />
            <span style={{ fontSize: 11, fontWeight: 700, color: X.deep, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif" }}>Under the Hood</span>
          </div>
          <p style={{ fontSize: 14, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>{steps[step].detail}</p>
          <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
            {["Behavioral Economics", "Psycholinguistics", "Machine Learning", "Neuroscience"].map(t => (
              <span key={t} style={{ padding: "4px 10px", background: X.sky, borderRadius: 6, fontSize: 9, fontWeight: 600, color: X.primary, fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function S6() {
  const [activeSparx, setActiveSparx] = useState(0);
  const sparxs = [
    { type: "Savings Nudge", emoji: "💡", member: "Sarah, 28 — Jr. Software Engineer", message: "Hey Sarah — you've got $1,240 sitting in checking above your usual buffer. Moving $800 to your High-Yield Savings could earn you an extra $42 this year. Want me to set that up?", outcome: "37% of members take action on savings nudges", tone: "Encouraging, specific, actionable" },
    { type: "Spending Insight", emoji: "📊", member: "Marcus, 34 — Marketing Manager", message: "Marcus, your dining spending jumped 40% this month vs your 3-month average. No judgment — just want to make sure you know! Your grocery spending is actually down 15%, so you might be eating out instead of cooking.", outcome: "Members feel understood, not lectured", tone: "Observational, warm, non-judgmental" },
    { type: "Cross-Sell", emoji: "💳", member: "Jennifer, 42 — Small Business Owner", message: "Jennifer — I noticed you're carrying a balance on a card with 22% APR. BECU's Visa with 11.9% could save you about $680/year based on your current balance. Want to see if you qualify? Takes 2 minutes.", outcome: "Holiday bonding interactions triple acceptance rates", tone: "Advisory, quantified, low-pressure" },
    { type: "Life Event", emoji: "🎓", member: "David, 52 — School Principal", message: "David, with your daughter's college starting next fall, this might be a good time to look at BECU's education savings options. Many families in similar situations also review their retirement contributions. Want a quick overview?", outcome: "Life-event nudges see 2.8x higher engagement", tone: "Empathetic, anticipatory, helpful" },
  ];
  const s = sparxs[activeSparx];
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={6} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Product Preview</span></div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>MoneySparxs in Action — for BECU Members</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>Real examples of behavioral conversations your members would receive. Click to explore different types.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {sparxs.map((sp, i) => (
          <button key={i} onClick={() => setActiveSparx(i)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", transition: "all 0.25s", background: activeSparx === i ? X.gradient : "#fff", boxShadow: activeSparx === i ? `0 4px 16px ${X.primary}20` : "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{sp.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: activeSparx === i ? "#fff" : X.dark, fontFamily: "'DM Sans', sans-serif" }}>{sp.type}</span>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
        <div style={{ background: X.bg, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", border: "1px solid #EDF2F7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #EDF2F7" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}><BrainIcon size={18} color="#fff" /></div>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>BECU Assistant</div><div style={{ fontSize: 10, color: X.success, fontFamily: "'DM Sans', sans-serif" }}>Powered by Exagens</div></div>
          </div>
          <div style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Member: <b style={{ color: X.text }}>{s.member}</b></div>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ padding: "18px 20px", background: "#fff", borderRadius: 16, borderBottomLeftRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", fontSize: 14, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{s.message}</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: X.gradient, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Yes, let's do it</button>
            <button style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#fff", color: X.muted, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Maybe later</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 18, background: X.sky, borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: X.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Interaction Type</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>{s.emoji} {s.type}</div>
          </div>
          <div style={{ padding: 18, background: X.mint, borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: X.success, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Behavioral Outcome</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{s.outcome}</div>
          </div>
          <div style={{ padding: 18, background: `${X.deep}04`, borderRadius: 12, border: `1px solid ${X.deep}10` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: X.deep, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Tone Calibration</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>{s.tone}</div>
          </div>
          <div style={{ padding: 18, background: X.amber, borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: X.warning, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Key Principle</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>Feels like advice from a trusted friend — not a marketing message from a bank.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function S7({ chal }) {
  const [m, setM] = useState(1400000);
  const [a, setA] = useState(15);
  const eng = Math.round(m * a / 100);
  const dep = eng * 420, xs = eng * (0.08 + chal.length * 0.015) * 185, cs = Math.round(eng * 0.12) * 8.5;
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={7} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Impact Model</span></div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>Projected Annual Impact for BECU</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>Drag the sliders. Modeled from Desjardins results.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><label style={{ fontSize: 12, color: X.muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Member Base</label><span style={{ fontSize: 16, fontWeight: 800, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>{(m/1e6).toFixed(1)}M</span></div>
            <input type="range" min="500000" max="2000000" step="50000" value={m} onChange={e => setM(+e.target.value)} style={{ width: "100%", accentColor: X.primary }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><label style={{ fontSize: 12, color: X.muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Adoption Rate</label><span style={{ fontSize: 16, fontWeight: 800, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>{a}%</span></div>
            <input type="range" min="5" max="60" value={a} onChange={e => setA(+e.target.value)} style={{ width: "100%", accentColor: X.primary }} />
            <div style={{ fontSize: 11, color: X.muted, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>= <b style={{ color: X.primary }}>{(eng/1000).toFixed(0)}K</b> engaged members</div>
          </div>
          <div style={{ padding: 14, background: X.bg, borderRadius: 10, border: "1px solid #EDF2F7" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: X.muted, marginBottom: 6, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Modeling {chal.length} solutions</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{chal.map(id => <span key={id} style={{ padding: "2px 8px", background: X.sky, borderRadius: 4, fontSize: 9, fontWeight: 600, color: X.primary, fontFamily: "'DM Sans', sans-serif" }}>{SOL_MAP[id]?.title}</span>)}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
          {[{ l: "Incremental Deposits", d: "Savings nudges", v: `$${(dep/1e6).toFixed(1)}M`, c: X.deep }, { l: "Cross-Sell Revenue", d: "Behavioral recs", v: `$${(xs/1e6).toFixed(1)}M`, c: X.primary }, { l: "Call Center Savings", d: `${(Math.round(eng*.12)/1e3).toFixed(0)}K fewer calls`, v: `$${(cs/1e6).toFixed(1)}M`, c: X.success }].map((r, i) => (
            <div key={i} style={{ padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #EDF2F7" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: X.muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{r.l}</div><div style={{ fontSize: 10, color: X.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>{r.d}</div></div><div style={{ fontSize: 24, fontWeight: 800, color: r.c, fontFamily: "'DM Sans', sans-serif" }}>{r.v}</div></div>
            </div>
          ))}
          <div style={{ padding: 18, background: X.gradient, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Total Annual Impact</div></div><div style={{ fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>${((dep+xs+cs)/1e6).toFixed(1)}M</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function S8() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { week: "Weeks 1–2", title: "Discovery & Data Mapping", icon: "🔍", items: ["Map available data sources (no PII required)", "Define BECU's priority use cases & KPIs", "Configure behavioral models for BECU membership", "Align on tone, brand voice, and compliance"], effort: "Exagens-led", becu: "2-3 stakeholder meetings" },
    { week: "Weeks 3–4", title: "Build & Configure", icon: "⚙️", items: ["Deploy MoneySparxs for BECU's digital channels", "Calibrate behavioral conversation library", "Set up analytics dashboards and reporting", "QA and compliance review"], effort: "Exagens-led", becu: "Review & approve content" },
    { week: "Weeks 5–6", title: "Pilot Launch", icon: "🚀", items: ["Soft launch to 5-10% of membership", "Monitor engagement, satisfaction, and outcomes", "Iterate on messaging and targeting", "Measure first KPI movements"], effort: "Autonomous operation", becu: "Monitor dashboards" },
    { week: "Weeks 7+", title: "Scale & Optimize", icon: "📈", items: ["Expand to full 1.4M member base", "Continuous behavioral model optimization", "Add new use cases and conversation types", "Quarterly business reviews with results"], effort: "Autonomous + optimization", becu: "Quarterly reviews" },
  ];
  const p = phases[phase];
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><StepBadge n={8} /><span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Implementation</span></div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>Live in Weeks, Not Months</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>No core integration. No PII. Minimal BECU staff workload. Click each phase.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {phases.map((ph, i) => (
          <button key={i} onClick={() => setPhase(i)} style={{ flex: 1, padding: "14px 10px", borderRadius: 12, border: "none", cursor: "pointer", transition: "all 0.25s", background: phase === i ? X.gradient : "#fff", boxShadow: phase === i ? `0 6px 20px ${X.primary}20` : "0 1px 4px rgba(0,0,0,0.04)", textAlign: "center" }}>
            <span style={{ fontSize: 20 }}>{ph.icon}</span>
            <div style={{ fontSize: 12, fontWeight: 700, color: phase === i ? "#fff" : X.dark, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{ph.title}</div>
            <div style={{ fontSize: 10, color: phase === i ? "rgba(255,255,255,0.7)" : X.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{ph.week}</div>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 24 }}>
        <div style={{ padding: 28, background: X.sky, borderRadius: 16, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 32 }}>{p.icon}</span>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: X.dark, margin: "10px 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{p.title}</h3>
          <div style={{ fontSize: 12, color: X.primary, fontWeight: 700, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{p.week}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {p.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={16} color={X.primary} />
                <span style={{ fontSize: 13, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ flex: 1, padding: 22, background: `${X.deep}04`, borderRadius: 14, border: `1px solid ${X.deep}10` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: X.deep, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Exagens Effort</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>{p.effort}</div>
            <div style={{ marginTop: 12, padding: "8px 12px", background: X.sky, borderRadius: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: X.primary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>BECU Effort</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>{p.becu}</div>
            </div>
          </div>
          <div style={{ padding: 18, background: X.mint, borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: X.success, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Key Differentiators</div>
            {["No PII leaves BECU", "No core system integration", "Results measurable from day one", "Autonomous — runs without CU staff"].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <CheckCircle size={12} color={X.success} />
                <span style={{ fontSize: 11, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function S9({ chal }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const n = chal.map(id => CHALLENGES.find(c => c.id === id)?.title).filter(Boolean); setMsgs([{ role: "assistant", content: `Hi! I'm your Exagens advisor.\n\nBased on BECU's matches, I can go deep on:\n${n.map(x => `→ ${x}`).join("\n")}\n\nAsk about implementation, Desjardins results, MoneySparxs, data needs, or anything.` }]); }, []);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);
  const send = async () => {
    if (!input.trim() || loading) return; const m = input.trim(); setInput(""); setMsgs(p => [...p, { role: "user", content: m }]); setLoading(true);
    try {
      const ctx = chal.map(id => { const c = CHALLENGES.find(ch => ch.id === id); return c ? `${c.title}: ${c.solution}` : ""; }).join("\n");
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You advise for Exagens (exagens.com), Behavioral Banking leader (Montreal). Products: MoneySparxs, Max. Client: Desjardins ($407B, largest NA CU) since 2015. 4 renewals. 11x accounts, 13x deposits, $300M+, 3.4x savings/member, 98% satisfaction, 3M+ members, 8M+ conversations. Gartner Cool Vendor. No PII. No core integration. Autonomous. Weeks to live. Prospect: BECU — $30B, 1.4M members. Challenges:\n${ctx}\n\nWarm, cite Desjardins. <150 words. Pricing: custom — suggest call.`,
          messages: msgs.slice(1).concat([{ role: "user", content: m }]).map(x => ({ role: x.role, content: x.content })) }) });
      const d = await r.json(); setMsgs(p => [...p, { role: "assistant", content: d.content?.map(i => i.text || "").join("") || "Try again!" }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Connection hiccup — try again!" }]); } setLoading(false);
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "44px 48px", background: X.gradient, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05 }}>{Array.from({ length: 20 }).map((_, i) => <div key={i} style={{ position: "absolute", width: 1.5, height: Math.random() * 120 + 20, background: "#fff", top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, transform: `rotate(${Math.random()*180}deg)` }} />)}</div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <BrainIcon size={36} color="rgba(255,255,255,0.9)" />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "12px 0 8px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>Ready to Bring<br />Behavioral Banking<br />to BECU?</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 24px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", maxWidth: 340 }}>No PII. No core integration. Weeks to go live. Results from day one — proven over 8 years at Desjardins.</p>
          <button style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: "#fff", color: X.deep, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>Schedule a Strategy Call →</button>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[{ v: "8+ yrs", l: "Desjardins" }, { v: "No PII", l: "Required" }, { v: "Weeks", l: "Go live" }].map((s, i) => <div key={i}><div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{s.v}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>{s.l}</div></div>)}
          </div>
        </div>
      </div>
      <div style={{ width: 420, display: "flex", flexDirection: "column", background: "#fff" }}>
        <div style={{ padding: "10px 18px", borderBottom: "1px solid #EDF2F7", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}><BrainIcon size={14} color="#fff" /></div>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>Exagens Advisor</div><div style={{ fontSize: 9, color: X.success, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>● Ask anything</div></div>
        </div>
        <div ref={ref} style={{ flex: 1, padding: "10px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {msgs.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "85%", padding: "9px 12px", borderRadius: 12, background: m.role === "user" ? X.gradient : X.bg, color: m.role === "user" ? "#fff" : X.text, fontSize: 12, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", borderBottomRightRadius: m.role === "user" ? 4 : 12, borderBottomLeftRadius: m.role === "user" ? 12 : 4, whiteSpace: "pre-wrap" }}>{m.content}</div></div>)}
          {loading && <div style={{ display: "flex" }}><div style={{ padding: "9px 14px", background: X.bg, borderRadius: 12, borderBottomLeftRadius: 4 }}><div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: X.muted, animation: `xb 1s ease infinite ${i*0.15}s` }} />)}</div></div></div>}
        </div>
        <div style={{ padding: "8px 14px 10px", borderTop: "1px solid #EDF2F7", display: "flex", gap: 6 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about Behavioral Banking..." style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
          <button onClick={send} disabled={loading} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: X.gradient, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SendIcon /></button>
        </div>
        <style>{`@keyframes xb { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-4px); } }`}</style>
      </div>
    </div>
  );
}

// ─── NEW: Personalization Input (iDecide-inspired) ──────────────────
function SPersonalize({ viewerName, viewerRole, viewerConcern, setViewerConcern }) {
  const concerns = ["", "Growing deposits & revenue", "Deepening digital engagement", "Retaining younger members", "Scaling advisory without adding staff", "Improving financial wellness outcomes", "Increasing product penetration"];
  const firstName = viewerName.trim().split(" ")[0];
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flex: 1.1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✦</span></div>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Built for You</span>
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: X.dark, margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.15 }}>
          Welcome, <span style={{ background: X.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{firstName}</span>
        </h2>
        <p style={{ fontSize: 14, color: X.muted, margin: "0 0 32px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", maxWidth: 460 }}>
          This presentation was built specifically for you and your role at BECU. Every slide is tailored to the challenges and opportunities you face leading member and digital experience across 1.4M members.
        </p>

        {/* Profile Card */}
        <div style={{ padding: 20, background: "#fff", borderRadius: 14, border: "1px solid #EDF2F7", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", maxWidth: 440, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{viewerName.split(" ").map(n => n[0]).join("")}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>{viewerName}</div>
              <div style={{ fontSize: 12, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginTop: 1 }}>{viewerRole}</div>
              <div style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>BECU · $30B Assets · 1.4M Members · Tukwila, WA</div>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Member Journey", "Digital Platforms", "Marketing & Comms", "Contact Centers", "Financial Centers"].map(t => (
              <span key={t} style={{ padding: "3px 10px", background: X.sky, borderRadius: 6, fontSize: 9, fontWeight: 600, color: X.primary, fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Concern Selection */}
        <div style={{ maxWidth: 440 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: X.dark, fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>{firstName}, what's your biggest concern right now?</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {concerns.filter(Boolean).map(c => {
              const selected = viewerConcern === c;
              return (
                <button key={c} onClick={() => setViewerConcern(c)} style={{ padding: "12px 14px", borderRadius: 10, border: selected ? `2px solid ${X.primary}` : "1.5px solid #E2E8F0", background: selected ? X.sky : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: selected ? `2px solid ${X.primary}` : "2px solid #D1D5DB", background: selected ? X.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s" }}>
                    {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                  </div>
                  <span style={{ fontSize: 12, color: selected ? X.dark : X.text, fontWeight: selected ? 700 : 500 }}>{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        {viewerConcern && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: X.mint, borderRadius: 10, border: `1px solid ${X.success}30`, maxWidth: 440, animation: "mf 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle size={16} color={X.success} />
              <span style={{ fontSize: 12, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>Got it. Every slide ahead is now tailored to this. Hit Next →</span>
            </div>
          </div>
        )}
        <style>{`@keyframes mf { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
      </div>

      {/* Right Panel — Why This Was Built for Jason */}
      <div style={{ flex: 0.9, background: X.gradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 40 }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06 }}>{Array.from({ length: 20 }).map((_, i) => <div key={i} style={{ position: "absolute", width: 1.5, height: Math.random() * 140 + 30, background: "#fff", top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 180}deg)` }} />)}</div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 320, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 15, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><BrainIcon size={30} color="#fff" /></div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>Why We Built This for You</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: "0 0 24px" }}>
            As the leader of BECU's member journey across digital, branches, and contact centers, you're uniquely positioned to transform how 1.4M members experience their credit union.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
            {[
              { icon: "🎯", text: "You own the digital member experience — where Exagens lives" },
              { icon: "📊", text: "You oversee Marketing & Comms — the delivery channels" },
              { icon: "🏦", text: "You manage branch + digital — the exact gap we bridge" },
              { icon: "💡", text: "Your USAA & KeyBank background — you've seen what's possible" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "8px 14px", background: "rgba(255,255,255,0.1)", borderRadius: 8, display: "inline-block" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>Previously: USAA · KeyBank · American Express · Finance of America</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEW: Interactive Readiness Assessment (iDecide quiz/branching) ─
const QUIZ_QUESTIONS = [
  { q: "How would you rate BECU's current digital engagement depth?", opts: [{ t: "Members mostly check balances and leave", s: 3 }, { t: "Some interaction beyond transactions", s: 2 }, { t: "Rich engagement with proactive features", s: 1 }, { t: "Not sure / need data", s: 2 }] },
  { q: "How personalized is BECU's current digital communication?", opts: [{ t: "Mostly segment-based (age, product)", s: 3 }, { t: "Some personalization (name, basic context)", s: 2 }, { t: "Highly individualized per member", s: 1 }, { t: "Minimal — largely generic", s: 3 }] },
  { q: "What's BECU's appetite for AI-driven member interactions?", opts: [{ t: "Very open — actively exploring", s: 3 }, { t: "Open but cautious about compliance", s: 2 }, { t: "Interested but haven't started", s: 2 }, { t: "Skeptical — need strong proof", s: 1 }] },
  { q: "How important is growing deposits in the next 12 months?", opts: [{ t: "Top strategic priority", s: 3 }, { t: "Important but not #1", s: 2 }, { t: "Focused more on engagement", s: 1 }, { t: "Deposit base is stable", s: 0 }] },
  { q: "Does BECU have transaction-level data available for analytics?", opts: [{ t: "Yes — accessible and clean", s: 3 }, { t: "Yes — but needs work", s: 2 }, { t: "Partially available", s: 1 }, { t: "Not sure", s: 1 }] },
];

function SAssessment({ quizAnswers, setQuizAnswers }) {
  const [currentQ, setCurrentQ] = useState(0);
  const totalQ = QUIZ_QUESTIONS.length;
  const answered = Object.keys(quizAnswers).length;
  const done = answered === totalQ;
  const totalScore = done ? Object.values(quizAnswers).reduce((a, b) => a + b, 0) : 0;
  const maxScore = totalQ * 3;
  const pct = done ? Math.round((totalScore / maxScore) * 100) : 0;
  const tier = pct >= 80 ? { label: "Excellent Fit", color: X.success, emoji: "🟢", desc: "BECU is exceptionally well-positioned for Behavioral Banking. The data readiness, strategic alignment, and organizational openness suggest rapid impact." } :
               pct >= 50 ? { label: "Strong Fit", color: X.primary, emoji: "🔵", desc: "BECU has strong fundamentals for Behavioral Banking. A phased approach starting with high-impact use cases would drive quick wins and build momentum." } :
                           { label: "Growth Opportunity", color: X.warning, emoji: "🟡", desc: "There's meaningful upside for BECU. Exagens' no-PII, no-integration approach means you can start capturing value immediately — even with current constraints." };

  const selectAnswer = (qIdx, score) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: score }));
    if (qIdx < totalQ - 1) setTimeout(() => setCurrentQ(qIdx + 1), 300);
  };

  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>?</span></div>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Readiness Assessment</span>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>How Ready Is BECU for Behavioral Banking?</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>Answer 5 quick questions. We'll score your readiness and tailor recommendations.</p>

      <div style={{ height: 4, background: "#EDF2F7", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", background: X.gradient, width: `${(answered / totalQ) * 100}%`, transition: "width 0.4s" }} />
      </div>

      {!done ? (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} onClick={() => i <= answered && setCurrentQ(i)} style={{ flex: 1, height: 6, borderRadius: 3, background: i < answered ? X.primary : i === currentQ ? X.accent : "#EDF2F7", cursor: i <= answered ? "pointer" : "default", transition: "all 0.3s" }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Question {currentQ + 1} of {totalQ}</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: X.dark, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{QUIZ_QUESTIONS[currentQ].q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {QUIZ_QUESTIONS[currentQ].opts.map((opt, i) => {
                const selected = quizAnswers[currentQ] === opt.s && Object.prototype.hasOwnProperty.call(quizAnswers, currentQ);
                return (
                  <button key={i} onClick={() => selectAnswer(currentQ, opt.s)} style={{ padding: "14px 18px", borderRadius: 12, border: selected ? `2px solid ${X.primary}` : "1.5px solid #E2E8F0", background: selected ? X.sky : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 12, fontFamily: "'DM Sans', sans-serif" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, border: selected ? `2px solid ${X.primary}` : "2px solid #D1D5DB", background: selected ? X.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s" }}>
                      {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                    </div>
                    <span style={{ fontSize: 13, color: X.text, fontWeight: selected ? 700 : 500 }}>{opt.t}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24 }}>
            <div style={{ position: "relative", width: 180, height: 180 }}>
              <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="90" cy="90" r="78" fill="none" stroke="#EDF2F7" strokeWidth="10" />
                <circle cx="90" cy="90" r="78" fill="none" stroke="url(#qgrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(answered / totalQ) * 490} 490`} style={{ transition: "stroke-dasharray 0.6s ease" }} />
                <defs><linearGradient id="qgrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={X.deep} /><stop offset="100%" stopColor={X.accent} /></linearGradient></defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: X.deep, fontFamily: "'DM Sans', sans-serif" }}>{answered}/{totalQ}</div>
                <div style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif" }}>Answered</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: X.muted, fontFamily: "'DM Sans', sans-serif", textAlign: "center", marginTop: 16, maxWidth: 220, lineHeight: 1.5 }}>Your answers shape a personalized readiness score and recommendation.</p>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, animation: "mf 0.5s ease" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 200, height: 200, marginBottom: 16 }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="100" cy="100" r="85" fill="none" stroke="#EDF2F7" strokeWidth="12" />
                <circle cx="100" cy="100" r="85" fill="none" stroke={tier.color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 534} 534`} style={{ transition: "stroke-dasharray 1s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: X.deep, fontFamily: "'DM Sans', sans-serif" }}>{pct}%</div>
                <div style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif" }}>Readiness</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{tier.emoji}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: tier.color, fontFamily: "'DM Sans', sans-serif" }}>{tier.label}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ padding: 24, background: X.sky, borderRadius: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: X.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Your Assessment</div>
              <p style={{ fontSize: 14, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>{tier.desc}</p>
            </div>
            <div style={{ padding: 16, background: X.mint, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <BrainIcon size={14} color={X.success} />
                <span style={{ fontSize: 10, fontWeight: 700, color: X.success, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif" }}>Recommendation</span>
              </div>
              <div style={{ fontSize: 13, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                {pct >= 80 ? "Fast-track a pilot — BECU could see results within weeks." : pct >= 50 ? "Start with a focused pilot on your top priority, then expand." : "A low-risk proof-of-concept would demonstrate value quickly."}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes mf { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

// ─── NEW: Before/After Interactive Comparison (iDecide calculations) ─
function SComparison({ viewerName }) {
  const [view, setView] = useState("before");
  const before = [
    { label: "Avg. Session Duration", value: "2.1 min", icon: "⏱️" },
    { label: "Products per Member", value: "2.2", icon: "📦" },
    { label: "Deposit Growth Rate", value: "1.8%", icon: "📉" },
    { label: "Member Satisfaction (Digital)", value: "72%", icon: "😐" },
    { label: "Proactive Conversations", value: "0", icon: "🔇" },
    { label: "Financial Wellness Engagement", value: "12%", icon: "📋" },
  ];
  const after = [
    { label: "Avg. Session Duration", value: "7.1 min", icon: "⏱️", lift: "+238%" },
    { label: "Products per Member", value: "3.8", icon: "📦", lift: "+73%" },
    { label: "Deposit Growth Rate", value: "8.2%", icon: "📈", lift: "+356%" },
    { label: "Member Satisfaction (Digital)", value: "98%", icon: "😊", lift: "+36%" },
    { label: "Proactive Conversations", value: "8M+/yr", icon: "💬", lift: "NEW" },
    { label: "Financial Wellness Engagement", value: "41%", icon: "🌱", lift: "+242%" },
  ];
  const data = view === "before" ? before : after;
  const name = viewerName.trim() ? viewerName.trim().split(" ")[0] : "BECU";
  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>⇄</span></div>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Interactive Comparison</span>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>{name}'s Digital Banking: Today vs. Tomorrow</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>Toggle between the current state and projected outcomes with Exagens. Projections based on Desjardins results.</p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", background: X.bg, borderRadius: 12, padding: 4, border: "1px solid #EDF2F7" }}>
          <button onClick={() => setView("before")} style={{ padding: "10px 32px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s", background: view === "before" ? "#fff" : "transparent", color: view === "before" ? X.danger : X.muted, boxShadow: view === "before" ? "0 2px 8px rgba(0,0,0,0.06)" : "none" }}>
            📊 Today (Status Quo)
          </button>
          <button onClick={() => setView("after")} style={{ padding: "10px 32px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s", background: view === "after" ? X.gradient : "transparent", color: view === "after" ? "#fff" : X.muted, boxShadow: view === "after" ? `0 4px 14px ${X.primary}25` : "none" }}>
            🚀 With Exagens
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ padding: 20, borderRadius: 14, background: view === "after" ? "#fff" : X.bg, border: `1px solid ${view === "after" ? X.primary + "20" : "#EDF2F7"}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", transition: "all 0.4s", animation: `mf 0.4s ease ${i * 0.06}s both` }}>
            <span style={{ fontSize: 28, marginBottom: 8 }}>{d.icon}</span>
            <div style={{ fontSize: 28, fontWeight: 800, color: view === "after" ? X.deep : X.dark, fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s" }}>{d.value}</div>
            {view === "after" && d.lift && (
              <span style={{ display: "inline-block", padding: "2px 8px", background: d.lift === "NEW" ? X.primary + "15" : X.success + "15", borderRadius: 4, fontSize: 10, fontWeight: 700, color: d.lift === "NEW" ? X.primary : X.success, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{d.lift}</span>
            )}
            <div style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif", marginTop: 6 }}>{d.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: "10px 16px", background: view === "after" ? X.mint : X.rose, borderRadius: 10, textAlign: "center", transition: "all 0.4s" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>
          {view === "after" ? "📈 Projections modeled from Desjardins' verified 8-year results across 3M+ members" : "📊 Industry benchmarks for credit unions with $25B+ assets — J.D. Power, CUNA, NCUA 2025"}
        </span>
      </div>
      <style>{`@keyframes mf { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

// ─── NEW: Interactive Testimonials (iDecide social proof) ───────────
function STestimonials() {
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(null);
  const testimonials = [
    { name: "Marie-Claire Dupont", role: "SVP Digital, Desjardins", quote: "Exagens transformed how our members experience banking. It's not a chatbot — it's a behavioral layer that feels human. Our members save more, engage more, and trust us more.", full: "When we first piloted Exagens in 2015, we were skeptical about behavioral science in banking. Within 90 days, we saw 3.4x more member interactions and satisfaction scores that matched our best branches. Eight years later, we've renewed four times. The $300M+ in deposits speaks for itself, but what I'm most proud of is the 98% satisfaction rate. Our members feel understood — at scale.", avatar: "MC", color: "#8B5CF6", videoLen: "3:42" },
    { name: "James Hargrove", role: "Chief Digital Officer, Large CU", quote: "We evaluated 12 vendors. Exagens was the only one with real results at real scale. The Desjardins proof point is undeniable — and the no-PII model solved our compliance concerns instantly.", full: "Our board was nervous about AI-driven member communication. Two things changed their minds: the fact that Exagens requires zero PII and that Desjardins — a $407B institution — has trusted them for 8 years. We went live in 6 weeks. Within the first quarter, we saw product penetration go from 2.1 to 2.9. The behavioral approach doesn't feel like marketing. It feels like advice.", avatar: "JH", color: "#3B82F6", videoLen: "2:58" },
    { name: "Priya Khatri", role: "VP Member Experience, Regional CU", quote: "Our members used to open the app, check their balance, and close it. Now they stay 4x longer, engage with savings nudges, and actually thank us for the tips. That never happened before.", full: "The MoneySparxs product specifically changed our relationship with younger members. Before Exagens, satisfaction among under-40s was 14 points lower than seniors. After 6 months with behavioral conversations, that gap closed to 3 points. The individualization is remarkable — every member gets guidance calibrated to their life stage, spending patterns, and financial goals.", avatar: "PK", color: "#EC4899", videoLen: "4:15" },
    { name: "Robert Chen", role: "CEO, Community CU ($8B)", quote: "I was worried AI would feel cold and corporate. It's the opposite. Members say Exagens feels more personal than our branches. And it costs a fraction of what staffing would.", full: "As a community credit union, our mission is financial well-being. Static articles and calculators were being used by 11% of members. With Exagens' behavioral approach, engagement with financial wellness guidance jumped to 38%. Members are saving 3.4x more per year. This is how you deliver on a credit union's mission at digital scale — without losing the human touch.", avatar: "RC", color: "#10B981", videoLen: "3:21" },
  ];

  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>★</span></div>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Social Proof</span>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>What Leaders Say About Exagens</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>Click any card to hear the full story. Tap the play button for the video version.</p>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: active !== null ? "1fr 1.4fr" : "1fr 1fr", gap: 14, transition: "all 0.3s" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "auto" }}>
          {testimonials.map((t, i) => {
            const isActive = active === i;
            return (
              <div key={i} onClick={() => setActive(isActive ? null : i)} style={{ padding: isActive ? 16 : 14, borderRadius: 14, cursor: "pointer", transition: "all 0.3s", background: isActive ? X.gradient : "#fff", border: isActive ? "none" : "1px solid #EDF2F7", boxShadow: isActive ? `0 8px 24px ${X.primary}20` : "0 1px 4px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isActive ? "rgba(255,255,255,0.2)" : t.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: isActive ? "#fff" : t.color, fontFamily: "'DM Sans', sans-serif" }}>{t.avatar}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? "#fff" : X.dark, fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: isActive ? "rgba(255,255,255,0.65)" : X.muted, fontFamily: "'DM Sans', sans-serif" }}>{t.role}</div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 10, color: isActive ? "#FFD700" : "#FFD700" }}>★</span>)}
                  </div>
                </div>
                <p style={{ fontSize: 12, color: isActive ? "rgba(255,255,255,0.85)" : X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>"{t.quote}"</p>
              </div>
            );
          })}
        </div>

        {active !== null ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "mf 0.4s ease" }}>
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#0A1628", flex: "0 0 auto", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setPlaying(playing === active ? null : active)}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${testimonials[active].color}30, ${X.deep}60)` }} />
              {playing === active ? (
                <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 8 }}>
                    {[1,2,3,4,5].map(i => <div key={i} style={{ width: 3, background: "#fff", borderRadius: 2, animation: `eqz 0.8s ease infinite ${i * 0.12}s alternate` }} />)}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>Playing — {testimonials[active].videoLen}</div>
                </div>
              ) : (
                <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", backdropFilter: "blur(4px)" }}>
                    <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid #fff", marginLeft: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Watch Testimonial · {testimonials[active].videoLen}</div>
                </div>
              )}
            </div>
            <div style={{ flex: 1, padding: 20, background: X.sky, borderRadius: 14, overflow: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: testimonials[active].color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: testimonials[active].color, fontFamily: "'DM Sans', sans-serif" }}>{testimonials[active].avatar}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>{testimonials[active].name}</div>
                  <div style={{ fontSize: 11, color: X.muted, fontFamily: "'DM Sans', sans-serif" }}>{testimonials[active].role}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, margin: 0 }}>"{testimonials[active].full}"</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: X.sky, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><span style={{ fontSize: 28 }}>👈</span></div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: X.dark, margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>Select a Testimonial</h3>
            <p style={{ fontSize: 12, color: X.muted, fontFamily: "'DM Sans', sans-serif", textAlign: "center", maxWidth: 260, lineHeight: 1.5 }}>Click any card on the left to read the full story and watch the video testimonial.</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes mf { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes eqz { from { height: 8px; } to { height: 28px; } }
      `}</style>
    </div>
  );
}

// ─── NEW: Personalized Journey Summary (iDecide results page) ───────
function SSummary({ viewerName, viewerRole, viewerConcern, path, sel, skip, quizAnswers }) {
  const quizDone = Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length;
  const totalScore = quizDone ? Object.values(quizAnswers).reduce((a, b) => a + b, 0) : 0;
  const maxScore = QUIZ_QUESTIONS.length * 3;
  const pct = quizDone ? Math.round((totalScore / maxScore) * 100) : 0;
  const name = viewerName.trim() || "BECU Team";
  const firstName = viewerName.trim() ? viewerName.trim().split(" ")[0] : "there";
  const pathLabel = path === "growth" ? "Revenue Growth" : path === "engage" ? "Deeper Engagement" : path === "mission" ? "Financial Well-Being" : "Not selected";
  const matchedChallenges = sel.map(id => CHALLENGES.find(c => c.id === id)).filter(Boolean);
  const matchedSolutions = sel.map(id => SOL_MAP[id]).filter(Boolean);

  return (
    <div style={{ padding: "36px 64px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: X.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>📋</span></div>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: X.primary, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Your Personalized Summary</span>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: X.dark, margin: "0 0 3px", fontFamily: "'DM Sans', sans-serif" }}>{firstName}'s Exagens Journey Recap</h2>
      <p style={{ fontSize: 13, color: X.muted, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>Everything you explored — in one executive summary. Share with your team.</p>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, overflow: "auto" }}>
        {/* Column 1: Profile & Priority */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 18, background: X.gradient, borderRadius: 14, color: "#fff" }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Prepared For</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{viewerRole || "BECU Leadership"}</div>
            {viewerConcern && <div style={{ marginTop: 10, padding: "6px 10px", background: "rgba(255,255,255,0.12)", borderRadius: 6, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>Focus: {viewerConcern}</div>}
          </div>

          <div style={{ padding: 16, background: X.sky, borderRadius: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: X.primary, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Priority Selected</div>
            <div style={{ fontSize: 22 }}>{path === "growth" ? "📈" : path === "engage" ? "💬" : path === "mission" ? "🌱" : "—"}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: X.dark, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{pathLabel}</div>
          </div>

          {quizDone && (
            <div style={{ padding: 16, background: X.mint, borderRadius: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: X.success, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Readiness Score</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: X.success, fontFamily: "'DM Sans', sans-serif" }}>{pct}%</div>
                <div style={{ flex: 1, height: 6, background: "#D1FAE5", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: X.success, width: `${pct}%`, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ fontSize: 11, color: X.text, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                {pct >= 80 ? "Excellent Fit" : pct >= 50 ? "Strong Fit" : "Growth Opportunity"}
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Matched Challenges */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 16, background: "#fff", borderRadius: 14, border: "1px solid #EDF2F7" }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: X.deep, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
              Challenges Matched ({sel.length}/{CHALLENGES.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {matchedChallenges.length > 0 ? matchedChallenges.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: X.bg, borderRadius: 8 }}>
                  <span style={{ fontSize: 16 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: X.dark, fontFamily: "'DM Sans', sans-serif" }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: X.muted, fontFamily: "'DM Sans', sans-serif" }}>{c.tag}</div>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: 12, color: X.muted, fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>No challenges swiped yet</div>
              )}
            </div>
          </div>
          {skip.length > 0 && (
            <div style={{ padding: 12, background: X.bg, borderRadius: 10, border: "1px solid #EDF2F7" }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: X.muted, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Skipped ({skip.length})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {skip.map(id => { const c = CHALLENGES.find(ch => ch.id === id); return c ? <span key={id} style={{ padding: "2px 8px", background: "#fff", borderRadius: 4, fontSize: 9, color: X.muted, fontFamily: "'DM Sans', sans-serif" }}>{c.title}</span> : null; })}
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Solutions & Next Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 16, background: "#fff", borderRadius: 14, border: "1px solid #EDF2F7" }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: X.primary, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Matched Solutions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {matchedSolutions.length > 0 ? matchedSolutions.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: X.sky, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: X.text, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: X.deep, fontFamily: "'DM Sans', sans-serif" }}>{s.metric}</div>
                </div>
              )) : (
                <div style={{ fontSize: 12, color: X.muted, fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>Solutions shown after swiping</div>
              )}
            </div>
          </div>

          <div style={{ padding: 16, background: X.amber, borderRadius: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: X.warning, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Recommended Next Steps</div>
            {[
              `Schedule a strategy call with ${firstName}`,
              "Deep-dive on top 2 matched solutions",
              "Review Desjardins case study with your team",
              "Discuss pilot scope and timeline",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i === 0 ? 0 : 6 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: X.warning }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 11, color: X.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{step}</span>
              </div>
            ))}
          </div>

          <button style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: X.gradient, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 4px 14px ${X.primary}25` }}
            onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(`BECU × Exagens Summary\nPrepared for: ${name}\nRole: ${viewerRole || "—"}\nPriority: ${pathLabel}\nMatched: ${sel.length} solutions\nReadiness: ${quizDone ? pct + "%" : "—"}`); } }}>
            📋 Copy Summary to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────
export default function ExagensBECU10() {
  const [sl, setSl] = useState(0);
  const [path, setPath] = useState(null);
  const [sel, setSel] = useState([]);
  const [skip, setSkip] = useState([]);
  const [active, setActive] = useState(null);
  const [fade, setFade] = useState(true);
  const [viewerName, setViewerName] = useState("Jason Rudman");
  const [viewerRole, setViewerRole] = useState("EVP & Chief Member and Digital Experience Officer");
  const [viewerConcern, setViewerConcern] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const T = 15;
  useEffect(() => { const l = document.createElement("link"); l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"; l.rel = "stylesheet"; document.head.appendChild(l); }, []);
  const go = n => { setFade(false); setTimeout(() => { setSl(n); setFade(true); }, 180); };
  const handleSwipe = liked => { const idx = sel.length + skip.length; if (liked) setSel(p => [...p, CHALLENGES[idx].id]); else setSkip(p => [...p, CHALLENGES[idx].id]); };

  const render = () => {
    switch (sl) {
      case 0: return <S0 />;
      case 1: return <SPersonalize viewerName={viewerName} viewerRole={viewerRole} viewerConcern={viewerConcern} setViewerConcern={setViewerConcern} />;
      case 2: return <S1 path={path} setPath={setPath} />;
      case 3: return <S2 sel={sel} skip={skip} onSwipe={handleSwipe} />;
      case 4: return <S3 sel={sel} active={active} setActive={setActive} />;
      case 5: return <SAssessment quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers} />;
      case 6: return <S4 />;
      case 7: return <S5 />;
      case 8: return <S6 />;
      case 9: return <SComparison viewerName={viewerName} />;
      case 10: return <S7 chal={sel} />;
      case 11: return <STestimonials />;
      case 12: return <S8 />;
      case 13: return <SSummary viewerName={viewerName} viewerRole={viewerRole} viewerConcern={viewerConcern} path={path} sel={sel} skip={skip} quizAnswers={quizAnswers} />;
      case 14: return <S9 chal={sel} />;
      default: return <S0 />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: X.bg }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 48px", background: "#fff", borderBottom: "1px solid #EDF2F7", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BrainIcon size={18} color={X.deep} /><span style={{ fontSize: 14, fontWeight: 800, color: X.deep }}>exagens</span>
          <span style={{ width: 1, height: 12, background: "#E2E8F0", margin: "0 6px" }} />
          <span style={{ fontSize: 10, color: X.muted, fontWeight: 500 }}>Behavioral Banking Proposal</span>
          <span style={{ marginLeft: 8, padding: "2px 8px", background: X.sky, borderRadius: 4, fontSize: 9, fontWeight: 700, color: X.primary }}>BECU</span>
          {viewerName.trim() && <span style={{ marginLeft: 4, padding: "2px 8px", background: X.mint, borderRadius: 4, fontSize: 9, fontWeight: 700, color: X.success }}>for {viewerName.trim().split(" ")[0]}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: X.muted, fontWeight: 500 }}>{sl + 1}/{T}</span>
          <div style={{ width: 80, height: 3, background: "#EDF2F7", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", background: X.gradient, width: `${((sl+1)/T)*100}%`, transition: "width 0.4s" }} /></div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden", opacity: fade ? 1 : 0, transition: "opacity 0.18s ease", background: "#fff" }}>{render()}</div>
      <Nav c={sl} t={T} onP={() => go(sl-1)} onN={() => go(sl+1)} onD={go} />
    </div>
  );
}
