import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/home/ProductCard";
import type { IProduct } from "@/schemas/products/product.schema";

const mock: IProduct = {
  _id: "1",
  title: "KOI Oversize Tee",
  description: "Test",
  brand: "KOI",
  price: 49.99,
  discount: 0,
  colors: ["black"],
  sizes: ["M"],
  variants: [],
  images: [{ url: "/test.jpg", public_id: null }],
  categoryId: "12345abcdef",
  status: "active",
};

describe("ProductCard", () => {
  it("renders product title", () => {
    render(<ProductCard product={mock} />);
    expect(screen.getByText("KOI Oversize Tee")).toBeInTheDocument();
  });

  it("renders product price", () => {
    render(<ProductCard product={mock} />);
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("renders product image", () => {
    render(<ProductCard product={mock} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
  });
});
