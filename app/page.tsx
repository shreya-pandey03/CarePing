"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  CalendarDays,
  TrendingUp,
  Sparkles,
  Check,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Sparkles size={20} />,
    title: "AI-Powered Scheduling",
    desc: "NeuroHabit analyzes your peak energy hours and dynamically suggests when to tackle difficult habits.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Predictive Streak Protection",
    desc: "Our algorithm detects patterns in your behavior and warns you *before* you're likely to break a streak.",
  },
  {
    icon: <Activity size={20} />,
    title: "Adaptive Goals",
    desc: "Sick day? Traveling? The AI scales your habits down to 'maintenance mode' so you don't lose momentum.",
  },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --bg-main: #0f172a; /* Slate 900 */
    --bg-card: rgba(30, 41, 59, 0.6); /* Slate 800 */
    --primary: #10b981; /* Emerald 500 */
    --primary-glow: rgba(16, 185, 129, 0.4);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: rgba(255, 255, 255, 0.08);
  }

  .ht-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: var(--bg-main);
    color: var(--text-main);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  /* Ambient Background Glows */
  .ht-ambient-1 {
    position: absolute; top: -10%; left: -10%; width: 50vw; height: 50vw;
    background: radial-gradient(circle, var(--primary-glow) 0%, transparent 60%);
    filter: blur(120px); opacity: 0.5; z-index: 0; pointer-events: none;
  }
  .ht-ambient-2 {
    position: absolute; bottom: 10%; right: -10%; width: 60vw; height: 60vw;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 60%);
    filter: blur(120px); z-index: 0; pointer-events: none;
  }

  /* Navigation */
  .ht-nav {
    position: fixed; top: 0; width: 100%; z-index: 50;
    backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
    background: rgba(15, 23, 42, 0.7);
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 5%;
  }
  .ht-logo {
    display: flex; align-items: center; gap: 10px;
    font-size: 1.25rem; font-weight: 700; color: var(--text-main);
    text-decoration: none;
  }
  .ht-logo-icon { color: var(--primary); }
  .ht-btn {
    background: var(--primary); color: #022c22;
    padding: 0.6rem 1.5rem; border-radius: 999px;
    font-weight: 600; text-decoration: none; font-size: 0.9rem;
    transition: all 0.3s ease; box-shadow: 0 4px 14px var(--primary-glow);
  }
  .ht-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--primary-glow); filter: brightness(1.1); }

  /* Hero Section */
  .ht-hero {
    position: relative; z-index: 10;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; padding: 8rem 5% 4rem; align-items: center;
    max-width: 1400px; margin: 0 auto;
  }
  .ht-hero-content h1 {
    font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; line-height: 1.1;
    margin-bottom: 1.5rem; letter-spacing: -0.03em;
  }
  .ht-hero-content h1 span { color: var(--primary); }
  .ht-hero-content p {
    font-size: 1.125rem; color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.6; max-width: 500px;
  }

  /* ─── 3D Isometric Grid Effect ─── */
  .ht-isometric-wrapper {
    position: relative; width: 100%; height: 400px;
    display: flex; justify-content: center; align-items: center;
    perspective: 1200px;
  }
  .ht-iso-grid {
    display: grid; grid-template-columns: repeat(5, 50px); grid-gap: 16px;
    transform: rotateX(60deg) rotateZ(-45deg);
    transform-style: preserve-3d;
  }
  .ht-iso-cube {
    width: 50px; height: 50px; border-radius: 12px;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    transform-style: preserve-3d;
  }
  /* 3D Sides of the cube */
  .ht-iso-cube::before, .ht-iso-cube::after {
    content: ''; position: absolute; background: inherit; border: inherit; border-radius: inherit;
  }
  .ht-iso-cube::before {
    width: 100%; height: 20px; top: 100%; left: 0;
    transform-origin: top; transform: rotateX(-90deg);
    filter: brightness(0.7);
  }
  .ht-iso-cube::after {
    width: 20px; height: 100%; top: 0; left: 100%;
    transform-origin: left; transform: rotateY(90deg);
    filter: brightness(0.5);
  }

  /* Active Cube States */
  .ht-iso-cube.active {
    background: var(--primary);
    border-color: #34d399;
    transform: translateZ(30px);
    box-shadow: -15px 15px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.2);
    animation: floatCube 3s ease-in-out infinite;
  }
  .ht-iso-cube.active::before, .ht-iso-cube.active::after { border-color: #34d399; }
  
  /* Cube Delays for wave effect */
  .ht-iso-cube:nth-child(1) { animation-delay: 0.1s; }
  .ht-iso-cube:nth-child(5) { animation-delay: 0.3s; }
  .ht-iso-cube:nth-child(12) { animation-delay: 0.5s; transform: translateZ(45px); }
  .ht-iso-cube:nth-child(18) { animation-delay: 0.2s; }
  .ht-iso-cube:nth-child(24) { animation-delay: 0.6s; transform: translateZ(25px); }

  @keyframes floatCube {
    0%, 100% { transform: translateZ(30px); }
    50% { transform: translateZ(40px); }
  }

  /* Interactive Tracker Widget */
  .ht-widget {
    background: var(--bg-card); backdrop-filter: blur(20px);
    border: 1px solid var(--border); border-radius: 24px;
    padding: 2rem; max-width: 600px; margin: 4rem auto;
    position: relative; z-index: 10;
  }
  .ht-widget-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 2rem;
  }
  .ht-badge {
    background: rgba(16, 185, 129, 0.15); color: var(--primary);
    padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
  }
  .ht-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; text-align: center; }
  .ht-day-label { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; }
  .ht-day-circle {
    width: 40px; height: 40px; margin: 0 auto; border-radius: 50%;
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.3s ease; color: transparent;
  }
  .ht-day-circle:hover { background: rgba(255,255,255,0.1); }
  .ht-day-circle.done {
    background: var(--primary); border-color: #34d399; color: #fff;
    box-shadow: 0 0 15px var(--primary-glow); transform: scale(1.1);
  }
  .ht-ai-insight {
    margin-top: 1.5rem; padding: 1rem; border-radius: 12px;
    background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2);
    display: flex; gap: 12px; align-items: flex-start;
  }
  .ht-ai-icon { color: #38bdf8; flex-shrink: 0; }
  .ht-ai-text { font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; }

  /* Features */
  .ht-features {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem; max-width: 1200px; margin: 4rem auto; padding: 0 5%;
    position: relative; z-index: 10;
  }
  .ht-card {
    background: var(--bg-card); border: 1px solid var(--border);
    padding: 2rem; border-radius: 20px; transition: transform 0.3s ease;
  }
  .ht-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.15); }
  .ht-card-icon {
    width: 48px; height: 48px; border-radius: 14px; margin-bottom: 1.25rem;
    background: rgba(16, 185, 129, 0.1); color: var(--primary);
    display: flex; align-items: center; justify-content: center;
  }
  .ht-card h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
  .ht-card p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }

  @media (max-width: 900px) {
    .ht-hero { grid-template-columns: 1fr; text-align: center; padding-top: 6rem; gap: 2rem; }
    .ht-hero-content p { margin: 0 auto 2rem; }
    .ht-isometric-wrapper { height: 300px; }
  }
