"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/mockApi";
import type { ProductResponse } from "@/types/contracts";

function NutritionRow({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-[#1e1e1e] font-medium">{label}</span>
        <span className="text-[#7f8c8d]">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#edf1f3] overflow-hidden">
        <div className="h-full bg-[#2ecc71]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem, getItemQuantity, updateQuantity } = useCart();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const result = await getProductById(params.id);
      if (mounted) {
        setProduct(result);
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const quantity = useMemo(() => (product ? getItemQuantity(product.id) : 0), [product, getItemQuantity]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="px-4 py-6">
          <div className="surface-card p-4 text-sm text-[#7f8c8d]">Loading product...</div>
        </div>
      </PageWrapper>
    );
  }

  if (!product) {
    return (
      <PageWrapper>
        <div className="px-4 py-6">
          <div className="surface-card p-4 text-sm text-[#7f8c8d]">Product not found.</div>
          <Link href="/vegetables" className="text-xs text-[#27ae60] font-semibold mt-3 inline-block">Back to catalog</Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="px-4 py-4 pb-28 flex flex-col gap-4">
        <section className="surface-card overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
          <div className="p-4">
            <p className="text-xs text-[#7f8c8d]">{product.category}</p>
            <h1 className="text-xl font-black text-[#1e1e1e] mt-1">{product.name}</h1>
            <p className="text-sm text-[#7f8c8d] mt-1">{product.description}</p>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-[#27ae60]">Rs {product.price}</p>
                <p className="text-xs text-[#7f8c8d]">{product.unit}</p>
              </div>

              {quantity > 0 ? (
                <div className="rounded-xl border border-[#d5f1e2] bg-[#eef9f2] px-1 h-9 inline-flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="h-7 w-7 rounded-lg bg-white text-[#27ae60] text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold min-w-4 text-center text-[#27ae60]">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="h-7 w-7 rounded-lg bg-white text-[#27ae60] text-sm"
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
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-bold text-[#1e1e1e] mb-3">Full Nutrition Chart</h2>
          <div className="space-y-3">
            <NutritionRow label="Calories" value={product.nutrition.calories} max={300} unit=" kcal" />
            <NutritionRow label="Protein" value={product.nutrition.protein} max={20} unit=" g" />
            <NutritionRow label="Fiber" value={product.nutrition.fiber} max={20} unit=" g" />
            <NutritionRow label="Iron" value={product.nutrition.iron} max={20} unit=" mg" />
            <NutritionRow label="Potassium" value={product.nutrition.potassium ?? 0} max={1000} unit=" mg" />
          </div>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-bold text-[#1e1e1e] mb-2">Health Benefit Tags</h2>
          <div className="flex flex-wrap gap-2">
            {product.healthBenefits.map((benefit) => (
              <span key={benefit} className="px-2.5 py-1 rounded-full text-xs bg-[#eef9f2] border border-[#d5f1e2] text-[#27ae60]">
                {benefit}
              </span>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
