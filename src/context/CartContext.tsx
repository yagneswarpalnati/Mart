"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

// ─── Types ────────────────────────────────────────
export interface CartItem {
  id: number;
  name: string;
  emoji: string;
  price: number;
  quantity: number;
  category: "vegetable" | "fruit" | "salad" | "icecream";
  unit: string; // "kg" | "bowl" | "scoop"
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getItemQuantity: (id: number) => number;
}

const CartContext = createContext<CartContextType | null>(null);

// ─── Toast State (global) ─────────────────────────
export interface Toast {
  id: string;
  message: string;
  emoji: string;
  type: "success" | "info" | "warning";
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, emoji?: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// ─── Cart Provider ────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ynot_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("ynot_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToast = useCallback((message: string, emoji = "✅", type: Toast["type"] = "success") => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, emoji, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity || 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...item, quantity: qty } as CartItem];
    });
    addToast(`${item.name} added to cart!`, item.emoji);
  }, [addToast]);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const getItemQuantity = useCallback((id: number) => {
    return items.find((i) => i.id === id)?.quantity || 0;
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, getItemQuantity }}>
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        {children}
      </ToastContext.Provider>
    </CartContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within CartProvider");
  return ctx;
}
