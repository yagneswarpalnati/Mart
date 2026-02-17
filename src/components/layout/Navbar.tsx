"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Vegetables", path: "/vegetables" },
  { name: "Fruits", path: "/fruits" },
  { name: "Weekly", path: "/weekly" },
  { name: "Cart", path: "/cart" },
  { name: "Profile", path: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-lg">FreshMart</h1>

      <div className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`hover:underline ${
              pathname === item.path ? "font-bold underline" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
