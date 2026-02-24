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
        className="fixed bottom-[78px] z-50 px-3"
        style={{
          width: "min(100vw, var(--app-mobile-max-width))",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="w-full">
          <Link
            href="/cart"
            className="surface-card rounded-2xl px-4 py-3 flex items-center justify-between border-[#d9f3e5] bg-[#f3fdf7]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2ecc71] text-white inline-flex items-center justify-center">
                <ShoppingBagRoundedIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1e1e1e]">
                  {totalItems} item(s) in cart
                </p>
                <p className="text-xs text-[#7f8c8d]">
                  Total Rs {totalPrice.toFixed(0)}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#27ae60]">View</span>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
