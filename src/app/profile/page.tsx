"use client";

import { useEffect, useMemo, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useToast } from "@/context/CartContext";
import {
  getAllProducts,
  getOrdersForUser,
  getUserProfile,
  updateUserProfile,
} from "@/data/mockApi";
import type {
  OrderResponse,
  ProductResponse,
  UserProfileResponse,
} from "@/types/contracts";

export default function ProfilePage() {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const [formState, setFormState] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "moderate",
    city: "",
  });

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getUserProfile(),
      getOrdersForUser(10),
      getAllProducts(),
    ]).then(([profile, orderList, productList]) => {
      if (!mounted) {
        return;
      }

      setUser(profile);
      setOrders(orderList);
      setProducts(productList);
      setFormState({
        name: profile.name,
        age: String(profile.age),
        height: String(profile.height),
        weight: String(profile.weight),
        activityLevel: profile.activityLevel,
        city: profile.city,
      });
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const productMap = useMemo(() => {
    return products.reduce<Record<string, ProductResponse>>((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [products]);

  const handleSave = async () => {
    const payload = {
      name: formState.name,
      age: Number(formState.age),
      height: Number(formState.height),
      weight: Number(formState.weight),
      activityLevel:
        formState.activityLevel as UserProfileResponse["activityLevel"],
      city: formState.city,
    };

    const updated = await updateUserProfile(payload);
    setUser(updated);
    addToast("Profile updated");
  };

  if (loading || !user) {
    return (
      <PageWrapper>
        <div className="px-4 py-6">
          <div className="surface-card p-4 text-sm text-[#7f8c8d]">
            Loading profile...
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="px-4 py-4 pb-28 flex flex-col gap-4">
        <section className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#7f8c8d] font-semibold">
            Profile Screen
          </p>
          <h1 className="text-xl font-black text-[#1e1e1e] mt-1">
            {user.name}
          </h1>
          <p className="text-sm text-[#7f8c8d] mt-1">
            Edit personal details and health inputs for better recommendations.
          </p>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-bold text-[#1e1e1e] mb-3">
            Edit Personal Details
          </h2>

          <div className="space-y-2.5">
            <input
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Name"
              className="input-field"
            />
            <input
              value={formState.city}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, city: event.target.value }))
              }
              placeholder="City"
              className="input-field"
            />
          </div>

          <h3 className="text-sm font-bold text-[#1e1e1e] mt-4 mb-2">
            Health Inputs
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <input
              value={formState.age}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, age: event.target.value }))
              }
              placeholder="Age"
              className="input-field"
            />
            <input
              value={formState.height}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  height: event.target.value,
                }))
              }
              placeholder="Height"
              className="input-field"
            />
            <input
              value={formState.weight}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  weight: event.target.value,
                }))
              }
              placeholder="Weight"
              className="input-field"
            />
          </div>

          <select
            value={formState.activityLevel}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                activityLevel: event.target.value,
              }))
            }
            className="input-field mt-2.5"
          >
            <option value="low">Low activity</option>
            <option value="moderate">Moderate activity</option>
            <option value="high">High activity</option>
          </select>

          <button
            onClick={handleSave}
            className="btn-primary w-full mt-4 py-2.5 text-sm"
          >
            Save Profile
          </button>
        </section>

        <section className="surface-card p-4">
          <h2 className="text-sm font-bold text-[#1e1e1e] mb-3">
            Last 10 Orders (Mock)
          </h2>
          <div className="space-y-2">
            {orders.map((order) => {
              const itemNames = order.items
                .map(
                  (item) =>
                    `${productMap[item.productId]?.name ?? item.productId} x${item.quantity}`,
                )
                .join(", ");

              return (
                <article
                  key={order.id}
                  className="rounded-xl border border-[#e7ecef] bg-white p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#1e1e1e]">
                      {order.id}
                    </p>
                    <span className="text-[11px] text-[#27ae60] font-semibold">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#7f8c8d] mt-0.5">
                    {order.orderedAt}
                  </p>
                  <p className="text-xs text-[#7f8c8d] mt-1 line-clamp-2">
                    {itemNames}
                  </p>
                  <p className="text-sm font-bold text-[#1e1e1e] mt-1">
                    Rs {order.total}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
