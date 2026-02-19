// ─── Types ────────────────────────────────────────
export interface NutritionInfo {
  vitaminA: number;   // mg per kg
  vitaminC: number;
  vitaminK: number;
  iron: number;
  calcium: number;
  protein: number;    // g per kg
  fiber: number;      // g per kg
}

export interface Product {
  id: number;
  name: string;
  emoji: string;
  price: number;         // ₹ per kg
  nutrition: NutritionInfo;
  benefit: string;       // "Why this vegetable/fruit?"
  priority: "must-have" | "recommended" | "good-choice";
  category: "vegetable" | "fruit" | "salad" | "icecream";
}

export interface Salad {
  id: number;
  name: string;
  emoji: string;
  price: number;
  ingredients: string[];
  nutrition: NutritionInfo;
  benefit: string;
  category: "salad";
}

export interface IceCream {
  id: number;
  name: string;
  emoji: string;
  price: number;
  flavor: string;
  description: string;
  mood: ("kid-favourite" | "cheat-day" | "guilt-free")[];
  calories: number;
  category: "icecream";
}

// ─── Daily Recommended Values ─────────────────────
export const dailyRecommended = {
  vitaminA: 0.9,   // mg
  vitaminC: 90,    // mg
  vitaminK: 0.12,  // mg
  iron: 18,        // mg
  calcium: 1000,   // mg
  protein: 50,     // g
  fiber: 25,       // g
};

// ─── Vegetables ───────────────────────────────────
export const vegetables: Product[] = [
  {
    id: 1,
    name: "Spinach",
    emoji: "🥬",
    price: 40,
    nutrition: { vitaminA: 9.4, vitaminC: 28, vitaminK: 4.8, iron: 27, calcium: 990, protein: 29, fiber: 22 },
    benefit: "Spinach is a superfood packed with iron and Vitamin K. It strengthens bones, boosts immunity, and improves blood circulation. A must for daily health!",
    priority: "must-have",
    category: "vegetable",
  },
  {
    id: 2,
    name: "Carrot",
    emoji: "🥕",
    price: 50,
    nutrition: { vitaminA: 8.3, vitaminC: 59, vitaminK: 0.13, iron: 3, calcium: 330, protein: 9.3, fiber: 28 },
    benefit: "Carrots are rich in beta-carotene (Vitamin A) which is essential for eye health, skin glow, and immune function. Eat them raw or cooked!",
    priority: "must-have",
    category: "vegetable",
  },
  {
    id: 3,
    name: "Broccoli",
    emoji: "🥦",
    price: 90,
    nutrition: { vitaminA: 0.6, vitaminC: 892, vitaminK: 1.0, iron: 7.3, calcium: 470, protein: 28, fiber: 26 },
    benefit: "Broccoli is a cancer-fighting powerhouse! Rich in Vitamin C and sulforaphane, it detoxifies your body and strengthens your immune system.",
    priority: "must-have",
    category: "vegetable",
  },
  {
    id: 4,
    name: "Beetroot",
    emoji: "🫒",
    price: 45,
    nutrition: { vitaminA: 0.02, vitaminC: 49, vitaminK: 0.02, iron: 8, calcium: 160, protein: 16, fiber: 28 },
    benefit: "Beetroot boosts stamina, lowers blood pressure, and improves blood flow. Its nitrates enhance athletic performance naturally.",
    priority: "recommended",
    category: "vegetable",
  },
  {
    id: 5,
    name: "Sweet Potato",
    emoji: "🍠",
    price: 35,
    nutrition: { vitaminA: 14.2, vitaminC: 24, vitaminK: 0.02, iron: 6.1, calcium: 300, protein: 16, fiber: 30 },
    benefit: "Sweet potatoes are a fantastic source of Vitamin A and complex carbs. They provide sustained energy and support gut health with high fiber.",
    priority: "recommended",
    category: "vegetable",
  },
  {
    id: 6,
    name: "Bell Pepper",
    emoji: "🫑",
    price: 80,
    nutrition: { vitaminA: 1.6, vitaminC: 1280, vitaminK: 0.05, iron: 4.3, calcium: 70, protein: 9, fiber: 17 },
    benefit: "Bell peppers have 3x more Vitamin C than oranges! They boost collagen production, improve skin health, and fight inflammation.",
    priority: "recommended",
    category: "vegetable",
  },
  {
    id: 7,
    name: "Kale",
    emoji: "🥗",
    price: 70,
    nutrition: { vitaminA: 5.1, vitaminC: 930, vitaminK: 3.9, iron: 15, calcium: 1540, protein: 43, fiber: 36 },
    benefit: "Kale is the king of greens! With massive calcium and Vitamin K content, it's essential for bone density and cardiovascular health.",
    priority: "must-have",
    category: "vegetable",
  },
  {
    id: 8,
    name: "Tomato",
    emoji: "🍅",
    price: 30,
    nutrition: { vitaminA: 0.4, vitaminC: 140, vitaminK: 0.08, iron: 2.7, calcium: 100, protein: 9, fiber: 12 },
    benefit: "Tomatoes contain lycopene, a powerful antioxidant that reduces heart disease risk and protects skin from UV damage.",
    priority: "good-choice",
    category: "vegetable",
  },
];

