// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Product } from "@/schemas/product.schema";
import type { SortOrder } from "mongoose";

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    
    const query: Record<string, unknown> = {};

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // SORT TIPADO
    const sortOption: Record<string, SortOrder> =
      sort === "price_asc"
        ? { price: 1 }
        : sort === "price_desc"
        ? { price: -1 }
        : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
