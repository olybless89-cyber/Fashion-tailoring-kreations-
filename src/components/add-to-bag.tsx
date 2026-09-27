"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart";

type P = {
  id: string; slug: string; name: string; image: string; price: number;
  sizes: string[]; colors: string[]; bespoke: boolean; leadTimeDays: number;
};

export function AddToBag({ product }: { product: P }) {
  const { add } = useCart();
  const hasSizes = product.sizes.length > 0;
  const [fit, setFit] = useState<"STANDARD" | "BESPOKE">(hasSizes ? "STANDARD" : "BESPOKE");
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    if (fit === "STANDARD" && !size) {
      setError("Choose a size, or switch to made to measure.");
      return;
    }
    setError("");
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: qty,
      fit,
      size: fit === "STANDARD" ? size : undefined,
      color: color || undefined,
      leadTimeDays: product.leadTimeDays,
    });
    setAdded(true);
  }

  return (
    <div className="mt-8 space-y-6">
      {hasSizes && product.bespoke && (
        <fieldset>
          <legend className="label">Fit</legend>
          <div className="grid grid-cols-2 border border-ink">
            {(["STANDARD", "BESPOKE"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={fit === f}
                onClick={() => { setFit(f); setAdded(false); }}
                className={`py-3 text-sm font-semibold ${fit === f ? "bg-ink text-paper" : "hover:bg-chalk"}`}
              >
                {f === "STANDARD" ? "Standard size" : "Made to measure"}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {fit === "STANDARD" && hasSizes && (
        <fieldset>
          <legend className="label">Size</legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                onClick={() => { setSize(s); setError(""); setAdded(false); }}
                className={`min-w-12 border px-3 py-2.5 text-sm font-medium tabular-nums ${size === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {fit === "BESPOKE" && (
        <p className="border-l-2 border-coral pl-4 text-sm">
          You&rsquo;ll enter your measurements at checkout. Not sure how?{" "}
          <Link href="/made-to-measure" className="font-medium underline underline-offset-4">Read the guide</Link>.
        </p>
      )}

      {product.colors.length > 1 && (
        <fieldset>
          <legend className="label">Colour</legend>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className={`border px-3 py-2.5 text-sm ${color === c ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex gap-3">
        <div className="flex items-center border border-line" role="group" aria-label="Quantity">
          <button type="button" className="h-13 w-11 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One fewer">−</button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" className="h-13 w-11 text-lg" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="One more">+</button>
        </div>
        <button type="button" onClick={submit} className="btn btn-ink flex-1">
          Add to bag
        </button>
      </div>

      {error && <p className="text-sm text-coral" role="alert">{error}</p>}
      {added && (
        <div className="flex items-center justify-between bg-chalk px-4 py-3 text-sm" role="status">
          <span>Added to your bag.</span>
          <Link href="/bag" className="font-semibold underline underline-offset-4">View bag</Link>
        </div>
      )}
    </div>
  );
}
