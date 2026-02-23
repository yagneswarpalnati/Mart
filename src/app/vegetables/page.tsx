"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import CategoryNav from "@/components/layout/CategoryNav";
import { vegetables } from "@/data/nutrition";
import { useCart } from "@/context/CartContext";

export default function VegetablesPage() {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-green-950/30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.05] blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <CategoryNav />
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 mt-8">
            <div className="text-5xl mb-3 animate-float">🥦</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              Fresh Vegetables
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Handpicked, farm-fresh vegetables with full nutritional info per kg. Know what you eat!
            </p>
          </motion.div>

          {/* Grid */}
          <div className="flex flex-col gap-4">
            {vegetables?.map((veg: any, i: number) => {
              const inCart = getItemQuantity(veg.id);

              return (
                <motion.div
                  key={veg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex gap-4 items-center bg-white/5 border-white/5 active:bg-white/10 transition-colors"
                >
                  {/* Image Area (Zepto Style) */}
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-5xl relative flex-shrink-0 overflow-hidden shadow-inner">
                    {veg.image ? (
                      <img src={veg.image} alt={veg.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="animate-float">{veg.emoji}</span>
                    )}
                    {/* Time Badge Over Image */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                      <span className="text-[8px] font-black text-black tracking-tighter">10 MINS</span>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="flex-1 min-w-0 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-black text-white truncate uppercase tracking-tight">{veg.name}</h3>
                      </div>
                      <p className="text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">1 kg • Fresh Daily</p>
                      
                      {/* Nutrition Tags (Horizontal Scroll) */}
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/10">Vit A: {veg.nutrition.vitaminA}mg</span>
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/10">Vit C: {veg.nutrition.vitaminC}mg</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-black text-lg">₹{veg.price}</span>
                          {veg.oldPrice && (
                            <span className="text-[10px] text-white/30 line-through font-medium">₹{veg.oldPrice}</span>
                          )}
                        </div>
                        <span className="text-[8px] text-emerald-500/60 font-black uppercase tracking-widest">In Stock</span>
                      </div>
                      
                      <div className="h-9 flex items-center">
                        {inCart === 0 ? (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addItem({ ...veg, quantity: 1, category: "vegetable", unit: "kg" })}
                            className="px-8 h-9 rounded-xl border border-emerald-500/40 text-emerald-400 text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black shadow-lg shadow-emerald-500/10 transition-all"
                          >
                            Add
                          </motion.button>
                        ) : (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center bg-emerald-500 h-9 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20"
                          >
                            <button 
                              onClick={() => updateQuantity(veg.id, inCart - 1)}
                              className="w-9 h-full flex items-center justify-center text-black font-black text-lg hover:bg-black/10 transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-black text-sm font-black italic">{inCart}</span>
                            <button 
                              onClick={() => updateQuantity(veg.id, inCart + 1)}
                              className="w-9 h-full flex items-center justify-center text-black font-black text-lg hover:bg-black/10 transition-colors"
                            >
                              +
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
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
