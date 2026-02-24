import db from "../../mocks/db.json";
import type {
  CatalogFilters,
  DashboardResponse,
  MockDatabase,
  NutritionResponse,
  NutritionTarget,
  ProductCategory,
  ProductResponse,
  UserProfileResponse,
  WeeklyPlanResponse,
  OrderResponse,
} from "@/types/contracts";

const database: MockDatabase = db as MockDatabase;

let cachedUser: UserProfileResponse = { ...database.users[0] };
export const USER_PROFILE_UPDATED_EVENT = "mart:user-profile-updated";
const USER_CACHE_KEY = "mart:user-profile-cache";
const ORDERS_CACHE_KEY = "mart:user-orders-cache";
const ORDERS_CACHE_TTL_MS = 5 * 60 * 1000;

const API_DELAY_MS = 180;

function wait(ms = API_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function byPopularityWithJitter(a: ProductResponse, b: ProductResponse) {
  const scoreA = a.popularity + Math.random() * 8;
  const scoreB = b.popularity + Math.random() * 8;
  return scoreB - scoreA;
}

function normalizeCategory(category: string): ProductCategory {
  const map: Record<string, ProductCategory> = {
    vegetables: "Vegetables",
    fruits: "Fruits",
    salads: "Salads",
    "ice creams": "Ice Creams",
    icecreams: "Ice Creams",
  };
  return map[category.toLowerCase()] ?? "Vegetables";
}

function isBrowser() {
  return typeof window !== "undefined";
}

function hydrateCachedUserFromStorage() {
  if (!isBrowser()) return;

  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as UserProfileResponse;
    if (parsed?.id) {
      cachedUser = { ...cachedUser, ...parsed };
    }
  } catch {
    localStorage.removeItem(USER_CACHE_KEY);
  }
}

function persistCachedUserToStorage(user: UserProfileResponse) {
  if (!isBrowser()) return;
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
}

function getOrderDate(dateText: string) {
  const dt = new Date(dateText);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function getMondayAndSundayNoon(now: Date) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sundayNoon = new Date(monday);
  sundayNoon.setDate(monday.getDate() + 6);
  sundayNoon.setHours(12, 0, 0, 0);

  return { monday, sundayNoon };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export const categoryList: Array<ProductCategory | "All"> = [
  "All",
  "Vegetables",
  "Fruits",
  "Salads",
  "Ice Creams",
];

export async function simulateQrLogin() {
  await wait(700);
  return {
    token: `mock-token-${Date.now()}`,
    user: cachedUser,
  };
}

export async function getUserProfile() {
  hydrateCachedUserFromStorage();
  await wait();
  persistCachedUserToStorage(cachedUser);
  return { ...cachedUser };
}

export async function updateUserProfile(payload: Partial<UserProfileResponse>) {
  hydrateCachedUserFromStorage();
  await wait();
  cachedUser = { ...cachedUser, ...payload };
  persistCachedUserToStorage(cachedUser);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(USER_PROFILE_UPDATED_EVENT, { detail: { user: { ...cachedUser } } }),
    );
  }

  return { ...cachedUser };
}

export async function getAllProducts() {
  await wait();
  return [...database.products];
}

export async function getProductById(productId: string) {
  await wait();
  return database.products.find((product) => product.id === productId) ?? null;
}

export async function getDashboardData(): Promise<DashboardResponse> {
  hydrateCachedUserFromStorage();
  await wait();
  const sorted = [...database.products].sort(byPopularityWithJitter);
  const trending = sorted.slice(0, 6);
  const recommended = [...database.products]
    .filter((item) => item.nutrition.protein >= 2 || item.nutrition.fiber >= 3)
    .slice(0, 6);

  const userOrders = database.orders.filter((order) => order.userId === cachedUser.id);
  const allOrderedItems = userOrders.flatMap((order) => order.items);
  const proteinSum = allOrderedItems.reduce((sum, item) => {
    const product = database.products.find((entry) => entry.id === item.productId);
    return sum + (product?.nutrition.protein ?? 0) * item.quantity;
  }, 0);

  const now = new Date();
  const { monday, sundayNoon } = getMondayAndSundayNoon(now);
  const resetApplied = now >= sundayNoon;
  const endForWindow = resetApplied ? monday : now;
  const weeklyOrders = resetApplied
    ? []
    : userOrders.filter((order) => {
        const orderDate = getOrderDate(order.orderedAt);
        return orderDate >= monday && orderDate <= endForWindow;
      });

  const weeklyValues = weeklyOrders.reduce(
    (acc, order) => {
      order.items.forEach((orderItem) => {
        const product = database.products.find((entry) => entry.id === orderItem.productId);
        if (!product) return;

        const qty = orderItem.quantity;
        acc.vitaminC += (product.nutrition.vitaminC ?? 0) * qty;
        acc.protein += product.nutrition.protein * qty;
        acc.fiber += product.nutrition.fiber * qty;
        acc.calcium += (product.nutrition.calcium ?? (product.nutrition.potassium ?? 0) * 0.35) * qty;
        acc.iron += product.nutrition.iron * qty;
      });
      return acc;
    },
    { vitaminC: 0, protein: 0, fiber: 0, calcium: 0, iron: 0 },
  );

  const dailyTarget = getNutritionTargets(cachedUser);
  const elapsedDays = resetApplied
    ? 7
    : Math.max(1, Math.floor((now.getTime() - monday.getTime()) / (24 * 60 * 60 * 1000)) + 1);
  const weeklyTargets = {
    vitaminC: 90 * elapsedDays,
    protein: dailyTarget.protein * elapsedDays,
    fiber: dailyTarget.fiber * elapsedDays,
    calcium: 1000 * elapsedDays,
    iron: dailyTarget.iron * elapsedDays,
  };

  return {
    trending,
    recommended,
    weeklySummary: {
      itemsOrdered: allOrderedItems.reduce((sum, item) => sum + item.quantity, 0),
      estimatedSavings: 260,
      avgProtein: Number((proteinSum / Math.max(allOrderedItems.length, 1)).toFixed(1)),
    },
    weeklyReport: {
      periodLabel: resetApplied
        ? `${formatDate(monday)} - reset after Sun 12 PM`
        : `${formatDate(monday)} - ${formatDate(now)}`,
      resetApplied,
      values: weeklyValues,
      targets: weeklyTargets,
    },
  };
}

