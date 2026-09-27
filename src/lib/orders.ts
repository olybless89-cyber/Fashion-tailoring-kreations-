import "server-only";
import { eq } from "drizzle-orm";
import { db, orders, orderEvents } from "@/db";
import { verifyPayment } from "./paystack";

export function newOrderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FTK-${ymd}-${rand}`;
}

/** Confirms a Paystack payment against our order. Safe to call repeatedly (callback + webhook). */
export async function settlePaystack(reference: string) {
  const order = await db.query.orders.findFirst({ where: eq(orders.paymentRef, reference) });
  if (!order) return null;
  if (order.paymentStatus === "PAID") return order;

  const tx = await verifyPayment(reference);
  if (!tx || tx.status !== "success" || tx.currency !== "NGN" || tx.amount < order.total * 100) return order;

  const [updated] = await db
    .update(orders)
    .set({ paymentStatus: "PAID", status: "CONFIRMED" })
    .where(eq(orders.id, order.id))
    .returning();
  await db.insert(orderEvents).values({ orderId: order.id, status: "CONFIRMED", note: "Payment received via Paystack" });
  return updated;
}
