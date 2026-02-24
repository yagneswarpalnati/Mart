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
  await wait();
  return { ...cachedUser };
}

export async function updateUserProfile(payload: Partial<UserProfileResponse>) {
  await wait();
  cachedUser = { ...cachedUser, ...payload };

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

  return {
    trending,
    recommended,
    weeklySummary: {
      itemsOrdered: allOrderedItems.reduce((sum, item) => sum + item.quantity, 0),
      estimatedSavings: 260,
      avgProtein: Number((proteinSum / Math.max(allOrderedItems.length, 1)).toFixed(1)),
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
  await wait();
  return database.orders
    .filter((order) => order.userId === cachedUser.id)
    .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
    .slice(0, limit);
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
