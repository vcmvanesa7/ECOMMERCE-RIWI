// src/services/products.ts
import connect from "@/lib/db";
import { Product } from "@/schemas/product.schema";

export async function createProduct(data: any) {
  await connect();
  const product = await Product.create(data);
  return product;
}

export async function getProductById(id: string) {
  await connect();
  return Product.findById(id).lean();
}

export async function listProducts({ page = 1, limit = 12, filters = {} }: any) {
  await connect();
  const skip = (page - 1) * limit;
  const query = { ...filters, isPublished: true };
  const products = await Product.find(query).skip(skip).limit(limit).lean();
  const total = await Product.countDocuments(query);
  return { products, total };
}
