"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import CategoryNav from "@/components/layout/CategoryNav";
import { fruits } from "@/data/nutrition";
import { useCart } from "@/context/CartContext";

export default function FruitsPage() {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden pb-24">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-orange-950/30" />
        <div className="absolute top-20 left-0 w-[500px] h-[500px] rounded-full bg-red-500/[0.05] blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <CategoryNav />
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 mt-8">
            <div className="text-5xl mb-3 animate-float">🍎</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-red-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Fresh Fruits
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Nature&apos;s sweetest vitamins — picked fresh, delivered fast. See every nutrient per kg!
            </p>
          </motion.div>

          {/* List */}
          <div className="flex flex-col gap-4">
            {fruits?.map((fruit: any, i: number) => {
              const inCart = getItemQuantity(fruit.id);

              return (
                <motion.div
                  key={fruit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex gap-4 items-center bg-white/5 border-white/5 active:bg-white/10 transition-colors"
                >
                  {/* Image Area (Zepto Style) */}
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center text-5xl relative flex-shrink-0 overflow-hidden shadow-inner">
                    {fruit.image ? (
                      <img src={fruit.image} alt={fruit.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="animate-float">{fruit.emoji}</span>
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
                        <h3 className="text-sm font-black text-white truncate uppercase tracking-tight">{fruit.name}</h3>
                      </div>
                      <p className="text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">1 kg • Sweet & Fresh</p>
                      
                      {/* Nutrition Tags (Horizontal Scroll) */}
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-400 text-[9px] border border-orange-500/10">Vit A: {fruit.nutrition.vitaminA}mg</span>
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-400 text-[9px] border border-orange-500/10">Vit C: {fruit.nutrition.vitaminC}mg</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-orange-400 font-black text-lg">₹{fruit.price}</span>
                          {fruit.oldPrice && (
                            <span className="text-[10px] text-white/30 line-through font-medium">₹{fruit.oldPrice}</span>
                          )}
                        </div>
                        <span className="text-[8px] text-orange-500/60 font-black uppercase tracking-widest">In Stock</span>
                      </div>
                      
                      <div className="h-9 flex items-center">
                        {inCart === 0 ? (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addItem({ ...fruit, quantity: 1, category: "fruit", unit: "kg" })}
                            className="px-8 h-9 rounded-xl border border-orange-500/40 text-orange-400 text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-black shadow-lg shadow-orange-500/10 transition-all"
                          >
                            Add
                          </motion.button>
                        ) : (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center bg-orange-500 h-9 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20"
                          >
                            <button 
                              onClick={() => updateQuantity(fruit.id, inCart - 1)}
                              className="w-9 h-full flex items-center justify-center text-black font-black text-lg hover:bg-black/10 transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-black text-sm font-black italic">{inCart}</span>
                            <button 
                              onClick={() => updateQuantity(fruit.id, inCart + 1)}
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
