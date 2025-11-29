// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Product } from "@/schemas/product.schema";
import { productSchema } from "@/lib/validators";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const body = await req.json();

    const validated = await productSchema.validate(body, {
      abortEarly: false,
    });

    const cleanArray = (arr?: (string | undefined)[]) =>
      Array.isArray(arr) ? arr.filter((v): v is string => !!v) : [];

    const cleaned = {
      ...validated,
      colors: cleanArray(validated.colors),
      sizes: cleanArray(validated.sizes),
    };

    const updated = await Product.findByIdAndUpdate(
      params.id,
      cleaned,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.errors || "Error updating product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const deleted = await Product.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
