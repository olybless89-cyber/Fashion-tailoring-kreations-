import Link from "next/link";
import type { Metadata } from "next";
import { measurementFields, requiredMeasurements } from "@/lib/measurements";
import { whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Made to measure — how to take your measurements",
  description: "How FTK made-to-measure works, and how to take your own measurements for senator, agbada and native wear.",
};

export default function MadeToMeasure() {
  const wa = whatsappLink("Hello FTK, I'd like to book a fitting.");
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="display display-lg">Made to measure</h1>
          <p className="mt-6 max-w-[56ch] text-lg text-stone">
            Every made-to-measure piece is cut from your own measurements. Take them at home with a soft tape, or come to the atelier and we&rsquo;ll take them for you.
          </p>
        </div>
        <div className="self-end lg:col-span-5">
          <div className="border-l-2 border-coral pl-5">
            <p className="font-semibold">Rather be measured in person?</p>
            <p className="mt-1 text-stone">Book a fitting and we&rsquo;ll save your measurements for every future order.</p>
            {wa && <a href={wa} className="btn btn-ink mt-4">Book a fitting on WhatsApp</a>}
          </div>
        </div>
      </div>

      <section className="mt-20 grid gap-10 lg:grid-cols-12" aria-labelledby="before">
        <h2 id="before" className="display display-sm lg:col-span-4">Before you start</h2>
        <ul className="space-y-3 text-lg lg:col-span-8">
          <li>Use a soft tailor&rsquo;s tape, not a metal one. Measure in inches.</li>
          <li>Wear a thin shirt and trousers that fit you well. Empty your pockets.</li>
          <li>Stand relaxed. Ask someone to help with shoulder, back and length.</li>
          <li>Keep the tape snug, not tight. You should be able to slide one finger under it.</li>
          <li>If you like a looser or slimmer fit, tell us in the notes rather than changing the numbers.</li>
        </ul>
      </section>

      <section className="mt-20" aria-labelledby="how">
        <h2 id="how" className="display display-sm">How to take each measurement</h2>
        {(["Top", "Trousers", "Cap"] as const).map((g) => (
          <div key={g} className="mt-10">
            <h3 className="text-lg font-semibold">{g}</h3>
            <dl className="mt-3 border-t border-ink">
              {measurementFields.filter((f) => f.group === g).map((f) => (
                <div key={f.key} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[14rem_1fr]">
                  <dt className="font-semibold">
                    {f.label}
                    {requiredMeasurements.includes(f.key) && <span className="ml-2 text-sm font-normal text-coral">needed</span>}
                  </dt>
                  <dd className="text-stone">{f.hint}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </section>

      <section className="mt-20 bg-chalk p-8 lg:p-12" aria-labelledby="after">
        <h2 id="after" className="display display-sm">After you order</h2>
        <p className="mt-4 max-w-[62ch] text-lg">
          We check every set of measurements before cutting. If something looks off, we&rsquo;ll call or message you first. Small alterations within 14 days of delivery are free.
        </p>
        <Link href="/shop" className="btn btn-ink mt-6">Choose a piece</Link>
      </section>
    </div>
  );
}
