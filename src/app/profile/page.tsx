"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useToast } from "@/context/CartContext";
import Link from "next/link";

// ─── FAQ Data ─────────────────────────────────────
const faqs = [
  { q: "How do I place an order?", a: "Browse products from the Dashboard, add items to your cart, and hit 'Place Order'. It's that simple!" },
  { q: "What are the delivery timings?", a: "We deliver between 7 AM – 9 PM daily. Orders placed before 6 PM are delivered the same day." },
  { q: "Can I cancel or modify my order?", a: "Yes, you can cancel or modify your order within 30 minutes of placing it from the Profile → Order History section." },
  { q: "How does the Weekly Routine work?", a: "Set your weekly meal plan on the Weekly page and toggle 'Set as Routine'. We'll auto-deliver every week — no daily ordering needed!" },
  { q: "What if I receive damaged items?", a: "Contact our support team immediately. We offer full refunds or replacements for any damaged or low-quality items." },
  { q: "Is there a minimum order value?", a: "No minimum order! However, orders above ₹500 get free delivery." },
];

// ─── Profile Sections ─────────────────────────────
const settingsItems = [
  { emoji: "📍", label: "Delivery Address", value: "123, Green Valley, Hyderabad", editable: true },
  { emoji: "🔔", label: "Notifications", value: "Enabled", toggle: true },
  { emoji: "🌙", label: "Dark Mode", value: "Always On", toggle: true },
  { emoji: "🌐", label: "Language", value: "English", editable: true },
];

