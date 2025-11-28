// src/schemas/order.schema.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
  priceAtBuy: number;
  variant?: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IPaymentInfo {
  method: string;
  transactionId?: string;
  status?: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  shippingAddress?: IShippingAddress;
  paymentInfo?: IPaymentInfo;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: Number,
  priceAtBuy: Number,
  variant: String,
});

const OrderSchema: Schema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
  shippingAddress: Schema.Types.Mixed,
  paymentInfo: Schema.Types.Mixed,
}, { timestamps: true });

export const Order: Model<IOrder> = (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);
