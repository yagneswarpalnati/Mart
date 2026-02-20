"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/context/CartContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto"
          >
            <div
              onClick={() => removeToast(toast.id)}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl cursor-pointer border transition-all hover:scale-[1.02]"
              style={{
                background: toast.type === "success"
                  ? "rgba(16,185,129,0.15)"
                  : toast.type === "warning"
                  ? "rgba(245,158,11,0.15)"
                  : "rgba(59,130,246,0.15)",
                borderColor: toast.type === "success"
                  ? "rgba(16,185,129,0.25)"
                  : toast.type === "warning"
                  ? "rgba(245,158,11,0.25)"
                  : "rgba(59,130,246,0.25)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <span className="text-xl">{toast.emoji}</span>
              <p className="text-sm font-medium text-white/90">{toast.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
