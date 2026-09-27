import Image from "next/image";
import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { db, categories, products } from "@/db";
import { naira } from "@/lib/format";
import { toggleProduct } from "./actions";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const { saved, deleted } = await searchParams;
  const rows = await db
    .select({ p: products, cat: categories.name })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), asc(products.sortOrder), desc(products.createdAt));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display display-md">Products</h1>
        <Link href="/admin/products/new" className="btn btn-ink">Add product</Link>
      </div>
      {saved && <p className="mt-4 bg-paper p-3 text-sm" role="status">Product saved.</p>}
      {deleted && <p className="mt-4 bg-paper p-3 text-sm" role="status">Product deleted.</p>}
      <div className="mt-6 overflow-x-auto bg-paper">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line text-left text-stone">
            <tr>
              <th className="p-3 font-medium">Product</th><th className="p-3 font-medium">Collection</th><th className="p-3 text-right font-medium">Price</th>
              <th className="p-3 font-medium">Homepage</th><th className="p-3 font-medium">In shop</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, cat }) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-chalk/60">
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:underline underline-offset-4">
                    <span className="relative block h-14 w-10 shrink-0 overflow-hidden bg-chalk">
                      {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" unoptimized={p.images[0].endsWith(".svg")} className="object-cover" />}
                    </span>
                    <span className="font-medium">{p.name}</span>
                  </Link>
                </td>
                <td className="p-3 text-stone">{cat}</td>
                <td className="p-3 text-right tabular-nums">{naira(p.price)}</td>
                <td className="p-3">
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="featured" />
                    <button className={`px-2 py-1 text-xs font-semibold ${p.featured ? "bg-ink text-paper" : "border border-line"}`}>{p.featured ? "Featured" : "No"}</button>
                  </form>
                </td>
                <td className="p-3">
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="active" />
                    <button className={`px-2 py-1 text-xs font-semibold ${p.active ? "bg-emerald-100 text-emerald-900" : "border border-line text-stone"}`}>{p.active ? "Visible" : "Hidden"}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
