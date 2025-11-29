// src/services/product.service.ts
import axios from "axios";
import { ProductFormValues } from "@/lib/validators";

export async function getProducts() {
  const { data } = await axios.get("/api/products");
  return data;
}

export async function getProductById(id: string) {
  const { data } = await axios.get(`/api/products/${id}`);
  return data;
}

export async function createProduct(payload: ProductFormValues) {
  const { data } = await axios.post("/api/products", payload);
  return data;
}

export async function updateProduct(id: string, payload: ProductFormValues) {
  const { data } = await axios.put(`/api/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string) {
  const { data } = await axios.delete(`/api/products/${id}`);
  return data;
}
