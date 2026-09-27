import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/product-grid";

export const metadata: Metadata = { title: "Shop all menswear" };

export default async function Shop({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams;
  const [cats, items] = await Promise.all([getCategories(), getProducts({ sort })]);
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <h1 className="display display-lg">Every piece</h1>
      <nav aria-label="Collections" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-6">
        {cats.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="whitespace-nowrap border border-line px-4 py-2 text-sm font-medium hover:border-ink">
            {c.name}
          </Link>
        ))}
      </nav>
      <ProductGrid products={items} basePath="/shop" sort={sort} />
    </div>
  );
}
