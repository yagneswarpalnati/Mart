"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import type { NutritionResponse } from "@/types/contracts";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  quantity: number;
  nutrition: NutritionResponse;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getItemQuantity: (id: string) => number;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const ToastContext = createContext<ToastContextType | null>(null);

const STORAGE_KEY = "mart_cart_items_v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, ready]);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const quantity = item.quantity ?? 1;
      setItems((prev) => {
        const existing = prev.find((entry) => entry.id === item.id);
        if (existing) {
          return prev.map((entry) =>
            entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry,
          );
        }

        return [...prev, { ...item, quantity }];
      });
      addToast(`${item.name} added to cart`);
    },
    [addToast],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((entry) => entry.id !== id));
      return;
    }

    setItems((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalPrice = items.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);

  const getItemQuantity = useCallback(
    (id: string) => items.find((entry) => entry.id === id)?.quantity ?? 0,
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getItemQuantity,
      }}
    >
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within CartProvider");
  }

  return context;
}
