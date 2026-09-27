import "server-only";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { db, categories, products } from "@/db";

export const getCategories = cache(async () =>
  db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      tagline: categories.tagline,
      description: categories.description,
      image: categories.image,
      count: sql<number>`(select count(*)::int from products p where p.category_id = "categories"."id" and p.active)`,
    })
    .from(categories)
    .orderBy(asc(categories.sortOrder)),
);

export const getCategory = cache(async (slug: string) =>
  db.query.categories.findFirst({ where: eq(categories.slug, slug) }),
);

export async function getProducts(opts: { categoryId?: string; featured?: boolean; sort?: string; limit?: number } = {}) {
  const where = and(
    eq(products.active, true),
    opts.categoryId ? eq(products.categoryId, opts.categoryId) : undefined,
    opts.featured ? eq(products.featured, true) : undefined,
  );
  const order =
    opts.sort === "price-asc" ? [asc(products.price)]
    : opts.sort === "price-desc" ? [desc(products.price)]
    : opts.sort === "new" ? [desc(products.createdAt)]
    : [asc(products.sortOrder), desc(products.createdAt)];
  return db.select().from(products).where(where).orderBy(...order).limit(opts.limit ?? 200);
}

export const getProduct = cache(async (slug: string) =>
  db.query.products.findFirst({ where: and(eq(products.slug, slug), eq(products.active, true)), with: { category: true } }),
);
