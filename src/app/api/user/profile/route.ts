import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: Request) {
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

    const updates = await req.json();
    
    // Safety check so users can't update password through this route directly
    delete updates.password;

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
