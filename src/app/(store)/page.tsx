import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard, isRemote } from "@/components/product-card";
import { StitchArc } from "@/components/stitch";
import { whatsappLink } from "@/lib/config";

export default async function Home() {
  const [cats, featured] = await Promise.all([getCategories(), getProducts({ featured: true, limit: 8 })]);
  const wa = whatsappLink("Hello FTK, I'd like to book a fitting.");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-6 lg:px-10 lg:pt-12">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pb-10">
            <h1 className="display display-lg">
              Cut to your
              <br />
              measure.
              <br />
              Worn like
              <br />
              you own the room.
            </h1>
            <StitchArc animate className="mt-6 h-8 w-full max-w-xl text-coral" />
            <p className="mt-6 max-w-[46ch] text-lg text-stone">
              Senator, agbada, native two-piece, English and office wear, sewn to your measurements and delivered to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-ink">Shop the collection</Link>
              <Link href="/made-to-measure" className="btn btn-line">How made to measure works</Link>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[9/16] max-h-[78vh] w-full overflow-hidden bg-chalk sm:aspect-[4/5] lg:aspect-[9/14]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/media/hero-agbada.mp4"
                poster="/media/hero-agbada.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Crimson embroidered agbada on a mannequin in the FTK atelier"
              />
            </div>
            <Link
              href="/product/crimson-embroidered-agbada"
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-paper px-4 py-3 text-sm font-medium"
            >
              <span>Crimson embroidered agbada</span>
              <span className="underline underline-offset-4">View piece</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Collection index */}
      <section className="mx-auto mt-24 max-w-[1440px] px-4 sm:px-6 lg:mt-32 lg:px-10" aria-labelledby="collections">
        <div className="flex items-end justify-between gap-6">
          <h2 id="collections" className="display display-md">The collections</h2>
          <Link href="/shop" className="hidden text-sm font-medium underline underline-offset-4 sm:inline">See every piece</Link>
        </div>
        <ul className="mt-8 border-t border-ink">
          {cats.map((c) => (
            <li key={c.slug} className="border-b border-line">
              <Link href={`/collections/${c.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 py-4 sm:grid-cols-[1fr_1fr_auto] sm:py-5">
                <span className="display display-sm transition-colors group-hover:text-coral">{c.name}</span>
                <span className="hidden text-stone sm:block">{c.tagline}</span>
                <span className="flex items-center gap-4">
                  <span className="text-sm tabular-nums text-stone">{c.count} {c.count === 1 ? "piece" : "pieces"}</span>
                  {c.image && (
                    <span className="relative block h-16 w-12 overflow-hidden bg-chalk sm:h-20 sm:w-16">
                      <Image src={c.image} alt="" fill sizes="64px" unoptimized={isRemote(c.image)} className="object-cover" />
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured */}
      <section className="mx-auto mt-24 max-w-[1440px] px-4 sm:px-6 lg:mt-32 lg:px-10" aria-labelledby="featured">
        <h2 id="featured" className="display display-md">Worn this season</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* Made to measure */}
      <section className="mt-24 bg-indigo text-paper lg:mt-32" aria-labelledby="mtm">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
          <div className="lg:col-span-5">
            <div className="relative aspect-[9/14] w-full max-w-md overflow-hidden bg-indigo-soft">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/media/fabric-room.mp4"
                poster="/media/fabric-room.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-label="Choosing fabric from the shelves in the FTK fabric room"
              />
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <h2 id="mtm" className="display display-md">Made for one man</h2>
            <p className="mt-5 max-w-[52ch] text-lg text-paper/80">
              Choose a style, send your measurements, and we cut and sew it for you. Most pieces are ready in 7 to 21 days.
            </p>
            <ol className="mt-10 space-y-0">
              {[
                ["Pick a style and fabric", "Choose from the collections, or send us a picture of what you have in mind."],
                ["Send your measurements", "Enter them at checkout using our guide, or visit the atelier to be measured."],
                ["We cut and sew", "Your piece is made by hand and checked against your measurements before it leaves."],
                ["Wear it", "Delivered to your door or ready for pickup. Small alterations after delivery are on us."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-dashed border-paper/35 py-5">
                  <span className="display text-3xl text-paper/60">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{t}</h3>
                    <p className="mt-1 text-paper/75">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/made-to-measure" className="btn btn-paper">Read the measurement guide</Link>
              {wa && <a href={wa} className="btn btn-line">Book a fitting on WhatsApp</a>}
            </div>
          </div>
        </div>
      </section>

      {/* Atelier */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-32">
        <div className="relative aspect-[4/3] overflow-hidden bg-chalk lg:col-span-7">
          <Image src="/media/atelier-rail.jpg" alt="Finished pieces on the rail in the FTK showroom" fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
        </div>
        <div className="lg:col-span-5">
          <h2 className="display display-md">From our rail to your wardrobe</h2>
          <p className="mt-5 max-w-[46ch] text-lg text-stone">
            Every order is tracked from the cutting table to your door. You get an order number the moment you pay, and updates as your piece moves through the atelier.
          </p>
          <Link href="/track" className="btn btn-line mt-8">Track an order</Link>
        </div>
      </section>
    </>
  );
}
