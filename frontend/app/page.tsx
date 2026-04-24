"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Rocket, GitBranch, Server, Activity, RotateCcw, Boxes
} from "lucide-react";

// ── Fake dashboard mockup ─────────────────────────────────────────────────────
const MOCK_DEPLOYMENTS = [
  { repo: "ayush/ai-voice-assistant",  branch: "main",    status: "live",     time: "2m ago",   framework: "nextjs",  commit: "a1b2c3" },
  { repo: "shruti/portfolio-v3",       branch: "main",    status: "live",     time: "18m ago",  framework: "react",   commit: "d4e5f6" },
  { repo: "akhil/devops-cloud",        branch: "devops",  status: "building", time: "1m ago",   framework: "node",    commit: "g7h8i9" },
  { repo: "ayush/resume-analyzer",     branch: "main",    status: "live",     time: "2h ago",   framework: "python",  commit: "j1k2l3" },
  { repo: "shruti/ecommerce-app",      branch: "staging", status: "failed",   time: "3h ago",   framework: "nextjs",  commit: "m4n5o6" },
  { repo: "akhil/ml-dashboard",        branch: "main",    status: "queued",   time: "just now", framework: "python",  commit: "p7q8r9" },
]

const STATUS_STYLE: Record<string, { color: string; bg: string; dot: boolean }> = {
  live:     { color: "#00ff8c", bg: "rgba(0,255,140,0.10)", dot: true  },
  building: { color: "#fbbf24", bg: "rgba(251,191,36,0.10)", dot: true  },
  failed:   { color: "#f87171", bg: "rgba(248,113,113,0.10)", dot: false },
  queued:   { color: "#94a3b8", bg: "rgba(148,163,184,0.10)", dot: false },
}