// ─── Fruits ───────────────────────────────────────
export const fruits: Product[] = [
  {
    id: 101,
    name: "Banana",
    emoji: "🍌",
    price: 50,
    nutrition: { vitaminA: 0.06, vitaminC: 87, vitaminK: 0.005, iron: 2.6, calcium: 50, protein: 11, fiber: 26 },
    benefit: "Bananas are nature's energy bar! Packed with potassium, they prevent muscle cramps, support heart health, and provide instant energy.",
    priority: "must-have",
    category: "fruit",
  },
  {
    id: 102,
    name: "Apple",
    emoji: "🍎",
    price: 150,
    nutrition: { vitaminA: 0.03, vitaminC: 46, vitaminK: 0.02, iron: 1.2, calcium: 60, protein: 3, fiber: 24 },
    benefit: "An apple a day keeps the doctor away! Rich in pectin fiber, apples improve digestion, lower cholesterol, and support weight management.",
    priority: "must-have",
    category: "fruit",
  },
  {
    id: 103,
    name: "Orange",
    emoji: "🍊",
    price: 80,
    nutrition: { vitaminA: 0.1, vitaminC: 532, vitaminK: 0.0, iron: 1, calcium: 400, protein: 9.4, fiber: 24 },
    benefit: "Oranges are immune system champions! Their high Vitamin C content fights infections, heals wounds faster, and keeps your skin radiant.",
    priority: "must-have",
    category: "fruit",
  },
  {
    id: 104,
    name: "Mango",
    emoji: "🥭",
    price: 200,
    nutrition: { vitaminA: 0.54, vitaminC: 366, vitaminK: 0.04, iron: 1.6, calcium: 110, protein: 8.2, fiber: 16 },
    benefit: "The king of fruits! Mangoes boost immunity, improve digestion with natural enzymes, and are incredible for skin health and eye sight.",
    priority: "recommended",
    category: "fruit",
  },
  {
    id: 105,
    name: "Papaya",
    emoji: "🍑",
    price: 60,
    nutrition: { vitaminA: 0.47, vitaminC: 609, vitaminK: 0.03, iron: 2.5, calcium: 200, protein: 5.3, fiber: 17 },
    benefit: "Papaya contains papain enzyme that aids digestion, reduces inflammation, and prevents constipation. A true digestive healer!",
    priority: "recommended",
    category: "fruit",
  },
  {
    id: 106,
    name: "Pomegranate",
    emoji: "🫐",
    price: 180,
    nutrition: { vitaminA: 0.0, vitaminC: 102, vitaminK: 0.16, iron: 3, calcium: 100, protein: 17, fiber: 40 },
    benefit: "Pomegranates are antioxidant powerhouses! They improve blood flow, reduce inflammation, and support heart and joint health.",
    priority: "recommended",
    category: "fruit",
  },
  {
    id: 107,
    name: "Watermelon",
    emoji: "🍉",
    price: 25,
    nutrition: { vitaminA: 0.28, vitaminC: 81, vitaminK: 0.001, iron: 2.4, calcium: 70, protein: 6.1, fiber: 4 },
    benefit: "Watermelon hydrates you with 92% water content! It contains citrulline which improves blood flow and reduces muscle soreness.",
    priority: "good-choice",
    category: "fruit",
  },
  {
    id: 108,
    name: "Grapes",
    emoji: "🍇",
    price: 120,
    nutrition: { vitaminA: 0.03, vitaminC: 36, vitaminK: 0.15, iron: 3.6, calcium: 100, protein: 7.2, fiber: 9 },
    benefit: "Grapes contain resveratrol, a compound that protects your heart, reduces bad cholesterol, and has anti-aging properties.",
    priority: "good-choice",
    category: "fruit",
  },
];

