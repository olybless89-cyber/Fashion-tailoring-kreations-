import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, categories } from "@/db";
import { requireAdmin } from "@/lib/auth";

async function saveCollection(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  await db
    .update(categories)
    .set({
      name: String(formData.get("name") ?? "").trim() || undefined,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      image: String(formData.get("image") ?? "").trim() || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
    })
    .where(eq(categories.id, id));
  revalidatePath("/", "layout");
}

export default async function Collections() {
  const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  return (
    <>
      <h1 className="display display-md">Collections</h1>
      <p className="mt-2 max-w-[60ch] text-sm text-stone">
        These are the collections in the shop menu. For the thumbnail, paste the address of any product photo, e.g. /products/teal-senator-1.jpg or /api/media/…
      </p>
      <div className="mt-6 space-y-4">
        {cats.map((c) => (
          <form key={c.id} action={saveCollection} className="grid gap-3 bg-paper p-5 md:grid-cols-12">
            <input type="hidden" name="id" value={c.id} />
            <div className="md:col-span-3"><label className="label">Name</label><input name="name" defaultValue={c.name} className="field" /></div>
            <div className="md:col-span-4"><label className="label">Tagline</label><input name="tagline" defaultValue={c.tagline ?? ""} className="field" /></div>
            <div className="md:col-span-4"><label className="label">Thumbnail</label><input name="image" defaultValue={c.image ?? ""} className="field" /></div>
            <div className="md:col-span-1"><label className="label">Order</label><input name="sortOrder" type="number" defaultValue={c.sortOrder} className="field" /></div>
            <div className="md:col-span-10"><label className="label">Description</label><textarea name="description" rows={2} defaultValue={c.description ?? ""} className="field" /></div>
            <div className="flex items-end md:col-span-2"><button className="btn btn-ink w-full">Save</button></div>
          </form>
        ))}
      </div>
    </>
  );
}
