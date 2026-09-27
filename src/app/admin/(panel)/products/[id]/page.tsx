import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, categories, products } from "@/db";
import { ProductForm } from "@/components/product-form";
import { deleteProduct } from "../actions";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, cats] = await Promise.all([
    db.query.products.findFirst({ where: eq(products.id, id) }),
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sortOrder)),
  ]);
  if (!product) notFound();
  return (
    <>
      <Link href="/admin/products" className="text-sm text-stone hover:text-ink">All products</Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display display-md">{product.name}</h1>
        <Link href={`/product/${product.slug}`} className="text-sm underline underline-offset-4" target="_blank">View in shop</Link>
      </div>
      <ProductForm product={product} categories={cats} />
      <form action={deleteProduct} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={product.id} />
        <p className="text-sm text-stone">Deleting removes this product from the shop. Past orders keep their details. To take it down temporarily, untick &ldquo;Visible in shop&rdquo; instead.</p>
        <button className="mt-3 text-sm font-semibold text-coral underline underline-offset-4">Delete product</button>
      </form>
    </>
  );
}
