import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, eq, ne } from "drizzle-orm";
import { db, products } from "@/db";
import { getProduct } from "@/lib/queries";
import { naira } from "@/lib/format";
import { site, whatsappLink } from "@/lib/config";
import { Gallery } from "@/components/gallery";
import { AddToBag } from "@/components/add-to-bag";
import { ProductCard } from "@/components/product-card";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description,
    openGraph: { images: p.images[0] && !p.images[0].endsWith(".svg") ? [{ url: p.images[0] }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const related = await db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, product.categoryId), eq(products.active, true), ne(products.id, product.id)))
    .limit(4);

  const wa = whatsappLink(`Hello FTK, I'm interested in the ${product.name} (${site.url}/product/${product.slug}).`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${site.url}${i}`),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${site.url}/product/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-stone">
        <Link href="/shop" className="hover:text-ink">Shop</Link> <span aria-hidden>/</span>{" "}
        <Link href={`/collections/${product.category.slug}`} className="hover:text-ink">{product.category.name}</Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Gallery images={product.images} alt={product.name} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h1 className="display display-md">{product.name}</h1>
            <p className="mt-4 text-2xl tabular-nums">
              {naira(product.price)}
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <s className="ml-3 text-lg text-stone">{naira(product.compareAtPrice)}</s>
              )}
            </p>
            <p className="mt-5 max-w-[52ch] text-stone">{product.description}</p>

            <AddToBag
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0] ?? "",
                price: product.price,
                sizes: product.sizes,
                colors: product.colors,
                bespoke: product.bespoke,
                leadTimeDays: product.leadTimeDays,
              }}
            />

            <dl className="mt-10 border-t border-line text-sm">
              {product.fabric && (
                <div className="grid grid-cols-[8rem_1fr] border-b border-line py-3">
                  <dt className="text-stone">Fabric</dt>
                  <dd>{product.fabric}</dd>
                </div>
              )}
              <div className="grid grid-cols-[8rem_1fr] border-b border-line py-3">
                <dt className="text-stone">Made in</dt>
                <dd>About {product.leadTimeDays} days from order</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] border-b border-line py-3">
                <dt className="text-stone">Alterations</dt>
                <dd>Free small alterations within 14 days of delivery</dd>
              </div>
            </dl>

            {wa && (
              <a href={wa} className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
                Ask about this piece on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related">
          <h2 id="related" className="display display-sm">More {product.category.name.toLowerCase()}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
