"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { useCart } from "@/context/CartContext";
import { getDashboardData } from "@/data/mockApi";
import type { DashboardResponse, ProductResponse } from "@/types/contracts";

function ProductRail({
  title,
  items,
  onAdd,
}: {
  title: string;
  items: ProductResponse[];
  onAdd: (item: ProductResponse) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-[#1e1e1e]">{title}</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {items.map((item) => (
          <article key={item.id} className="surface-card min-w-[170px] w-[170px] p-2.5">
            <Link href={`/product/${item.id}`} className="block rounded-lg overflow-hidden bg-[#f3f5f6] h-24">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </Link>
            <p className="text-xs font-bold mt-2 text-[#1e1e1e] line-clamp-1">{item.name}</p>
            <p className="text-[11px] text-[#7f8c8d]">{item.unit}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-[#27ae60]">Rs {item.price}</span>
              <button onClick={() => onAdd(item)} className="btn-primary text-[11px] px-3 py-1.5">
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { addItem } = useCart();

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const response = await getDashboardData();
      if (mounted) {
        setData(response);
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = (product: ProductResponse) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      image: product.image,
      nutrition: product.nutrition,
    });
  };

  return (
    <PageWrapper>
      <div className="px-4 py-4 pb-28 flex flex-col gap-4">
        <section className="surface-card p-4 bg-gradient-to-br from-[#e9f9f0] to-white">
          <p className="text-[11px] text-[#27ae60] uppercase font-semibold tracking-[0.14em]">Dashboard</p>
          <h1 className="text-2xl font-black mt-1 text-[#1e1e1e]">Fresh nutrition, right on schedule</h1>
          <p className="text-sm text-[#7f8c8d] mt-1">Trending picks, smart recommendations, and weekly plan status in one place.</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/vegetables" className="soft-pill px-3 py-1.5 text-xs text-[#1e1e1e] font-semibold">Vegetables</Link>
            <Link href="/fruits" className="soft-pill px-3 py-1.5 text-xs text-[#1e1e1e] font-semibold">Fruits</Link>
            <Link href="/salads" className="soft-pill px-3 py-1.5 text-xs text-[#1e1e1e] font-semibold">Salads</Link>
            <Link href="/icecreams" className="soft-pill px-3 py-1.5 text-xs text-[#1e1e1e] font-semibold">Ice Creams</Link>
          </div>
        </section>

        {loading || !data ? (
          <section className="surface-card p-4 text-sm text-[#7f8c8d]">Loading dashboard...</section>
        ) : (
          <>
            <ProductRail title="Trending" items={data.trending} onAdd={handleAdd} />
            <ProductRail title="Recommended" items={data.recommended} onAdd={handleAdd} />

            <section className="surface-card p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1e1e1e]">Weekly Summary Card</h2>
                <Link href="/weekly" className="text-xs font-semibold text-[#27ae60]">Open Weekly</Link>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="rounded-xl border border-[#e7ecef] bg-[#fafcff] p-2.5 text-center">
                  <p className="text-lg font-bold text-[#1e1e1e]">{data.weeklySummary.itemsOrdered}</p>
                  <p className="text-[11px] text-[#7f8c8d]">Items</p>
                </div>
                <div className="rounded-xl border border-[#e7ecef] bg-[#fafcff] p-2.5 text-center">
                  <p className="text-lg font-bold text-[#1e1e1e]">Rs {data.weeklySummary.estimatedSavings}</p>
                  <p className="text-[11px] text-[#7f8c8d]">Saved</p>
                </div>
                <div className="rounded-xl border border-[#e7ecef] bg-[#fafcff] p-2.5 text-center">
                  <p className="text-lg font-bold text-[#1e1e1e]">{data.weeklySummary.avgProtein}g</p>
                  <p className="text-[11px] text-[#7f8c8d]">Avg Protein</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
