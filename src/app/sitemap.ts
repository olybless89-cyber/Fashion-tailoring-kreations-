import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db, categories, products } from "@/db";
import { site } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, prods] = await Promise.all([
    db.select({ slug: categories.slug }).from(categories),
    db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(eq(products.active, true)),
  ]);
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/shop`, changeFrequency: "weekly" },
    { url: `${site.url}/made-to-measure`, changeFrequency: "monthly" },
    ...cats.map((c) => ({ url: `${site.url}/collections/${c.slug}`, changeFrequency: "weekly" as const })),
    ...prods.map((p) => ({ url: `${site.url}/product/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
