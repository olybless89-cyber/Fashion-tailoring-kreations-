import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db, orders, orderStatus } from "@/db";
import { dateFmt, naira, statusLabel } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function Orders({ searchParams }: Props) {
  const { status, q } = await searchParams;
  const valid = orderStatus.enumValues.find((s) => s === status);
  const term = q?.trim();
  const list = await db
    .select()
    .from(orders)
    .where(
      and(
        valid ? eq(orders.status, valid) : undefined,
        term ? or(ilike(orders.number, `%${term}%`), ilike(orders.customerName, `%${term}%`), ilike(orders.email, `%${term}%`), ilike(orders.phone, `%${term}%`)) : undefined,
      ),
    )
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return (
    <>
      <h1 className="display display-md">Orders</h1>
      <form className="mt-6 flex flex-wrap gap-2" role="search">
        <input name="q" defaultValue={term} placeholder="Order number, name, email or phone" className="field max-w-sm" />
        {valid && <input type="hidden" name="status" value={valid} />}
        <button className="btn btn-ink">Search</button>
      </form>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        <Link href="/admin/orders" className={`whitespace-nowrap border px-3 py-1.5 text-sm ${!valid ? "border-ink bg-ink text-paper" : "border-line bg-paper"}`}>All</Link>
        {orderStatus.enumValues.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`whitespace-nowrap border px-3 py-1.5 text-sm ${valid === s ? "border-ink bg-ink text-paper" : "border-line bg-paper"}`}>
            {statusLabel[s]}
          </Link>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto bg-paper">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line text-left text-stone">
            <tr>
              <th className="p-3 font-medium">Order</th><th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Placed</th>
              <th className="p-3 font-medium">Payment</th><th className="p-3 font-medium">Status</th><th className="p-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-stone">No orders match. Clear the search or pick another status.</td></tr>}
            {list.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-chalk/60">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline underline-offset-4">{o.number}</Link></td>
                <td className="p-3">{o.customerName}<div className="text-xs text-stone">{o.phone}</div></td>
                <td className="p-3 text-stone">{dateFmt(o.createdAt)}</td>
                <td className="p-3">{o.paymentStatus === "PAID" ? "Paid" : "Unpaid"}<div className="text-xs text-stone">{o.paymentMethod === "PAYSTACK" ? "Paystack" : "Transfer"}</div></td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 text-right tabular-nums">{naira(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
