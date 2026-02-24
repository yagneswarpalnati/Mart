"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import NutritionRingsCard from "@/components/ui/NutritionRingsCard";
import { useCart, useToast } from "@/context/CartContext";
import { getNutritionTargets, getUserProfile } from "@/data/mockApi";
import type { UserProfileResponse } from "@/types/contracts";

function calciumFromItem(item: {
  nutrition: { calcium?: number; potassium?: number };
}) {
  if (typeof item.nutrition.calcium === "number") {
    return item.nutrition.calcium;
  }
  return (item.nutrition.potassium ?? 0) * 0.35;
}

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart, updateQuantity } =
    useCart();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    getUserProfile().then((user) => {
      if (mounted) {
        setProfile(user);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const aggregate = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const quantity = item.quantity;
        acc.protein += item.nutrition.protein * quantity;
        acc.fiber += item.nutrition.fiber * quantity;
        acc.vitaminC += (item.nutrition.vitaminC ?? 0) * quantity;
        acc.calcium += calciumFromItem(item) * quantity;
        acc.iron += item.nutrition.iron * quantity;
        return acc;
      },
      { protein: 0, fiber: 0, vitaminC: 0, calcium: 0, iron: 0 },
    );
  }, [items]);

  const targets = useMemo(() => {
    if (!profile) {
      return { protein: 50, fiber: 25, vitaminC: 90, calcium: 1000, iron: 18 };
    }

    const nutritionTargets = getNutritionTargets(profile);
    return {
      protein: nutritionTargets.protein,
      fiber: nutritionTargets.fiber,
      vitaminC: 90,
      calcium: 1000,
      iron: nutritionTargets.iron,
    };
  }, [profile]);

  const deliveryFee = totalPrice >= 500 ? 0 : 35;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <PageWrapper>
      <div className="px-4 py-4 pb-28 flex flex-col gap-4">
        <section className="surface-card p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#7f8c8d] font-semibold">
                Cart Screen
              </p>
              <h1 className="text-xl font-black text-[#1e1e1e] mt-0.5">
                {totalItems} item(s) selected
              </h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-[#7f8c8d] hover:text-[#1e1e1e]"
              >
                Clear
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="mt-4 border border-dashed border-[#d7e3e8] rounded-xl p-4 text-center">
              <p className="text-sm text-[#7f8c8d]">Cart is empty.</p>
              <Link
                href="/vegetables"
                className="text-xs font-semibold text-[#27ae60] mt-2 inline-block"
              >
                Browse catalog
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2.5">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-[#e7ecef] bg-white p-2.5 flex gap-3 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover bg-[#f3f5f6]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1e1e1e] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#7f8c8d]">
                      Rs {item.price} / {item.unit}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#d5f1e2] bg-[#eef9f2] p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-6 w-6 rounded-md bg-white text-[#27ae60]"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold text-[#27ae60] min-w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 rounded-md bg-white text-[#27ae60]"
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="h-[360px]">
          <NutritionRingsCard
            title="Aggregate Weekly Nutrition"
            metrics={[
              {
                label: "Vitamin C",
                value: aggregate.vitaminC,
                target: targets.vitaminC,
                unit: "mg",
                color: "#10E6C2",
              },
              {
                label: "Protein",
                value: aggregate.protein,
                target: targets.protein,
                unit: "g",
                color: "#2BC4FF",
              },
              {
                label: "Fiber",
                value: aggregate.fiber,
                target: targets.fiber,
                unit: "g",
                color: "#7B61FF",
              },
              {
                label: "Calcium",
                value: aggregate.calcium,
                target: targets.calcium,
                unit: "mg",
                color: "#FFB020",
              },
              {
                label: "Iron",
                value: aggregate.iron,
                target: targets.iron,
                unit: "mg",
                color: "#FF4E58",
              },
            ]}
          />
        </section>

        {items.length > 0 && (
          <section className="surface-card p-4">
            <h2 className="text-sm font-bold text-[#1e1e1e] mb-3">
              Total Price
            </h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7f8c8d]">Items</span>
                <span className="text-[#1e1e1e]">
                  Rs {totalPrice.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f8c8d]">Delivery</span>
                <span className="text-[#1e1e1e]">
                  {deliveryFee === 0 ? "FREE" : `Rs ${deliveryFee}`}
                </span>
              </div>
              <div className="h-px bg-[#e7ecef] my-1" />
              <div className="flex justify-between font-bold text-[#1e1e1e]">
                <span>Grand Total</span>
                <span>Rs {grandTotal.toFixed(0)}</span>
              </div>
            </div>

            <button
              disabled={items.length === 0}
              onClick={() => addToast("Cart checkout initiated")}
              className="btn-primary w-full mt-4 py-2.5 text-sm disabled:opacity-50"
            >
              Checkout
            </button>
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
