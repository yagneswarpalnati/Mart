"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryNav from "@/components/layout/CategoryNav";
import PageWrapper from "@/components/layout/PageWrapper";
import { useCart } from "@/context/CartContext";
import { getCatalogProducts, getTopNutrients } from "@/data/mockApi";
import type { CatalogFilters, ProductCategory, ProductResponse } from "@/types/contracts";

const nutritionOptions: Array<{ label: string; value: CatalogFilters["nutrition"] }> = [
  { label: "All Nutrition", value: "all" },
  { label: "High Protein", value: "high-protein" },
  { label: "High Fiber", value: "high-fiber" },
  { label: "High Iron", value: "high-iron" },
  { label: "Low Calorie", value: "low-calorie" },
];

export default function CatalogScreen({ initialCategory }: { initialCategory: ProductCategory }) {
  const { addItem, getItemQuantity, updateQuantity } = useCart();

  const [filters, setFilters] = useState<CatalogFilters>({
    category: initialCategory,
    search: "",
    nutrition: "all",
  });
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      const response = await getCatalogProducts(filters);
      if (mounted) {
        setProducts(response);
        setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [filters]);

  return (
    <PageWrapper>
      <div className="px-4 pb-44">
        <CategoryNav />

        <section className="pt-4 flex flex-col gap-3">
          <input
            value={filters.search ?? ""}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Search products"
            className="input-field"
          />

          <div className="grid grid-cols-1 gap-2">
            <select
              className="input-field text-sm"
              value={filters.nutrition ?? "all"}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  nutrition: event.target.value as CatalogFilters["nutrition"],
                }))
              }
            >
              {nutritionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-4">
          {loading ? (
            <div className="surface-card p-4 text-sm text-[#7f8c8d]">Loading catalog...</div>
          ) : products.length === 0 ? (
            <div className="surface-card p-4 text-sm text-[#7f8c8d]">No products match current filters.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => {
                const quantity = getItemQuantity(product.id);

                return (
                  <article key={product.id} className="surface-card p-3">
                    <div className="flex gap-3">
                      <Link href={`/product/${product.id}`} className="h-24 w-24 rounded-xl overflow-hidden bg-[#f3f5f6] flex-shrink-0">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/product/${product.id}`} className="text-sm font-bold text-[#1e1e1e] block">
                              {product.name}
                            </Link>
                            <p className="text-xs text-[#7f8c8d] mt-0.5">{product.category}</p>
                          </div>
                          <p className="text-sm font-bold text-[#27ae60]">Rs {product.price}</p>
                        </div>

                        <p className="text-xs text-[#7f8c8d] mt-1">{product.unit}</p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {getTopNutrients(product.nutrition).map((entry) => (
                            <span
                              key={entry.label}
                              className="text-[10px] rounded-full bg-[#eef9f2] border border-[#d5f1e2] px-2 py-0.5 text-[#27ae60]"
                            >
                              {entry.label}: {entry.value}
                              {entry.unit}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex justify-end">
                          {quantity > 0 ? (
                            <div className="rounded-xl border border-[#d5f1e2] bg-[#eef9f2] px-1 h-8 inline-flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="h-6 w-6 rounded-lg bg-white text-[#27ae60] text-sm"
                              >
                                -
                              </button>
                              <span className="text-xs font-semibold min-w-4 text-center text-[#27ae60]">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="h-6 w-6 rounded-lg bg-white text-[#27ae60] text-sm"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  category: product.category,
                                  price: product.price,
                                  unit: product.unit,
                                  image: product.image,
                                  nutrition: product.nutrition,
                                })
                              }
                              className="btn-primary px-4 text-xs"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
