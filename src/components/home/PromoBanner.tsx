import Link from "next/link";
import { motion } from "framer-motion";


function PromoBanner() {
  return (
    <section
      id="highlights"
      className="max-w-6xl mx-auto px-4 mt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 text-white px-6 py-7 md:px-10 md:py-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-400">
            Limited Capsule
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            KOI Duality Night Drop
          </h2>
          <p className="mt-2 text-sm text-neutral-300 max-w-md">
            Piezas en negro, hints en koi orange, gráficos inspirados en dualidad,
            río, movimiento. Disponible solo este mes.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/products?tag=duality"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white text-black text-xs font-medium uppercase tracking-[0.16em] hover:bg-neutral-100 transition"
            >
              Explore drop
            </Link>
            <button className="inline-flex items-center px-4 py-2 rounded-full border border-neutral-500 text-xs font-medium uppercase tracking-[0.16em] hover:border-white hover:text-white transition">
              Notify me
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-56 h-40 md:h-44">
          <div className="absolute inset-0 bg-gradient-to-br from-koi-orange/40 via-koi-orange/10 to-transparent rounded-3xl blur-xl" />
          <div className="relative h-full w-full rounded-3xl border border-neutral-700 bg-neutral-900 flex flex-col items-center justify-center gap-1">
            <p className="text-[11px] text-neutral-400 tracking-[0.22em] uppercase">
              Sizes
            </p>
            <p className="text-sm font-medium">XS — 2XL</p>
            <p className="text-[11px] text-neutral-400 tracking-[0.22em] uppercase mt-3">
              Fabric
            </p>
            <p className="text-sm font-medium">240gsm heavy cotton</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
export default PromoBanner;