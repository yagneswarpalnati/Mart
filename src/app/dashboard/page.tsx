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
  isTrending?: boolean;
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
    const combined = [
      ...vegetables.map(v => ({ ...v, category: "vegetable", route: "/vegetables" })),
      ...fruits.map(f => ({ ...f, category: "fruit", route: "/fruits" })),
      ...salads.map(s => ({ ...s, category: "salad", route: "/salads" })),
      ...icecreams.map(i => ({ ...i, category: "icecream", route: "/icecreams" }))
    ];
    return combined as DashboardProduct[];
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allProducts.filter(p => p.name.toLowerCase().includes(query)).slice(0, 5);
  }, [searchQuery, allProducts]);

  const trendingItems = useMemo(() => allProducts.filter(p => p.isTrending).slice(0, 6), [allProducts]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 px-4 py-4 pb-20">
        
        {/* Search Bar (Zepto Style) */}
        <div className="sticky top-0 z-40 -mx-4 px-4 pb-3 bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50">🔍</span>
            <input
              type="text"
              placeholder='Search for "Milk", "Eggs", "Spinach"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 transition-all shadow-lg"
            />
          </div>
          
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-4 right-4 mt-2 glass-card border border-emerald-500/20 overflow-hidden shadow-2xl z-50">
                {searchResults.map((result) => (
                  <Link key={`${result.category}-${result.id}`} href={result.route}>
                    <div className="flex items-center gap-3 p-3 hover:bg-white/5 border-b border-white/5 last:border-0 cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                        {result.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-bold">{result.name}</p>
                        <p className="text-[10px] text-white/40 capitalize">{result.category}</p>
                      </div>
                      <p className="text-emerald-400 font-bold text-sm">₹{result.price}</p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Promo Hero (Vibrant Carousel Style) */}
        <section className="relative -mx-4 overflow-x-auto no-scrollbar flex gap-3 px-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 w-[85%] relative h-44 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-800 border border-white/10 p-6 flex flex-col justify-end"
          >
            <div className="absolute right-0 bottom-0 top-0 left-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop')] bg-cover opacity-20 mix-blend-overlay" />
            <div className="relative z-10">
              <span className="text-[10px] font-black bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">Flash Sale</span>
              <h2 className="text-2xl font-black text-white leading-tight">Fresh Veggies in<br/>20 Minutes</h2>            </div>
          </motion.div>
          
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 w-[85%] relative h-44 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 border border-white/10 p-6 flex flex-col justify-end"
          >
            <div className="absolute right-0 bottom-0 top-0 left-0 bg-[url('/background/dashboard-bg.jpeg')] bg-cover opacity-20 mix-blend-overlay" />
            <div className="relative z-10">
              <span className="text-[10px] font-black bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">Organic</span>
              <h2 className="text-2xl font-black text-white leading-tight">Fresh from<br/>Local Farms</h2>
              <p className="text-emerald-200 text-xs font-bold mt-2">Support Your Community</p>
            </div>
          </motion.div>
        </section>

        {/* Categories Grid (Zepto Circle Style) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-white tracking-tight uppercase text-[11px] opacity-40">Shop by Category</h3>
          </div>
          <div className="grid grid-cols-4 gap-y-6 gap-x-3">
            {categories.map((cat) => (
              <Link key={cat.path} href={cat.path} className="flex flex-col items-center gap-2 group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/5 border border-white/10 shadow-xl transition-all group-active:scale-90 group-hover:border-emerald-500/50`}>
                  {cat.emoji}
                </div>
                <span className="text-[10px] font-bold text-white/70 text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
            {/* Added extra placeholders for dense grid feel */}
            <div className="flex flex-col items-center gap-2 opacity-30 grayscale translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/5 border border-white/10 italic">🥛</div>
              <span className="text-[10px] font-bold text-white/70 text-center">Dairy</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-30 grayscale translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/5 border border-white/10 italic">🥖</div>
              <span className="text-[10px] font-bold text-white/70 text-center">Bread</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-30 grayscale translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/5 border border-white/10 italic">🧼</div>
              <span className="text-[10px] font-bold text-white/70 text-center">Hygiene</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-30 grayscale translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/5 border border-white/10 italic">🍪</div>
              <span className="text-[10px] font-bold text-white/70 text-center">Munchies</span>
            </div>
          </div>
        </section>

        {/* Trending Hits (Zepto Card Style) */}
        <section>
          <div className="flex items-center justify-between mb-4 mt-4">
            <h3 className="text-base font-black text-white tracking-tight">Trending Near You</h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">See All</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar">
            {trendingItems.map((item: any) => (
              <div key={item.id} className="flex-shrink-0 w-[140px]">
                <div className="glass-card h-full flex flex-col items-start bg-white/5 border-white/10 rounded-2xl overflow-hidden group">
                  <Link href={item.route} className="w-full relative aspect-square bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center group-active:scale-95 transition-transform">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">{item.emoji}</span>
                    )}
                    {/* Time Badge Over Image */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                      <span className="text-[8px] font-black text-black">10 MINS</span>
                    </div>
                  </Link>
                  
                  <div className="p-2.5 w-full flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight uppercase tabular-nums">{item.name}</h4>
                      <p className="text-[9px] text-white/40 mt-1 uppercase">1 KG</p>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between gap-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">₹{item.price}</span>
                        {item.oldPrice && (
                          <span className="text-[9px] text-white/30 line-through font-medium">₹{item.oldPrice}</span>
                        )}
                      </div>
                      
                      <button className="h-8 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black active:bg-emerald-500 active:text-black transition-all">
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Trust Section */}
        <section className="mt-4">
           <div className="p-5 rounded-[32px] bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent border border-emerald-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 text-6xl">🤝</div>
            <h3 className="text-white font-black text-sm mb-1 uppercase tracking-tight">Community Direct</h3>
            <p className="text-white/50 text-[10px] leading-relaxed max-w-[200px]">
              Every order supports local farmers & workers in your neighborhood.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-white/40 text-[8px] font-bold uppercase tracking-widest tracking-tighter">Verified Sourcing</div>
              <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-white/40 text-[8px] font-bold uppercase tracking-widest tracking-tighter">Zero Waste</div>
            </div>
           </div>
        </section>

      </div>
    </PageWrapper>
  );
}

