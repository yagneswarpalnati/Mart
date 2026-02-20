"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { vegetables, fruits, salads, icecreams } from "@/data/nutrition";

// ─── Products Interface ─────────────────────────────
interface DashboardProduct {
  id: number;
  name: string;
  emoji: string;
  price: number;
  category: string;
  route: string;
  flavor?: string;
}

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


// ─── Category Cards ───────────────────────────────
const categories = [
  { name: "Vegetables", emoji: "🥦", path: "/vegetables", desc: "Fresh greens rich in vitamins", gradient: "from-emerald-600/20 to-green-800/20", glow: "rgba(16,185,129,0.4)" },
  { name: "Fruits", emoji: "🍎", path: "/fruits", desc: "Nature's sweetest vitamins", gradient: "from-red-600/20 to-orange-800/20", glow: "rgba(239,68,68,0.3)" },
  { name: "Salads", emoji: "🥗", path: "/salads", desc: "Healthy add-ons & power bowls", gradient: "from-lime-600/20 to-green-700/20", glow: "rgba(132,204,22,0.3)" },
  { name: "Ice Creams", emoji: "🍦", path: "/icecreams", desc: "Cheat day & kid's favourites", gradient: "from-pink-600/20 to-purple-800/20", glow: "rgba(236,72,153,0.3)" },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState(getGreeting());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const allProducts = useMemo(() => {
    const routeMap: Record<string, string> = {
      vegetable: "/vegetables",
      fruit: "/fruits",
      salad: "/salads",
      icecream: "/icecreams"
    };

    const combined = [
      ...vegetables.map(v => ({ ...v, category: "vegetable" })),
      ...fruits.map(f => ({ ...f, category: "fruit" })),
      ...salads.map(s => ({ ...s, category: "salad" })),
      ...icecreams.map(i => ({ ...i, category: "icecream" }))
    ];

    return combined.map(p => ({
      ...p,
      route: routeMap[p.category] || "/dashboard"
    })) as DashboardProduct[];
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allProducts.filter(p => {
      return p.name.toLowerCase().includes(query) || 
             (p.flavor?.toLowerCase().includes(query));
    }).slice(0, 5);
  }, [searchQuery, allProducts]);

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
            className="text-center mb-10"
          >
            <div className="text-5xl mb-4 animate-float">{greeting.emoji}</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">
                {greeting.text}, Customer!
              </span>
            </h1>
            <p className="text-white/50 text-lg max-w-md mx-auto mb-8">{greeting.subtext}</p>
            
            {/* ── Search Bar ── */}
            <div className="relative max-w-xl mx-auto z-50">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">🔍</span>
                <input
                  type="text"
                  placeholder="Search fresh vegetables, fruits, salads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                />
              </div>

              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 glass-card border border-emerald-500/20 overflow-hidden text-left shadow-2xl"
                  >
                    {searchResults.map((result) => (
                      <Link key={`${result.category}-${result.id}`} href={result.route}>
                        <div className="flex items-center gap-3 p-3 hover:bg-white/[0.06] transition-colors border-b border-white/[0.05] last:border-0 cursor-pointer">
                          <span className="text-3xl">{result.emoji}</span>
                          <div>
                            <p className="text-white font-bold">{result.name}</p>
                            <p className="text-xs text-white/40 capitalize">{result.category} • ₹{result.price}</p>
                          </div>
                          <span className="ml-auto text-emerald-400/50">→</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
