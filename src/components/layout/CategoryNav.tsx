"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const categories = [
  { name: "Vegetables", path: "/vegetables", emoji: "🥦" },
  { name: "Fruits", path: "/fruits", emoji: "🍎" },
  { name: "Salads", path: "/salads", emoji: "🥗" },
  { name: "Ice Creams", path: "/icecreams", emoji: "🍦" },
];

export default function CategoryNav() {
  const pathname = usePathname();

  // Only show on product pages
  const isProductPage = categories.some(cat => cat.path === pathname);
  if (!isProductPage) return null;

  return (
    <div className="sticky top-[65px] z-40 bg-black/80 backdrop-blur-md border-b border-white/5 py-3 -mx-6 px-6 overflow-hidden">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = pathname === cat.path;
          return (
            <Link key={cat.path} href={cat.path}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 border ${
                  isActive 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-white/5 border-white/5 text-white/40 hover:text-white/60"
                }`}
              >
                <span className="text-base">{cat.emoji}</span>
                <span className={`text-xs font-black uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {cat.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="w-1 h-1 rounded-full bg-emerald-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
