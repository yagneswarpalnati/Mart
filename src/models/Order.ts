import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderItem {
  id: number;
  name: string;
  emoji: string;
  price: number;
  quantity: number;
  category: string;
  unit: string;
}

export interface IOrder extends Document {
  user?: Types.ObjectId; // Optional for Guest Checkout
  guestDetails?: {
    name: string;
    phone: string;
    address: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  nutritionSummary: {
    vitaminC: number;
    protein: number;
    fiber: number;
    iron: number;
    calcium: number;
  };
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    guestDetails: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    items: [
      {
        id: Number,
        name: String,
        emoji: String,
        price: Number,
        quantity: Number,
        category: String,
        unit: String,
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Processing", "Delivered", "Cancelled"], default: "Pending" },
    nutritionSummary: {
      vitaminC: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
      iron: { type: Number, default: 0 },
      calcium: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
