// src/schemas/product.schema.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  images: { url: string; public_id: string }[];
  category?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  stock: { type: Number, default: 0 },
  images: [{ url: String, public_id: String }],
  category: String,
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export const Product: Model<IProduct> = (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