function DashboardMock() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: "flex", height: 460, overflow: "hidden", fontFamily: "var(--font-mono)", fontSize: 12 }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: "1px solid var(--c-border)", background: "#030508", padding: "20px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid var(--c-border)", marginBottom: 8 }}>
          <div style={{ color: "var(--c-green)", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>⬡ ShipStack</div>
        </div>
        {["Overview", "Deployments", "Repositories", "Logs", "Settings"].map((item, i) => (
          <div key={item} style={{
            padding: "10px 16px", color: i === 1 ? "var(--c-green)" : "var(--c-muted)",
            background: i === 1 ? "rgba(0,255,140,0.06)" : "transparent",
            borderLeft: i === 1 ? "2px solid var(--c-green)" : "2px solid transparent",
            cursor: "pointer", transition: "all .2s",
          }}>{item}</div>
        ))}
        <div style={{ marginTop: "auto", padding: "20px 16px 0", borderTop: "1px solid var(--c-border)", marginTop: 160 }}>
          <div style={{ color: "var(--c-muted)", fontSize: 11 }}>ayushkar2005</div>
          <div style={{ color: "rgba(255,255,255,0.18)", fontSize: 10, marginTop: 2 }}>Pro plan</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#030508" }}>
          <div style={{ color: "var(--c-text)", fontSize: 13, fontWeight: 700 }}>Deployments</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--c-border)", borderRadius: 6, padding: "5px 12px", color: "var(--c-muted)", fontSize: 11 }}>
              Search repos...
            </div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--c-green)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 11, fontWeight: 700 }}>A</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--c-border)" }}>
          {[
            { label: "Total", value: "6" },
            { label: "Live", value: "3" },
            { label: "Building", value: "1" },
            { label: "Failed", value: "1" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, padding: "12px 20px", borderRight: "1px solid var(--c-border)" }}>
              <div style={{ color: "var(--c-green)", fontSize: 18, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: "var(--c-muted)", fontSize: 10, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {MOCK_DEPLOYMENTS.map((d, i) => {
            const s = STATUS_STYLE[d.status]
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "background .2s", cursor: "pointer",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Repo */}
                <div style={{ flex: 2, color: "var(--c-text)", fontSize: 12 }}>
                  <div>{d.repo}</div>
                  <div style={{ color: "var(--c-muted)", fontSize: 10, marginTop: 2 }}>
                    #{d.commit} · {d.branch}
                  </div>
                </div>
                {/* Framework */}
                <div style={{ flex: 1, color: "var(--c-muted)", fontSize: 11 }}>{d.framework}</div>
                {/* Status */}
                <div style={{ flex: 1 }}>
                  <span style={{
                    background: s.bg, color: s.color,
                    padding: "3px 10px", borderRadius: 100, fontSize: 11,
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}>
                    {s.dot && (
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%", background: s.color,
                        display: "inline-block",
                        animation: d.status === "live" ? `pulse ${1 + (tick % 2) * 0}s ease infinite` : d.status === "building" ? "blink .8s step-end infinite" : "none",
                        boxShadow: d.status === "live" ? `0 0 6px ${s.color}` : "none",
                      }} />
                    )}
                    {d.status}
                  </span>
                </div>
                {/* Time */}
                <div style={{ color: "var(--c-muted)", fontSize: 11, textAlign: "right", minWidth: 70 }}>{d.time}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = end / 60;
      const tick = () => {
        start += step;
        if (start >= end) { setVal(end); return; }
        setVal(Math.floor(start));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Floating particle ─────────────────────────────────────────────────────────
// ── Floating particle ─────────────────────────────────────────────────────────
function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="particles-wrap" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${6 + Math.random() * 10}s`,
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
          opacity: 0.15 + Math.random() * 0.35,
        }} />
      ))}
    </div>
  );
}

// ── Pipeline step ─────────────────────────────────────────────────────────────
const PIPELINE = [
  { icon: "⬡", label: "Git Push",  desc: "Source ingested" },
  { icon: "⚙",  label: "Build",    desc: "Deps resolved"   },
  { icon: "▣",  label: "Docker",   desc: "Image packaged"  },
  { icon: "▲",  label: "Deploy",   desc: "Container live"  },
  { icon: "◉",  label: "Live",     desc: "Traffic routed"  },
];

function PipelineStep({ item, index, active }: { item: typeof PIPELINE[0]; index: number; active: number }) {
  const done = index < active;
  const current = index === active;
  return (
    <div className={`pipe-step ${done ? "pipe-done" : ""} ${current ? "pipe-active" : ""}`}>
      <div className="pipe-icon">{item.icon}</div>
      <div className="pipe-label">{item.label}</div>
      <div className="pipe-desc">{item.desc}</div>
      {index < PIPELINE.length - 1 && (
        <div className={`pipe-connector ${done ? "connector-done" : ""}`}>
          <div className="connector-fill" />
        </div>
      )}
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="feat-card">
      <div className="feat-icon">{icon}</div>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-desc">{desc}</p>
      <div className="feat-glow" aria-hidden />
    </div>
  );
}

// ── Terminal log ticker ───────────────────────────────────────────────────────
const LOGS = [
  "[shipstack] › cloning AyushKar2005/AI---Voice-Assistant",
  "[shipstack] › framework detected: nextjs",
  "[shipstack] › installing dependencies...",
  "[shipstack] › building docker image sha256:a1b2c3",
  "[shipstack] › container deployed on port 3000",
  "[shipstack] › health check passed ✓",
  "[shipstack] › deployment live at ship.dev/ayush/ai-assistant",
  "[shipstack] › rollback snapshot saved",
];

function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const i = useRef(0);
  useEffect(() => {
    const tick = () => {
      setLines(prev => {
        const next = [...prev, LOGS[i.current % LOGS.length]];
        return next.length > 6 ? next.slice(-6) : next;
      });
      i.current++;
    };
    tick();
    const id = setInterval(tick, 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="terminal-title">shipstack — deploy pipeline</span>
      </div>
      <div className="terminal-body">
        {lines.map((l, idx) => (
          <div key={idx} className={`log-line ${idx === lines.length - 1 ? "log-current" : ""}`}>
            <span className="log-prompt">$</span> {l}
          </div>
        ))}
        <span className="cursor" />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [pipeActive, setPipeActive] = useState(0);

  const handleLogout = async () => { await signOut(); router.push("/"); };

  useEffect(() => {
    const id = setInterval(() => {
      setPipeActive(p => (p + 1) % (PIPELINE.length + 1) === PIPELINE.length ? 0 : (p + 1) % (PIPELINE.length + 1));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        /* ── Reset / base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

        :root {
          --c-bg: #04060d;
          --c-surface: #080d18;
          --c-border: rgba(0,255,140,0.10);
          --c-border-hi: rgba(0,255,140,0.28);
          --c-green: #00ff8c;
          --c-green-dim: rgba(0,255,140,0.55);
          --c-blue: #3b7fff;
          --c-muted: rgba(255,255,255,0.38);
          --c-text: rgba(255,255,255,0.88);
          --c-text-hi: #ffffff;
          --font-display: 'Syne', sans-serif;
          --font-mono: 'Space Mono', monospace;
          --radius: 14px;
          --glow: 0 0 40px rgba(0,255,140,0.12);
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--c-bg); }
        ::-webkit-scrollbar-thumb { background: var(--c-border-hi); border-radius: 4px; }

        /* ── Particles ── */
        .particles-wrap {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
        }
        .particle {
          position: absolute; border-radius: 50%; background: var(--c-green);
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: var(--op,0.3); }
          50%  { transform: translateY(-60px) scale(1.4); }
          100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
        }

        /* ── Grid overlay ── */
        .grid-overlay {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0,255,140,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* ── Scanline ── */
        .scanline {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          );
        }

        /* ── Section wrapper ── */
        .ss-wrap {
          background: var(--c-bg);
          color: var(--c-text);
          min-height: 100vh;
          font-family: var(--font-display);
          overflow-x: hidden;
        }

        /* ── Auth bar ── */
        .auth-bar {
          position: absolute; top: 22px; right: 28px; z-index: 50;
          display: flex; align-items: center; gap: 14px;
        }
        .btn-primary {
          background: var(--c-green); color: #000;
          padding: 8px 20px; border-radius: 8px;
          font-family: var(--font-mono); font-size: 13px; font-weight: 700;
          text-decoration: none; transition: all .2s;
          box-shadow: 0 0 20px rgba(0,255,140,0.30);
        }
        .btn-primary:hover { background: #00e57d; box-shadow: 0 0 32px rgba(0,255,140,0.55); transform: translateY(-1px); }
        .avatar { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--c-border-hi); }
        .btn-logout { font-family: var(--font-mono); font-size: 12px; color: var(--c-muted); background: none; border: none; cursor: pointer; transition: color .2s; }
        .btn-logout:hover { color: var(--c-text); }

        /* ── Hero ── */
        .hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 24px 80px; overflow: hidden;
        }
        .hero-eyebrow {
          font-family: var(--font-mono); font-size: 12px; letter-spacing: 3px;
          color: var(--c-green); text-transform: uppercase; margin-bottom: 28px;
          border: 1px solid var(--c-border-hi); border-radius: 100px;
          padding: 6px 18px; display: inline-block;
          animation: fadeUp .6s ease both;
        }
        .hero-title {
          font-family: var(--font-display); font-size: clamp(52px,8vw,112px);
          font-weight: 800; line-height: 1.0; letter-spacing: -2px;
          color: var(--c-text-hi);
          animation: fadeUp .7s .1s ease both;
        }
        .hero-title span {
          background: linear-gradient(135deg, var(--c-green) 0%, #3b7fff 60%, #a855f7 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-family: var(--font-mono); font-size: clamp(13px,2vw,16px);
          color: var(--c-muted); max-width: 560px; line-height: 1.8; margin: 28px auto 0;
          animation: fadeUp .7s .2s ease both;
        }
        .hero-cta {
          display: flex; gap: 14px; justify-content: center; margin-top: 44px;
          animation: fadeUp .7s .3s ease both;
        }
        .btn-ghost {
          font-family: var(--font-mono); font-size: 13px; color: var(--c-text);
          background: transparent; border: 1px solid var(--c-border-hi);
          padding: 10px 24px; border-radius: 8px; text-decoration: none; transition: all .2s;
        }
        .btn-ghost:hover { border-color: var(--c-green); color: var(--c-green); background: rgba(0,255,140,0.04); }

        /* ── Orb blur ── */
        .orb {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px);
        }
        .orb-1 { width: 500px; height: 500px; top: -100px; left: -100px; background: rgba(0,255,140,0.06); }
        .orb-2 { width: 400px; height: 400px; bottom: -60px; right: -80px; background: rgba(59,127,255,0.07); }
        .orb-3 { width: 300px; height: 300px; top: 40%; left: 50%; transform: translate(-50%,-50%); background: rgba(168,85,247,0.05); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Stats bar ── */
        .stats-bar {
          display: flex; justify-content: center; gap: 0; flex-wrap: wrap;
          border-top: 1px solid var(--c-border); border-bottom: 1px solid var(--c-border);
          background: var(--c-surface);
        }
        .stat-item {
          flex: 1; min-width: 160px; text-align: center; padding: 28px 20px;
          border-right: 1px solid var(--c-border); position: relative;
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: var(--font-mono); font-size: 32px; font-weight: 700;
          color: var(--c-green); display: block; line-height: 1;
        }
        .stat-label {
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--c-muted); margin-top: 6px; font-family: var(--font-mono);
        }

        /* ── Pipeline ── */
        .pipeline-section {
          max-width: 1100px; margin: 0 auto; padding: 100px 24px;
        }
        .section-tag {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px;
          color: var(--c-green); text-transform: uppercase; margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(28px,4vw,48px); font-weight: 800; color: var(--c-text-hi);
          margin-bottom: 16px; line-height: 1.1;
        }
        .section-sub {
          font-family: var(--font-mono); font-size: 14px; color: var(--c-muted);
          max-width: 480px; line-height: 1.7; margin-bottom: 64px;
        }
        .pipe-row {
          display: flex; align-items: flex-start; gap: 0;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 20px; padding: 36px 28px;
          position: relative; overflow: hidden;
        }
        .pipe-row::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--c-green-dim), transparent);
        }
        .pipe-step {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          text-align: center; position: relative; transition: transform .2s;
        }
        .pipe-step:hover { transform: translateY(-4px); }
        .pipe-icon {
          font-size: 28px; width: 60px; height: 60px; border-radius: 16px;
          border: 1.5px solid var(--c-border);
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03);
          color: var(--c-muted); transition: all .35s; margin-bottom: 12px;
          font-family: var(--font-mono);
        }
        .pipe-active .pipe-icon {
          border-color: var(--c-green); color: var(--c-green);
          background: rgba(0,255,140,0.08);
          box-shadow: 0 0 24px rgba(0,255,140,0.22);
          animation: pulse 1s ease infinite;
        }
        .pipe-done .pipe-icon {
          border-color: rgba(0,255,140,0.40); color: rgba(0,255,140,0.55);
          background: rgba(0,255,140,0.04);
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 20px rgba(0,255,140,0.22); }
          50%      { box-shadow: 0 0 40px rgba(0,255,140,0.44); }
        }
        .pipe-label {
          font-family: var(--font-mono); font-size: 13px; font-weight: 700;
          color: var(--c-muted); letter-spacing: 1px; text-transform: uppercase;
          transition: color .35s;
        }
        .pipe-active .pipe-label { color: var(--c-green); }
        .pipe-done .pipe-label { color: rgba(0,255,140,0.55); }
        .pipe-desc { font-size: 11px; color: rgba(255,255,255,0.22); margin-top: 4px; font-family: var(--font-mono); }
        .pipe-connector {
          position: absolute; top: 28px; left: 50%; width: 100%;
          height: 1.5px; background: var(--c-border); overflow: hidden;
        }
        .connector-fill {
          height: 100%; width: 0%; background: var(--c-green);
          box-shadow: 0 0 8px var(--c-green-dim);
          transition: width .6s ease;
        }
        .connector-done .connector-fill { width: 100%; }

        /* ── Terminal ── */
        .terminal {
          background: #020408; border: 1px solid var(--c-border);
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,140,0.06);
          font-family: var(--font-mono);
        }
        .terminal-bar {
          background: #0a1020; padding: 12px 16px;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid var(--c-border);
        }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-r { background: #ff5f56; } .dot-y { background: #ffbd2e; } .dot-g { background: #27c93f; }
        .terminal-title { font-size: 12px; color: var(--c-muted); margin-left: 8px; letter-spacing: 1px; }
        .terminal-body { padding: 20px; min-height: 200px; }
        .log-line {
          font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.8;
          transition: color .3s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .log-current { color: var(--c-green); }
        .log-prompt { color: var(--c-blue); margin-right: 8px; }
        .cursor {
          display: inline-block; width: 8px; height: 14px;
          background: var(--c-green); vertical-align: middle; margin-left: 4px;
          animation: blink .8s step-end infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        /* ── Features ── */
        .features-section {
          max-width: 1100px; margin: 0 auto; padding: 60px 24px 120px;
        }
        .feat-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap: 16px;
        }
        .feat-card {
          background: var(--c-surface); border: 1px solid var(--c-border);
          border-radius: var(--radius); padding: 32px 28px;
          position: relative; overflow: hidden; cursor: default;
          transition: border-color .3s, transform .3s;
        }
        .feat-card:hover { border-color: var(--c-border-hi); transform: translateY(-4px); }
        .feat-card:hover .feat-glow { opacity: 1; }
        .feat-glow {
          position: absolute; bottom: -40px; right: -40px;
          width: 120px; height: 120px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,140,0.10), transparent 70%);
          opacity: 0; transition: opacity .4s; pointer-events: none;
        }
        .feat-icon { color: var(--c-green); margin-bottom: 16px; width: 28px; height: 28px; }
        .feat-title { font-size: 16px; font-weight: 700; color: var(--c-text-hi); margin-bottom: 8px; }
        .feat-desc { font-family: var(--font-mono); font-size: 12px; color: var(--c-muted); line-height: 1.7; }

        /* ── About ── */
        .about-section {
          max-width: 1100px; margin: 0 auto; padding: 60px 24px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
        }
        @media (max-width: 768px) {
          .about-section { grid-template-columns: 1fr; gap: 40px; }
          .pipe-row { flex-wrap: wrap; gap: 24px; }
          .pipe-connector { display: none; }
        }
        .about-label {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 3px;
          color: var(--c-green); text-transform: uppercase; margin-bottom: 18px;
        }
        .about-text {
          font-size: 18px; line-height: 1.85; color: var(--c-muted); font-family: var(--font-mono);
        }
        .about-text strong { color: var(--c-text-hi); font-weight: 700; }

        /* ── Dashboard preview ── */
        .preview-section {
          max-width: 1100px; margin: 0 auto; padding: 60px 24px 80px;
        }
        .preview-frame {
          border: 1px solid var(--c-border); border-radius: 20px; overflow: hidden;
          background: var(--c-surface); position: relative;
        }
        .preview-frame::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--c-green), var(--c-blue), #a855f7);
          z-index: 1;
        }
        .preview-bar {
          background: #0a1020; padding: 12px 20px;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid var(--c-border);
        }
        .preview-bar-url {
          font-family: var(--font-mono); font-size: 12px; color: var(--c-muted);
          margin-left: 12px; flex: 1;
        }

        /* ── CTA ── */
        .cta-section {
          text-align: center; padding: 100px 24px;
          position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,140,0.05), transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(36px,5vw,72px); font-weight: 800;
          line-height: 1.05; color: var(--c-text-hi); margin-bottom: 20px;
        }
        .cta-sub {
          font-family: var(--font-mono); font-size: 14px; color: var(--c-muted); margin-bottom: 40px;
        }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid var(--c-border);
          padding: 28px 40px; display: flex; justify-content: space-between; align-items: center;
        }
        .footer-brand { font-family: var(--font-mono); font-size: 13px; color: var(--c-muted); }
        .footer-brand strong { color: var(--c-green); }
        .footer-copy { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.18); }
      `}</style>

      <div className="scanline" aria-hidden />

      <main className="ss-wrap">
        <div style={{ borderRadius: 28, border: "1px solid rgba(0,255,140,0.08)", overflow: "hidden", background: "var(--c-bg)", position: "relative" }}>

          <Navbar />

          {/* Auth */}
          <div className="auth-bar">
            {!isSignedIn ? (
              <Link href="/sign-in" className="btn-primary">Sign in with GitHub</Link>
            ) : (
              <>
                <Link href="/dashboard" className="btn-primary">Dashboard</Link>
                <img src={user?.imageUrl} alt="avatar" className="avatar" />
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </>
            )}
          </div>

          {/* ── HERO ── */}
          <section className="hero">
            <Particles />
            <div className="grid-overlay" />
            <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="hero-eyebrow">Mission Control · CI/CD Platform</div>
              <h1 className="hero-title">
                Deploy.<br /><span>Launch.</span><br />Go Live.
              </h1>
              <p className="hero-sub">
                From git push to production in seconds. Docker-native pipelines,
                real-time telemetry, zero vendor lock-in.
              </p>
              <div className="hero-cta">
                <Link href="/sign-in" className="btn-primary" style={{ fontSize: 14, padding: "12px 32px" }}>
                  Launch your app →
                </Link>
                <Link href="#about" className="btn-ghost">See how it works</Link>
              </div>
            </div>
          </section>

          {/* ── STATS ── */}
          <div className="stats-bar">
            {[
              { end: 12400, suffix: "+", label: "Deployments" },
              { end: 99, suffix: ".9%", label: "Uptime" },
              { end: 340, suffix: "ms", label: "Avg build time" },
              { end: 47, suffix: "+", label: "Frameworks" },
            ].map(s => (
              <div className="stat-item" key={s.label}>
                <span className="stat-num"><Counter end={s.end} suffix={s.suffix} /></span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── PIPELINE ── */}
          <section className="pipeline-section">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div>
                <div className="section-tag">// deployment pipeline</div>
                <h2 className="section-title">Your code,<br />live in seconds.</h2>
                <p className="section-sub">
                  ShipStack orchestrates every step from source to production.
                  Watch your deployment progress in real time.
                </p>
                <Terminal />
              </div>
              <div>
                <div className="pipe-row">
                  {PIPELINE.map((item, i) => (
                    <PipelineStep key={i} item={item} index={i} active={pipeActive} />
                  ))}
                </div>
                <div style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-muted)", textAlign: "center", letterSpacing: 1 }}>
                  click the pipeline to deploy
                </div>
              </div>
            </div>
          </section>

          {/* ── DASHBOARD PREVIEW ── */}
{/* ── DASHBOARD PREVIEW ── */}
<section className="preview-section" id="features">
  <div style={{ textAlign: "center", marginBottom: 48 }}>
    <div className="section-tag" style={{ display: "inline-block" }}>// live dashboard</div>
    <h2 className="section-title">ShipStack Dashboard</h2>
  </div>
  <div className="preview-frame">
    <div className="preview-bar">
      <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
      <span className="preview-bar-url">app.shipstack.dev/dashboard</span>
    </div>
    <DashboardMock />
  </div>
</section>

          {/* ── ABOUT ── */}
          <section className="about-section" id="about">
            <div>
              <div className="about-label">// about shipstack</div>
              <h2 className="section-title">Built for devs who ship fast.</h2>
            </div>
            <div>
              <p className="about-text">
                ShipStack is a <strong>Docker-native CI/CD platform</strong> that gives developers
                full control over builds, deployments, and infrastructure —
                <strong> without vendor lock-in.</strong><br /><br />
                Connect your GitHub, select a repo, push. We handle the rest —
                from <strong>framework detection</strong> to <strong>live container routing.</strong>
              </p>
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section className="features-section">
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="section-tag" style={{ display: "inline-block" }}>// platform features</div>
              <h2 className="section-title">Everything you need.</h2>
            </div>
            <div className="feat-grid">
              <Feature icon={<GitBranch />} title="Git Deployments" desc="Push to any branch and trigger instant deployments. Automatic branch detection and rollback support built in." />
              <Feature icon={<Server />} title="Isolated Workers" desc="Every build runs in an isolated container worker. No shared state, no interference, full reproducibility." />
              <Feature icon={<Boxes />} title="Docker Pipelines" desc="Native Docker image building and registry push. Bring your own Dockerfile or let ShipStack auto-generate one." />
              <Feature icon={<Activity />} title="Real-time Logs" desc="WebSocket-powered live log streaming. Watch every build step as it happens, not after the fact." />
              <Feature icon={<RotateCcw />} title="Rollback Support" desc="Every deployment is snapshotted. One click rolls back to any previous working state instantly." />
              <Feature icon={<Rocket />} title="Fast Deployments" desc="Median deployment time under 340ms. Layer caching, parallel builds, and optimized runners." />
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="cta-section">
            <h2 className="cta-title">Ready to ship?</h2>
            <p className="cta-sub">Connect GitHub. Select repo. Deploy in seconds.</p>
            <Link href="/sign-in" className="btn-primary" style={{ fontSize: 15, padding: "14px 40px", display: "inline-block" }}>
              Get started free →
            </Link>
          </section>

          {/* ── FOOTER ── */}
          <footer className="footer">
            <div className="footer-brand"><strong>ShipStack</strong> — Deploy. Launch. Go Live.</div>
            <div className="footer-copy">© 2026 ShipStack. All rights reserved.</div>
          </footer>

        </div>
      </main>
    </>
  );
}
