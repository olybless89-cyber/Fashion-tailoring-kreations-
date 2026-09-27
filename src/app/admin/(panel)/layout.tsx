import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { destroySession, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

async function signOut() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await requireAdmin();
  const nav = [
    ["/admin", "Overview"],
    ["/admin/orders", "Orders"],
    ["/admin/products", "Products"],
    ["/admin/collections", "Collections"],
  ];
  return (
    <div className="min-h-screen bg-chalk lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-ink text-paper lg:min-h-screen lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-8">
          <Link href="/admin"><Image src="/brand/ftk-white.png" alt="FTK admin" width={764} height={685} className="h-10 w-auto lg:h-16" /></Link>
          <Link href="/" className="text-sm text-paper/70 hover:text-paper lg:mt-4 lg:block">View shop</Link>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="whitespace-nowrap px-3 py-2 text-sm font-medium text-paper/85 hover:bg-paper/10 hover:text-paper">
              {label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="hidden px-6 pt-8 text-sm lg:block">
          <p className="truncate text-paper/50">{s.email}</p>
          <button className="mt-2 text-paper/80 underline underline-offset-4 hover:text-paper">Sign out</button>
        </form>
      </aside>
      <div className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">{children}</div>
    </div>
  );
}
