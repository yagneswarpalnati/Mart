"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { totalItems, totalPrice } = useCart();

  if (
    totalItems === 0 ||
    pathname === "/" ||
    pathname === "/cart" ||
    pathname === "/weekly" ||
    pathname === "/profile"
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-[76px] left-0 right-0 z-50 px-3 md:left-1/2 md:right-auto md:w-[92vw] md:max-w-[440px] md:-translate-x-1/2"
      >
        <div className="w-full">
          <Link
            href="/cart"
            className="block rounded-2xl border border-[#30cb73] bg-gradient-to-r from-[#2ecc71] to-[#28b765] px-3.5 py-2.5 shadow-[0_10px_24px_rgba(46,204,113,0.32)]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-white/20 text-white inline-flex items-center justify-center border border-white/30">
                  <ShoppingBagRoundedIcon sx={{ fontSize: 18 }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {totalItems} item{totalItems > 1 ? "s" : ""} added
                  </p>
                  <p className="text-[11px] text-white/80 truncate">
                    Total Rs {totalPrice.toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="h-8 px-3 rounded-lg bg-white text-[#27ae60] text-xs font-bold inline-flex items-center">
                View Cart
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
