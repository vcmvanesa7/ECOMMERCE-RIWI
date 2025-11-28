// src/app/api/cart/get/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCartByUser } from "@/services/cart";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).user.id;
  const cart = await getCartByUser(userId);
  return NextResponse.json({ cart });
}
