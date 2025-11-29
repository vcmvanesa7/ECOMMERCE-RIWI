import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Product } from "@/schemas/product.schema";
import { productSchema } from "@/lib/validators";

//  GET /api/products/:id 
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connect();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT 
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connect();

    const body = await req.json();
    const validated = await productSchema.validate(body, { abortEarly: false });

    const cleanArray = (arr?: (string | undefined)[]) =>
      Array.isArray(arr) ? arr.filter((v): v is string => !!v) : [];

    const cleaned = {
      ...validated,
      colors: cleanArray(validated.colors),
      sizes: cleanArray(validated.sizes),
    };

    const updated = await Product.findByIdAndUpdate(id, cleaned, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    let response: unknown = "Error updating product";
    if (typeof error === "object" && error !== null && "errors" in error) {
      response = (error as { errors: unknown }).errors;
    }

    return NextResponse.json(
      { error: response },
      { status: 400 }
    );
  }
}

// DELETE 
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connect();

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
