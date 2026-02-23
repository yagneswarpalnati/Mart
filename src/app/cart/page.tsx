"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { useCart, useToast } from "@/context/CartContext";
import { vegetables, fruits, salads, icecreams, dailyRecommended } from "@/data/nutrition";
import { CircularProgress, Box, Typography } from "@mui/material";

function MuiProgressRing({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={100} size={60} thickness={5} sx={{ color: 'rgba(255,255,255,0.06)' }} />
        <CircularProgress variant="determinate" value={percentage} size={60} thickness={5} 
          sx={{ color, position: 'absolute', left: 0, '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} 
        />
        <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" component="div" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {Math.round(percentage)}%
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, display: 'block', mb: 0.5 }}>{label}</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>{Math.round(value)}{unit}/{max}</Typography>
      </Box>
    </Box>
  );
}

const allProducts = [
  ...vegetables.map(v => ({ ...v, type: "vegetable" as const })),
  ...fruits.map(f => ({ ...f, type: "fruit" as const })),
  ...salads.map(s => ({ ...s, type: "salad" as const })),
  ...icecreams.map(i => ({ ...i, type: "icecream" as const })),
];

export default function CartPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState<"details" | "success">("details");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestAddress, setGuestAddress] = useState("");

  const openCheckout = () => {
    setStep("details");
    setShowCheckout(true);
  };

  const deliveryFee = totalPrice > 500 ? 0 : 30;
  const grandTotal = totalPrice + deliveryFee;

  // Calculate actual nutrition from cart items
  const nutritionSummary = useMemo(() => {
    let vc = 0, p = 0, f = 0, c = 0, i = 0;
    
    items.forEach(cartItem => {
      const fullItem = allProducts.find(p => p.id === cartItem.id);
      if (fullItem && 'nutrition' in fullItem) {
        vc += (fullItem.nutrition.vitaminC || 0) * cartItem.quantity;
        p += (fullItem.nutrition.protein || 0) * cartItem.quantity;
        f += (fullItem.nutrition.fiber || 0) * cartItem.quantity;
        c += (fullItem.nutrition.calcium || 0) * cartItem.quantity;
        i += (fullItem.nutrition.iron || 0) * cartItem.quantity;
      }
    });

    return { vitaminC: vc, protein: p, fiber: f, calcium: c, iron: i };
  }, [items]);

  const handleProceedToPay = async () => {
    if (!guestName || !guestPhone || !guestAddress) {
      addToast("Please fill all delivery details");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal: totalPrice,
          deliveryFee,
          total: grandTotal,
          nutritionSummary,
          guestDetails: {
            name: guestName,
            phone: guestPhone,
            address: guestAddress,
          }
        }),
      });

      if (res.ok) {
        clearCart();
        setStep("success");
        setTimeout(() => {
          setShowCheckout(false);
          router.push("/dashboard");
        }, 3000);
      } else {
        const error = await res.json();
        addToast(error.error || "Failed to place order");
      }
    } catch {
      addToast("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-teal-950/30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="text-5xl mb-3">🛒</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Your Cart
            </h1>
            <p className="text-white/40 text-base">
              {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} ready for checkout` : "Your cart is empty"}
            </p>
          </motion.div>

          {items.length === 0 ? (
            /* Empty Cart */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-16 text-center">
              <span className="text-6xl block mb-4">🛒</span>
              <h3 className="text-xl font-bold text-white/80 mb-2">Your cart is empty</h3>
              <p className="text-white/40 text-sm mb-6">Add some fresh vegetables, fruits, salads or ice creams!</p>
              <Link href="/dashboard" className="btn-premium inline-block">
                Browse Products
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items (2/3) */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Cart Items</h2>
                  <button onClick={clearCart}
                    className="text-xs text-red-400/60 hover:text-red-400 transition-colors cursor-pointer">
                    Clear All
                  </button>
                </div>

                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="glass-card p-3 flex items-center gap-3 active:bg-white/5 transition-colors"
                    >
                      <div className="text-3xl flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">{item.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-white truncate">{item.name}</h3>
                        <p className="text-[10px] text-white/40">₹{item.price}/{item.unit}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">-</button>
                          <span className="text-white text-[11px] font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">+</button>
                        </div>
                        <p className="text-emerald-400 font-bold text-[11px]">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
                <div className="flex flex-col gap-6">
                  {/* Bill Details */}
                  <div className="glass-card p-5 relative overflow-hidden">
                    {/* Delivery Badge (Zepto Style) */}
                    <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 rounded-bl-xl flex items-center gap-1.5 shadow-lg">
                      <span className="text-[10px] font-black text-black">10 MINS</span>
                      <span className="text-[8px] font-bold text-black opacity-60">DELIVERY</span>
                    </div>

                    <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4">Summary</h2>
                    <div className="flex flex-col gap-2.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Item Total</span>
                        <span className="text-white/80 tabular-nums">₹{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Delivery Fee</span>
                        <span className={deliveryFee === 0 ? "text-emerald-400 font-bold" : "text-white/80 tabular-nums"}>
                          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </span>
                      </div>
                      <div className="h-px bg-white/5 my-1" />
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white">To Pay</span>
                        <span className="text-sm font-black text-emerald-400 tabular-nums">₹{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={openCheckout}
                      disabled={totalItems === 0}
                      className="w-full bg-emerald-500 py-3.5 rounded-xl text-black text-xs font-black uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-emerald-500/10"
                    >
                      Checkout Order
                    </button>
                  </div>

                  {/* Nutrition Progress */}
                  {totalItems > 0 && Object.values(nutritionSummary).some(v => v > 0) && (
                    <div className="glass-card p-5 border-emerald-500/10">
                      <p className="text-[11px] font-bold text-emerald-400/60 uppercase tracking-widest mb-4">Nutrition Analysis</p>
                      <div className="flex justify-between items-center gap-2">
                        <MuiProgressRing label="C" value={nutritionSummary.vitaminC} max={dailyRecommended.vitaminC} unit="mg" color="#10b981" />
                        <MuiProgressRing label="Prot" value={nutritionSummary.protein} max={dailyRecommended.protein} unit="g" color="#14b8a6" />
                        <MuiProgressRing label="Fib" value={nutritionSummary.fiber} max={dailyRecommended.fiber} unit="g" color="#8b5cf6" />
                      </div>
                    </div>
                  )}
                </div>
            </div>
          )}

          {/* Free delivery banner */}
          {totalPrice > 0 && totalPrice <= 500 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-6 glass-card p-3 text-center !border-emerald-500/10">
              <p className="text-xs text-white/50">
                🚚 Free delivery on orders above <span className="text-emerald-400 font-bold">₹500</span> — add ₹{500 - totalPrice} more!
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !loading && setShowCheckout(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm glass-card border-emerald-500/20 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {step === "details" ? "Delivery Details" : "Order Confirmed"}
                  </h3>
                  {!loading && step !== "success" && (
                    <button onClick={() => setShowCheckout(false)} className="text-white/40 hover:text-white transition-colors">
                      ✕
                    </button>
                  )}
                </div>

                {step === "details" ? (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <div className="flex flex-col gap-4 mb-6">
                      <div>
                        <label className="text-xs text-white/40 uppercase mb-1.5 block">Full Name</label>
                        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500/50" />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase mb-1.5 block">Phone Number</label>
                        <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500/50" />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase mb-1.5 block">Delivery Address</label>
                        <textarea value={guestAddress} onChange={e => setGuestAddress(e.target.value)} rows={3} required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500/50 resize-none" />
                      </div>
                    </div>
                    
                    <button onClick={handleProceedToPay} disabled={loading} className="btn-premium w-full !py-3 !rounded-xl relative overflow-hidden">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Proceed to Pay ₹${grandTotal.toLocaleString()}`
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-8 text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-black text-emerald-400 mb-2">Payment Success!</h3>
                    <p className="text-white/80 text-sm">Your order is on the way. Redirecting...</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
}
