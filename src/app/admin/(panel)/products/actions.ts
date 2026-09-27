"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db, media, products } from "@/db";
import { requireAdmin } from "@/lib/auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX = 8 * 1024 * 1024;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);
const list = (v: FormDataEntryValue | null) =>
  String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export type FormState = { error?: string } | undefined;

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const compare = Number(formData.get("compareAtPrice") || 0);
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return { error: "Give the product a name." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Enter a price in Naira, e.g. 95000." };
  if (!categoryId) return { error: "Choose a collection." };
  if (!description) return { error: "Add a short description." };

  let slug = slugify(String(formData.get("slug") || name));
  const clash = await db.query.products.findFirst({ where: and(eq(products.slug, slug), id ? ne(products.id, id) : undefined) });
  if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;

  // Keep existing images the admin didn't remove, cover first
  const kept = formData.getAll("keepImage").map(String);
  const cover = String(formData.get("cover") ?? "");
  const ordered = cover && kept.includes(cover) ? [cover, ...kept.filter((k) => k !== cover)] : kept;

  const uploads = formData.getAll("newImages").filter((f): f is File => f instanceof File && f.size > 0);
  for (const f of uploads) {
    if (!ALLOWED.includes(f.type)) return { error: `${f.name} is not a JPG, PNG, WebP or AVIF image.` };
    if (f.size > MAX) return { error: `${f.name} is larger than 8 MB. Resize it and upload again.` };
  }
  const uploaded: string[] = [];
  for (const f of uploads) {
    const buf = Buffer.from(await f.arrayBuffer());
    const [m] = await db.insert(media).values({ mime: f.type, data: buf, size: buf.length }).returning({ id: media.id });
    uploaded.push(`/api/media/${m.id}`);
  }
  const images = [...ordered, ...uploaded];
  if (images.length === 0) return { error: "Add at least one photo." };

  const values = {
    name,
    slug,
    price: Math.round(price),
    compareAtPrice: compare > 0 ? Math.round(compare) : null,
    categoryId,
    description,
    fabric: String(formData.get("fabric") ?? "").trim() || null,
    colors: list(formData.get("colors")),
    sizes: list(formData.get("sizes")),
    bespoke: formData.get("bespoke") === "on",
    leadTimeDays: Math.max(1, Number(formData.get("leadTimeDays") || 7)),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    images,
  };

  if (values.sizes.length === 0 && !values.bespoke) return { error: "Add sizes, or allow made to measure. Otherwise customers can't order it." };

  if (id) await db.update(products).set(values).where(eq(products.id, id));
  else await db.insert(products).values(values);

  revalidatePath("/", "layout");
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/products?deleted=1");
}

export async function toggleProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const field = formData.get("field") === "featured" ? "featured" : "active";
  const p = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!p) return;
  await db.update(products).set({ [field]: !p[field] }).where(eq(products.id, id));
  revalidatePath("/", "layout");
}
