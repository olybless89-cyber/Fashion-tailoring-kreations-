import "server-only";
import { createHmac } from "node:crypto";

const BASE = "https://api.paystack.co";
const key = () => process.env.PAYSTACK_SECRET_KEY || "";

export const paystackReady = () => Boolean(key());

export async function initializePayment(opts: {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: opts.email,
      amount: Math.round(opts.amountNaira * 100),
      currency: "NGN",
      reference: opts.reference,
      callback_url: opts.callbackUrl,
      metadata: opts.metadata,
    }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.status) throw new Error(json.message || "Paystack could not start the payment.");
  return json.data as { authorization_url: string; reference: string };
}

export async function verifyPayment(reference: string) {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key()}` },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.status) return null;
  return json.data as { status: string; amount: number; reference: string; currency: string };
}

export function validWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature || !key()) return false;
  const hash = createHmac("sha512", key()).update(rawBody).digest("hex");
  return hash === signature;
}
