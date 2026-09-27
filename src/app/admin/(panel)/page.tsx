import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db, orders, products } from "@/db";
import { naira, dateFmt } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export default async function Overview() {
  const [[stats], recent, [pc]] = await Promise.all([
    db
      .select({
        revenueMonth: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.paymentStatus} = 'PAID' and ${orders.createdAt} >= date_trunc('month', now())), 0)::int`,
        paidMonth: sql<number>`count(*) filter (where ${orders.paymentStatus} = 'PAID' and ${orders.createdAt} >= date_trunc('month', now()))::int`,
        awaiting: sql<number>`count(*) filter (where ${orders.status} = 'PENDING_PAYMENT')::int`,
        production: sql<number>`count(*) filter (where ${orders.status} in ('CONFIRMED','IN_PRODUCTION'))::int`,
        outgoing: sql<number>`count(*) filter (where ${orders.status} in ('READY','SHIPPED'))::int`,
      })
      .from(orders),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
    db.select({ n: sql<number>`count(*)::int` }).from(products),
  ]);

  const cards = [
    ["Paid this month", naira(stats.revenueMonth), `${stats.paidMonth} orders`, "/admin/orders?status=CONFIRMED"],
    ["Awaiting payment", String(stats.awaiting), "Check transfers", "/admin/orders?status=PENDING_PAYMENT"],
    ["On the cutting table", String(stats.production), "Confirmed or in production", "/admin/orders?status=IN_PRODUCTION"],
    ["Ready or on the way", String(stats.outgoing), "Pickup or delivery", "/admin/orders?status=READY"],
  ];

  return (
    <>
      <h1 className="display display-md">Overview</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, sub, href]) => (
          <Link key={label} href={href} className="bg-paper p-5 hover:outline hover:outline-1 hover:outline-ink">
            <p className="text-sm text-stone">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums condensed">{value}</p>
            <p className="mt-1 text-xs text-stone">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-end justify-between">
        <h2 className="text-lg font-semibold">Latest orders</h2>
        <Link href="/admin/orders" className="text-sm underline underline-offset-4">All orders</Link>
      </div>
      <div className="mt-3 overflow-x-auto bg-paper">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line text-left text-stone">
            <tr><th className="p-3 font-medium">Order</th><th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Placed</th><th className="p-3 font-medium">Status</th><th className="p-3 text-right font-medium">Total</th></tr>
          </thead>
          <tbody>
            {recent.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-stone">No orders yet. They&rsquo;ll appear here as soon as a customer checks out.</td></tr>}
            {recent.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-chalk/60">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium underline-offset-4 hover:underline">{o.number}</Link></td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3 text-stone">{dateFmt(o.createdAt)}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 text-right tabular-nums">{naira(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-stone">{pc.n} products in the shop. <Link href="/admin/products/new" className="underline underline-offset-4">Add a product</Link></p>
    </>
  );
}
