import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import mongoose from "mongoose";
import connect from "@/lib/db";

import { Cart } from "@/schemas/cart.schema";
import { addToCartSchema } from "@/lib/validators/cart.validator";

export async function POST(req: Request) {
  try {
    await connect();

    const session = await getServerSession(authOptions);

    const body = await req.json();
    const validated = await addToCartSchema.validate(body, {
      abortEarly: false,
    });

    const { productId, qty, variant } = validated;

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: session.user.id,
        items: [
          {
            productId: productObjectId,
            qty,
            priceAtAdd: 0,
            variant: variant ?? undefined,
          },
        ],
      });

      return NextResponse.json({ cart });
    }

    const existing = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.variant === (variant ?? undefined)
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({
        productId: productObjectId,
        qty,
        priceAtAdd: 0,
        variant: variant ?? undefined,
      });
    }

    await cart.save();

    return NextResponse.json({ cart });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 400 }
    );
  }
}
