import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import connect from "@/lib/db";
import { Cart } from "@/schemas/cart.schema";
import { updateCartSchema } from "@/lib/validators/cart.validator";

export async function PUT(req: Request) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = await updateCartSchema.validate(body, {
      abortEarly: false,
    });

    const { productId, qty, variant } = validated;

    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Buscar el ítem correcto
    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.variant === (variant ?? undefined)
    );

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Si qty es 0, remueve el item del carrito
    if (qty === 0) {
      cart.items = cart.items.filter(
        (i) =>
          !(
            i.productId.toString() === productId &&
            i.variant === (variant ?? undefined)
          )
      );
    } else {
      item.qty = qty;
    }

    await cart.save();

    return NextResponse.json({ cart });
  } catch (err) {
    console.error("Update cart error:", err);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 400 }
    );
  }
}
