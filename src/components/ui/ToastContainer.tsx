"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/context/CartContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[70] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={() => removeToast(toast.id)}
            className="pointer-events-auto text-left min-w-56 px-4 py-3 rounded-xl border border-[#d8efe1] bg-white shadow-md"
          >
            <p className="text-sm font-semibold text-[#1e1e1e]">{toast.message}</p>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
