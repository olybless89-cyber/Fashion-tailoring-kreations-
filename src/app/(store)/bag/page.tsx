"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart";
import { isRemote } from "@/components/product-card";
import { naira } from "@/lib/format";

export default function Bag() {
  const { items, ready, subtotal, setQty, remove, needsMeasurements } = useCart();

  if (!ready) return <div className="min-h-[60vh]" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-24 text-center sm:px-6 lg:px-10">
        <h1 className="display display-md">Your bag is empty</h1>
        <p className="mt-4 text-stone">Start with a collection, or send us a picture of what you want made.</p>
        <Link href="/shop" className="btn btn-ink mt-8">Shop the collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <h1 className="display display-lg">Your bag</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <ul className="border-t border-ink lg:col-span-8">
          {items.map((i) => (
            <li key={i.key} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[7rem_1fr_auto]">
              <Link href={`/product/${i.slug}`} className="relative aspect-[3/4] overflow-hidden bg-chalk">
                {i.image && <Image src={i.image} alt={i.name} fill sizes="112px" unoptimized={isRemote(i.image)} className="object-cover" />}
              </Link>
              <div>
                <Link href={`/product/${i.slug}`} className="font-medium hover:underline underline-offset-4">{i.name}</Link>
                <p className="mt-1 text-sm text-stone">
                  {i.fit === "BESPOKE" ? "Made to measure" : `Size ${i.size}`}
                  {i.color ? `, ${i.color}` : ""}
                </p>
                <p className="mt-1 text-sm text-stone">Ready in about {i.leadTimeDays} days</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center border border-line" role="group" aria-label={`Quantity of ${i.name}`}>
                    <button className="h-9 w-9" onClick={() => setQty(i.key, i.quantity - 1)} aria-label="One fewer">−</button>
                    <span className="w-6 text-center text-sm tabular-nums">{i.quantity}</span>
                    <button className="h-9 w-9" onClick={() => setQty(i.key, i.quantity + 1)} aria-label="One more">+</button>
                  </div>
                  <button onClick={() => remove(i.key)} className="text-sm text-stone underline underline-offset-4 hover:text-ink">Remove</button>
                </div>
              </div>
              <p className="col-start-2 tabular-nums sm:col-start-3 sm:text-right">{naira(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>

        <aside className="lg:col-span-4">
          <div className="bg-chalk p-6">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span className="tabular-nums font-semibold">{naira(subtotal)}</span>
            </div>
            <p className="mt-2 text-sm text-stone">Delivery is calculated at checkout.</p>
            {needsMeasurements && (
              <p className="mt-4 border-l-2 border-coral pl-3 text-sm">
                Your bag has made-to-measure pieces. Have a tape measure ready, or book a fitting.
              </p>
            )}
            <Link href="/checkout" className="btn btn-ink mt-6 w-full">Go to checkout</Link>
            <Link href="/shop" className="mt-4 block text-center text-sm underline underline-offset-4">Keep shopping</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
