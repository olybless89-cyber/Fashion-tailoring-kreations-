"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart";
import { isRemote } from "./product-card";
import { naira } from "@/lib/format";
import { measurementFields, requiredMeasurements } from "@/lib/measurements";
import { nigerianStates } from "@/lib/nigeria";

const M_STORE = "ftk-measurements-v1";

export function CheckoutForm(props: { deliveryFee: number; freeDeliveryOver: number; paystack: boolean; pickupAddress: string }) {
  const cart = useCart();
  const [delivery, setDelivery] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [payment, setPayment] = useState<"PAYSTACK" | "BANK_TRANSFER">(props.paystack ? "PAYSTACK" : "BANK_TRANSFER");
  const [measure, setMeasure] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(M_STORE);
      if (raw) setMeasure(JSON.parse(raw));
    } catch {}
  }, []);

  const fee = delivery === "PICKUP" || cart.subtotal >= props.freeDeliveryOver ? 0 : props.deliveryFee;
  const total = cart.subtotal + fee;

  if (!cart.ready) return <div className="min-h-[50vh]" />;
  if (cart.items.length === 0) {
    return (
      <div className="py-20">
        <p className="text-lg">Your bag is empty.</p>
        <Link href="/shop" className="btn btn-ink mt-6">Shop the collection</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    if (cart.needsMeasurements) {
      const missing = requiredMeasurements.filter((k) => !measure[k]?.trim());
      if (missing.length) {
        const names = missing.map((k) => measurementFields.find((f) => f.key === k)?.label).join(", ");
        setError(`Add these measurements so we can cut your piece: ${names}.`);
        document.getElementById("measurements")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      try { localStorage.setItem(M_STORE, JSON.stringify(measure)); } catch {}
    }
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          deliveryMethod: delivery,
          address: fd.get("address") || undefined,
          city: fd.get("city") || undefined,
          state: fd.get("state") || undefined,
          notes: fd.get("notes") || undefined,
          paymentMethod: payment,
          measurements: cart.needsMeasurements ? measure : undefined,
          items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity, fit: i.fit, size: i.size, color: i.color })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "We couldn't place your order. Check your details and try again.");
      cart.clear();
      window.location.href = json.redirect;
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't place your order. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-12 lg:grid-cols-12" noValidate={false}>
      <div className="space-y-12 lg:col-span-7">
        <section aria-labelledby="c-details">
          <h2 id="c-details" className="display display-sm">Your details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Full name</label>
              <input id="name" name="name" required autoComplete="name" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone (WhatsApp preferred)</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="080..." className="field" />
            </div>
          </div>
        </section>

        <section aria-labelledby="c-delivery">
          <h2 id="c-delivery" className="display display-sm">Delivery</h2>
          <div className="mt-5 grid grid-cols-2 border border-ink">
            {(["DELIVERY", "PICKUP"] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={delivery === d}
                onClick={() => setDelivery(d)}
                className={`py-3 text-sm font-semibold ${delivery === d ? "bg-ink text-paper" : "hover:bg-chalk"}`}
              >
                {d === "DELIVERY" ? "Deliver to me" : "Pick up at the atelier"}
              </button>
            ))}
          </div>
          {delivery === "DELIVERY" ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">Street address</label>
                <input id="address" name="address" required autoComplete="street-address" className="field" />
              </div>
              <div>
                <label className="label" htmlFor="city">City or town</label>
                <input id="city" name="city" required autoComplete="address-level2" className="field" />
              </div>
              <div>
                <label className="label" htmlFor="state">State</label>
                <select id="state" name="state" required className="field" defaultValue="">
                  <option value="" disabled>Choose a state</option>
                  {nigerianStates.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-stone">
              We&rsquo;ll message you when your order is ready to collect{props.pickupAddress ? ` at ${props.pickupAddress}` : ""}.
            </p>
          )}
        </section>

        {cart.needsMeasurements && (
          <section aria-labelledby="measurements" className="scroll-mt-28">
            <h2 id="measurements" className="display display-sm">Your measurements</h2>
            <p className="mt-3 max-w-[60ch] text-stone">
              In inches. Measure over a thin shirt, tape snug but not tight. Fields marked with a dot are needed to cut your piece.{" "}
              <Link href="/made-to-measure" target="_blank" className="font-medium text-ink underline underline-offset-4">Open the guide</Link>
            </p>
            {(["Top", "Trousers", "Cap"] as const).map((group) => (
              <fieldset key={group} className="mt-6">
                <legend className="text-sm font-semibold">{group}</legend>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {measurementFields.filter((f) => f.group === group).map((f) => (
                    <div key={f.key}>
                      <label className="label" htmlFor={`m-${f.key}`} title={f.hint}>
                        {f.label}
                        {requiredMeasurements.includes(f.key) && <span className="ml-1 text-coral" aria-label="required">•</span>}
                      </label>
                      <input
                        id={`m-${f.key}`}
                        inputMode="decimal"
                        className="field"
                        placeholder="in"
                        value={measure[f.key] ?? ""}
                        onChange={(e) => setMeasure((m) => ({ ...m, [f.key]: e.target.value.replace(/[^\d.]/g, "").slice(0, 5) }))}
                        aria-describedby={`h-${f.key}`}
                      />
                      <p id={`h-${f.key}`} className="mt-1 text-xs leading-snug text-stone">{f.hint}</p>
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="mt-6">
              <label className="label" htmlFor="m-height">Height and build (optional)</label>
              <input
                id="m-height"
                className="field"
                placeholder="e.g. 6ft, broad shoulders, likes a relaxed fit"
                value={measure.notes ?? ""}
                onChange={(e) => setMeasure((m) => ({ ...m, notes: e.target.value.slice(0, 200) }))}
              />
            </div>
          </section>
        )}

        <section aria-labelledby="c-notes">
          <h2 id="c-notes" className="display display-sm">Anything else</h2>
          <label className="label mt-5" htmlFor="notes">Notes for the tailor (optional)</label>
          <textarea id="notes" name="notes" rows={3} maxLength={1000} className="field" placeholder="Event date, cap style, embroidery colour..." />
        </section>

        <section aria-labelledby="c-pay">
          <h2 id="c-pay" className="display display-sm">Payment</h2>
          <div className="mt-5 space-y-3">
            {props.paystack && (
              <label className={`flex cursor-pointer gap-3 border p-4 ${payment === "PAYSTACK" ? "border-ink" : "border-line"}`}>
                <input type="radio" name="payment" checked={payment === "PAYSTACK"} onChange={() => setPayment("PAYSTACK")} className="mt-1 accent-black" />
                <span>
                  <span className="block font-semibold">Card, bank or USSD</span>
                  <span className="text-sm text-stone">Secure payment through Paystack.</span>
                </span>
              </label>
            )}
            <label className={`flex cursor-pointer gap-3 border p-4 ${payment === "BANK_TRANSFER" ? "border-ink" : "border-line"}`}>
              <input type="radio" name="payment" checked={payment === "BANK_TRANSFER"} onChange={() => setPayment("BANK_TRANSFER")} className="mt-1 accent-black" />
              <span>
                <span className="block font-semibold">Bank transfer</span>
                <span className="text-sm text-stone">We&rsquo;ll show our account details after you place the order. Production starts once payment is confirmed.</span>
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="bg-chalk p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-4">
            {cart.items.map((i) => (
              <li key={i.key} className="grid grid-cols-[3.5rem_1fr_auto] gap-3 text-sm">
                <div className="relative aspect-[3/4] overflow-hidden bg-paper">
                  {i.image && <Image src={i.image} alt="" fill sizes="56px" unoptimized={isRemote(i.image)} className="object-cover" />}
                </div>
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-stone">
                    {i.fit === "BESPOKE" ? "Made to measure" : `Size ${i.size}`} × {i.quantity}
                  </p>
                </div>
                <p className="tabular-nums">{naira(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{naira(cart.subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="tabular-nums">{fee === 0 ? "Free" : naira(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
              <dt>Total</dt><dd className="tabular-nums">{naira(total)}</dd>
            </div>
          </dl>
          {delivery === "DELIVERY" && fee > 0 && (
            <p className="mt-2 text-xs text-stone">Free delivery on orders over {naira(props.freeDeliveryOver)}.</p>
          )}
          {error && <p className="mt-4 text-sm text-coral" role="alert">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-ink mt-6 w-full">
            {busy ? "Placing your order…" : payment === "PAYSTACK" ? `Pay ${naira(total)}` : "Place order"}
          </button>
        </div>
      </aside>
    </form>
  );
}