export async function getCatalogProducts(filters: CatalogFilters = {}) {
  await wait();
  let products = [...database.products];

  if (filters.category && filters.category !== "All") {
    const normalized = normalizeCategory(filters.category);
    products = products.filter((product) => product.category === normalized);
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    products = products.filter((product) => product.name.toLowerCase().includes(term));
  }

  switch (filters.nutrition) {
    case "high-protein":
      products = products.filter((product) => product.nutrition.protein >= 5);
      break;
    case "high-fiber":
      products = products.filter((product) => product.nutrition.fiber >= 4);
      break;
    case "high-iron":
      products = products.filter((product) => product.nutrition.iron >= 2);
      break;
    case "low-calorie":
      products = products.filter((product) => product.nutrition.calories <= 120);
      break;
    default:
      break;
  }

  return products;
}

export async function getOrdersForUser(limit = 10): Promise<OrderResponse[]> {
  hydrateCachedUserFromStorage();
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(ORDERS_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { userId: string; ts: number; orders: OrderResponse[] };
        if (
          parsed.userId === cachedUser.id &&
          Date.now() - parsed.ts <= ORDERS_CACHE_TTL_MS &&
          Array.isArray(parsed.orders)
        ) {
          return parsed.orders.slice(0, limit);
        }
      }
    } catch {
      localStorage.removeItem(ORDERS_CACHE_KEY);
    }
  }

  await wait();
  const orders = database.orders
    .filter((order) => order.userId === cachedUser.id)
    .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
    .slice(0, limit);

  if (isBrowser()) {
    localStorage.setItem(
      ORDERS_CACHE_KEY,
      JSON.stringify({ userId: cachedUser.id, ts: Date.now(), orders }),
    );
  }

  return orders;
}

export function getNutritionTargets(user: UserProfileResponse): NutritionTarget {
  const activityMultiplier: Record<string, number> = {
    low: 28,
    moderate: 32,
    high: 36,
  };

  const multiplier = activityMultiplier[user.activityLevel] ?? activityMultiplier.moderate;

  return {
    calories: Math.round(user.weight * multiplier),
    protein: Math.round(user.weight * 1.1),
    fiber: Math.round(25 + user.weight * 0.08),
    iron: user.age < 50 ? 18 : 10,
  };
}

export function calculateCartNutrition(
  items: Array<{ nutrition: NutritionResponse; quantity: number }>,
): NutritionTarget {
  return items.reduce(
    (acc, item) => {
      acc.calories += item.nutrition.calories * item.quantity;
      acc.protein += item.nutrition.protein * item.quantity;
      acc.fiber += item.nutrition.fiber * item.quantity;
      acc.iron += item.nutrition.iron * item.quantity;
      return acc;
    },
    { calories: 0, protein: 0, fiber: 0, iron: 0 },
  );
}

export function getTopNutrients(nutrition: NutritionResponse) {
  const nutrients: Array<{ label: string; value: number; unit: string }> = [
    { label: "Calories", value: nutrition.calories, unit: "kcal" },
    { label: "Protein", value: nutrition.protein, unit: "g" },
    { label: "Fiber", value: nutrition.fiber, unit: "g" },
    { label: "Iron", value: nutrition.iron, unit: "mg" },
    { label: "Potassium", value: nutrition.potassium ?? 0, unit: "mg" },
    { label: "Vitamin C", value: nutrition.vitaminC ?? 0, unit: "mg" },
  ];

  return nutrients
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .filter((entry) => entry.value > 0);
}

export function generateSampleWeeklyPlan(products: ProductResponse[]): WeeklyPlanResponse {
  const planDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const vegetables = products.filter((item) => item.category === "Vegetables");
  const fruits = products.filter((item) => item.category === "Fruits");
  const bowls = products.filter((item) => item.category === "Salads");

  return planDays.reduce<WeeklyPlanResponse>((acc, day, index) => {
    const veg = vegetables[index % Math.max(vegetables.length, 1)];
    const fruit = fruits[index % Math.max(fruits.length, 1)];
    const bowl = bowls[index % Math.max(bowls.length, 1)];

    acc[day] = [veg?.id, fruit?.id, bowl?.id].filter(Boolean) as string[];
    return acc;
  }, {});
}
