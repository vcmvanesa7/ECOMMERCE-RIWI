// src/app/api/cart/add/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addToCart } from "@/services/cart";
import { Product } from "@/schemas/product.schema";
import connect from "@/lib/db";

/**
 * body: { productId, qty }
 * requires authentication
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).user.id;
  const body = await req.json();
  const { productId, qty = 1 } = body;
  await connect();
  const product = await Product.findById(productId).lean();
  if (!product) return NextResponse.json({ error: "product not found" }, { status: 404 });
  const result = await addToCart(userId, { productId, qty, priceAtAdd: product.price });
  return NextResponse.json({ cart: result });
}
