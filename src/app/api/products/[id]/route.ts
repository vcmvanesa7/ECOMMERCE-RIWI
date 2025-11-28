// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Product } from "@/schemas/product.schema";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connect();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
