import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import connect from "@/lib/db";
import { Cart } from "@/schemas/cart.schema";
import { removeFromCartSchema } from "@/lib/validators/cart.validator";

export async function DELETE(req: Request) {
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
    const validated = await removeFromCartSchema.validate(body);

    const { productId, variant } = validated;

    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json({ error: "Cart is empty" });
    }

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.productId.toString() === productId &&
          i.variant === (variant ?? undefined)
        )
    );

    await cart.save();

    return NextResponse.json({ cart });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 400 }
    );
  }
}
