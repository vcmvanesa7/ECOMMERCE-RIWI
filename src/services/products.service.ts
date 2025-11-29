// src/services/product.service.ts
import axios from "axios";
import { ProductFormValues } from "@/lib/validators";

// GET 
export async function getProducts() {
  const { data } = await axios.get("/api/products");
  return data;
}

// GET with filters
export async function getProductsFiltered(options?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string; // newest | price_asc | price_desc
}) {
  const params = new URLSearchParams();

  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.search) params.set("search", options.search);
  if (options?.category) params.set("category", options.category);
  if (options?.sort) params.set("sort", options.sort);

  const url = `/api/products?${params.toString()}`;

  const { data } = await axios.get(url);
  return data; // { items, total, page, pages }
}

// GET by ID
export async function getProductById(id: string) {
  const { data } = await axios.get(`/api/products/${id}`);
  return data;
}
// POST
export async function createProduct(payload: ProductFormValues) {
  const { data } = await axios.post("/api/products", payload);
  return data;
}
// PUT
export async function updateProduct(id: string, payload: ProductFormValues) {
  const { data } = await axios.put(`/api/products/${id}`, payload);
  return data;
}
// DELETE
export async function deleteProduct(id: string) {
  const { data } = await axios.delete(`/api/products/${id}`);
  return data;
}
