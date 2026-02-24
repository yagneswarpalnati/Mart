"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      icon: <HomeRoundedIcon sx={{ fontSize: 22 }} />,
      path: "/dashboard",
    },
    {
      label: "Catalog",
      icon: <CategoryRoundedIcon sx={{ fontSize: 22 }} />,
      path: "/vegetables",
    },
    {
      label: "Weekly",
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22 }} />,
      path: "/weekly",
    },
    {
      label: "Profile",
      icon: <PersonRoundedIcon sx={{ fontSize: 22 }} />,
      path: "/profile",
    },
  ];

  return (
    <div
      className="fixed bottom-0 z-[60] border-t border-[#e7ecef] bg-white pb-safe"
      style={{
        width: "min(100vw, var(--app-mobile-max-width))",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div className="w-full flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const isCatalogRoute =
            ["/vegetables", "/fruits", "/salads", "/icecreams"].includes(
              pathname,
            ) || pathname.startsWith("/product/");
          const isActive =
            pathname === item.path ||
            (item.path === "/vegetables" && isCatalogRoute);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <span className={isActive ? "text-[#2ecc71]" : "text-[#9aa4ab]"}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-[#2ecc71]" : "text-[#9aa4ab]"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
