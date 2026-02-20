import "dotenv/config";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Manually load .env.local since dotenv/config defaults to .env
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Import local data
import { vegetables, fruits, salads, icecreams } from "../data/nutrition";

// Product Schema Definition (duplicated for standalone script usage without Next.js React issues)
const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["vegetable", "fruit", "salad", "icecream"],
    },
    nutrition: {
      vitaminC: Number,
      protein: Number,
      fiber: Number,
      iron: Number,
      calcium: Number,
    },
    details: {
      description: String,
      benefits: String,
      priority: {
        level: { type: String, enum: ["A", "B", "C"] },
        text: String,
      },
      ingredients: [String],
      mood: [String],
      flavor: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is undefined");

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    console.log("Clearing old products...");
    await Product.deleteMany({});

    const mapNutrition = (n: any) => ({
      vitaminC: n.vitaminC || 0,
      protein: n.protein || 0,
      fiber: n.fiber || 0,
      iron: n.iron || 0,
      calcium: n.calcium || 0,
    });

    const mapPriority = (p: string) => {
      if (p === "must-have") return "A";
      if (p === "recommended") return "B";
      return "C";
    };

    const allProducts = [
      ...vegetables.map(v => ({
        id: v.id,
        name: v.name,
        emoji: v.emoji,
        price: v.price,
        unit: "kg",
        category: "vegetable",
        nutrition: mapNutrition(v.nutrition),
        details: {
          benefits: v.benefit,
          priority: { level: mapPriority(v.priority), text: v.priority }
        }
      })),
      ...fruits.map(f => ({
        id: f.id,
        name: f.name,
        emoji: f.emoji,
        price: f.price,
        unit: "kg",
        category: "fruit",
        nutrition: mapNutrition(f.nutrition),
        details: {
          benefits: f.benefit,
          priority: { level: mapPriority(f.priority), text: f.priority }
        }
      })),
      ...salads.map(s => ({
        id: s.id,
        name: s.name,
        emoji: s.emoji,
        price: s.price,
        unit: "bowl",
        category: "salad",
        nutrition: mapNutrition(s.nutrition || {}),
        details: {
          benefits: s.benefit,
          ingredients: s.ingredients
        }
      })),
      ...icecreams.map(i => ({
        id: i.id,
        name: i.name,
        emoji: i.emoji,
        price: i.price,
        unit: "scoop",
        category: "icecream",
        details: {
          description: i.description,
          flavor: i.flavor,
          mood: i.mood
        }
      })),
    ];

    const result = await Product.insertMany(allProducts);
    console.log(`Successfully seeded ${result.length} products!`);

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  }
};

seedDatabase();
