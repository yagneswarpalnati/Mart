import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { items, subtotal, deliveryFee, total, nutritionSummary, guestDetails } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let userId = null;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    if (!userId && !guestDetails) {
      return NextResponse.json({ error: "Must be logged in or provide guest details" }, { status: 401 });
    }

    await connectDB();

    const orderData: any = {
      items,
      subtotal,
      deliveryFee,
      total,
      nutritionSummary,
    };

    if (userId) orderData.user = userId;
    // We can also store guest details even for logged in users if they change it
    if (guestDetails) orderData.guestDetails = guestDetails;

    const order = await Order.create(orderData);

    return NextResponse.json({ message: "Order placed successfully", order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ user: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
