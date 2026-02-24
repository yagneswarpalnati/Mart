"use client";

import { useEffect, useMemo, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import NutritionRingsCard from "@/components/ui/NutritionRingsCard";
import { useToast } from "@/context/CartContext";
import {
  generateSampleWeeklyPlan,
  getAllProducts,
  getNutritionTargets,
  getUserProfile,
} from "@/data/mockApi";
import type {
  ProductCategory,
  ProductResponse,
  UserProfileResponse,
  WeeklyPlanResponse,
} from "@/types/contracts";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const SHORT_DAY: Record<(typeof DAYS)[number], string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const STORAGE_KEY = "mart_weekly_plan_v5";
const TABLE_VISIBLE_ROWS = 5;
const TABLE_ROW_HEIGHT_REM = 1.75;
const TABLE_BODY_HEIGHT_REM = TABLE_VISIBLE_ROWS * TABLE_ROW_HEIGHT_REM;

type WeeklyPlanItem = {
  id: string;
  quantity: number;
};

type WeeklyPlanState = {
  [day: string]: WeeklyPlanItem[];
};

function getEmptyPlan(): WeeklyPlanState {
  return DAYS.reduce<WeeklyPlanState>((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});
}

function normalizePlanData(raw: unknown): WeeklyPlanState {
  const empty = getEmptyPlan();
  if (!raw || typeof raw !== "object") {
    return empty;
  }

  const input = raw as Record<string, unknown>;

  return DAYS.reduce<WeeklyPlanState>((acc, day) => {
    const dayValue = input[day];

    if (!Array.isArray(dayValue)) {
      acc[day] = [];
      return acc;
    }

    const quantityById: Record<string, number> = {};

    dayValue.forEach((entry) => {
      if (typeof entry === "string") {
        quantityById[entry] = (quantityById[entry] ?? 0) + 1;
        return;
      }

      if (entry && typeof entry === "object") {
        const maybeEntry = entry as { id?: unknown; quantity?: unknown };
        if (typeof maybeEntry.id === "string") {
          const qty =
            typeof maybeEntry.quantity === "number" && maybeEntry.quantity > 0
              ? Math.floor(maybeEntry.quantity)
              : 1;
          quantityById[maybeEntry.id] =
            (quantityById[maybeEntry.id] ?? 0) + qty;
        }
      }
    });

    acc[day] = Object.entries(quantityById).map(([id, quantity]) => ({
      id,
      quantity,
    }));
    return acc;
  }, empty);
}

function legacyToPlanState(legacy: WeeklyPlanResponse): WeeklyPlanState {
  return DAYS.reduce<WeeklyPlanState>((acc, day) => {
    acc[day] = (legacy[day] ?? []).map((id) => ({ id, quantity: 1 }));
    return acc;
  }, getEmptyPlan());
}

function toCalcium(product: ProductResponse) {
  if (typeof product.nutrition.calcium === "number") {
    return product.nutrition.calcium;
  }
  return (product.nutrition.potassium ?? 0) * 0.35;
}

function getPrimaryNutrient(product: ProductResponse) {
  const vitaminC = product.nutrition.vitaminC ?? 0;
  const iron = product.nutrition.iron;
  const calcium = toCalcium(product);

  if (vitaminC >= iron && vitaminC >= calcium / 20)
    return `Vit C ${vitaminC.toFixed(0)}mg`;
  if (calcium / 20 >= iron) return `Calcium ${calcium.toFixed(0)}mg`;
  return `Iron ${iron.toFixed(1)}mg`;
}

export default function WeeklyPage() {
  const { addToast } = useToast();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedDay, setSelectedDay] =
    useState<(typeof DAYS)[number]>("Monday");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "All">("All");

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanState>(() => {
    if (typeof window === "undefined") {
      return getEmptyPlan();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getEmptyPlan();
      return normalizePlanData(JSON.parse(raw));
    } catch {
      return getEmptyPlan();
    }
  });

  useEffect(() => {
    let mounted = true;

    Promise.all([getUserProfile(), getAllProducts()]).then(
      ([user, productList]) => {
        if (!mounted) return;
        setProfile(user);
        setProducts(productList);

        setWeeklyPlan((prev) => {
          const hasData = DAYS.some((day) => (prev[day] ?? []).length > 0);
          if (hasData) return prev;
          return legacyToPlanState(generateSampleWeeklyPlan(productList));
        });
      },
    );

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  const productsById = useMemo(() => {
    return products.reduce<Record<string, ProductResponse>>((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [products]);

  const selectedDayEntries = useMemo(
    () => weeklyPlan[selectedDay] ?? [],
    [weeklyPlan, selectedDay],
  );

  const quantityById = useMemo(() => {
    return selectedDayEntries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.id] = entry.quantity;
      return acc;
    }, {});
  }, [selectedDayEntries]);

  const selectedDayItems = useMemo(() => {
    return selectedDayEntries
      .map((entry) => {
        const product = productsById[entry.id];
        if (!product) return null;
        return { product, quantity: entry.quantity };
      })
      .filter(Boolean) as Array<{ product: ProductResponse; quantity: number }>;
  }, [selectedDayEntries, productsById]);

  const dayTotals = useMemo(() => {
    return selectedDayItems.reduce(
      (acc, row) => {
        const qty = row.quantity;
        const item = row.product;
        acc.calories += item.nutrition.calories * qty;
        acc.protein += item.nutrition.protein * qty;
        acc.fiber += item.nutrition.fiber * qty;
        acc.vitaminC += (item.nutrition.vitaminC ?? 0) * qty;
        acc.calcium += toCalcium(item) * qty;
        acc.iron += item.nutrition.iron * qty;
        acc.totalQty += qty;
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        fiber: 0,
        vitaminC: 0,
        calcium: 0,
        iron: 0,
        totalQty: 0,
      },
    );
  }, [selectedDayItems]);

  const targets = useMemo(() => {
    if (!profile) {
      return { protein: 50, fiber: 25, vitaminC: 90, calcium: 1000, iron: 18 };
    }

    const base = getNutritionTargets(profile);
    return {
      protein: base.protein,
      fiber: base.fiber,
      vitaminC: 90,
      calcium: 1000,
      iron: base.iron,
    };
  }, [profile]);

  const filteredItems = useMemo(() => {
    return products.filter((item) => {
      const categoryOk = category === "All" || item.category === category;
      const searchOk = item.name.toLowerCase().includes(search.toLowerCase());
      return categoryOk && searchOk;
    });
  }, [products, search, category]);

  const setItemQuantity = (productId: string, nextQuantity: number) => {
    setWeeklyPlan((prev) => {
      const current = prev[selectedDay] ?? [];
      const existing = current.find((entry) => entry.id === productId);

      if (nextQuantity <= 0) {
        return {
          ...prev,
          [selectedDay]: current.filter((entry) => entry.id !== productId),
        };
      }

      if (!existing) {
        return {
          ...prev,
          [selectedDay]: [
            ...current,
            { id: productId, quantity: nextQuantity },
          ],
        };
      }

      return {
        ...prev,
        [selectedDay]: current.map((entry) =>
          entry.id === productId ? { ...entry, quantity: nextQuantity } : entry,
        ),
      };
    });
  };

  const addItemToDay = (productId: string) => {
    setItemQuantity(productId, (quantityById[productId] ?? 0) + 1);
  };

  const removeItemFromDay = (productId: string) => {
    setItemQuantity(productId, (quantityById[productId] ?? 0) - 1);
  };

  const selectAllFiltered = () => {
    setWeeklyPlan((prev) => {
      const nextEntries = filteredItems.map((item) => ({
        id: item.id,
        quantity: quantityById[item.id] ?? 1,
      }));
      return { ...prev, [selectedDay]: nextEntries };
    });

    addToast(`Selected all filtered items for ${SHORT_DAY[selectedDay]}`);
  };

  const clearDay = () => {
    setWeeklyPlan((prev) => ({ ...prev, [selectedDay]: [] }));
  };

  const autoPlan = () => {
    const generated = generateSampleWeeklyPlan(products);
    setWeeklyPlan(legacyToPlanState(generated));
    addToast("Generated sample weekly plan");
  };

  const handleCheckout = () => {
    if (dayTotals.totalQty === 0) {
      addToast("Add items before checkout", "warning");
      return;
    }
    addToast("Weekly checkout initiated");
  };

  return (
    <PageWrapper>
      <div className="app-page-fit px-3 py-2 overflow-hidden">
        <section className="surface-card h-full p-2.5 grid grid-rows-[auto_auto_minmax(0,1fr)] gap-2 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-[#7f8c8d] uppercase tracking-[0.12em]">
              Weekly Diet Planner
            </p>
            <button
              onClick={autoPlan}
              className="h-7 px-2.5 rounded-full text-[10px] font-semibold bg-[#eef9f2] text-[#27ae60] border border-[#c7efda]"
            >
              Auto Plan
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((day) => {
              const active = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-7 rounded-lg border text-[10px] font-semibold ${
                    active
                      ? "bg-[#2ecc71] text-white border-[#2ecc71]"
                      : "bg-white text-[#7f8c8d] border-[#e7ecef]"
                  }`}
                >
                  {SHORT_DAY[day]}
                </button>
              );
            })}
          </div>

          <div className="min-h-0 grid grid-rows-[auto_minmax(0,auto)_minmax(0,1fr)] gap-2 overflow-hidden">
            <div className="rounded-xl border border-[#e7ecef] overflow-hidden">
              <div className="px-2 py-1.5 bg-[#f8fafb] border-b border-[#e7ecef]">
                <p className="text-[10px] font-semibold text-[#7f8c8d]">
                  Weekly Diet Table ({SHORT_DAY[selectedDay]})
                </p>
              </div>

              <div className="px-1.5 py-1">
                <div className="grid grid-cols-[28%_10%_12%_12%_12%_26%] text-[9px] sm:text-[10px] text-[#7f8c8d] font-semibold px-0.5">
                  <span>Item</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Cal</span>
                  <span className="text-right">Prot</span>
                  <span className="text-right">Fib</span>
                  <span className="text-right">Primary</span>
                </div>

                <div
                  className="mt-1 overflow-y-auto"
                  style={{
                    height: `${TABLE_BODY_HEIGHT_REM}rem`,
                    minHeight: `${TABLE_BODY_HEIGHT_REM}rem`,
                  }}
                >
                  {selectedDayItems.map((row) => {
                    const item = row.product;
                    const qty = row.quantity;

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-[28%_10%_12%_12%_12%_26%] items-center border-t border-[#f0f3f5] text-[9px] sm:text-[10px]"
                        style={{ minHeight: `${TABLE_ROW_HEIGHT_REM}rem` }}
                      >
                        <span className="truncate text-[#1e1e1e] font-medium pr-1">
                          {item.name}
                        </span>
                        <span className="text-right text-[#1e1e1e]">{qty}</span>
                        <span className="text-right text-[#1e1e1e]">
                          {(item.nutrition.calories * qty).toFixed(0)}
                        </span>
                        <span className="text-right text-[#1e1e1e]">
                          {(item.nutrition.protein * qty).toFixed(1)}
                        </span>
                        <span className="text-right text-[#1e1e1e]">
                          {(item.nutrition.fiber * qty).toFixed(1)}
                        </span>
                        <span className="text-right text-[#7f8c8d] truncate">
                          {getPrimaryNutrient(item)}
                        </span>
                      </div>
                    );
                  })}

                  {selectedDayItems.length === 0 && (
                    <div className="h-full border-t border-[#f0f3f5] flex items-center justify-center text-[#7f8c8d] text-[10px]">
                      No items selected
                    </div>
                  )}
                </div>
              </div>

              <div className="px-2 py-1 border-t border-[#d7efe2] bg-[#eef9f2]">
                <div className="grid grid-cols-5 text-[9px] sm:text-[10px]">
                  <span className="font-bold text-[#1e1e1e]">TOTAL</span>
                  <span className="text-right font-bold text-[#1e1e1e]">
                    {dayTotals.totalQty}
                  </span>
                  <span className="text-right font-bold text-[#1e1e1e]">
                    {dayTotals.calories.toFixed(0)}
                  </span>
                  <span className="text-right font-bold text-[#1e1e1e]">
                    {dayTotals.protein.toFixed(1)}
                  </span>
                  <span className="text-right font-bold text-[#1e1e1e]">
                    {dayTotals.fiber.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-0 grid  gap-2 overflow-hidden">
              <div className="min-h-0">
                <NutritionRingsCard
                  compact
                  title="Aggregate Weekly Nutrition"
                  metrics={[
                    {
                      label: "Vitamin C",
                      value: dayTotals.vitaminC,
                      target: targets.vitaminC,
                      unit: "mg",
                      color: "#10E6C2",
                    },
                    {
                      label: "Protein",
                      value: dayTotals.protein,
                      target: targets.protein,
                      unit: "g",
                      color: "#2BC4FF",
                    },
                    {
                      label: "Fiber",
                      value: dayTotals.fiber,
                      target: targets.fiber,
                      unit: "g",
                      color: "#7B61FF",
                    },
                    {
                      label: "Calcium",
                      value: dayTotals.calcium,
                      target: targets.calcium,
                      unit: "mg",
                      color: "#FFB020",
                    },
                    {
                      label: "Iron",
                      value: dayTotals.iron,
                      target: targets.iron,
                      unit: "mg",
                      color: "#FF4E58",
                    },
                  ]}
                />
              </div>

              <div className="min-h-0 rounded-xl border border-[#e7ecef] bg-white p-2 grid grid-rows-[auto_auto_1fr_auto] gap-1.5 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-[#1e1e1e]">
                    All Items
                  </p>
                  <div className="inline-flex gap-1">
                    <button
                      onClick={selectAllFiltered}
                      className="h-6 px-2 rounded-md text-[10px] font-semibold bg-[#eef9f2] text-[#27ae60] border border-[#c7efda]"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearDay}
                      className="h-6 px-2 rounded-md text-[10px] font-semibold bg-[#fff5f5] text-[#e74c3c] border border-[#ffd7d2]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-1.5">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search item"
                    className="input-field h-7 !py-1 !px-2 text-[10px]"
                  />
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value as ProductCategory | "All")
                    }
                    className="input-field h-7 !py-1 !px-2 text-[10px] w-[102px]"
                  >
                    <option value="All">All</option>
                    <option value="Vegetables">Veg</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Salads">Salads</option>
                    <option value="Ice Creams">Ice</option>
                  </select>
                </div>

                <div className="min-h-0 overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 gap-1">
                    {filteredItems.map((product) => {
                      const qty = quantityById[product.id] ?? 0;

                      return (
                        <div
                          key={product.id}
                          className="rounded-lg border border-[#edf1f3] px-2 py-1.5 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-[#1e1e1e] truncate">
                              {product.name}
                            </p>
                            <p className="text-[9px] text-[#7f8c8d]">
                              {product.category}
                            </p>
                          </div>

                          {qty > 0 ? (
                            <div className="inline-flex items-center gap-1 rounded-md bg-[#eef9f2] border border-[#c7efda] p-0.5">
                              <button
                                onClick={() => removeItemFromDay(product.id)}
                                className="h-5 w-5 rounded bg-white text-[#27ae60] text-[11px] font-bold"
                              >
                                -
                              </button>
                              <span className="min-w-4 text-center text-[10px] font-semibold text-[#1e1e1e]">
                                {qty}
                              </span>
                              <button
                                onClick={() => addItemToDay(product.id)}
                                className="h-5 w-5 rounded bg-white text-[#27ae60] text-[11px] font-bold"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addItemToDay(product.id)}
                              className="h-6 px-2 rounded-md text-[10px] font-semibold bg-[#eef9f2] text-[#27ae60] border border-[#c7efda]"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {filteredItems.length === 0 && (
                      <p className="text-[10px] text-[#7f8c8d] text-center py-2">
                        No items found for current filter
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-primary h-8 text-xs"
                >
                  Checkout Weekly Plan
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
