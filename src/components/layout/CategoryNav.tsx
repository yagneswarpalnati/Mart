"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { name: "Vegetables", path: "/vegetables" },
  { name: "Fruits", path: "/fruits" },
  { name: "Salads", path: "/salads" },
  { name: "Ice Creams", path: "/icecreams" },
];

export default function CategoryNav() {
  const pathname = usePathname();
  const isProductRoute = categories.some((category) => category.path === pathname) || pathname.startsWith("/product/");

  if (!isProductRoute) {
    return null;
  }

  return (
    <div className="sticky top-[61px] z-40 -mx-4 px-4 py-3 border-b border-[#e7ecef] bg-white/90 backdrop-blur-sm">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((category) => {
          const active = pathname === category.path;

          return (
            <Link
              key={category.path}
              href={category.path}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap border ${
                active
                  ? "bg-[#e9f9f0] text-[#27ae60] border-[#c7efda]"
                  : "bg-white text-[#7f8c8d] border-[#e7ecef]"
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