// ─── Salads ───────────────────────────────────────
export const salads: Salad[] = [
  {
    id: 201,
    name: "Greek Salad",
    emoji: "🥗",
    price: 180,
    ingredients: ["Cucumber", "Tomato", "Olives", "Feta Cheese", "Red Onion", "Olive Oil"],
    nutrition: { vitaminA: 1.2, vitaminC: 150, vitaminK: 0.3, iron: 5, calcium: 350, protein: 15, fiber: 8 },
    benefit: "A Mediterranean classic packed with healthy fats, antioxidants, and hydrating vegetables. Perfect for heart health!",
    category: "salad",
  },
  {
    id: 202,
    name: "Caesar Salad",
    emoji: "🥬",
    price: 200,
    ingredients: ["Romaine Lettuce", "Parmesan", "Croutons", "Caesar Dressing", "Lemon"],
    nutrition: { vitaminA: 2.8, vitaminC: 120, vitaminK: 1.2, iron: 4, calcium: 450, protein: 18, fiber: 6 },
    benefit: "Rich in Vitamin K from romaine lettuce and calcium from parmesan. A satisfying, nutrient-dense meal option.",
    category: "salad",
  },
  {
    id: 203,
    name: "Quinoa Power Bowl",
    emoji: "🫘",
    price: 250,
    ingredients: ["Quinoa", "Avocado", "Chickpeas", "Cherry Tomato", "Spinach", "Tahini"],
    nutrition: { vitaminA: 3.5, vitaminC: 200, vitaminK: 2.1, iron: 12, calcium: 280, protein: 32, fiber: 18 },
    benefit: "Complete protein from quinoa + healthy fats from avocado. This is a muscle-building, energy-boosting superfood bowl!",
    category: "salad",
  },
  {
    id: 204,
    name: "Fruit Salad Bliss",
    emoji: "🍓",
    price: 160,
    ingredients: ["Strawberry", "Mango", "Kiwi", "Blueberry", "Mint", "Honey-Lime Dressing"],
    nutrition: { vitaminA: 0.8, vitaminC: 450, vitaminK: 0.1, iron: 3, calcium: 120, protein: 5, fiber: 14 },
    benefit: "A vitamin C explosion! This fruit medley boosts immunity, hydrates your body, and satisfies sweet cravings naturally.",
    category: "salad",
  },
  {
    id: 205,
    name: "Asian Crunch Salad",
    emoji: "🥜",
    price: 220,
    ingredients: ["Cabbage", "Edamame", "Carrot", "Peanuts", "Sesame", "Ginger-Soy Dressing"],
    nutrition: { vitaminA: 4.2, vitaminC: 180, vitaminK: 0.8, iron: 8, calcium: 200, protein: 22, fiber: 12 },
    benefit: "Crunchy, umami-rich, and packed with plant protein from edamame. Anti-inflammatory ginger makes this a healing meal.",
    category: "salad",
  },
  {
    id: 206,
    name: "Detox Green Salad",
    emoji: "🌿",
    price: 190,
    ingredients: ["Kale", "Cucumber", "Green Apple", "Celery", "Lemon-Ginger Dressing"],
    nutrition: { vitaminA: 5.0, vitaminC: 320, vitaminK: 3.5, iron: 10, calcium: 600, protein: 14, fiber: 20 },
    benefit: "The ultimate cleanse! Alkalizing greens flush toxins, reduce bloating, and give you glowing skin from the inside out.",
    category: "salad",
  },
];

// ─── Ice Creams ───────────────────────────────────
export const icecreams: IceCream[] = [
  {
    id: 301,
    name: "Classic Vanilla",
    emoji: "🍦",
    price: 120,
    flavor: "Madagascar Vanilla Bean",
    description: "Creamy, dreamy, and timeless. Made with real vanilla beans for that authentic, comforting sweetness.",
    mood: ["kid-favourite"],
    calories: 207,
    category: "icecream",
  },
  {
    id: 302,
    name: "Belgian Chocolate",
    emoji: "🍫",
    price: 150,
    flavor: "Dark Belgian Cocoa",
    description: "Rich, indulgent dark chocolate ice cream with cocoa swirls. The ultimate cheat day companion!",
    mood: ["cheat-day", "kid-favourite"],
    calories: 250,
    category: "icecream",
  },
  {
    id: 303,
    name: "Mango Sorbet",
    emoji: "🥭",
    price: 130,
    flavor: "Alphonso Mango",
    description: "A tropical escape in every bite! Made with real Alphonso mango pulp. Dairy-free and naturally sweet.",
    mood: ["guilt-free"],
    calories: 120,
    category: "icecream",
  },
  {
    id: 304,
    name: "Strawberry Cheesecake",
    emoji: "🍓",
    price: 180,
    flavor: "Strawberry & Cream Cheese",
    description: "Luscious strawberry ribbons swirled through cream cheese ice cream with crunchy graham bits.",
    mood: ["cheat-day"],
    calories: 280,
    category: "icecream",
  },
  {
    id: 305,
    name: "Mint Choco Chip",
    emoji: "🌿",
    price: 140,
    flavor: "Fresh Mint & Dark Chips",
    description: "Cool, refreshing mint with crunchy dark chocolate chips. A perfect balance of fresh and sweet!",
    mood: ["kid-favourite", "cheat-day"],
    calories: 230,
    category: "icecream",
  },
  {
    id: 306,
    name: "Coconut Bliss",
    emoji: "🥥",
    price: 160,
    flavor: "Toasted Coconut & Vanilla",
    description: "Vegan-friendly coconut cream with toasted coconut flakes. Tropical, guilt-free indulgence!",
    mood: ["guilt-free"],
    calories: 145,
    category: "icecream",
  },
];

// ─── Priority Helpers ─────────────────────────────
export const priorityConfig = {
  "must-have": { label: "🟢 Must Have", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25" },
  "recommended": { label: "🟡 Recommended", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25" },
  "good-choice": { label: "🔵 Good Choice", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/25" },
};

export const moodConfig = {
  "kid-favourite": { label: "🧒 Kid's Favourite", color: "text-pink-400", bg: "bg-pink-500/15 border-pink-500/25" },
  "cheat-day": { label: "🎉 Cheat Day", color: "text-purple-400", bg: "bg-purple-500/15 border-purple-500/25" },
  "guilt-free": { label: "💚 Guilt-Free", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25" },
};
