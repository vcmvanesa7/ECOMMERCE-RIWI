// src/services/cart.ts
import connect from "@/lib/db";
import { Cart } from "@/schemas/cart.schema";
import mongoose from "mongoose";

export async function getCartByUser(userId: string) {
  await connect();
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return Cart.findOne({ userId }).populate("items.productId").lean();
}

export async function addToCart(userId: string, item: { productId: string; qty: number; priceAtAdd: number; variant?: string }) {
  await connect();
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    const newCart = await Cart.create({ userId, items: [item] });
    return newCart;
  }
  // merge if product exists
  const existingIndex = cart.items.findIndex(i => i.productId.toString() === item.productId);
  if (existingIndex > -1) {
    cart.items[existingIndex].qty += item.qty;
  } else {
    cart.items.push(item as any);
  }
  await cart.save();
  return cart;
}
