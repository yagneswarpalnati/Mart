"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

export default function FloatingCartBar() {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="fixed bottom-[84px] left-0 right-0 z-50 px-4 pointer-events-none"
      >
        <div className="max-w-md mx-auto pointer-events-auto">
          <Link href="/cart">
            <div className="relative group overflow-hidden rounded-[24px] bg-emerald-500 border border-emerald-400/50 shadow-[0_8px_32px_rgba(16,185,129,0.3)] active:scale-95 transition-all duration-300">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-inner">
                    <ShoppingBagRoundedIcon sx={{ fontSize: 22 }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-black font-black text-sm uppercase tracking-tight">
                      {totalItems} Item{totalItems > 1 ? 's' : ''} Added
                    </span>
                    <span className="text-black/60 font-black text-xs tabular-nums">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl group-hover:bg-black/20 transition-colors">
                  <span className="text-black font-black text-[11px] uppercase tracking-widest">View Cart</span>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 10, color: 'black' }} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
