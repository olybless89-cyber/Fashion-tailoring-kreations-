import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const cats = (await getCategories()).map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:p-3">
        Skip to content
      </a>
      <Header categories={cats} />
      <main id="main">{children}</main>
      <Footer categories={cats} />
    </>
  );
}