`;

export default function AIHabitTrackerLanding() {
  // State for the interactive week widget
  const [completedDays, setCompletedDays] = useState<number[]>([0, 1, 2]); // Mon, Tue, Wed done
  const [insight, setInsight] = useState(
    "Consistent mornings! Completing your routine before 9 AM increases your success rate by 42%.",
  );

  const toggleDay = (index: number) => {
    if (completedDays.includes(index)) {
      setCompletedDays(completedDays.filter((d) => d !== index));
      setInsight(
        "Streak paused. Don't worry, the AI has adjusted your baseline for tomorrow to ease you back in.",
      );
    } else {
      const newDays = [...completedDays, index];
      setCompletedDays(newDays);
      if (newDays.length >= 5) {
        setInsight(
          "Incredible momentum! You're in the top 10% of users this week. The neural pathway is solidifying.",
        );
      } else {
        setInsight(
          "Great job logging today. Your 3D streak graph just grew. Keep the momentum going tomorrow.",
        );
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ht-root">
        {/* Ambient Glows */}
        <div className="ht-ambient-1" />
        <div className="ht-ambient-2" />

        {/* Navbar */}
        <nav className="ht-nav">
          <Link href="/" className="ht-logo">
            <Brain className="ht-logo-icon" size={28} />
            NeuroHabit
          </Link>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link href="/register" className="ht-btn">
              Start Tracking
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="ht-hero">
          <div className="ht-hero-content">
            <div
              className="ht-badge"
              style={{
                display: "inline-flex",
                marginBottom: "1.5rem",
                background: "rgba(56, 189, 248, 0.1)",
                color: "#38bdf8",
              }}
            >
              <Zap size={14} /> Neuro-Behavioral AI Engine v2.0
            </div>
            <h1>
              Build habits that <span>actually stick.</span>
            </h1>
            <p>
              Traditional trackers just show you boxes. NeuroHabit uses AI to
              analyze your behavior, predict burnout, and adapt your routine in
              real-time to guarantee consistency.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/register"
                className="ht-btn"
                style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}
              >
                Build Your Routine
              </Link>
              <Link
                href="#demo"
                className="ht-btn"
                style={{
                  background: "transparent",
                  color: "#f8fafc",
                  border: "1px solid var(--border)",
                  boxShadow: "none",
                }}
              >
                View Live Demo
              </Link>
            </div>
          </div>

          {/* 3D Isometric Streak Grid */}
          <div className="ht-isometric-wrapper">
            <div className="ht-iso-grid">
              {/* Generate 25 cubes for a 5x5 grid */}
              {Array.from({ length: 25 }).map((_, i) => {
                // Make a pattern of active/inactive blocks to look like a heatmap
                const isActive = [
                  0, 4, 6, 7, 8, 11, 12, 13, 14, 16, 17, 18, 22, 23, 24,
                ].includes(i);
                return (
                  <div
                    key={i}
                    className={`ht-iso-cube ${isActive ? "active" : ""}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Interactive Widget Demo */}
        <section
          id="demo"
          style={{ position: "relative", zIndex: 10, padding: "0 5%" }}
        >
          <div className="ht-widget">
            <div className="ht-widget-header">
              <div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Deep Work Session
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Daily • 90 Minutes
                </p>
              </div>
              <div className="ht-badge">
                <TrendingUp size={14} /> {completedDays.length} Day Streak
              </div>
            </div>

            <div className="ht-week">
              {WEEK_DAYS.map((day, idx) => {
                const isDone = completedDays.includes(idx);
                const isToday = idx === 3; // Pretend Thursday is today
                return (
                  <div key={day}>
                    <div
                      className="ht-day-label"
                      style={
                        isToday
                          ? { color: "var(--primary)", fontWeight: 700 }
                          : {}
                      }
                    >
                      {day}
                    </div>
                    <div
                      className={`ht-day-circle ${isDone ? "done" : ""}`}
                      onClick={() => toggleDay(idx)}
                      style={
                        isToday && !isDone
                          ? {
                              borderStyle: "dashed",
                              borderColor: "var(--primary)",
                            }
                          : {}
                      }
                    >
                      <Check size={20} strokeWidth={3} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ht-ai-insight">
              <Sparkles className="ht-ai-icon" size={20} />
              <div className="ht-ai-text">
                <strong>AI Coach Insight:</strong> {insight}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="ht-features">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="ht-card">
              <div className="ht-card-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section
          style={{
            textAlign: "center",
            padding: "6rem 5% 8rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Ready to rewire your brain?
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Join 50,000+ users building unstoppable momentum.
          </p>
          <Link
            href="/register"
            className="ht-btn"
            style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
          >
            Start Your Free Trial
          </Link>
        </section>
      </div>
    </>
  );
}
