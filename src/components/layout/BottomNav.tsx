"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: <HomeRoundedIcon sx={{ fontSize: 24 }} />, path: "/dashboard" },
    { label: "Products", icon: <CategoryRoundedIcon sx={{ fontSize: 24 }} />, path: "/vegetables" }, // Default to veggies
    { label: "Weekly", icon: <CalendarMonthRoundedIcon sx={{ fontSize: 24 }} />, path: "/weekly" },
    { label: "Profile", icon: <PersonRoundedIcon sx={{ fontSize: 24 }} />, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path === "/vegetables" && ["/vegetables", "/fruits", "/salads", "/icecreams"].includes(pathname));
          
          return (
            <Link key={item.path} href={item.path} className="relative group flex flex-col items-center gap-1 transition-all duration-300">
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/60'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-white/20'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="bottomNavDot"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
