import Link from "next/link";
import { ProductCard } from "./product-card";
import type { Product } from "@/db/schema";

const sorts = [
  ["", "Featured"],
  ["new", "Newest"],
  ["price-asc", "Price, low to high"],
  ["price-desc", "Price, high to low"],
] as const;

export function ProductGrid({ products, basePath, sort }: { products: Product[]; basePath: string; sort?: string }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3 text-sm">
        <p className="text-stone tabular-nums">{products.length} {products.length === 1 ? "piece" : "pieces"}</p>
        <div className="no-scrollbar flex gap-4 overflow-x-auto" role="group" aria-label="Sort">
          {sorts.map(([v, l]) => (
            <Link
              key={v}
              href={v ? `${basePath}?sort=${v}` : basePath}
              scroll={false}
              className={`whitespace-nowrap ${(sort ?? "") === v ? "font-semibold underline underline-offset-4" : "text-stone hover:text-ink"}`}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-lg">New pieces for this collection are being photographed.</p>
          <Link href="/shop" className="btn btn-line mt-6">Browse every collection</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </>
  );
}
