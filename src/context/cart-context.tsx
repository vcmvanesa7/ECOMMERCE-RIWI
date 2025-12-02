"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useSession } from "next-auth/react";
import type { CartDTO } from "@/types/cart";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/services/cart/cart.service";

// Types
interface AddItemPayload {
  productId: string;
  qty?: number;
  priceAtAdd: number;
  variant?: string;

  // Required for GUEST users
  title: string;
  image: string;
}

interface CartContextValue {
  cart: CartDTO | null;
  loading: boolean;

  addItem: (payload: AddItemPayload) => Promise<void>;
  updateItem: (productId: string, qty: number, variant?: string) => Promise<void>;
  removeItem: (productId: string, variant?: string) => Promise<void>;
  clear: () => Promise<void>;

  refresh: () => Promise<void>;
}

// CONTEXT
const CartContext = createContext<CartContextValue | undefined>(undefined);

// PROVIDER
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const [cart, setCart] = useState<CartDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // LOAD CART
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (!session) {
        const local = localStorage.getItem("cart");
        setCart(local ? JSON.parse(local) : { items: [] });
        return;
      }

      const serverCart = await getCart();
      setCart(serverCart);
    } catch (err) {
      console.error("Cart refresh error:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ADD ITEM
  const addItem = useCallback(
    async (payload: AddItemPayload) => {
      const { productId, qty = 1, priceAtAdd, title, image, variant } = payload;

      if (!session) {
        // Guest user → LocalStorage
        const local = localStorage.getItem("cart");
        const parsed: CartDTO = local ? JSON.parse(local) : { items: [] };

        const existing = parsed.items.find(
          (i) =>
            i.productId === productId &&
            (i.variant ?? null) === (variant ?? null)
        );

        if (existing) {
          existing.qty += qty;
        } else {
          parsed.items.push({
            productId,
            qty,
            priceAtAdd,
            variant: variant ?? undefined,
            title,
            image,
          });
        }

        localStorage.setItem("cart", JSON.stringify(parsed));
        setCart(parsed);
        return;
      }

      // Logged user → API
      const updated = await addToCart(productId, qty, variant);
      setCart(updated);
    },
    [session]
  );

  // UPDATE ITEM
  const updateItem = useCallback(
    async (productId: string, qty: number, variant?: string) => {
      if (!session) {
        const local = localStorage.getItem("cart");
        const parsed: CartDTO = local ? JSON.parse(local) : { items: [] };

        if (qty === 0) {
          parsed.items = parsed.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (i.variant ?? null) === (variant ?? null)
              )
          );
        } else {
          const item = parsed.items.find(
            (i) =>
              i.productId === productId &&
              (i.variant ?? null) === (variant ?? null)
          );
          if (item) item.qty = qty;
        }

        localStorage.setItem("cart", JSON.stringify(parsed));
        setCart(parsed);
        return;
      }

      const updated = await updateCartItem(productId, qty, variant);
      setCart(updated);
    },
    [session]
  );

  // REMOVE ITEM
  const removeItem = useCallback(
    async (productId: string, variant?: string) => {
      if (!session) {
        const local = localStorage.getItem("cart");
        const parsed: CartDTO = local ? JSON.parse(local) : { items: [] };

        parsed.items = parsed.items.filter(
          (i) =>
            !(
              i.productId === productId &&
              (i.variant ?? null) === (variant ?? null)
            )
        );

        localStorage.setItem("cart", JSON.stringify(parsed));
        setCart(parsed);
        return;
      }

      const updated = await removeFromCart(productId, variant);
      setCart(updated);
    },
    [session]
  );

  // CLEAR CART
  const clear = useCallback(async () => {
    if (!session) {
      localStorage.removeItem("cart");
      setCart({ items: [] });
      return;
    }

    await clearCart();
    setCart({ items: [] });
  }, [session]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        clear,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// HOOK
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
