import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, orders } from "@/db";

export const metadata: Metadata = { title: "Track an order" };

async function findOrder(formData: FormData) {
  "use server";
  const number = String(formData.get("number") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const o = number && email ? await db.query.orders.findFirst({ where: and(eq(orders.number, number), eq(orders.email, email)) }) : null;
  if (!o) redirect("/track?missing=1");
  redirect(`/order/${o.number}?t=${o.accessToken}`);
}

export default async function Track({ searchParams }: { searchParams: Promise<{ missing?: string }> }) {
  const { missing } = await searchParams;
  return (
    <div className="mx-auto max-w-[640px] px-4 pb-24 pt-12 sm:px-6">
      <h1 className="display display-lg">Track an order</h1>
      <p className="mt-4 text-stone">Enter the order number from your confirmation and the email you ordered with.</p>
      <form action={findOrder} className="mt-8 space-y-4">
        <div>
          <label className="label" htmlFor="number">Order number</label>
          <input id="number" name="number" required placeholder="FTK-260927-AB12" className="field uppercase" autoComplete="off" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        {missing && (
          <p className="text-sm text-coral" role="alert">
            We couldn&rsquo;t find an order with that number and email. Check both and try again, or message us on WhatsApp.
          </p>
        )}
        <button className="btn btn-ink w-full">Find my order</button>
      </form>
    </div>
  );
}
