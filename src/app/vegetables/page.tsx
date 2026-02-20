"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { vegetables, priorityConfig } from "@/data/nutrition";
import { useCart } from "@/context/CartContext";

export default function VegetablesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addItem, getItemQuantity } = useCart();

  const updateQty = (id: number, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const handleAddToCart = (veg: any) => {
    const qty = quantities[veg.id] || 1;
    addItem({ id: veg.id, name: veg.name, emoji: veg.emoji, price: veg.price, quantity: qty, category: "vegetable", unit: "kg" });
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-green-950/30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.05] blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="text-5xl mb-3 animate-float">🥦</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              Fresh Vegetables
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Handpicked, farm-fresh vegetables with full nutritional info per kg. Know what you eat!
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vegetables?.map((veg: any, i: number) => {
              const isExpanded = expandedId === veg.id;
              const qty = quantities[veg.id] || 1;
              const priority = priorityConfig[veg.priority as keyof typeof priorityConfig] || priorityConfig["good-choice"];
              const inCart = getItemQuantity(veg.id);

              return (
                <motion.div
                  key={veg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-card p-6 flex flex-col"
                >
                  {/* In-cart badge */}
                  {inCart > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      {inCart} in cart
                    </div>
                  )}

                  {/* Top Row: Emoji + Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl flex-shrink-0">{veg.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-xl font-bold text-white">{veg.name}</h3>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${priority.bg} ${priority.color}`}>
                          {priority.label}
                        </span>
                        {veg.isTrending && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 font-bold flex items-center gap-1">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-400 font-semibold text-lg">₹{veg.price}<span className="text-xs text-white/40 ml-1">/ kg</span></p>
                    </div>
                  </div>

                  {/* Nutrition Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Vit A", value: `${veg.nutrition.vitaminA}mg`, type: "emerald" },
                      { label: "Vit C", value: `${veg.nutrition.vitaminC}mg`, type: "emerald" },
                      { label: "Protein", value: `${veg.nutrition.protein}g`, type: "amber" },
                      { label: "Fiber", value: `${veg.nutrition.fiber}g`, type: "blue" },
                      { label: "Iron", value: `${veg.nutrition.iron}mg`, type: "pink" },
                      { label: "Calcium", value: `${veg.nutrition.calcium}mg`, type: "amber" },
                      { label: "Vit K", value: `${veg.nutrition.vitaminK}mg`, type: "emerald" },
                    ].map((n) => (
                      <div key={n.label} className={`nutrition-badge${n.type !== "emerald" ? `-${n.type}` : ""} text-center flex-col !gap-0 !py-1.5`}>
                        <span className="text-[10px] opacity-70">{n.label}</span>
                        <span className="text-xs font-bold">{n.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Why This Vegetable? */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : veg.id)}
                    className="text-left text-sm text-emerald-400/80 hover:text-emerald-300 transition-colors mb-3 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                    Why {veg.name}?
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-3"
                      >
                        <div className="p-3 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/10 text-sm text-white/70 leading-relaxed">
                          {veg.benefit}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex-1" />

                  {/* Quantity + Add to Cart */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(veg.id, -1)} className="qty-btn">−</button>
                      <span className="text-white font-bold text-base w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(veg.id, 1)} className="qty-btn">+</button>
                      <span className="text-xs text-white/30">kg</span>
                    </div>

                    <button onClick={() => handleAddToCart(veg)} className="btn-premium text-xs !px-5 !py-2.5">
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
