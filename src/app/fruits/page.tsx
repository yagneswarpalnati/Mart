"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { priorityConfig } from "@/data/nutrition";
import useSWR from "swr";
import { useCart } from "@/context/CartContext";

export default function FruitsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { addItem, getItemQuantity } = useCart();

  const updateQty = (id: number, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data: fruits, error, isLoading } = useSWR("/api/products?category=fruit", fetcher);

  const handleAddToCart = (fruit: any) => {
    const qty = quantities[fruit.id] || 1;
    addItem({ id: fruit.id, name: fruit.name, emoji: fruit.emoji, price: fruit.price, quantity: qty, category: "fruit", unit: "kg" });
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-orange-950/30" />
        <div className="absolute top-20 left-0 w-[500px] h-[500px] rounded-full bg-red-500/[0.05] blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="text-5xl mb-3 animate-float">🍎</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-red-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Fresh Fruits
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Nature&apos;s sweetest vitamins — picked fresh, delivered fast. See every nutrient per kg!
            </p>
          </motion.div>

          {/* Loader or Error */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            </div>
          )}
          {error && <div className="text-center text-red-400 py-10">Failed to load fruits</div>}

          {/* Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {fruits?.map((fruit: any, i: number) => {
              const isExpanded = expandedId === fruit.id;
              const qty = quantities[fruit.id] || 1;
              const priority = priorityConfig[fruit.priority as keyof typeof priorityConfig] || priorityConfig["good-choice"];
              const inCart = getItemQuantity(fruit.id);

              return (
                <motion.div
                  key={fruit.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-card p-6 flex flex-col"
                >
                  {inCart > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-bold">
                      {inCart} in cart
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl flex-shrink-0">{fruit.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-xl font-bold text-white">{fruit.name}</h3>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${priority.bg} ${priority.color}`}>
                          {priority.label}
                        </span>
                        {fruit.isTrending && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 font-bold flex items-center gap-1">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <p className="text-orange-400 font-semibold text-lg">₹{fruit.price}<span className="text-xs text-white/40 ml-1">/ kg</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Vit A", value: `${fruit.nutrition.vitaminA}mg`, type: "emerald" },
                      { label: "Vit C", value: `${fruit.nutrition.vitaminC}mg`, type: "emerald" },
                      { label: "Protein", value: `${fruit.nutrition.protein}g`, type: "amber" },
                      { label: "Fiber", value: `${fruit.nutrition.fiber}g`, type: "blue" },
                      { label: "Iron", value: `${fruit.nutrition.iron}mg`, type: "pink" },
                      { label: "Calcium", value: `${fruit.nutrition.calcium}mg`, type: "amber" },
                      { label: "Vit K", value: `${fruit.nutrition.vitaminK}mg`, type: "emerald" },
                    ].map((n) => (
                      <div key={n.label} className={`nutrition-badge${n.type !== "emerald" ? `-${n.type}` : ""} text-center flex-col !gap-0 !py-1.5`}>
                        <span className="text-[10px] opacity-70">{n.label}</span>
                        <span className="text-xs font-bold">{n.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : fruit.id)}
                    className="text-left text-sm text-orange-400/80 hover:text-orange-300 transition-colors mb-3 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                    Why {fruit.name}?
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-3"
                      >
                        <div className="p-3 rounded-xl bg-orange-500/[0.07] border border-orange-500/10 text-sm text-white/70 leading-relaxed">
                          {fruit.benefit}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex-1" />

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(fruit.id, -1)} className="qty-btn">−</button>
                      <span className="text-white font-bold text-base w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(fruit.id, 1)} className="qty-btn">+</button>
                      <span className="text-xs text-white/30">kg</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(fruit)}
                      className="btn-premium text-xs !px-5 !py-2.5"
                      style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
