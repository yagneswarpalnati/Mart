"use client";

import SpringyCursor from "@/components/ui/SpringyCursor";
import FloatingCartBar from "@/components/ui/FloatingCartBar";
import ToastContainer from "@/components/ui/ToastContainer";
import { CartProvider } from "@/context/CartContext";
import MuiThemeProvider from "@/components/layout/MuiThemeProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <MuiThemeProvider>
        <SpringyCursor />
        <ToastContainer />
        {children}
        <FloatingCartBar />
      </MuiThemeProvider>
    </CartProvider>
  );
}
