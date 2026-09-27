import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard, isRemote } from "@/components/product-card";
import { StitchArc } from "@/components/stitch";
import { whatsappLink } from "@/lib/config";

// Tile sizes for the collection mosaic, in collection order (reorder collections in /admin)
const tile = ["col-span-2 row-span-2", "", "", "", "", "col-span-2 lg:col-span-2", "col-span-2 lg:col-span-2"];

export default async function Home() {
  const [cats, featured] = await Promise.all([getCategories(), getProducts({ featured: true, limit: 8 })]);
  const wa = whatsappLink("Hello FTK, I'd like to book a fitting.");
  // Agbada leads the mosaic as the large tile; the rest follow the collection order set in /admin
  const mosaic = [...cats.filter((c) => c.slug === "agbada"), ...cats.filter((c) => c.slug !== "agbada")];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-paper" aria-labelledby="hero-title">
        {/* Ambient backdrop: the agbada itself, blurred into a crimson glow, laid over adire pattern */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image src="/media/hero-agbada.jpg" alt="" fill priority sizes="100vw" className="scale-125 object-cover opacity-55 blur-3xl saturate-150" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,#000_22%,rgba(0,0,0,.82)_48%,rgba(0,0,0,.35)_100%)]" />
          <div className="absolute inset-0 bg-[url('/media/adire.svg')] bg-[length:160px_160px] opacity-[0.07]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] items-center gap-10 px-4 py-12 sm:px-6 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:px-10 lg:py-16">
          <div className="lg:col-span-7">
            <p className="tagline text-sm text-paper/70">Fashion Tailoring Kreation</p>
            <h1 id="hero-title" className="display display-lg mt-5">
              Cut to
              <br />
              your measure.
            </h1>
            <StitchArc animate className="mt-6 h-8 w-full max-w-lg text-coral" />
            <p className="mt-6 max-w-[44ch] text-lg text-paper/80">
              Agbada, senator, native and English wear, sewn by hand to your measurements and delivered to your door.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-paper">Shop the collection</Link>
              <Link href="/made-to-measure" className="btn btn-ghost">
                How made to measure works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:mr-0">
            <div className="relative aspect-[9/14] overflow-hidden shadow-[0_40px_120px_-20px_rgba(184,65,46,.55)] ring-1 ring-paper/15">
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
              <div aria-hidden className="absolute inset-3 border border-dashed border-paper/40" />
            </div>
            <Link
              href="/product/crimson-embroidered-agbada"
              className="group absolute -bottom-5 left-4 right-4 flex items-center justify-between bg-paper px-5 py-4 text-ink sm:-left-8 sm:right-auto sm:min-w-[20rem]"
            >
              <span>
                <span className="block text-xs text-stone">Made to measure</span>
                <span className="font-semibold">Crimson embroidered agbada</span>
              </span>
              <span className="ml-6 text-sm underline underline-offset-4 group-hover:text-coral">View</span>
            </Link>
          </div>
        </div>

        <nav aria-label="Collections" className="border-t border-paper/15">
          <div className="no-scrollbar mx-auto flex max-w-[1440px] gap-8 overflow-x-auto px-4 py-4 sm:px-6 lg:justify-between lg:px-10">
            {cats.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="condensed whitespace-nowrap text-lg font-medium text-paper/75 transition-colors hover:text-paper">
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      </section>

      {/* Collections */}
      <section className="mx-auto mt-20 max-w-[1440px] px-4 sm:px-6 lg:mt-28 lg:px-10" aria-labelledby="collections">
        <div className="flex items-end justify-between gap-6">
          <h2 id="collections" className="display display-md">The collections</h2>
          <Link href="/shop" className="hidden text-sm font-medium underline underline-offset-4 sm:inline">See every piece</Link>
        </div>
        <ul className="mt-8 grid auto-rows-[15rem] grid-cols-2 gap-3 sm:auto-rows-[18rem] lg:grid-cols-4 lg:gap-4">
          {mosaic.map((c, i) => (
            <li key={c.slug} className={tile[i] ?? ""}>
              <Link href={`/collections/${c.slug}`} className="group relative block h-full overflow-hidden bg-indigo">
                {c.image && (
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    unoptimized={isRemote(c.image)}
                    sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                    className={`object-cover transition-transform duration-700 group-hover:scale-[1.04] ${isRemote(c.image) ? "object-center" : "object-top"}`}
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-paper sm:p-5">
                  <h3 className={`display ${i === 0 ? "display-md" : "text-[1.35rem] sm:text-[1.75rem] lg:text-[2.1rem]"}`}>{c.name}</h3>
                  <p className="mt-1 text-sm text-paper/80">
                    {c.tagline ? `${c.tagline}. ` : ""}
                    <span className="tabular-nums">{c.count} {c.count === 1 ? "piece" : "pieces"}</span>
                  </p>
                </div>
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
      <section className="relative isolate mt-24 overflow-hidden bg-indigo text-paper lg:mt-32" aria-labelledby="mtm">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[url('/media/adire.svg')] bg-[length:160px_160px] opacity-[0.06]" />
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
