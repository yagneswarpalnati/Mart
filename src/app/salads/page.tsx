"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { salads } from "@/data/nutrition";
import { useCart } from "@/context/CartContext";

export default function SaladsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addItem, getItemQuantity } = useCart();

  const updateQty = (id: number, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (salad: any) => {
    const qty = quantities[salad.id] || 1;
    addItem({ id: salad.id, name: salad.name, emoji: salad.emoji, price: salad.price, quantity: qty, category: "salad", unit: "bowl" });
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-lime-950/30 via-transparent to-emerald-950/30" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-lime-500/[0.05] blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="text-5xl mb-3 animate-float">🥗</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-lime-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
              Healthy Salads
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Power bowls & fresh mixes — the perfect add-on to any meal. Packed with nutrients, ready to eat!
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {salads?.map((salad: any, i: number) => {
              const isExpanded = expandedId === salad.id;
              const qty = quantities[salad.id] || 1;
              const inCart = getItemQuantity(salad.id);

              return (
                <motion.div
                  key={salad.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-card p-6 flex flex-col"
                >
                  {inCart > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-lime-500/20 border border-lime-500/30 text-lime-400 text-[10px] font-bold">
                      {inCart} in cart
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl flex-shrink-0">{salad.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-xl font-bold text-white">{salad.name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full border font-semibold bg-lime-500/15 border-lime-500/25 text-lime-400">
                          🌿 Healthy Add-on
                        </span>
                        {salad.isTrending && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 font-bold flex items-center gap-1">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <p className="text-lime-400 font-semibold text-lg">₹{salad.price}<span className="text-xs text-white/40 ml-1">/ bowl</span></p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {salad.ingredients.map((ing: string) => (
                      <span key={ing} className="text-[11px] px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60">
                        {ing}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Protein", value: `${salad.nutrition.protein}g` },
                      { label: "Fiber", value: `${salad.nutrition.fiber}g` },
                      { label: "Vit C", value: `${salad.nutrition.vitaminC}mg` },
                      { label: "Calcium", value: `${salad.nutrition.calcium}mg` },
                    ].map((n) => (
                      <div key={n.label} className="nutrition-badge text-center flex-col !gap-0 !py-1.5">
                        <span className="text-[10px] opacity-70">{n.label}</span>
                        <span className="text-xs font-bold">{n.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : salad.id)}
                    className="text-left text-sm text-lime-400/80 hover:text-lime-300 transition-colors mb-3 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                    Why {salad.name}?
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-3"
                      >
                        <div className="p-3 rounded-xl bg-lime-500/[0.07] border border-lime-500/10 text-sm text-white/70 leading-relaxed">
                          {salad.benefit}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex-1" />

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(salad.id, -1)} className="qty-btn">−</button>
                      <span className="text-white font-bold text-base w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(salad.id, 1)} className="qty-btn">+</button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(salad)}
                      className="btn-premium text-xs !px-5 !py-2.5"
                      style={{ background: "linear-gradient(135deg, #84cc16, #22c55e)" }}
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
