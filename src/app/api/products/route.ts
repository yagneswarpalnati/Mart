import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Product } from "@/models/Product";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");
  
  await mongoose.connect(uri);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    await connectDB();
    
    // Sort by priority if it's vegetable/fruit, otherwise just by ID
    let query = {};
    if (category) {
      query = { category };
    }
    
    const products = await Product.find(query)
      .sort({ "details.priority.level": 1, id: 1 })
      .lean();
      
    // Transform back to the expected plain object structure the frontend expects
    const formattedProducts = products.map((p: any) => {
      const { _id, __v, ...rest } = p as any;
      
      // Standardize the shape based on category type
      if (rest.category === 'vegetable' || rest.category === 'fruit') {
        return {
          id: rest.id,
          name: rest.name,
          emoji: rest.emoji,
          price: rest.price,
          unit: rest.unit,
          category: rest.category,
          benefit: rest.details?.benefits,
          priority: rest.details?.priority?.level === "A" ? "must-have" : 
                    rest.details?.priority?.level === "B" ? "recommended" : "good-choice",
          isTrending: rest.id <= 2, // First 2 items are trending
          nutrition: rest.nutrition
        };
      } else if (rest.category === 'salad') {
        return {
          id: rest.id,
          name: rest.name,
          emoji: rest.emoji,
          price: rest.price,
          unit: rest.unit,
          category: rest.category,
          ingredients: rest.details?.ingredients || [],
          nutrition: rest.nutrition
        };
      } else if (rest.category === 'icecream') {
        return {
          id: rest.id,
          name: rest.name,
          emoji: rest.emoji,
          price: rest.price,
          unit: rest.unit,
          category: rest.category,
          flavor: rest.details?.flavor,
          description: rest.details?.description,
          mood: rest.details?.mood || []
        };
      }
      return rest;
    });

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}
