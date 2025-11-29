// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Product } from "@/schemas/product.schema";
import { productSchema } from "@/lib/validators";

export async function GET() {
  try {
    await connect();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();

    const validated = await productSchema.validate(body, { abortEarly: false });

    // Clean arrays defensively
    const cleanArray = (arr?: (string | undefined)[]) =>
      Array.isArray(arr) ? arr.filter((item): item is string => !!item) : [];

    const cleaned = {
      ...validated,
      colors: cleanArray(validated.colors),
      sizes: cleanArray(validated.sizes),
      variants: validated.variants ?? [],
    };

    const created = await Product.create(cleaned);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.errors || "Error creating product" },
      { status: 400 }
    );
  }
}