export default function ProfilePage() {
  // Mocking user since legacy Auth is removed
  const user = {
    name: "Guest Customer",
    email: "customer@ynot.in",
    phone: "Not registered",
    address: "123 Green Valley, Hyderabad"
  };
  const isLoading = false;
  const logout = () => {
    window.location.href = "/dashboard";
  };
  const checkAuth = async () => {};

  const { addToast } = useToast();
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [notif, setNotif] = useState(true);
  const [showChat, setShowChat] = useState(false);
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const openEditModal = () => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditAddress(user.address || "");
      setIsEditing(true);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone, address: editAddress })
      });
      if (res.ok) {
        await checkAuth(); // refresh user data globally
        addToast("Profile updated successfully!");
        setIsEditing(false);
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to update profile");
      }
    } catch (e: any) {
      addToast("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-emerald-950/20" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/[0.04] blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="text-5xl mb-3">👤</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-violet-400 via-purple-300 to-teal-400 bg-clip-text text-transparent">
              My Profile
            </h1>
          </motion.div>

          {/* ── User Info Card ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-4xl flex-shrink-0">
                🧑
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-0.5">{user.name}</h2>
                <p className="text-white/40 text-sm">{user.email}</p>
                <p className="text-white/30 text-xs mt-1">
                  📞 {user.phone || "No phone added"} • {user.address ? `📍 ${user.address}` : "No address added"}
                </p>
              </div>
              <button onClick={openEditModal} className="glass-card px-4 py-2 text-xs text-white/60 hover:text-emerald-400 transition-colors cursor-pointer hidden sm:block">
                Edit Profile
              </button>
            </div>
            {/* Mobile edit button */}
            <button onClick={openEditModal} className="sm:hidden w-full mt-4 glass-card px-4 py-2 text-xs text-white/60 hover:text-emerald-400 transition-colors cursor-pointer">
              Edit Profile
            </button>
          </motion.div>

          {/* ── Stats Row ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-6">
            {[
              { emoji: "📦", label: "Orders", value: "24" },
              { emoji: "💚", label: "Saved", value: "₹1,240" },
              { emoji: "⭐", label: "Rating", value: "4.9" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <span className="text-2xl">{stat.emoji}</span>
                <p className="text-white font-bold text-lg mt-1">{stat.value}</p>
                <p className="text-white/40 text-[11px] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>

        {/* ── Settings ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6 mb-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Settings</h3>
            <div className="flex flex-col gap-1">
              {[
                { emoji: "📍", label: "Delivery Address", value: user.address || "Not set" },
                { emoji: "🔔", label: "Notifications", value: "Enabled", toggle: true },
                { emoji: "🌙", label: "Dark Mode", value: "Always On", toggle: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm text-white/80">{item.label}</span>
                  </div>
                  {item.toggle ? (
                    <button
                      onClick={() => item.label === "Notifications" && setNotif(!notif)}
                      className="cursor-pointer"
                    >
                      <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-0.5 ${
                        (item.label === "Notifications" ? notif : true) ? "bg-emerald-500" : "bg-white/10"
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                          (item.label === "Notifications" ? notif : true) ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </div>
                    </button>
                  ) : (
                    <span className="text-sm text-white/40 truncate max-w-[150px] sm:max-w-xs">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Order History ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="glass-card p-6 mb-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Recent Orders</h3>
            <div className="flex flex-col gap-3">
              {[
                { id: "#YN-1024", date: "Feb 18, 2026", items: "Spinach, Banana, Greek Salad", total: "₹270", status: "Delivered" },
                { id: "#YN-1023", date: "Feb 15, 2026", items: "Broccoli, Orange, Vanilla Ice Cream", total: "₹380", status: "Delivered" },
                { id: "#YN-1022", date: "Feb 12, 2026", items: "Kale, Pomegranate, Quinoa Bowl", total: "₹500", status: "Delivered" },
              ].map((order) => (
                <div key={order.id} className="flex items-center gap-4 py-3 px-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{order.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 truncate">{order.items}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{order.total}</p>
                    <p className="text-[11px] text-white/30">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Help & Support ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-6 mb-6">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">❓ Help & Support</h3>

            {/* Contact Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button onClick={() => setShowChat(true)}
                className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/15 hover:bg-emerald-500/15 transition-colors cursor-pointer text-left">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-sm font-semibold text-white">Live Chat</p>
                  <p className="text-[11px] text-white/40">Get instant help</p>
                </div>
              </button>
              <a href="mailto:support@ynot.in"
                className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/[0.08] border border-blue-500/15 hover:bg-blue-500/15 transition-colors cursor-pointer text-left">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-sm font-semibold text-white">Email Us</p>
                  <p className="text-[11px] text-white/40">support@ynot.in</p>
                </div>
              </a>
              <a href="tel:+911800123456"
                className="flex items-center gap-3 p-4 rounded-xl bg-violet-500/[0.08] border border-violet-500/15 hover:bg-violet-500/15 transition-colors cursor-pointer text-left">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-sm font-semibold text-white">Call Us</p>
                  <p className="text-[11px] text-white/40">1800-123-456</p>
                </div>
              </a>
            </div>

            {/* FAQ */}
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Frequently Asked Questions</h4>
            <div className="flex flex-col gap-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-sm text-white/80">{faq.q}</span>
                    <span className="text-xs text-white/30 ml-3 flex-shrink-0">{expandedFaq === i ? "▼" : "▶"}</span>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 text-sm text-white/50 leading-relaxed border-t border-white/[0.04] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Logout ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
            <button onClick={logout} className="text-sm text-red-400/60 hover:text-red-400 transition-colors cursor-pointer">
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Live Chat Modal ── */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowChat(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass-card p-6 !bg-[#0d0d0d] !border-emerald-500/15"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">💬 Live Chat</h3>
                <button onClick={() => setShowChat(false)} className="text-white/40 hover:text-white cursor-pointer text-lg">✕</button>
              </div>

              <div className="h-48 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 mb-4 overflow-y-auto">
                <div className="flex gap-2 mb-3">
                  <span className="text-lg">🤖</span>
                  <div className="bg-emerald-500/10 border border-emerald-500/15 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-white/80 max-w-[80%]">
                    Hi! Welcome to Y NOT support. How can I help you today?
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/30 transition-colors"
                />
                <button className="btn-premium !px-4 !py-2.5 !rounded-xl">
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Edit Profile Modal ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm glass-card p-6 border-emerald-500/20"
            >
              <h3 className="text-xl font-bold text-white mb-6">Edit Profile</h3>
              
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-xs text-white/40 uppercase mb-1.5 block">Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase mb-1.5 block">Phone</label>
                  <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase mb-1.5 block">Delivery Address</label>
                  <textarea value={editAddress} onChange={e => setEditAddress(e.target.value)} rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-500/50 resize-none" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={saveProfile} disabled={saving} className="flex-1 btn-premium !py-3 !rounded-xl">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
