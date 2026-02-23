"use client";

import FloatingCartBar from "@/components/ui/FloatingCartBar";
import ToastContainer from "@/components/ui/ToastContainer";
import { CartProvider } from "@/context/CartContext";
import MuiThemeProvider from "@/components/layout/MuiThemeProvider";
import BottomNav from "@/components/layout/BottomNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <MuiThemeProvider>
        <ToastContainer />
        {children}
        <FloatingCartBar />
        <BottomNav />
      </MuiThemeProvider>
    </CartProvider>
  );
}
