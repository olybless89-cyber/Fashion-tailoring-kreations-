import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { db, orders } from "@/db";
import { site } from "@/lib/config";
import { initializePayment, paystackReady } from "@/lib/paystack";

export async function POST(req: Request, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const t = String((await req.formData()).get("t") ?? "");
  const order = await db.query.orders.findFirst({ where: eq(orders.number, number) });
  if (!order || order.accessToken !== t) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const orderUrl = `${site.url}/order/${order.number}?t=${t}`;
  if (order.paymentStatus === "PAID" || !paystackReady()) return NextResponse.redirect(orderUrl, 303);

  const reference = `${order.number}-${randomBytes(3).toString("hex")}`;
  await db.update(orders).set({ paymentRef: reference, paymentMethod: "PAYSTACK" }).where(eq(orders.id, order.id));
  try {
    const init = await initializePayment({ email: order.email, amountNaira: order.total, reference, callbackUrl: orderUrl, metadata: { order_number: order.number } });
    return NextResponse.redirect(init.authorization_url, 303);
  } catch {
    return NextResponse.redirect(`${orderUrl}&payfail=1`, 303);
  }
}
