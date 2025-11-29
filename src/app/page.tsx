"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import  Hero  from "@/components/home/Hero";
import  ProductCard from "@/components/home/ProductCard";
import  BenefitsStrip  from "@/components/home/Benefits";
import  PromoBanner  from "@/components/home/PromoBanner";


type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  images?: { url: string }[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=8");
        const data = await res.json();

        const items = Array.isArray(data) ? data : data.items || [];
        setProducts(items);
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featured = products.slice(0, 4);
  const latest = products.slice(4, 8);

 return (
  <div className="min-h-screen bg-white text-neutral-900">
    {/* HERO */}
    <Hero />

    {/* STRIP DE BENEFICIOS */}
    <BenefitsStrip />

    {/* DESTACADOS */}
    <section className="max-w-6xl mx-auto px-4 mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight uppercase text-neutral-900">
          Featured Drops
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading products…</p>
      ) : featured.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No products yet. Create some from the admin panel.
        </p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {featured.map((p, idx) => (
            <motion.div key={p._id} variants={fadeUp} custom={idx * 0.05}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>

    {/* BANNER KOI */}
    <PromoBanner />

    {/* NUEVOS LANZAMIENTOS */}
    {!loading && latest.length > 0 && (
      <section className="max-w-6xl mx-auto px-4 mt-16 mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight uppercase text-neutral-900">
            New in Store
          </h2>
          <Link
            href="/products?sort=newest"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            See latest →
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6"
        >
          {latest.map((p, idx) => (
            <motion.div key={p._id} variants={fadeUp} custom={idx * 0.05}>
              <ProductCard product={p} compact />
            </motion.div>
          ))}
        </motion.div>
      </section>
    )}

    {/* FOOTER */}
    <footer className="border-t border-neutral-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <span>© {new Date().getFullYear()} KOI Streetwear. All rights reserved.</span>
        <span className="flex gap-4">
          <button className="hover:text-neutral-800 transition">Privacy</button>
          <button className="hover:text-neutral-800 transition">Terms</button>
          <button className="hover:text-neutral-800 transition">Support</button>
        </span>
      </div>
    </footer>
  </div>
);
}