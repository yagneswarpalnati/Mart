"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
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

type AnyItem = { id: number; name: string; emoji: string; category: string; nutrition?: any };

const allItems: AnyItem[] = [
  ...vegetables.map((v) => ({ id: v.id, name: v.name, emoji: v.emoji, category: "vegetable", nutrition: v.nutrition })),
  ...fruits.map((f) => ({ id: f.id, name: f.name, emoji: f.emoji, category: "fruit", nutrition: f.nutrition })),
  ...salads.map((s) => ({ id: s.id, name: s.name, emoji: s.emoji, category: "salad", nutrition: s.nutrition })),
  ...icecreams.map((ic) => ({ id: ic.id, name: ic.name, emoji: ic.emoji, category: "icecream" })),
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayEmojis = ["🌱", "🌿", "☘️", "🍀", "🌾", "🌻", "🌈"];

type WeeklyPlan = Record<string, AnyItem[]>;

export default function WeeklyPage() {
  const [plan, setPlan] = useState<WeeklyPlan>(() =>
    Object.fromEntries(days.map((d) => [d, []]))
  );
  const [activeDay, setActiveDay] = useState("Monday");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [isRoutine, setIsRoutine] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem("ynot_weekly_plan");
      if (savedPlan) setPlan(JSON.parse(savedPlan));

      const savedRoutine = localStorage.getItem("ynot_is_routine");
      if (savedRoutine) setIsRoutine(JSON.parse(savedRoutine));
    } catch (e) {
      console.error("Failed to load weekly plan", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("ynot_weekly_plan", JSON.stringify(plan));
      localStorage.setItem("ynot_is_routine", JSON.stringify(isRoutine));
    }
  }, [plan, isRoutine, isInitialized]);

  const addItem = (day: string, item: AnyItem) => {
    setPlan((prev) => ({
      ...prev,
      [day]: prev[day].some((i) => i.id === item.id) ? prev[day] : [...prev[day], item],
    }));
  };

  const removeItem = (day: string, itemId: number) => {
    setPlan((prev) => ({
      ...prev,
      [day]: prev[day].filter((i) => i.id !== itemId),
    }));
  };

  const filteredItems = filterCat === "all" ? allItems : allItems.filter((i) => i.category === filterCat);

  const totalItemsThisWeek = Object.values(plan).reduce((sum, items) => sum + items.length, 0);

  // Calculate total weekly nutrition
  const weeklyNutrition = Object.values(plan).flat().reduce((acc, item) => {
    if (item.nutrition) {
      acc.vitaminC += item.nutrition.vitaminC || 0;
      acc.protein += item.nutrition.protein || 0;
      acc.fiber += item.nutrition.fiber || 0;
      acc.calcium += item.nutrition.calcium || 0;
      acc.iron += item.nutrition.iron || 0;
    }
    return acc;
  }, { vitaminC: 0, protein: 0, fiber: 0, calcium: 0, iron: 0 });

  const activeDaysCount = Object.values(plan).filter(items => items.length > 0).length || 1;

  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-emerald-950/30" />
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/[0.05] blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="text-5xl mb-3 animate-float">📅</div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-violet-400 via-purple-300 to-teal-400 bg-clip-text text-transparent">
              Weekly Routine
            </h1>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Plan your weekly meals and make healthy eating a habit. Set it once, auto-order every week!
            </p>
          </motion.div>

          {/* Routine Toggle + Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            <button
              onClick={() => setIsRoutine(!isRoutine)}
              className={`glass-card px-5 py-2.5 flex items-center gap-2 text-sm font-medium transition-all cursor-pointer ${
                isRoutine ? "!border-emerald-500/40 text-emerald-400" : "text-white/60"
              }`}
            >
              <span className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-0.5 ${
                isRoutine ? "bg-emerald-500" : "bg-white/10"
              }`}>
                <span className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                  isRoutine ? "translate-x-5" : "translate-x-0"
                }`} />
              </span>
              Set as Routine
            </button>

            <div className="glass-card px-4 py-2 text-sm text-white/50">
              📦 <span className="text-white font-bold">{totalItemsThisWeek}</span> items this week
            </div>
          </motion.div>

          {/* Weekly Nutrition Tracker */}
          {totalItemsThisWeek > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-6 glass-card border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-violet-500/5">
              <h3 className="text-center font-bold text-white mb-6">Aggregate Weekly Nutrition</h3>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                <MuiProgressRing label="Vitamin C" value={weeklyNutrition.vitaminC} max={dailyRecommended.vitaminC * activeDaysCount} unit="mg" color="#10b981" />
                <MuiProgressRing label="Protein" value={weeklyNutrition.protein} max={dailyRecommended.protein * activeDaysCount} unit="g" color="#14b8a6" />
                <MuiProgressRing label="Fiber" value={weeklyNutrition.fiber} max={dailyRecommended.fiber * activeDaysCount} unit="g" color="#8b5cf6" />
                <MuiProgressRing label="Calcium" value={weeklyNutrition.calcium} max={dailyRecommended.calcium * activeDaysCount} unit="mg" color="#f59e0b" />
                <MuiProgressRing label="Iron" value={weeklyNutrition.iron} max={dailyRecommended.iron * activeDaysCount} unit="mg" color="#ef4444" />
              </div>
            </motion.div>
          )}

          {/* Day Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {days.map((day, i) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`glass-card px-4 py-2.5 text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDay === day
                    ? "!border-violet-500/40 text-violet-400 !bg-violet-500/10"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <span>{dayEmojis[i]}</span>
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
                {plan[day].length > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-violet-500/30 text-violet-300 text-[11px] font-bold flex items-center justify-center">
                    {plan[day].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content: Day Plan + Add Items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Day Plan (2/3 width) */}
            <div className="lg:col-span-2 glass-card p-6 min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{dayEmojis[days.indexOf(activeDay)]} {activeDay}&apos;s Plan</h3>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden btn-premium text-xs !px-4 !py-2"
                >
                  + Add Items
                </button>
              </div>

              {plan[activeDay].length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-white/30">
                  <span className="text-4xl mb-3">🍽️</span>
                  <p className="text-sm">No items planned for {activeDay}.</p>
                  <p className="text-xs mt-1">Add items from the sidebar to plan your day!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {plan[activeDay].map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] group"
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-[11px] text-white/40 capitalize">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeItem(activeDay, item.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Add Items Sidebar (1/3 width) */}
            <div className={`glass-card p-5 lg:block ${sidebarOpen ? "block" : "hidden"}`}>
              <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-3">Add Items</h3>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[
                  { key: "all", label: "All" },
                  { key: "vegetable", label: "🥦 Veg" },
                  { key: "fruit", label: "🍎 Fruit" },
                  { key: "salad", label: "🥗 Salad" },
                  { key: "icecream", label: "🍦 Ice Cream" },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFilterCat(cat.key)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      filterCat === cat.key
                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        : "bg-white/[0.04] text-white/50 border border-white/[0.06] hover:text-white/80"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-1">
                {filteredItems.map((item) => {
                  const isAdded = plan[activeDay].some((i) => i.id === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => !isAdded && addItem(activeDay, item)}
                      disabled={isAdded}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all text-sm ${
                        isAdded
                          ? "bg-emerald-500/10 text-emerald-400/60 cursor-default"
                          : "bg-white/[0.02] text-white/70 hover:bg-white/[0.06] cursor-pointer"
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="flex-1">{item.name}</span>
                      {isAdded ? (
                        <span className="text-[10px] text-emerald-400">✓</span>
                      ) : (
                        <span className="text-[10px] text-white/30">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Routine Saved Banner */}
          <AnimatePresence>
            {isRoutine && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 glass-card p-4 text-center !border-emerald-500/20"
              >
                <p className="text-sm text-emerald-400 font-medium">
                  ✅ Routine mode is ON — This plan will auto-repeat every week. No need to order daily!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
