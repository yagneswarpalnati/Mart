"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function FloatingCartBar() {
  const { totalItems, totalPrice } = useCart();
  const pathname = usePathname();

  // Hide on login, cart page itself, and home
  const hidden = pathname === "/login" || pathname === "/" || pathname === "/cart";

  if (hidden || totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
      >
        <Link href="/cart">
          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #059669, #0d9488)",
              boxShadow: "0 -4px 30px rgba(16,185,129,0.3), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              {/* Left: Item count & total */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-2xl">🛒</span>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-emerald-700 text-[11px] font-black flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    {totalItems} item{totalItems > 1 ? "s" : ""} added
                  </p>
                  <p className="text-emerald-100/70 text-xs">₹{totalPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Right: View Cart CTA */}
              <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all duration-300">
                <span>View Cart</span>
                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>

            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
