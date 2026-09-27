import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, categories } from "@/db";
import { ProductForm } from "@/components/product-form";

export default async function NewProduct() {
  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sortOrder));
  return (
    <>
      <Link href="/admin/products" className="text-sm text-stone hover:text-ink">All products</Link>
      <h1 className="display display-md mt-2">Add a product</h1>
      <ProductForm categories={cats} />
    </>
  );
}
