import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db, orderEvents, orderItems, orders, products } from "@/db";
import { commerce, site } from "@/lib/config";
import { newOrderNumber } from "@/lib/orders";
import { initializePayment, paystackReady } from "@/lib/paystack";
import { requiredMeasurements } from "@/lib/measurements";

const schema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a phone number we can reach you on.").max(30),
  deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(1000).optional(),
  paymentMethod: z.enum(["PAYSTACK", "BANK_TRANSFER"]),
  measurements: z.record(z.string(), z.string().max(200)).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        fit: z.enum(["STANDARD", "BESPOKE"]),
        size: z.string().max(20).optional(),
        color: z.string().max(60).optional(),
      }),
    )
    .min(1, "Your bag is empty.")
    .max(30),
});

export async function POST(req: Request) {
  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Invalid request.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (body.deliveryMethod === "DELIVERY" && (!body.address || !body.city || !body.state)) {
    return NextResponse.json({ error: "Enter your delivery address, city and state." }, { status: 400 });
  }

  // Prices always come from the database, never from the browser.
  const ids = [...new Set(body.items.map((i) => i.productId))];
  const found = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(found.map((p) => [p.id, p]));

  type Line = (typeof body.items)[number] & { p: (typeof found)[number] };
  const lines: Line[] = [];
  for (const i of body.items) {
    const p = byId.get(i.productId);
    if (!p || !p.active) return NextResponse.json({ error: "One of the pieces in your bag is no longer available. Remove it and try again." }, { status: 409 });
    if (i.fit === "STANDARD" && (!i.size || !p.sizes.includes(i.size))) {
      return NextResponse.json({ error: `Choose a valid size for ${p.name}.` }, { status: 400 });
    }
    if (i.fit === "BESPOKE" && !p.bespoke) {
      return NextResponse.json({ error: `${p.name} is only available in standard sizes.` }, { status: 400 });
    }
    lines.push({ p, ...i });
  }

  const bespoke = lines.some((l) => l.fit === "BESPOKE");
  if (bespoke) {
    const m = body.measurements ?? {};
    if (requiredMeasurements.some((k) => !m[k]?.trim())) {
      return NextResponse.json({ error: "Add your measurements so we can cut your made-to-measure pieces." }, { status: 400 });
    }
  }

  if (body.paymentMethod === "PAYSTACK" && !paystackReady()) {
    return NextResponse.json({ error: "Card payment is not available right now. Choose bank transfer." }, { status: 400 });
  }

  const subtotal = lines.reduce((n, l) => n + l.p.price * l.quantity, 0);
  const deliveryFee = body.deliveryMethod === "PICKUP" || subtotal >= commerce.freeDeliveryOver ? 0 : commerce.deliveryFee;
  const total = subtotal + deliveryFee;
  const number = newOrderNumber();
  const accessToken = randomBytes(18).toString("base64url");
  const paymentRef = body.paymentMethod === "PAYSTACK" ? `${number}-${randomBytes(3).toString("hex")}` : null;

  const order = await db.transaction(async (tx) => {
    const [o] = await tx
      .insert(orders)
      .values({
        number,
        accessToken,
        paymentMethod: body.paymentMethod,
        paymentRef,
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        deliveryMethod: body.deliveryMethod,
        address: body.deliveryMethod === "DELIVERY" ? body.address : null,
        city: body.deliveryMethod === "DELIVERY" ? body.city : null,
        state: body.deliveryMethod === "DELIVERY" ? body.state : null,
        notes: body.notes || null,
        measurements: bespoke ? body.measurements : null,
        subtotal,
        deliveryFee,
        total,
      })
      .returning();
    await tx.insert(orderItems).values(
      lines.map((l) => ({
        orderId: o.id,
        productId: l.p.id,
        name: l.p.name,
        image: l.p.images[0] ?? null,
        unitPrice: l.p.price,
        quantity: l.quantity,
        fit: l.fit,
        size: l.fit === "STANDARD" ? l.size : null,
        color: l.color ?? null,
      })),
    );
    await tx.insert(orderEvents).values({ orderId: o.id, status: "PENDING_PAYMENT", note: "Order placed" });
    return o;
  });

  const orderUrl = `/order/${order.number}?t=${accessToken}`;

  if (body.paymentMethod === "PAYSTACK" && paymentRef) {
    try {
      const init = await initializePayment({
        email: order.email,
        amountNaira: total,
        reference: paymentRef,
        callbackUrl: `${site.url}${orderUrl}`,
        metadata: { order_number: order.number, customer: order.customerName },
      });
      return NextResponse.json({ redirect: init.authorization_url, number: order.number });
    } catch (e) {
      console.error("Paystack init failed", e);
      return NextResponse.json({ redirect: `${orderUrl}&payfail=1`, number: order.number });
    }
  }

  return NextResponse.json({ redirect: orderUrl, number: order.number });
}
