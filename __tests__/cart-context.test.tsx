import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/cart-context";
import { MockSessionProvider } from "../__mocks__/MockSessionProvider";

// Wrapper used to provide SessionProvider and CartProvider to the hook
interface WrapperProps {
  children: React.ReactNode;
}

const wrapper = ({ children }: WrapperProps) => (
  <MockSessionProvider session={null}>
    <CartProvider>{children}</CartProvider>
  </MockSessionProvider>
);

// Product mock used for tests
const mockProduct = {
  productId: "abc123",
  title: "Test Product",
  priceAtAdd: 50,
  qty: 1,
  image: "/test.jpg",
  variant: "M",
};

describe("Cart Context - Unit Tests", () => {
  // No need to call setupLocalStorageMock() manually because Jest loads it globally

  test("initializes with an empty cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.cart!.items).toEqual([]);
  });

  test("adds product to the cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem(mockProduct);
      await result.current.refresh();
    });

    expect(result.current.cart!.items.length).toBe(1);
    expect(result.current.cart!.items[0].productId).toBe("abc123");
  });

  test("updates product quantity", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem(mockProduct);
      await result.current.refresh();
      await result.current.updateItem("abc123", 3, "M");
      await result.current.refresh();
    });

    expect(result.current.cart!.items[0].qty).toBe(3);
  });

  test("removes product from the cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem(mockProduct);
      await result.current.refresh();
      await result.current.removeItem("abc123", "M");
      await result.current.refresh();
    });

    expect(result.current.cart!.items.length).toBe(0);
  });

  test("calculates subtotal", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem({
        ...mockProduct,
        productId: "p1",
        priceAtAdd: 20,
        qty: 2,
      });
      await result.current.refresh();
      await result.current.addItem({
        ...mockProduct,
        productId: "p2",
        priceAtAdd: 30,
        qty: 1,
      });
      await result.current.refresh();
    });

    const items = result.current.cart!.items;

    const subtotal =
      items[0].qty * items[0].priceAtAdd + items[1].qty * items[1].priceAtAdd;

    expect(subtotal).toBe(70);
  });

  test("persists cart to localStorage", async () => {
    jest.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem(mockProduct);
      await result.current.refresh();
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
