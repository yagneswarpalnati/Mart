"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { icecreams, moodConfig } from "@/data/nutrition";
import { useCart } from "@/context/CartContext";

export default function IceCreamsPage() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addItem, getItemQuantity } = useCart();

  const updateQty = (id: number, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (ic: any) => {
    const qty = quantities[ic.id] || 1;
    addItem({ id: ic.id, name: ic.name, emoji: ic.emoji, price: ic.price, quantity: qty, category: "icecream", unit: "scoop" });
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-950/40 via-transparent to-purple-950/40" />
        <div className="absolute top-10 left-1/3 w-[400px] h-[400px] rounded-full bg-pink-500/[0.06] blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/[0.06] blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="text-5xl mb-3 animate-float">🍦</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
              Ice Creams
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Kid&apos;s favourites, cheat day indulgences & guilt-free options — because you deserve a treat! 🎉
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-3 mb-10">
            {Object.entries(moodConfig).map(([key, config]) => (
              <span key={key} className={`text-xs px-3 py-1.5 rounded-full border font-semibold ${config.bg} ${config.color}`}>
                {config.label}
              </span>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {icecreams?.map((ic: any, i: number) => {
              const qty = quantities[ic.id] || 1;
              const inCart = getItemQuantity(ic.id);

              return (
                <motion.div
                  key={ic.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-card p-6 flex flex-col group"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  {inCart > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-[10px] font-bold">
                      {inCart} in cart
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-5xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {ic.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xl font-bold text-white mb-0">{ic.name}</h3>
                        {ic.isTrending && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 font-bold flex items-center gap-1 h-fit">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <p className="text-purple-400/80 text-sm font-medium">{ic.flavor}</p>
                    </div>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed mb-4">{ic.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {ic.mood.map((m: string) => {
                      const mc = moodConfig[m as keyof typeof moodConfig];
                      return (
                        <span key={m} className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${mc.bg} ${mc.color}`}>
                          {mc.label}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="nutrition-badge-pink text-center flex-col !gap-0 !py-1.5 flex-1">
                      <span className="text-[10px] opacity-70">Calories</span>
                      <span className="text-xs font-bold">{ic.calories} kcal</span>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-pink-400 font-bold text-xl">₹{ic.price}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">per scoop</p>
                    </div>
                  </div>

                  <div className="flex-1" />

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(ic.id, -1)} className="qty-btn" style={{ borderColor: "rgba(236,72,153,0.3)", color: "#f9a8d4", background: "rgba(236,72,153,0.15)" }}>−</button>
                      <span className="text-white font-bold text-base w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(ic.id, 1)} className="qty-btn" style={{ borderColor: "rgba(236,72,153,0.3)", color: "#f9a8d4", background: "rgba(236,72,153,0.15)" }}>+</button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(ic)}
                      className="btn-premium text-xs !px-5 !py-2.5"
                      style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
