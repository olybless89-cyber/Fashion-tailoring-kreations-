import Image from "next/image";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/config";
import { StitchArc } from "./stitch";

export function Footer({ categories }: { categories: { slug: string; name: string }[] }) {
  const wa = whatsappLink("Hello FTK, I'd like to ask about an outfit.");
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image src="/brand/ftk-white.png" alt="Fashion Tailoring Kreation" width={764} height={685} className="h-28 w-auto" />
            <p className="mt-6 max-w-sm text-sm text-paper/70">
              Made-to-measure Nigerian menswear. Every piece is cut for one man and finished by hand in our atelier.
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-paper/60">Collections</h2>
            <ul className="mt-4 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} className="hover:underline underline-offset-4">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold text-paper/60">Orders</h2>
            <ul className="mt-4 space-y-2">
              <li><Link href="/made-to-measure" className="hover:underline underline-offset-4">Made to measure</Link></li>
              <li><Link href="/track" className="hover:underline underline-offset-4">Track an order</Link></li>
              <li><Link href="/bag" className="hover:underline underline-offset-4">Your bag</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-paper/60">Talk to the atelier</h2>
            <ul className="mt-4 space-y-2">
              {wa && <li><a href={wa} className="hover:underline underline-offset-4">WhatsApp us</a></li>}
              {site.phone && <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:underline underline-offset-4">{site.phone}</a></li>}
              {site.email && <li><a href={`mailto:${site.email}`} className="hover:underline underline-offset-4 break-all">{site.email}</a></li>}
              {site.instagram && (
                <li><a href={`https://instagram.com/${site.instagram}`} className="hover:underline underline-offset-4">Instagram @{site.instagram}</a></li>
              )}
              {site.address && <li className="text-paper/70">{site.address}</li>}
            </ul>
          </div>
        </div>

        <StitchArc className="mt-16 h-6 w-full text-paper/40" />
        <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Fashion Tailoring Kreation</p>
          <p>Prices in Naira. Made-to-measure pieces are made for you and can be altered, not returned.</p>
        </div>
      </div>
    </footer>
  );
}
