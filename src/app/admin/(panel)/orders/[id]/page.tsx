import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db, orderEvents, orders, orderStatus } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { dateFmt, naira, statusLabel } from "@/lib/format";
import { measurementFields } from "@/lib/measurements";
import { StatusBadge } from "@/components/status-badge";
import { isRemote } from "@/components/product-card";
import { site } from "@/lib/config";

async function updateStatus(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = orderStatus.enumValues.find((s) => s === formData.get("status"));
  const note = String(formData.get("note") ?? "").trim().slice(0, 500) || null;
  if (!status) return;
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  await db.insert(orderEvents).values({ orderId: id, status, note });
  revalidatePath(`/admin/orders/${id}`);
}

async function markPaid(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const o = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!o || o.paymentStatus === "PAID") return;
  await db.update(orders).set({ paymentStatus: "PAID", status: o.status === "PENDING_PAYMENT" ? "CONFIRMED" : o.status }).where(eq(orders.id, id));
  await db.insert(orderEvents).values({ orderId: id, status: o.status === "PENDING_PAYMENT" ? "CONFIRMED" : o.status, note: "Payment confirmed by the atelier" });
  revalidatePath(`/admin/orders/${id}`);
}

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true, events: { orderBy: [asc(orderEvents.createdAt)] } },
  });
  if (!o) notFound();

  const phone = o.phone.replace(/\D/g, "").replace(/^0/, "234");
  const link = `${site.url}/order/${o.number}?t=${o.accessToken}`;
  const waMsg = `Hello ${o.customerName.split(" ")[0]}, this is FTK. Your order ${o.number} is now: ${statusLabel[o.status]}. Track it here: ${link}`;

  return (
    <>
      <Link href="/admin/orders" className="text-sm text-stone hover:text-ink">All orders</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="display display-md">{o.number}</h1>
        <StatusBadge status={o.status} />
        <span className={`text-sm font-semibold ${o.paymentStatus === "PAID" ? "text-emerald-700" : "text-coral"}`}>
          {o.paymentStatus === "PAID" ? "Paid" : "Unpaid"} via {o.paymentMethod === "PAYSTACK" ? "Paystack" : "bank transfer"}
        </span>
      </div>
      <p className="mt-1 text-sm text-stone">Placed {dateFmt(o.createdAt)}</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <section className="bg-paper p-5">
            <h2 className="font-semibold">Items</h2>
            <ul className="mt-3">
              {o.items.map((i) => (
                <li key={i.id} className="grid grid-cols-[3.5rem_1fr_auto] gap-4 border-b border-line py-3 text-sm last:border-0">
                  <div className="relative aspect-[3/4] overflow-hidden bg-chalk">
                    {i.image && <Image src={i.image} alt="" fill sizes="56px" unoptimized={isRemote(i.image)} className="object-cover" />}
                  </div>
                  <div>
                    <p className="font-medium">{i.name}</p>
                    <p className="text-stone">{i.fit === "BESPOKE" ? "Made to measure" : `Size ${i.size}`}{i.color ? `, ${i.color}` : ""} × {i.quantity}</p>
                  </div>
                  <p className="tabular-nums">{naira(i.unitPrice * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{naira(o.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd className="tabular-nums">{naira(o.deliveryFee)}</dd></div>
              <div className="flex justify-between font-semibold"><dt>Total</dt><dd className="tabular-nums">{naira(o.total)}</dd></div>
            </dl>
          </section>

          {o.measurements && (
            <section className="bg-paper p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Measurements (inches)</h2>
                <span className="text-xs text-stone">For the cutting table</span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
                {measurementFields.map((f) => (
                  <div key={f.key} className="flex justify-between border-b border-line py-2 text-sm">
                    <dt className="text-stone">{f.label}</dt>
                    <dd className="font-semibold tabular-nums">{o.measurements?.[f.key] || "—"}</dd>
                  </div>
                ))}
              </dl>
              {o.measurements.notes && <p className="mt-3 text-sm"><span className="text-stone">Build notes: </span>{o.measurements.notes}</p>}
            </section>
          )}

          {o.notes && (
            <section className="bg-paper p-5">
              <h2 className="font-semibold">Customer notes</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm">{o.notes}</p>
            </section>
          )}

          <section className="bg-paper p-5">
            <h2 className="font-semibold">History</h2>
            <ol className="mt-3 space-y-3 text-sm">
              {o.events.map((e) => (
                <li key={e.id} className="border-l-2 border-dashed border-line pl-3">
                  <span className="font-medium">{statusLabel[e.status]}</span> <span className="text-stone">— {dateFmt(e.createdAt)}</span>
                  {e.note && <p className="text-stone">{e.note}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <section className="bg-paper p-5">
            <h2 className="font-semibold">Update status</h2>
            <form key={`${o.status}-${o.events.length}`} action={updateStatus} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="field">
                {orderStatus.enumValues.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
              </select>
              <textarea name="note" rows={2} className="field" placeholder="Note the customer will see (optional)" />
              <button className="btn btn-ink w-full">Save status</button>
            </form>
            {o.paymentStatus !== "PAID" && (
              <form action={markPaid} className="mt-3">
                <input type="hidden" name="id" value={o.id} />
                <button className="btn btn-line w-full">Mark as paid</button>
              </form>
            )}
          </section>

          <section className="bg-paper p-5 text-sm">
            <h2 className="font-semibold">Customer</h2>
            <p className="mt-2">{o.customerName}</p>
            <p><a href={`mailto:${o.email}`} className="underline underline-offset-4 break-all">{o.email}</a></p>
            <p><a href={`tel:${o.phone}`} className="underline underline-offset-4">{o.phone}</a></p>
            <p className="mt-3 text-stone">
              {o.deliveryMethod === "PICKUP" ? "Pickup at the atelier" : [o.address, o.city, o.state].filter(Boolean).join(", ")}
            </p>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer" className="btn btn-line mt-4 w-full">
              Send status on WhatsApp
            </a>
            <p className="mt-3 break-all text-xs text-stone">Customer link: {link}</p>
          </section>
        </div>
      </div>
    </>
  );
}
