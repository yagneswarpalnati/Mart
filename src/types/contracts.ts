export type ActivityLevel = "low" | "moderate" | "high";

export interface UserProfileResponse {
  id: string;
  name: string;
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  city: string;
}

export interface NutritionResponse {
  calories: number;
  protein: number;
  fiber: number;
  iron: number;
  calcium?: number;
  potassium?: number;
  vitaminC?: number;
}

export type ProductCategory = "Vegetables" | "Fruits" | "Salads" | "Ice Creams";

export interface ProductResponse {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  image: string;
  description: string;
  popularity: number;
  healthBenefits: string[];
  nutrition: NutritionResponse;
}

export interface OrderItemResponse {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  orderedAt: string;
  status: "Delivered" | "Pending" | "Cancelled";
  total: number;
  items: OrderItemResponse[];
}

export interface MockDatabase {
  users: UserProfileResponse[];
  products: ProductResponse[];
  orders: OrderResponse[];
}

export interface DashboardResponse {
  trending: ProductResponse[];
  recommended: ProductResponse[];
  weeklySummary: {
    itemsOrdered: number;
    estimatedSavings: number;
    avgProtein: number;
  };
  weeklyReport: {
    periodLabel: string;
    resetApplied: boolean;
    values: {
      vitaminC: number;
      protein: number;
      fiber: number;
      calcium: number;
      iron: number;
    };
    targets: {
      vitaminC: number;
      protein: number;
      fiber: number;
      calcium: number;
      iron: number;
    };
  };
}

export interface CatalogFilters {
  category?: ProductCategory | "All";
  search?: string;
  nutrition?: "all" | "high-protein" | "high-fiber" | "high-iron" | "low-calorie";
}

export interface NutritionTarget {
  calories: number;
  protein: number;
  fiber: number;
  iron: number;
}

export interface WeeklyPlanResponse {
  [day: string]: string[];
}
