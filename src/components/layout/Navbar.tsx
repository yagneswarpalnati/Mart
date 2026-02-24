"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getUserProfile } from "@/data/mockApi";

function getGreetingBase(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour <= 11) return "Good Morning";
  if (hour >= 12 && hour <= 16) return "Good Afternoon";
  if (hour >= 17 && hour <= 21) return "Good Evening";
  return "Stay Healthy Tonight";
}

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [firstName, setFirstName] = useState("User");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let mounted = true;
    getUserProfile().then((user) => {
      if (mounted) {
        setFirstName(user.name.split(" ")[0] || "User");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = useMemo(
    () => `${getGreetingBase(now)}, ${firstName}`,
    [now, firstName],
  );

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7ecef] bg-white/95 backdrop-blur-sm">
      <div className="min-h-[68px] px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-[#7f8c8d] font-semibold uppercase tracking-[0.14em]">
            Healthy Planner
          </p>
          <p className="text-sm font-bold text-[#1e1e1e] truncate">
            {greeting}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/cart"
            className="soft-pill h-9 px-3 inline-flex items-center text-xs font-semibold text-[#1e1e1e]"
          >
            Cart {totalItems > 0 ? `(${totalItems})` : ""}
          </Link>
          <Link
            href="/profile"
            className="soft-pill h-9 w-9 inline-flex items-center justify-center text-xs font-bold text-[#2ecc71]"
          >
            RP
          </Link>
        </div>
      </div>
    </header>
  );
}
