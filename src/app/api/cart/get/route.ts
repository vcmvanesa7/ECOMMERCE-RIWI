import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connect from "@/lib/db";

import { Cart } from "@/schemas/cart.schema";
import { Product } from "@/schemas/products/product.schema";

export async function GET() {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    // No logged user → empty cart
    if (!session?.user?.id) {
      return NextResponse.json({ cart: { items: [] } });
    }

    const cart = await Cart.findOne({ userId: session.user.id }).lean();

    if (!cart) {
      return NextResponse.json({ cart: { items: [] } });
    }

    // Populate product data manually
    const items = await Promise.all(
      cart.items.map(async (i) => {
        const product = await Product.findById(i.productId).lean();

        return {
          productId: i.productId.toString(),
          qty: i.qty,
          priceAtAdd: i.priceAtAdd,
          variant: i.variant ?? undefined,

          // new fields:
          title: product?.title ?? "Untitled",
          image: product?.images?.[0]?.url ?? "/placeholder.png",
        };
      })
    );

    return NextResponse.json({ cart: { items } });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load cart" },
      { status: 500 }
    );
  }
}
