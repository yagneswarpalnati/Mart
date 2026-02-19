"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { dailyRecommended } from "@/data/nutrition";

// ─── Greeting Logic ────────────────────────────────
function getGreeting(): { text: string; emoji: string; subtext: string } {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return { text: "Good Morning", emoji: "☀️", subtext: "Start your day with something fresh and healthy!" };
  } else if (hour >= 12 && hour < 17) {
    return { text: "Good Afternoon", emoji: "🌤️", subtext: "Time for a nutritious meal to power through your day!" };
  } else {
    return { text: "Good Evening", emoji: "🌙", subtext: "Wind down with a light, healthy dinner tonight." };
  }
}

// ─── Nutrition Progress Ring ──────────────────────
function ProgressRing({ label, value, max, unit, color, delay }: {
  label: string; value: number; max: number; unit: string; color: string; delay: number;
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ "--circumference": circumference, "--dash-offset": dashOffset } as React.CSSProperties}
            className="progress-ring-circle"
            strokeDashoffset={circumference}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">{label}</p>
        <p className="text-[11px] text-white/40 mt-0.5">{value}{unit} / {max}{unit}</p>
      </div>
    </motion.div>
  );
}

// ─── Category Cards ───────────────────────────────
const categories = [
  { name: "Vegetables", emoji: "🥦", path: "/vegetables", desc: "Fresh greens rich in vitamins", gradient: "from-emerald-600/20 to-green-800/20", glow: "rgba(16,185,129,0.4)" },
  { name: "Fruits", emoji: "🍎", path: "/fruits", desc: "Nature's sweetest vitamins", gradient: "from-red-600/20 to-orange-800/20", glow: "rgba(239,68,68,0.3)" },
  { name: "Salads", emoji: "🥗", path: "/salads", desc: "Healthy add-ons & power bowls", gradient: "from-lime-600/20 to-green-700/20", glow: "rgba(132,204,22,0.3)" },
  { name: "Ice Creams", emoji: "🍦", path: "/icecreams", desc: "Cheat day & kid's favourites", gradient: "from-pink-600/20 to-purple-800/20", glow: "rgba(236,72,153,0.3)" },
];

// ─── Simulated Consumed Data (can be replaced by real state later) ──
const consumed = {
  vitaminC: 42,
  protein: 28,
  fiber: 12,
  calcium: 450,
  iron: 8,
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-purple-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">

          {/* ── Welcome Section ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="text-5xl mb-4 animate-float">{greeting.emoji}</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">
                {greeting.text}, Customer!
              </span>
            </h1>
            <p className="text-white/50 text-lg max-w-md mx-auto">{greeting.subtext}</p>
          </motion.div>

          {/* ── Tagline Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card px-6 py-4 mb-14 text-center max-w-2xl mx-auto"
          >
            <p className="text-sm text-white/50 uppercase tracking-[0.2em] font-medium mb-1">Why Y NOT?</p>
            <p className="text-white/80 text-base">
              Sit at home, eat healthy. 🏡 We deliver <span className="text-emerald-400 font-semibold">freshness</span> to your door — no juggling around the market.
            </p>
          </motion.div>

          {/* ── Nutrition Tracker ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-xl font-semibold text-white/90 mb-2 text-center">Today&apos;s Nutrition Tracker</h2>
            <p className="text-sm text-white/40 text-center mb-8">Track your daily vitamins & protein intake</p>

            <div className="glass-card p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
                <ProgressRing label="Vitamin C" value={consumed.vitaminC} max={dailyRecommended.vitaminC} unit="mg" color="#10b981" delay={0.5} />
                <ProgressRing label="Protein" value={consumed.protein} max={dailyRecommended.protein} unit="g" color="#14b8a6" delay={0.6} />
                <ProgressRing label="Fiber" value={consumed.fiber} max={dailyRecommended.fiber} unit="g" color="#8b5cf6" delay={0.7} />
                <ProgressRing label="Calcium" value={consumed.calcium} max={dailyRecommended.calcium} unit="mg" color="#f59e0b" delay={0.8} />
                <ProgressRing label="Iron" value={consumed.iron} max={dailyRecommended.iron} unit="mg" color="#ef4444" delay={0.9} />
              </div>
            </div>
          </motion.div>

          {/* ── Category Cards ── */}
          <div>
            <h2 className="text-xl font-semibold text-white/90 mb-2 text-center">Shop by Category</h2>
            <p className="text-sm text-white/40 text-center mb-8">Order everything fresh, delivered to your doorstep</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.path}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                >
                  <Link href={cat.path}>
                    <div className={`group glass-card p-8 text-center cursor-pointer hover:scale-[1.03] bg-gradient-to-br ${cat.gradient}`}
                      style={{ "--glow": cat.glow } as React.CSSProperties}>
                      <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                        {cat.emoji}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                      <p className="text-xs text-white/40">{cat.desc}</p>

                      {/* Hover glow accent */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 30px ${cat.glow}` }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Quick Links Row ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Link href="/weekly"
              className="glass-card px-6 py-3 flex items-center gap-2 text-sm text-white/70 hover:text-emerald-400 transition-colors">
              <span className="text-lg">📅</span> Set Weekly Routine
            </Link>
            <Link href="/cart"
              className="glass-card px-6 py-3 flex items-center gap-2 text-sm text-white/70 hover:text-emerald-400 transition-colors">
              <span className="text-lg">🛒</span> View Cart
            </Link>
            <Link href="/profile"
              className="glass-card px-6 py-3 flex items-center gap-2 text-sm text-white/70 hover:text-emerald-400 transition-colors">
              <span className="text-lg">👤</span> My Profile
            </Link>
          </motion.div>

        </div>
      </div>
    </PageWrapper>
  );
}
