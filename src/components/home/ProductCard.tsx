import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  images?: { url: string }[];
};

function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const imageUrl =
    product.images && product.images[0]?.url
      ? product.images[0].url
      : "/placeholder-product.png";

  return (
    <Link href={`/products/${product._id}`}>
      <motion.article
        whileHover={{ y: -6 }}
        className="group cursor-pointer rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition"
      >
        <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/80 text-[10px] uppercase tracking-[0.16em] text-white">
              {product.category || "Drop"}
            </span>
          </div>
        </div>

        <div className="p-3.5 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            KOI STREET
          </p>
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
            {product.title}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-neutral-900">
              ${product.price?.toFixed ? product.price.toFixed(2) : product.price}
            </span>
            {!compact && (
              <span className="text-[11px] text-neutral-500 group-hover:text-neutral-900 transition">
                View details →
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
export default ProductCard;