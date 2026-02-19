"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", path: "/dashboard", emoji: "🏠" },
  { name: "Vegetables", path: "/vegetables", emoji: "🥦" },
  { name: "Fruits", path: "/fruits", emoji: "🍎" },
  { name: "Salads", path: "/salads", emoji: "🥗" },
  { name: "Ice Creams", path: "/icecreams", emoji: "🍦" },
  { name: "Weekly", path: "/weekly", emoji: "📅" },
  { name: "Cart", path: "/cart", emoji: "🛒" },
  { name: "Profile", path: "/profile", emoji: "👤" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/login" || pathname === "/") return null;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.06]"
      style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
            Y NOT
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/60 font-medium hidden sm:block">
            Fresh & Healthy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? "text-emerald-400"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.name}</span>
                {isActive && (
                  <motion.div layoutId="nav-active"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
          aria-label="Toggle menu">
          <span className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] overflow-hidden"
            style={{ background: "rgba(0,0,0,0.9)" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link key={item.path} href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
