import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategory, getProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/product-grid";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  if (!c) return {};
  return { title: `${c.name} for men`, description: c.description ?? undefined };
}

export default async function Collection({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const cat = await getCategory(slug);
  if (!cat) notFound();
  const [cats, items] = await Promise.all([getCategories(), getProducts({ categoryId: cat.id, sort })]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <nav aria-label="Breadcrumb" className="text-sm text-stone">
        <Link href="/shop" className="hover:text-ink">Shop</Link> <span aria-hidden>/</span> {cat.name}
      </nav>
      <div className="mt-4 grid gap-6 lg:grid-cols-12">
        <h1 className="display display-lg lg:col-span-7">{cat.name}</h1>
        {cat.description && <p className="max-w-[48ch] self-end text-lg text-stone lg:col-span-5">{cat.description}</p>}
      </div>
      <nav aria-label="Other collections" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-6">
        {cats.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            aria-current={c.slug === slug ? "page" : undefined}
            className={`whitespace-nowrap border px-4 py-2 text-sm font-medium ${c.slug === slug ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      <ProductGrid products={items} basePath={`/collections/${slug}`} sort={sort} />
    </div>
  );
}
