"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import NutritionRingsCard from "@/components/ui/NutritionRingsCard";
import { useCart } from "@/context/CartContext";
import { getDashboardData } from "@/data/mockApi";
import type { DashboardResponse, ProductResponse } from "@/types/contracts";

function ProductRail({
  title,
  items,
  onAdd,
  onReduce,
  getQuantity,
}: {
  title: string;
  items: ProductResponse[];
  onAdd: (item: ProductResponse) => void;
  onReduce: (item: ProductResponse) => void;
  getQuantity: (id: string) => number;
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
        {items.map((item) => {
          const qty = getQuantity(item.id);

          return (
            <article key={item.id} className="surface-card min-w-[170px] w-[170px] p-2.5">
              <Link href={`/product/${item.id}`} className="block rounded-lg overflow-hidden bg-[#f3f5f6] h-24">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <p className="text-xs font-bold mt-2 text-[#1e1e1e] line-clamp-1">{item.name}</p>
              <p className="text-[11px] text-[#7f8c8d]">{item.unit}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#27ae60]">Rs {item.price}</span>
                {qty === 0 ? (
                  <button onClick={() => onAdd(item)} className="btn-primary text-[11px] px-3 py-1.5">
                    Add
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 rounded-md bg-[#eef9f2] border border-[#c7efda] p-0.5">
                    <button onClick={() => onReduce(item)} className="h-5 w-5 rounded bg-white text-[#27ae60] text-[11px] font-bold">-</button>
                    <span className="min-w-4 text-center text-[10px] font-semibold text-[#1e1e1e]">{qty}</span>
                    <button onClick={() => onAdd(item)} className="h-5 w-5 rounded bg-white text-[#27ae60] text-[11px] font-bold">+</button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

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

  const handleReduce = (product: ProductResponse) => {
    const qty = getItemQuantity(product.id);
    updateQuantity(product.id, qty - 1);
  };

  return (
    <PageWrapper>
      <div className="px-4 py-4 pb-44 flex flex-col gap-4">
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
            <ProductRail
              title="Trending"
              items={data.trending}
              onAdd={handleAdd}
              onReduce={handleReduce}
              getQuantity={getItemQuantity}
            />
            <ProductRail
              title="Recommended"
              items={data.recommended}
              onAdd={handleAdd}
              onReduce={handleReduce}
              getQuantity={getItemQuantity}
            />

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

            <section className="surface-card p-3.5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[#1e1e1e]">Weekly Report</h2>
                <p className="text-[10px] text-[#7f8c8d]">{data.weeklyReport.periodLabel}</p>
              </div>
              <div className="h-[290px]">
                <NutritionRingsCard
                  title="Nutrition from Monday to Today"
                  metrics={[
                    { label: "Vitamin C", value: data.weeklyReport.values.vitaminC, target: data.weeklyReport.targets.vitaminC, unit: "mg", color: "#10E6C2" },
                    { label: "Protein", value: data.weeklyReport.values.protein, target: data.weeklyReport.targets.protein, unit: "g", color: "#2BC4FF" },
                    { label: "Fiber", value: data.weeklyReport.values.fiber, target: data.weeklyReport.targets.fiber, unit: "g", color: "#7B61FF" },
                    { label: "Calcium", value: data.weeklyReport.values.calcium, target: data.weeklyReport.targets.calcium, unit: "mg", color: "#FFB020" },
                    { label: "Iron", value: data.weeklyReport.values.iron, target: data.weeklyReport.targets.iron, unit: "mg", color: "#FF4E58" },
                  ]}
                />
              </div>
              {data.weeklyReport.resetApplied && (
                <p className="text-[10px] text-[#7f8c8d] mt-2">
                  Weekly report reset applied after Sunday 12:00 PM.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
