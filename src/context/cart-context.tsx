"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

type CartItem = {
  productId: string;
  qty: number;
  priceAtAdd: number;
  variant?: string;
};

type Cart = {
  items: CartItem[];
};

type CartContextValue = {
  cart: Cart | null;
  addItem: (productId: string, qty?: number) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);

  // ---------------------------------------------------
  // REFRESH CART (useCallback)
  // ---------------------------------------------------
  const refresh = useCallback(async () => {
    if (!session) {
      const local =
        typeof window !== "undefined"
          ? localStorage.getItem("cart")
          : null;

      setCart(local ? JSON.parse(local) : { items: [] });
      return;
    }

    try {
      const res = await fetch("/api/cart/get");
      if (res.ok) {
        const json = await res.json();
        setCart(json.cart || { items: [] });
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  }, [session]);

  // ---------------------------------------------------
  // LOAD CART WHEN LOGIN/LOGOUT OCCURS (without ESLint errors)
  // ---------------------------------------------------
  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, [refresh]);

  // ---------------------------------------------------
  // ADD ITEM
  // ---------------------------------------------------
  const addItem = useCallback(
    async (productId: string, qty = 1) => {
      if (!session) {
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("cart")
            : null;

        const localCart: Cart = stored ? JSON.parse(stored) : { items: [] };

        const existing = localCart.items.find(
          (i) => i.productId === productId
        );

        if (existing) {
          existing.qty += qty;
        } else {
          localCart.items.push({
            productId,
            qty,
            priceAtAdd: 0,
          });
        }

        localStorage.setItem("cart", JSON.stringify(localCart));
        setCart(localCart);
        return;
      }

      // Authenticated user
      try {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, qty }),
        });

        if (res.ok) {
          const json = await res.json();
          setCart(json.cart);
        } else {
          console.error("Failed to add to cart");
        }
      } catch (err) {
        console.error("Add item error:", err);
      }
    },
    [session]
  );

  return (
    <CartContext.Provider value={{ cart, addItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
