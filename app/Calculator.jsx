"use client";
import { useState, useEffect, useRef } from "react";

function AnimatedNumber({ value, prefix = "$", duration = 700 }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const startVal = useRef(0);
  const startTime = useRef(null);

  useEffect(() => {
    startVal.current = display;
    startTime.current = null;
    const animate = (ts) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal.current + (value - startVal.current) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <span>{prefix}{display.toLocaleString()}</span>;
}

const SCENARIOS = [
  { emoji: "☕", label: "Morning coffee", amount: 7 },
  { emoji: "🍕", label: "Takeout for two", amount: 45 },
  { emoji: "🍷", label: "Dinner date out", amount: 90 },
  { emoji: "👟", label: "New shoes", amount: 120 },
  { emoji: "🛍️", label: "Impulse shopping", amount: 200 },
  { emoji: "🏖️", label: "Weekend getaway", amount: 500 },
];

function compoundOnce(principal, rate, years) {
  return principal * Math.pow(1 + (rate / 12), years * 12);
}

function compoundRecurring(monthlyAmount, annualRate, years) {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  if (monthlyRate === 0) return monthlyAmount * months;
  return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

export default function MoneyDateCalculator() {
  const [amount, setAmount] = useState(90);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [activeScenario, setActiveScenario] = useState(2);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(40);
  const [showCouple, setShowCouple] = useState(true);
  const [showReveal, setShowReveal] = useState(true);
  const [recurringFreq, setRecurringFreq] = useState("weekly");

  const effectiveAmount = showCouple ? amount * 2 : amount;

  // Core: one-time lump sum compound growth
  const oneTimeFuture = compoundOnce(effectiveAmount, rate / 100, years);
  const oneTimeMultiplier = (oneTimeFuture / effectiveAmount).toFixed(0);

  // Secondary: what if you did this regularly
  const recurringMonthly = recurringFreq === "daily" ? effectiveAmount * 30.44
    : recurringFreq === "weekly" ? effectiveAmount * 4.33
    : effectiveAmount;
  const recurringFuture = compoundRecurring(recurringMonthly, rate / 100, years);
  const recurringInvested = recurringMonthly * 12 * years;

  // Milestones for one-time growth
  const milestones = [1, 5, 10, 20, 30, 40].filter(y => y <= years);
  const milestoneValues = milestones.map(y => ({
    years: y,
    value: compoundOnce(effectiveAmount, rate / 100, y),
  }));
  const maxVal = milestoneValues.length > 0 ? milestoneValues[milestoneValues.length - 1].value : 1;

  useEffect(() => {
    setShowReveal(false);
    const t = setTimeout(() => setShowReveal(true), 80);
    return () => clearTimeout(t);
  }, [amount, rate, years, showCouple]);

  const handleScenario = (s, i) => {
    setAmount(s.amount);
    setActiveScenario(i);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustom = (val) => {
    setCustomAmount(val);
    setIsCustom(true);
    setActiveScenario(-1);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) setAmount(num);
  };

  const freqLabel = recurringFreq === "daily" ? "day" : recurringFreq === "weekly" ? "week" : "month";

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(168deg, #1a1612 0%, #2c2420 50%, #3d2b1e 100%)",
        padding: "36px 24px 44px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,84,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,84,0.06) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,160,84,0.1)",
            border: "1px solid rgba(212,160,84,0.18)", borderRadius: 20, padding: "5px 14px", marginBottom: 14,
          }}>
            <span style={{ fontSize: 13 }}>💛</span>
            <span style={{ color: "#d4a054", fontSize: 11, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase" }}>The Money Date</span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 34, color: "#f5f0e8",
            margin: "0 0 8px", lineHeight: 1.15, fontWeight: 400,
          }}>
            Save & Stack
          </h1>
          <p style={{ color: "#908070", fontSize: 14, margin: 0, maxWidth: 340, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
            One decision today. See what it's worth in 40 years.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* The Question */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#3a2a1e",
            margin: 0, lineHeight: 1.4, fontStyle: "italic",
          }}>
            "What if we skipped this one thing today?"
          </p>
        </div>

        {/* Scenarios */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#a09080", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            Today's temptation
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {SCENARIOS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleScenario(s, i)}
                style={{
                  padding: "12px 8px", borderRadius: 10, cursor: "pointer",
                  border: !isCustom && activeScenario === i ? "2px solid #d4a054" : "2px solid #e8e2d8",
                  background: !isCustom && activeScenario === i ? "#fdf6e8" : "#fff",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: 20 }}>{s.emoji}</span>
                <span style={{ fontSize: 11, color: "#a09080", lineHeight: 1.2 }}>{s.label}</span>
                <span style={{
                  fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  color: !isCustom && activeScenario === i ? "#8a6520" : "#3a2a1e",
                }}>${s.amount}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <span style={{ color: "#c0b8a8", fontSize: 12 }}>or</span>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", background: "#fff",
              border: isCustom ? "2px solid #d4a054" : "2px solid #e8e2d8", borderRadius: 10, padding: "0 12px",
            }}>
              <span style={{ color: "#a09080", fontSize: 16, fontFamily: "'JetBrains Mono', monospace" }}>$</span>
              <input
                type="number"
                placeholder="Your amount"
                value={customAmount}
                onChange={e => handleCustom(e.target.value)}
                style={{
                  flex: 1, border: "none", outline: "none", padding: "10px 8px", fontSize: 14,
                  background: "transparent", fontFamily: "'JetBrains Mono', monospace", color: "#3a2a1e",
                }}
              />
            </div>
          </div>
        </div>

        {/* Couple Toggle */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          background: "#fff", border: "2px solid #e8e2d8", borderRadius: 10, padding: "10px 16px", marginBottom: 20,
        }}>
          <span style={{ fontSize: 13, color: !showCouple ? "#3a2a1e" : "#a09080", fontWeight: !showCouple ? 700 : 400 }}>Just me</span>
          <button
            onClick={() => setShowCouple(!showCouple)}
            style={{
              width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer", position: "relative",
              background: showCouple ? "#d4a054" : "#d8d0c4", transition: "background 0.2s ease",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3,
              left: showCouple ? 25 : 3, transition: "left 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }} />
          </button>
          <span style={{ fontSize: 13, color: showCouple ? "#3a2a1e" : "#a09080", fontWeight: showCouple ? 700 : 400 }}>
            Both of us 💛
          </span>
        </div>

        {/* === THE PAIN === */}
        <div style={{
          background: "#fff", border: "2px solid #e8e2d8", borderRadius: 14,
          padding: "20px", marginBottom: 12, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, #c0392b, #e74c3c)",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>😬</span>
            <span style={{ color: "#c0392b", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              If {showCouple ? "you both" : "you"} spend it
            </span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: "#3a2a1e", lineHeight: 1.8,
          }}>
            <span style={{ color: "#c0392b", fontWeight: 700 }}>${effectiveAmount}</span> spent today
            <span style={{ color: "#a09080" }}> → </span>
            gone in {showCouple ? "one evening" : "a moment"}
            <br />
            <span style={{ color: "#a09080", fontSize: 13 }}>
              Plus the <span style={{ color: "#c0392b", fontWeight: 600 }}>
                <AnimatedNumber value={Math.round(oneTimeFuture - effectiveAmount)} />
              </span> it would have earned you
            </span>
          </div>
        </div>

        {/* === THE REWARD (ONE-TIME — CORE) === */}
        <div style={{
          background: "linear-gradient(135deg, #2c2420 0%, #3a2a1e 100%)",
          borderRadius: 14, padding: "24px 20px", marginBottom: 28, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,160,84,0.15) 0%, transparent 70%)",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ color: "#d4a054", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              If {showCouple ? "you both" : "you"} save & stack it
            </span>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#908070", fontSize: 12, marginBottom: 2 }}>
              That one ${effectiveAmount} decision becomes
            </div>
            <div style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 54, color: "#d4a054",
              lineHeight: 1.1, margin: "6px 0",
              opacity: showReveal ? 1 : 0,
              transform: showReveal ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              <AnimatedNumber value={Math.round(oneTimeFuture)} />
            </div>
            <div style={{ color: "#706050", fontSize: 12, marginBottom: 14 }}>in {years} years</div>
            <div style={{
              display: "inline-block", background: "rgba(212,160,84,0.12)",
              border: "1px solid rgba(212,160,84,0.25)", borderRadius: 8, padding: "6px 16px",
            }}>
              <span style={{ color: "#d4a054", fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                {oneTimeMultiplier}x
              </span>
              <span style={{ color: "#a09080", fontSize: 12, marginLeft: 6 }}>your money</span>
            </div>
          </div>
        </div>

        {/* Years Slider + Rate Slider */}
        <div className="slider-row" style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", background: "#fff", border: "2px solid #e8e2d8",
            borderRadius: 10, padding: "10px 12px", gap: 8,
          }}>
            <span style={{ color: "#a09080", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>Years</span>
            <input
              type="range" min="5" max="50" step="1" value={years}
              onChange={e => setYears(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: "#d4a054" }}
            />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700,
              color: "#3a2a1e", minWidth: 24, textAlign: "right",
            }}>{years}</span>
          </div>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", background: "#fff", border: "2px solid #e8e2d8",
            borderRadius: 10, padding: "10px 12px", gap: 8,
          }}>
            <span style={{ color: "#a09080", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>Return</span>
            <input
              type="range" min="4" max="12" step="0.5" value={rate}
              onChange={e => setRate(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "#d4a054" }}
            />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700,
              color: "#3a2a1e", minWidth: 36, textAlign: "right",
            }}>{rate}%</span>
          </div>
        </div>

        {/* Growth Timeline (one-time) */}
        <div style={{
          background: "#fff", border: "2px solid #e8e2d8", borderRadius: 14,
          padding: "20px", marginBottom: 28,
        }}>
          <div style={{ color: "#a09080", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
            Watch that one save grow
          </div>
          {milestoneValues.map((m, i) => {
            const barWidth = Math.max((m.value / maxVal) * 100, 2);
            const growth = m.value - effectiveAmount;
            return (
              <div key={m.years} style={{ marginBottom: i < milestoneValues.length - 1 ? 10 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: "#5a4a3a", fontWeight: 500 }}>
                    {m.years === 1 ? "1 year" : `${m.years} years`}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{
                      fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                      color: "#3a2a1e",
                    }}>
                      ${Math.round(m.value).toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                      color: "#7dae5a", fontWeight: 600,
                    }}>
                      +${Math.round(growth).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ height: 8, background: "#f0ece4", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, width: `${barWidth}%`,
                    background: i === milestoneValues.length - 1
                      ? "linear-gradient(90deg, #d4a054, #e8b84a)"
                      : "linear-gradient(90deg, #d8d0c4, #c8bfb0)",
                    transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Perspective Box (one-time) */}
        <div style={{
          background: "#f5f0e8", border: "2px solid #e8e2d8", borderRadius: 14,
          padding: "20px", marginBottom: 28, textAlign: "center",
        }}>
          <div style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.7 }}>
            {showCouple ? "You and your partner" : "You"} skip one
            <strong style={{ color: "#3a2a1e" }}> ${amount} {!isCustom && activeScenario >= 0 ? SCENARIOS[activeScenario]?.label.toLowerCase() : "expense"}</strong>
            {showCouple ? " each" : ""} today.
            <br />
            That's <strong style={{ color: "#3a2a1e" }}>${effectiveAmount}</strong> saved right now.
            <br />
            <span style={{ color: "#a09080" }}>Invested once at {rate}%, that single save becomes</span>
            <br />
            <span style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#d4a054",
              display: "inline-block", margin: "4px 0",
            }}>
              <AnimatedNumber value={Math.round(oneTimeFuture)} />
            </span>
          </div>
        </div>

        {/* === RECURRING (VISIBLE SECTION) === */}
        <div style={{
          background: "#fff", border: "2px solid #e8e2d8", borderRadius: 14,
          padding: "20px", marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>🚀</span>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "#3a2a1e" }}>
              Now imagine you did this every {freqLabel}...
            </span>
          </div>

          {/* Frequency picker */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "center" }}>
            {[
              { key: "daily", label: "Every day" },
              { key: "weekly", label: "Every week" },
              { key: "monthly", label: "Every month" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setRecurringFreq(f.key)}
                style={{
                  padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                  border: recurringFreq === f.key ? "2px solid #d4a054" : "2px solid #e8e2d8",
                  background: recurringFreq === f.key ? "#fdf6e8" : "#fff",
                  fontSize: 12, fontWeight: 600, color: recurringFreq === f.key ? "#8a6520" : "#a09080",
                  transition: "all 0.15s ease",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Recurring result */}
          <div style={{
            background: "linear-gradient(135deg, #1a1612, #2c2420)",
            borderRadius: 12, padding: "20px", textAlign: "center",
          }}>
            <div style={{ color: "#908070", fontSize: 12, marginBottom: 4 }}>
              Skipping ${effectiveAmount} every {freqLabel} and investing it
            </div>
            <div style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 42, color: "#d4a054",
              lineHeight: 1.1, margin: "8px 0",
            }}>
              <AnimatedNumber value={Math.round(recurringFuture)} />
            </div>
            <div style={{ color: "#706050", fontSize: 12, marginBottom: 10 }}>in {years} years at {rate}%</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <div>
                <div style={{ color: "#706050", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>You'd invest</div>
                <div style={{ color: "#f5f0e8", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  ${Math.round(recurringInvested).toLocaleString()}
                </div>
              </div>
              <div style={{ width: 1, background: "#4a3a2e" }} />
              <div>
                <div style={{ color: "#706050", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Interest earned</div>
                <div style={{ color: "#d4a054", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  ${Math.round(recurringFuture - recurringInvested).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: "#fff", border: "2px solid #e8e2d8", borderRadius: 14, padding: "24px 20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>💛</div>
          <h3 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#3a2a1e",
            margin: "0 0 6px", fontWeight: 400,
          }}>
            Make it a weekly habit
          </h3>
          <p style={{ color: "#a09080", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>
            Join The Money Date — couples who save together, build together.
            <br />Weekly prompts. Real conversations. Compound results.
          </p>
          <a
            href="https://www.skool.com/jacobs-group-8596/about"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", background: "#3a2a1e", color: "#f5f0e8", borderRadius: 10,
              padding: "14px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              letterSpacing: 0.5, width: "100%", textAlign: "center", textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            Join The Money Date — It&apos;s Free
          </a>
          <p style={{ color: "#c0b8a8", fontSize: 11, marginTop: 10 }}>
            Free weekly prompts · Couples community · No spam, ever
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media (max-width: 640px) {
          .slider-row { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
