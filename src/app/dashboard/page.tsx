"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FuturisticCard from "@/components/ui/FuturisticCard";
import PageWrapper from "@/components/layout/PageWrapper";
import SpringyCursor from "@/components/ui/SpringyCursor";

const sections = [
  { name: "Vegetables", emoji: "🥦", path: "/vegetables" },
  { name: "Fruits", emoji: "🍎", path: "/fruits" },
  { name: "Weekly Offers", emoji: "📅", path: "/weekly" },
  { name: "Cart", emoji: "🛒", path: "/cart" },
  { name: "Profile", emoji: "👤", path: "/profile" },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
        <div className="relative min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black overflow-hidden">
        <SpringyCursor/>
        {/* Content Wrapper */}
        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-center mb-14 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent"
          >
            FreshMart Dashboard
          </motion.h1>

          {/* Search Bar */}
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            type="text"
            placeholder="Search sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 mx-auto block mb-16 p-4 rounded-2xl bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {filteredSections.map((section, index) => (
                  <Link href={section.path} key={index}>
                      <div className="text-7xl mb-6 text-center">
                        {section.emoji}
                      </div>
                      <h2 className="text-2xl font-semibold text-center tracking-wide">
                        {section.name}
                      </h2>
                  </Link>
                
              ))}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
