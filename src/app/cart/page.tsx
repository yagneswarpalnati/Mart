"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import NutritionRingsCard from "@/components/ui/NutritionRingsCard";
import { useCart, useToast } from "@/context/CartContext";
import { getNutritionTargets, getUserProfile } from "@/data/mockApi";
import type { UserProfileResponse } from "@/types/contracts";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";

const CART_VISIBLE_ROWS = 5;
const CART_ROW_HEIGHT_REM = 3.25;

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
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <RemoveShoppingCartOutlinedIcon
              sx={{ fontSize: 56, color: "#cbd5e1" }}
            />
            <p className="mt-3 text-sm font-semibold text-[#1e1e1e]">
              Your cart is empty
            </p>
            <Link href='/vegetables'>
              Add fresh items to stay healthy
            </Link>
          </div>
        ) : (
          <>
            <section className="h-[360px]">
              <NutritionRingsCard
                title="Aggregate Cart Nutrition"
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
                <button
                  onClick={clearCart}
                  className="text-xs text-[#7f8c8d] hover:text-[#1e1e1e]"
                >
                  Clear
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-[#e7ecef] overflow-hidden overflow-x-hidden">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] px-2 py-1.5 bg-[#f8fafb] border-b border-[#e7ecef] text-[10px] font-semibold text-[#7f8c8d]">
                  <span>Item</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Unit Price</span>
                  <span className="text-right">Subtotal</span>
                </div>

                <div
                  className="overflow-y-auto px-2 overflow-x-hidden"
                  style={{
                    height: `${CART_VISIBLE_ROWS * CART_ROW_HEIGHT_REM}rem`,
                    minHeight: `${CART_VISIBLE_ROWS * CART_ROW_HEIGHT_REM}rem`,
                  }}
                >
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-1 border-t border-[#f0f3f5]"
                      style={{ minHeight: `${CART_ROW_HEIGHT_REM}rem` }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-9 w-9 rounded-md object-cover bg-[#f3f5f6] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-[#1e1e1e] truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-[#7f8c8d] truncate">
                            {item.unit}
                          </p>
                        </div>
                      </div>

                      <div className="justify-self-center inline-flex items-center gap-1 rounded-md border border-[#d5f1e2] bg-[#eef9f2] p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-5 w-5 rounded bg-white text-[#27ae60] text-[11px] font-bold"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-semibold text-[#27ae60] min-w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-5 w-5 rounded bg-white text-[#27ae60] text-[11px] font-bold"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-[11px] text-right text-[#1e1e1e]">
                        Rs {item.price}
                      </p>
                      <p className="text-[11px] text-right font-semibold text-[#1e1e1e]">
                        Rs {(item.price * item.quantity).toFixed(0)}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="px-2 py-1 border-t border-[#d7efe2] bg-[#eef9f2]">
                  <div className="grid grid-cols-[42%_22%_18%_18%] text-[10px]">
                    <span className="font-bold text-[#1e1e1e]">TOTAL</span>
                    <span className="font-bold text-[#1e1e1e] text-center">
                      {totalItems}
                    </span>
                    <span />
                    <span className="font-bold text-[#1e1e1e] text-right">
                      Rs {totalPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

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
          </>
        )}
      </div>
    </PageWrapper>
  );
}
