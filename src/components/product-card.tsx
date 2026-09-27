import Image from "next/image";
import Link from "next/link";
import { naira } from "@/lib/format";
import type { Product } from "@/db/schema";

export const isRemote = (src: string) => src.endsWith(".svg");

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [first, second] = product.images;
  const bespokeOnly = product.sizes.length === 0;
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-chalk">
        {first && (
          <Image
            src={first}
            alt={product.name}
            fill
            priority={priority}
            unoptimized={isRemote(first)}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-opacity duration-500"
          />
        )}
        {second && (
          <Image
            src={second}
            alt=""
            fill
            unoptimized={isRemote(second)}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {bespokeOnly && (
          <span className="absolute left-2 top-2 bg-paper px-2 py-1 text-[0.72rem] font-semibold text-ink">
            Made to measure
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <h3 className="text-[0.95rem] font-medium leading-snug group-hover:underline underline-offset-4">{product.name}</h3>
        <p className="shrink-0 text-[0.95rem] tabular-nums">{naira(product.price)}</p>
      </div>
      {product.fabric && <p className="mt-0.5 text-sm text-stone">{product.fabric}</p>}
    </Link>
  );
}
