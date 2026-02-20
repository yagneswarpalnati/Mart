import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: number;
  name: string;
  emoji: string;
  price: number;
  unit: string;
  category: "vegetable" | "fruit" | "salad" | "icecream";
  nutrition?: {
    vitaminC?: number;
    protein?: number;
    fiber?: number;
    iron?: number;
    calcium?: number;
  };
  details?: {
    description?: string;
    benefits?: string;
    priority?: {
      level: "A" | "B" | "C";
      text: string;
    };
    ingredients?: string[];
    mood?: string[];
    flavor?: string;
  };
}

const ProductSchema = new Schema(
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

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
