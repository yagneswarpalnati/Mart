"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 mx-auto w-full">
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-emerald-400 leading-none">10</span>
            <span className="text-[7px] font-bold text-emerald-400/60 uppercase">Mins</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-white font-black text-sm tracking-tight text-shadow-glow">Our Community</span>
              <span className="text-emerald-400 text-[10px]">▼</span>
            </div>
            <span className="text-white/40 text-[9px] font-medium tracking-wide">Bengaluru, KA 560001</span>
          </div>
        </div>
        
        <Link href="/profile" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg active:scale-95 transition-transform overflow-hidden shadow-inner">
          <span className="filter brightness-125">👤</span>
        </Link>
      </div>
    </header>
  );
}

