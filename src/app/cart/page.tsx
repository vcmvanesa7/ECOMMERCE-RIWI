"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();

  const items = useMemo(() => cart?.items ?? [], [cart]);

  const subtotal = useMemo(
    () =>
      items.reduce((acc, i) => acc + i.qty * i.priceAtAdd, 0),
    [items]
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-neutral-500">
        Loading your cart…
      </div>
    );

  if (items.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-neutral-600">
        <p className="text-xl font-semibold mb-4">Your cart is empty</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition"
        >
          Shop Products
        </Link>
      </div>
    );

  return (
    <div className="pt-24 pb-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <h1 className="text-3xl font-extrabold mb-10">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT — ITEMS */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.variant ?? ""}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-6 p-4 border border-neutral-200 rounded-xl shadow-sm"
                >
                  {/* IMAGE */}
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-lg font-semibold">{item.title}</h2>

                      {item.variant && (
                        <p className="text-neutral-500 text-sm mt-1">
                          Variant: {item.variant}
                        </p>
                      )}

                      <p className="mt-2 font-semibold">
                        ${item.priceAtAdd.toFixed(2)}
                      </p>
                    </div>

                    {/* QTY + REMOVE */}
                    <div className="flex items-center justify-between mt-4">
                      {/* QUANTITY */}
                      <select
                        className="border border-neutral-300 rounded-lg px-3 py-1"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(
                            item.productId,
                            Number(e.target.value),
                            item.variant
                          )
                        }
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          )
                        )}
                      </select>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variant)
                        }
                        className="text-red-500 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* ITEM TOTAL */}
                  <div className="text-right font-bold text-lg">
                    ${(item.qty * item.priceAtAdd).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT — SUMMARY */}
          <div className="p-6 border border-neutral-200 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="flex justify-between mb-3 text-neutral-600">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>

            <div className="flex justify-between mb-3 text-neutral-600">
              <p>Shipping</p>
              <p>${shipping.toFixed(2)}</p>
            </div>

            <div className="border-t border-neutral-300 my-4"></div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>

            <button
              className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition"
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-neutral-500 mt-3">
              *This is a demo. Checkout will be added later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
