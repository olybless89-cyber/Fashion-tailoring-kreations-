import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { db, orderEvents, orders } from "@/db";
import { settlePaystack } from "@/lib/orders";
import { commerce, whatsappLink } from "@/lib/config";
import { dateFmt, naira, statusFlow, statusLabel } from "@/lib/format";
import { measurementFields } from "@/lib/measurements";
import { isRemote } from "@/components/product-card";
import { timingSafeEqual } from "node:crypto";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

type Props = {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ t?: string; reference?: string; payfail?: string }>;
};

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export default async function OrderPage({ params, searchParams }: Props) {
  const { number } = await params;
  const { t = "", reference, payfail } = await searchParams;

  let order = await db.query.orders.findFirst({
    where: eq(orders.number, number),
    with: { items: true, events: { orderBy: [asc(orderEvents.createdAt)] } },
  });
  if (!order || !same(order.accessToken, t)) notFound();

  if (reference && order.paymentMethod === "PAYSTACK" && order.paymentStatus !== "PAID") {
    await settlePaystack(reference);
    order = (await db.query.orders.findFirst({
      where: eq(orders.number, number),
      with: { items: true, events: { orderBy: [asc(orderEvents.createdAt)] } },
    }))!;
  }

  const paid = order.paymentStatus === "PAID";
  const cancelled = order.status === "CANCELLED";
  const currentIdx = statusFlow.indexOf(order.status as (typeof statusFlow)[number]);
  const wa = whatsappLink(
    paid
      ? `Hello FTK, I'm checking on order ${order.number}.`
      : `Hello FTK, I've paid for order ${order.number} (${naira(order.total)}). Here is my proof of payment:`,
  );
  const steps = statusFlow.filter((s) => s !== "READY" || order.deliveryMethod === "PICKUP").filter((s) => s !== "SHIPPED" || order.deliveryMethod === "DELIVERY");

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <p className="text-sm text-stone">Order {order.number}</p>
      <h1 className="display display-md mt-2">
        {cancelled ? "This order was cancelled" : paid ? `Thank you, ${order.customerName.split(" ")[0]}` : "Order placed. Payment pending."}
      </h1>

      {payfail && !paid && (
        <p className="mt-4 border-l-2 border-coral pl-4">We couldn&rsquo;t open the payment page. Try again below or pay by bank transfer.</p>
      )}

      {!paid && !cancelled && (
        <section className="mt-8 bg-chalk p-6" aria-labelledby="pay">
          <h2 id="pay" className="text-lg font-semibold">Complete your payment of {naira(order.total)}</h2>
          {order.paymentMethod === "PAYSTACK" ? (
            <form action={`/api/pay/${order.number}`} method="post" className="mt-4">
              <input type="hidden" name="t" value={t} />
              <button className="btn btn-ink">Pay {naira(order.total)} with Paystack</button>
            </form>
          ) : null}
          {commerce.bank.accountNumber && (
            <dl className="mt-4 grid max-w-md grid-cols-[9rem_1fr] gap-y-2 text-sm">
              <dt className="text-stone">Bank</dt><dd className="font-medium">{commerce.bank.name}</dd>
              <dt className="text-stone">Account name</dt><dd className="font-medium">{commerce.bank.accountName}</dd>
              <dt className="text-stone">Account number</dt><dd className="font-semibold tabular-nums tracking-wide">{commerce.bank.accountNumber}</dd>
              <dt className="text-stone">Reference</dt><dd className="font-semibold">{order.number}</dd>
            </dl>
          )}
          <p className="mt-4 text-sm text-stone">
            Use your order number as the transfer reference. We start cutting as soon as payment is confirmed.
          </p>
          {wa && <a href={wa} className="btn btn-line mt-4">Send proof of payment on WhatsApp</a>}
        </section>
      )}

      {!cancelled && (
        <section className="mt-12" aria-labelledby="progress">
          <h2 id="progress" className="text-lg font-semibold">Progress</h2>
          <ol className="mt-5 grid gap-0 sm:grid-cols-5">
            {steps.map((s) => {
              const idx = statusFlow.indexOf(s);
              const done = idx <= currentIdx;
              return (
                <li key={s} className="flex items-center gap-3 border-l border-dashed border-line py-2 pl-4 sm:block sm:border-l-0 sm:border-t sm:pl-0 sm:pt-4">
                  <span className={`inline-block h-3 w-3 rounded-full ${done ? "bg-ink" : "border border-stone bg-paper"} sm:mb-3`} aria-hidden />
                  <span className={`text-sm ${done ? "font-semibold" : "text-stone"}`}>
                    {statusLabel[s]}
                    {idx === currentIdx && <span className="sr-only"> (current)</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <section className="lg:col-span-7" aria-labelledby="items">
          <h2 id="items" className="text-lg font-semibold">Items</h2>
          <ul className="mt-4 border-t border-line">
            {order.items.map((i) => (
              <li key={i.id} className="grid grid-cols-[4rem_1fr_auto] gap-4 border-b border-line py-4 text-sm">
                <div className="relative aspect-[3/4] overflow-hidden bg-chalk">
                  {i.image && <Image src={i.image} alt="" fill sizes="64px" unoptimized={isRemote(i.image)} className="object-cover" />}
                </div>
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-stone">{i.fit === "BESPOKE" ? "Made to measure" : `Size ${i.size}`}{i.color ? `, ${i.color}` : ""} × {i.quantity}</p>
                </div>
                <p className="tabular-nums">{naira(i.unitPrice * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{naira(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd className="tabular-nums">{order.deliveryFee ? naira(order.deliveryFee) : "Free"}</dd></div>
            <div className="flex justify-between pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{naira(order.total)}</dd></div>
          </dl>
        </section>

        <aside className="space-y-8 text-sm lg:col-span-5">
          <div>
            <h2 className="text-lg font-semibold">{order.deliveryMethod === "PICKUP" ? "Pickup" : "Delivering to"}</h2>
            <p className="mt-2">{order.customerName}</p>
            {order.deliveryMethod === "DELIVERY" && <p className="text-stone">{[order.address, order.city, order.state].filter(Boolean).join(", ")}</p>}
            <p className="text-stone">{order.phone}</p>
          </div>
          {order.measurements && (
            <div>
              <h2 className="text-lg font-semibold">Your measurements</h2>
              <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
                {measurementFields.filter((f) => order.measurements?.[f.key]).map((f) => (
                  <div key={f.key} className="flex justify-between border-b border-line py-1">
                    <dt className="text-stone">{f.label}</dt><dd className="tabular-nums">{order.measurements?.[f.key]}&quot;</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">History</h2>
            <ul className="mt-2 space-y-2">
              {order.events.map((e) => (
                <li key={e.id}>
                  <span className="font-medium">{statusLabel[e.status]}</span>
                  <span className="text-stone"> — {dateFmt(e.createdAt)}</span>
                  {e.note && <p className="text-stone">{e.note}</p>}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-stone">
            Keep this page&rsquo;s link to check on your order, or use <Link href="/track" className="underline underline-offset-4">Track an order</Link> with your order number and email.
          </p>
        </aside>
      </div>
    </div>
  );
}
