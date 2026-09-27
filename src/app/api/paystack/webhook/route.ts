import { NextResponse } from "next/server";
import { settlePaystack } from "@/lib/orders";
import { validWebhookSignature } from "@/lib/paystack";

// Set this URL in Paystack Dashboard → Settings → API Keys & Webhooks:
// https://YOUR-DOMAIN/api/paystack/webhook
export async function POST(req: Request) {
  const raw = await req.text();
  if (!validWebhookSignature(raw, req.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const event = JSON.parse(raw);
  if (event?.event === "charge.success" && event?.data?.reference) {
    await settlePaystack(String(event.data.reference));
  }
  return NextResponse.json({ ok: true });
}
