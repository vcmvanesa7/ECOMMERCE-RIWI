import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

function Hero() {
  return (
    <section className="border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500">
            New Drop • Limited Stock
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            KOI Street Oversize
            <span className="block text-koi-orange">
              Urban Spirit Collection
            </span>
          </h1>
          <p className="text-sm md:text-base text-neutral-600 max-w-lg">
            Tees oversized, gráficos con energía Koi, pensados para calle, skate
            y noche. Diseñados para combinar con cargos, denim y sneakers pesados.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium tracking-wide hover:bg-neutral-900 transition"
            >
              Shop collection
            </Link>
            <Link
              href="#highlights"
              className="inline-flex items-center px-5 py-2.5 rounded-full border border-neutral-800 text-sm font-medium hover:bg-neutral-100 transition"
            >
              View highlights
            </Link>
          </div>

          <div className="flex gap-6 pt-3 text-xs text-neutral-500">
            <div>
              <p className="font-medium text-neutral-900">24h shipping</p>
              <p>On all local orders</p>
            </div>
            <div>
              <p className="font-medium text-neutral-900">Easy returns</p>
              <p>30 days policy</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-72 md:h-96"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-koi-orange/10 via-transparent to-black/5 rounded-3xl blur-2xl" />
          {/* Card mock */}
          <div className="relative h-full rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col">
            <div className="relative h-40 md:h-52 bg-neutral-950">
              <Image
                src="/hero-koi-placeholder.png"
                alt="KOI Oversize Tee mock"
                fill
                className="object-cover opacity-90"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[10px] font-medium tracking-[0.15em] uppercase">
                Streetwear
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] text-neutral-200 uppercase tracking-[0.2em]">
                KOI / DROP 01
              </div>
            </div>

            <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-neutral-500 uppercase">
                    Highlight
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-koi-orange/10 text-koi-orange font-semibold">
                    New
                  </span>
                </div>
                <p className="text-sm font-semibold text-neutral-900">
                  Yin Yang Koi Street Tee
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Heavyweight 240gsm · Oversize fit · Screen print front & back
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-neutral-900">
                    $49.99
                  </span>
                  <span className="text-xs line-through text-neutral-400">
                    $69.99
                  </span>
                </div>
                <button className="px-3 py-1.5 rounded-full border border-neutral-900 text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-black hover:text-white transition">
                  Quick add
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
export default Hero;