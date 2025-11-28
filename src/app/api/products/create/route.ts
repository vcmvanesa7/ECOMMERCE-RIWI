// src/app/api/products/create/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Product } from "@/schemas/product.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Expected body:
 * {
 *  title, slug, description, price, currency, stock, images: [{url, public_id}], category
 * }
 * Access: admin only
 */

export async function POST(req: Request) {
  try {
    // Optional: check session
    const session = await getServerSession(authOptions as any);
    if (!session || (session as any).user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { title, slug, description, price, currency, stock, images = [], category } = body;
    if (!title || !slug || !price) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }
    await connect();
    const existing = await Product.findOne({ slug }).lean();
    if (existing) return NextResponse.json({ error: "slug already exists" }, { status: 409 });
    const product = await Product.create({ title, slug, description, price, currency, stock, images, category, isPublished: true });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
