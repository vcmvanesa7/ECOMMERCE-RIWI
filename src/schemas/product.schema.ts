// src/schemas/product.schema.ts
import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  brand: string; // marca
  category: string;
  price: number;
  discount?: number;
  colors: string[]; // hex colors
  sizes: string[]; // S, M, L...
  variants: {
    color: string;
    size: string;
    stock: number;
  }[];
  images: {
    url: string;
    public_id: string | null;
  }[];
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    colors: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],

    variants: [
      {
        color: { type: String, required: true },
        size: { type: String, required: true },
        stock: { type: Number, required: true },
      },
    ],

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: null }
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
